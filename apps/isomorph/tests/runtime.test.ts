import type { IsomorphRuntimeServices } from '../src/runtime.js'
import { promises as fs } from 'node:fs'
import os from 'node:os'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { parseMarkdownSurface } from '../src/markdown.js'
import {
  IsomorphConfigError,
  isomorphLiveLayer,
  IsomorphParseError,

  readPinEffect,
  resolveIsomorphRootEffect,
  runDoctorInspectEffect,
  runDoctorRepairEffect,
  runInitEffect,
  runLintEffect,
  runPrimitiveSkillEffect,
  runRecognitionEffect,
  runUpgradeStatusEffect,
} from '../src/runtime.js'

async function makeWorkspace(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'isomorph-test-'))
}

async function treeSnapshot(root: string): Promise<readonly string[]> {
  const result: string[] = []
  async function walk(directory: string): Promise<void> {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        await walk(absolute)
      }
      else if (entry.isFile()) {
        const content = await fs.readFile(absolute, 'utf8')
        result.push(`${path.relative(root, absolute)}\0${content}`)
      }
    }
  }
  await walk(root)
  return result.sort()
}

const testRoot = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(testRoot, '..')
const sourceBaselineRoot = path.join(packageRoot, 'isomorph-source')
const sourceRecognitionRule = path.join(sourceBaselineRoot, 'basis/lint/recognition/default.md')
const sourceConceptSignal = path.join(sourceBaselineRoot, 'basis/lint/signal/concept-as-policy.md')

async function writeSourceMetadata(workspace: string): Promise<void> {
  await fs.writeFile(path.join(workspace, '.isomorph', '.isomorph-source.json'), `${JSON.stringify({
    schemaVersion: 1,
    role: 'origin',
    source: {
      type: 'git',
      url: 'https://github.com/yume-infra/docwarden.git',
      path: 'apps/isomorph/isomorph-source',
    },
    createdAt: '2026-05-28T00:00:00.000Z',
  }, null, 2)}\n`, 'utf8')
}

function runIsomorph<A, E>(effect: Effect.Effect<A, E, IsomorphRuntimeServices>): Promise<A> {
  return Effect.runPromise(effect.pipe(Effect.provide(isomorphLiveLayer)))
}

describe('markdown surface parser', () => {
  it('parses frontmatter, headings, sections, path, OFM links, and locator markers', () => {
    const surface = parseMarkdownSurface(`---
kind: concept
owner: test
---

# sample

## Definition

agent MUST keep the marker. ^def-1

See [[basis/primitives/concept/concept|concept]].
`, 'sample.md')

    expect(surface.frontmatter).toEqual({
      kind: 'concept',
      owner: 'test',
    })
    expect(surface.headings.map(heading => heading.text)).toEqual(['sample', 'Definition'])
    expect(surface.sections.find(section => section.heading.text === 'Definition')?.text).toContain('agent MUST')
    expect(surface.locatorMarkers[0]?.marker).toBe('^def-1')
    expect(surface.ofmLinks[0]).toMatchObject({
      target: 'basis/primitives/concept/concept',
      label: 'concept',
    })
  })
})

describe('isomorph runtime v0', () => {
  it('initializes a non-root local .isomorph instance with pin metadata', async () => {
    const workspace = await makeWorkspace()
    const result = await runIsomorph(runInitEffect({
      root: workspace,
      now: new Date('2026-05-26T00:00:00.000Z'),
    }))

    expect(result.isomorphRoot).toBe(path.join(workspace, '.isomorph'))
    expect(result.pin).toMatchObject({
      schemaVersion: 1,
      vendor: 'isomorph',
      ref: 'isomorph-origin-v0',
      createdAt: '2026-05-26T00:00:00.000Z',
    })
    await expect(fs.access(path.join(workspace, 'isomorph.md'))).rejects.toThrow()
    await expect(fs.access(path.join(workspace, '.isomorph', '.isomorph-pin.json'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.isomorph', 'README.md'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.isomorph', 'init/README.md'))).rejects.toThrow()
    await expect(fs.access(path.join(workspace, '.isomorph', 'basis/primitives/concept/semantic-framework.md'))).rejects.toThrow()
    await expect(fs.access(path.join(workspace, '.isomorph', 'basis/primitives/concept/vocabulary.md'))).rejects.toThrow()
    await expect(fs.access(path.join(workspace, '.isomorph', 'basis/grammars/policy/semantic-framework-boundary.md'))).rejects.toThrow()
    await expect(fs.access(path.join(workspace, '.isomorph', 'basis/templates/semantic-framework.md'))).rejects.toThrow()
  })

  it('refuses to overwrite an existing local .isomorph', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))

    await expect(runIsomorph(runInitEffect({ root: workspace }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('resolves .isomorph from a target path before falling back to cwd', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const nested = path.join(workspace, 'nested', 'target.md')
    await fs.mkdir(path.dirname(nested), { recursive: true })
    await fs.writeFile(nested, '# target\n', 'utf8')

    const root = await runIsomorph(resolveIsomorphRootEffect({
      target: nested,
      cwd: path.dirname(nested),
    }))

    expect(root.source).toBe('target')
    expect(root.workspaceRoot).toBe(workspace)
    expect(root.isomorphRoot).toBe(path.join(workspace, '.isomorph'))
  })

  it('runs recognition before lint and emits local signal definitions with loss model', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# drift

## Definition

agent MUST treat this as a rule. ^def-1
`, 'utf8')

    const result = await runIsomorph(runLintEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('concept')
    expect(result.recognition.basis[0]).toBe('local recognition rule: local-kind-frontmatter')
    expect(result.recognition.candidateSignalScope.some(candidate => candidate.signal === 'concept-as-policy')).toBe(true)
    expect(result.signals).toHaveLength(1)
    expect(result.signals[0]).toMatchObject({
      signal: 'concept-as-policy',
      context: 'Definition',
      locator: '^def-1',
    })
    expect(result.signals[0]?.lossModel).toContain('concept material 的命名职责')
  })

  it('does not let an unknown frontmatter.kind become recognition authority', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'unknown.md')
    await fs.writeFile(target, `---
kind: not-local
---

# unknown
`, 'utf8')

    const result = await runIsomorph(runRecognitionEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('unknown')
  })

  it('recognizes pinned baseline semantic framework bootstrap concepts as local roles', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const framework = path.join(workspace, 'animation-framework.md')
    const vocabulary = path.join(workspace, 'animation-vocabulary.md')
    await fs.writeFile(framework, `---
kind: semantic-framework
---

# animation framework
`, 'utf8')
    await fs.writeFile(vocabulary, `---
kind: vocabulary
---

# animation vocabulary
`, 'utf8')

    const frameworkResult = await runIsomorph(runRecognitionEffect({
      root: workspace,
      target: framework,
    }))
    const vocabularyResult = await runIsomorph(runRecognitionEffect({
      root: workspace,
      target: vocabulary,
    }))

    expect(frameworkResult.recognition.recognizedRole).toBe('semantic-framework')
    expect(vocabularyResult.recognition.recognizedRole).toBe('vocabulary')
  })

  it('does not let arbitrary local frontmatter.kind become recognition authority', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const localFile = path.join(workspace, '.isomorph', 'local/foo.md')
    await fs.mkdir(path.dirname(localFile), { recursive: true })
    await fs.writeFile(localFile, `---
kind: foo
---

# foo
`, 'utf8')
    const target = path.join(workspace, 'foo.md')
    await fs.writeFile(target, `---
kind: foo
---

# foo
`, 'utf8')

    const result = await runIsomorph(runRecognitionEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('unknown')
  })

  it('fails recognition when local recognition authority is missing', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    await fs.rm(path.join(workspace, '.isomorph', '.isomorph-pin.json'), { force: true })
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    await expect(runIsomorph(runRecognitionEffect({
      root: workspace,
      target,
    }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('fails recognition when local recognition trigger is unsupported', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const recognitionFile = path.join(workspace, '.isomorph', 'basis/lint/recognition/default.md')
    await fs.mkdir(path.dirname(recognitionFile), { recursive: true })
    await fs.copyFile(sourceRecognitionRule, recognitionFile)
    const original = await fs.readFile(recognitionFile, 'utf8')
    await fs.writeFile(recognitionFile, original.replace('frontmatter.kind is local kind', 'unsupported trigger syntax'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    await expect(runIsomorph(runRecognitionEffect({
      root: workspace,
      target,
    }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('lets local recognition material change recognition output', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const recognitionFile = path.join(workspace, '.isomorph', 'basis/lint/recognition/default.md')
    await fs.mkdir(path.dirname(recognitionFile), { recursive: true })
    await fs.copyFile(sourceRecognitionRule, recognitionFile)
    const original = await fs.readFile(recognitionFile, 'utf8')
    await fs.writeFile(recognitionFile, original.replace('Role: $frontmatter.kind', 'Role: locally-overridden'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    const result = await runIsomorph(runRecognitionEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('locally-overridden')
  })

  it('applies pinned baseline concept signals from frontmatter surface even when recognition role is overridden', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const recognitionFile = path.join(workspace, '.isomorph', 'basis/lint/recognition/default.md')
    await fs.mkdir(path.dirname(recognitionFile), { recursive: true })
    await fs.copyFile(sourceRecognitionRule, recognitionFile)
    const original = await fs.readFile(recognitionFile, 'utf8')
    await fs.writeFile(recognitionFile, original.replace('Role: $frontmatter.kind', 'Role: locally-overridden'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# drift

## Definition

agent MUST treat this as a rule.
`, 'utf8')

    const result = await runIsomorph(runLintEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('locally-overridden')
    expect(result.recognition.candidateSignalScope.find(candidate => candidate.signal === 'concept-as-policy')).toMatchObject({
      applicable: true,
      applicabilityBasis: 'surface-feature',
    })
    expect(result.signals.find(signal => signal.signal === 'concept-as-policy')).toBeDefined()
  })

  it('does not apply pinned baseline frontmatter-based concept signal when frontmatter is absent', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const recognitionFile = path.join(workspace, '.isomorph', 'basis/lint/recognition/default.md')
    await fs.mkdir(path.dirname(recognitionFile), { recursive: true })
    await fs.copyFile(sourceRecognitionRule, recognitionFile)
    const original = await fs.readFile(recognitionFile, 'utf8')
    await fs.writeFile(
      recognitionFile,
      original
        .replace('Role: $frontmatter.kind', 'Role: concept')
        .replace('frontmatter.kind is local kind', 'path contains concept.md'),
      'utf8',
    )
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `# drift

## Definition

agent MUST treat this as a rule.
`, 'utf8')

    const result = await runIsomorph(runLintEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('concept')
    expect(result.signals.find(signal => signal.signal === 'concept-as-policy')).toBeUndefined()
  })

  it('lets local kind material add a recognized role without changing TypeScript', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const localKind = path.join(workspace, '.isomorph', 'basis/primitives/concept/decision.md')
    await fs.mkdir(path.dirname(localKind), { recursive: true })
    await fs.writeFile(localKind, `---
kind: concept
---

# decision

## Definition

decision is a local kind.
`, 'utf8')
    const target = path.join(workspace, 'decision.md')
    await fs.writeFile(target, `---
kind: decision
---

# local decision
`, 'utf8')

    const result = await runIsomorph(runRecognitionEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('decision')
  })

  it('uses edited local signal definitions during lint', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const signalFile = path.join(workspace, '.isomorph', 'basis/lint/signal/concept-as-policy.md')
    await fs.mkdir(path.dirname(signalFile), { recursive: true })
    await fs.copyFile(sourceConceptSignal, signalFile)
    const original = await fs.readFile(signalFile, 'utf8')
    await fs.writeFile(signalFile, original.replace('`section contains MUST / SHOULD / MUST NOT`', '`section contains impossible-token`'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# drift

## Definition

agent MUST treat this as a rule.
`, 'utf8')

    const result = await runIsomorph(runLintEffect({
      root: workspace,
      target,
    }))

    expect(result.signals).toHaveLength(0)
    expect(result.recognition.candidateSignalScope.find(candidate => candidate.signal === 'concept-as-policy')).toMatchObject({
      applicable: false,
    })
  })

  it('surfaces missing signal loss model as a lint diagnostic', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const signalFile = path.join(workspace, '.isomorph', 'basis/lint/signal/concept-as-policy.md')
    await fs.mkdir(path.dirname(signalFile), { recursive: true })
    await fs.copyFile(sourceConceptSignal, signalFile)
    const original = await fs.readFile(signalFile, 'utf8')
    await fs.writeFile(signalFile, original.replace(/## Loss Model\n\n[\s\S]*?\n## Trigger/, '## Trigger'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    const result = await runIsomorph(runLintEffect({
      root: workspace,
      target,
    }))

    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code: 'missing-signal-loss-model',
      target: 'basis/lint/signal/concept-as-policy.md',
    }))
  })

  it('surfaces unsupported signal triggers as lint diagnostics', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const signalFile = path.join(workspace, '.isomorph', 'basis/lint/signal/concept-as-policy.md')
    await fs.mkdir(path.dirname(signalFile), { recursive: true })
    await fs.copyFile(sourceConceptSignal, signalFile)
    const original = await fs.readFile(signalFile, 'utf8')
    await fs.writeFile(signalFile, original.replace('`section contains MUST / SHOULD / MUST NOT`', '`unsupported signal trigger`'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    const result = await runIsomorph(runLintEffect({
      root: workspace,
      target,
    }))

    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code: 'unparsed-signal-trigger',
      evidence: 'unsupported signal trigger',
    }))
  })

  it.each([
    {
      signal: 'workflow-as-policy',
      positivePath: 'workflow.md',
      positive: `---
kind: workflow
---

# workflow

## Responsibility

agent MUST follow this instruction.
`,
      negativePath: 'workflow-negative.md',
      negative: `---
kind: workflow
---

# workflow

## State

state transition move.

## Responsibility

agent MUST follow this instruction.
`,
    },
    {
      signal: 'template-owns-lifecycle',
      positivePath: 'custom/templates/bad-template.md',
      positive: `---
kind: template
---

# bad-template

## Rules

template MUST own source review lifecycle.
`,
      negativePath: 'custom/templates/good-template.md',
      negative: `---
kind: template
---

# good-template

## Surface

template describes source review lifecycle terms without rule language.
`,
    },
    {
      signal: 'architecture-as-responsibility-card',
      positivePath: 'architecture.md',
      positive: `---
kind: architecture
---

# architecture

## Responsibility

owner responsibility function descriptions.
`,
      negativePath: 'architecture-negative.md',
      negative: `---
kind: architecture
---

# architecture

## Boundary

owner responsibility function descriptions with layer relation boundary.
`,
    },
    {
      signal: 'example-as-kind',
      positivePath: 'example/templates/example.md',
      positive: `---
kind: example
---

# example

This example proves the kind for the module.
`,
      negativePath: 'example-negative.md',
      negative: `---
kind: example
---

# example

This example illustrates one concrete sample.
`,
    },
    {
      signal: 'composition-as-list',
      positivePath: 'composition.md',
      positive: `---
kind: composition
---

# composition

- alpha
- beta
`,
      negativePath: 'composition-negative.md',
      negative: `---
kind: composition
---

# composition

- whole alpha
- part beta

stable semantic boundary.
`,
    },
    {
      signal: 'project-framework-owned-by-root-isomorph',
      positivePath: '.isomorph/bootstrap/docwarden/concept/spec.md',
      positive: `---
kind: concept
---

# spec

This docwarden semantic shape is being treated as root isomorph source.
`,
      negativePath: 'frameworks/animation/vocabulary.md',
      negative: `---
kind: semantic-framework
---

# animation-framework

## Domain

animation vocabulary.

## Naming Surface

- stagger
- spring

## Semantic Objects

- motion term

      ## Loss Model

- jank
`,
      bootstrapSignal: 'bootstrap/lint/signal/project-framework-owned-by-root-isomorph.md',
    },
    {
      signal: 'concrete-skill-primitive-under-root',
      positivePath: '.isomorph/basis/primitives/skill-primitive/custom.md',
      positive: `---
kind: skill-primitive
---

# custom-skill

## Capability

Create a repository-specific skill from root primitive catalog material.
`,
      negativePath: 'stable-skill-primitive.md',
      negative: `---
kind: skill-primitive
---

# stable-skill

## Capability

Create skills through the stable primitive surface.

## Trigger

Description: Use when stabilizing skill primitive material.

## Soft Boundary

- Decide semantic skill behavior.

## Hard Boundary

- Defer runtime writes to exporters.

## Workflow

- Keep review gates as workflow moves.
`,
      bootstrapSignal: 'bootstrap/lint/signal/concrete-skill-primitive-under-root.md',
    },
  ])('covers pinned baseline signal positive and negative fixtures: $signal', async ({
    negative,
    negativePath,
    positive,
    positivePath,
    signal,
    bootstrapSignal,
  }) => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const positiveTarget = path.join(workspace, positivePath)
    const negativeTarget = path.join(workspace, negativePath)
    await fs.mkdir(path.dirname(positiveTarget), { recursive: true })
    await fs.mkdir(path.dirname(negativeTarget), { recursive: true })
    await fs.writeFile(positiveTarget, positive, 'utf8')
    await fs.writeFile(negativeTarget, negative, 'utf8')

    if (bootstrapSignal !== undefined) {
      const sourceSignal = path.join(sourceBaselineRoot, bootstrapSignal)
      const targetSignal = path.join(workspace, '.isomorph', bootstrapSignal)
      await fs.mkdir(path.dirname(targetSignal), { recursive: true })
      await fs.copyFile(sourceSignal, targetSignal)
    }
    const positiveResult = await runIsomorph(runLintEffect({
      root: workspace,
      target: positiveTarget,
    }))
    const negativeResult = await runIsomorph(runLintEffect({
      root: workspace,
      target: negativeTarget,
    }))
    const emitted = positiveResult.signals.find(item => item.signal === signal)

    expect(emitted).toBeDefined()
    expect(emitted?.evidence.length).toBeGreaterThan(0)
    expect(emitted?.basis.length).toBeGreaterThan(0)
    expect(emitted?.lossModel.length).toBeGreaterThan(0)
    expect(negativeResult.signals.some(item => item.signal === signal)).toBe(false)
  })

  it('validates initialized project skill primitive material through pinned package bootstrap', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'custom-skill.md')
    await fs.writeFile(target, `---
kind: skill-primitive
---

# custom-skill-creator

## Capability

Create or update Codex skills as behavior interventions before files are materialized.

Pressure Scenarios:

- User asks to create a skill and the agent starts with directory layout instead of failure mode.
- User asks to evolve skill-primitive and the agent treats CLI guardrails as skill behavior.

## Trigger

Description: Use when creating or updating a Codex skill from isomorph primitive material, especially when the user needs the skill behavior theory before files are materialized.

Triggers:

- create a skill from this primitive
- update skill-primitive

Exclusions:

- requests to run an existing skill validation script only.

## Soft Boundary

- Decide whether the skill exists to correct a real agent drift.
- Decide which judgments belong in skill instructions.

## Hard Boundary

- Defer filesystem shape validation to deterministic skill validation scripts.
- Do not materialize final SKILL.md artifacts from primitive analysis alone.

## Workflow

- Name the pressure scenario before naming the skill capability.
- Separate agent judgment from deterministic guardrails.
- Produce an export draft only after workflow and validation material exist.
- Ask the user to confirm the pressure scenario and trigger boundary before materializing the skill.

## Export Shape

- SKILL.md description must preserve trigger terms.
- SKILL.md body must preserve capability, trigger, soft boundary, hard boundary, workflow, semantic basis, and validation.

## Semantic Basis

- [[bootstrap/primitives/concept/skill-primitive|skill-primitive]]
- [[bootstrap/primitives/concept/primitive-creator|primitive-creator]]

## Validation

- Forward-test the materialized skill with a realistic user request.
`, 'utf8')

    const result = await runIsomorph(runPrimitiveSkillEffect({
      root: workspace,
      target,
    }))

    expect(result.recognizedRole).toBe('skill-primitive')
    expect(result.status).toBe('ready')
    expect(result.model).toMatchObject({
      capability: 'Create or update Codex skills as behavior interventions before files are materialized.',
      triggerDescription: 'Use when creating or updating a Codex skill from isomorph primitive material, especially when the user needs the skill behavior theory before files are materialized.',
    })
    expect(result.plan.compiler).toBe('draft-skill-v0')
    expect(result.plan.exportable).toBe(true)
    expect(result.plan.missingForExport).not.toContain('semantic-basis')
    expect(result.exportDraft).toMatchObject({
      artifact: 'codex-skill',
      skillName: 'custom-skill-creator',
      readiness: 'ready',
      frontmatter: {
        name: 'custom-skill-creator',
        description: 'Use when creating or updating a Codex skill from isomorph primitive material, especially when the user needs the skill behavior theory before files are materialized.',
      },
    })
    expect(result.model.pressureScenarios).toContain('User asks to create a skill and the agent starts with directory layout instead of failure mode.')
    expect(result.model.softBoundary).toContain('Decide whether the skill exists to correct a real agent drift.')
    expect(result.model.hardBoundary).toContain('Defer filesystem shape validation to deterministic skill validation scripts.')
    expect(result.model.workflow).toContain('Produce an export draft only after workflow and validation material exist.')
    expect(result.model.workflow).toContain('Ask the user to confirm the pressure scenario and trigger boundary before materializing the skill.')
    expect(result.model.validation).toContain('Forward-test the materialized skill with a realistic user request.')
    expect(result.model.semanticBasisLinks).toContain('bootstrap/primitives/concept/skill-primitive')
    expect(result.exportPosition.present).toBe(true)
    expect(result.sourceMaterial).toContain('bootstrap/templates/skill-primitive.md')
    expect(result.diagnostics).toHaveLength(0)
  })

  it('reports missing skill primitive semantic basis links as needs-work', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'custom-skill.md')
    await fs.writeFile(target, `---
kind: skill-primitive
---

# custom-skill-creator

## Capability

Create a skill from primitive material only after the capability is modeled.

Pressure Scenarios:

- User asks for a skill and the agent starts with files first.

## Trigger

Description: Use when creating a skill from primitive material.

Triggers:

- create a skill

Exclusions:

- run validation only.

## Soft Boundary

- Decide whether the skill exists to correct a real agent drift.

## Hard Boundary

- Defer filesystem shape validation to deterministic skill validation scripts.

## Workflow

- Name the pressure scenario before export.
- Ask the user to confirm drift before materialization.

## Export Shape

- SKILL.md export must preserve model material.

## Semantic Basis

- [[bootstrap/primitives/concept/skill-primitive|skill-primitive]]

## Validation

- Forward-test the materialized skill.
`, 'utf8')

    const result = await runIsomorph(runPrimitiveSkillEffect({
      root: workspace,
      target,
    }))

    expect(result.status).toBe('needs-work')
    expect(result.diagnostics).toContainEqual({
      severity: 'warning',
      message: 'missing semantic basis link: bootstrap/primitives/concept/primitive-creator',
    })
  })

  it('reports broken skill primitive semantic basis links as needs-work', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'custom-skill.md')
    await fs.writeFile(target, `---
kind: skill-primitive
---

# custom-skill-creator

## Capability

Create a skill from primitive material only after the capability is modeled.

Pressure Scenarios:

- User asks for a skill and the agent starts with files first.

## Trigger

Description: Use when creating a skill from primitive material.

Triggers:

- create a skill

Exclusions:

- run validation only.

## Soft Boundary

- Decide whether the skill exists to correct a real agent drift.

## Hard Boundary

- Defer filesystem shape validation to deterministic skill validation scripts.

## Workflow

- Name the pressure scenario before export.
- Ask the user to confirm drift before materialization.

## Export Shape

- SKILL.md export must preserve model material.

## Semantic Basis

- [[bootstrap/primitives/concept/skill-primitive|skill-primitive]]
- [[bootstrap/primitives/concept/primitive-creator|primitive-creator]]
- [[bootstrap/primitives/concept/missing|missing]]

## Validation

- Forward-test the materialized skill.
`, 'utf8')

    const result = await runIsomorph(runPrimitiveSkillEffect({
      root: workspace,
      target,
    }))

    expect(result.status).toBe('needs-work')
    expect(result.diagnostics).toContainEqual({
      severity: 'warning',
      message: 'broken semantic basis link: bootstrap/primitives/concept/missing',
    })
  })

  it('blocks skill primitive export when placeholder material remains', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'placeholder-skill.md')
    await fs.writeFile(target, `---
kind: skill-primitive
---

# placeholder-skill

## Capability

<Name the behavior intervention this future skill gives an agent.>

Pressure Scenarios:

- User asks for a skill and the agent starts with files first.

## Trigger

Description: Use when creating a skill from primitive material.

Triggers:

- create a skill

Exclusions:

- run validation only.

## Soft Boundary

- Decide whether the skill exists to correct a real agent drift.

## Hard Boundary

- Defer filesystem shape validation to deterministic skill validation scripts.

## Workflow

- Name the pressure scenario before export.
- Ask the user to confirm drift before materialization.

## Export Shape

- SKILL.md export must preserve model material.

## Semantic Basis

- [[bootstrap/primitives/concept/skill-primitive|skill-primitive]]
- [[bootstrap/primitives/concept/primitive-creator|primitive-creator]]

## Validation

- Forward-test the materialized skill.
`, 'utf8')

    const result = await runIsomorph(runPrimitiveSkillEffect({
      root: workspace,
      target,
    }))

    expect(result.status).toBe('needs-work')
    expect(result.plan.exportable).toBe(false)
    expect(result.plan.missingForExport).toContain('capability')
    expect(result.exportDraft.readiness).toBe('blocked')
    expect(result.diagnostics).toContainEqual({
      severity: 'warning',
      message: 'capability contains placeholder material',
    })
  })

  it('reports pinned vendor baseline for upgrade without running a merge engine', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({
      root: workspace,
      now: new Date('2026-05-26T00:00:00.000Z'),
    }))

    const result = await runIsomorph(runUpgradeStatusEffect({ root: workspace }))

    expect(result.status).toBe('derived-v0')
    if (result.status !== 'derived-v0') {
      throw new Error('expected derived-v0')
    }
    expect(result.localInstance.status).toBe('derived-v0')
    expect(result.pinStatus.status).toBe('pinned-v0')
    expect(result.pinnedBaseline?.ref).toBe('isomorph-origin-v0')
    expect(result.pinnedBaseline?.digest).toBe(result.newBaseline.digest)
    expect(result.mergeEngine).toBe('not-implemented-v0')
  })

  it('treats source metadata as an origin instance instead of a missing pinned baseline', async () => {
    const workspace = await makeWorkspace()
    const isomorphRoot = path.join(workspace, '.isomorph')
    const concept = path.join(isomorphRoot, 'basis/primitives/concept/concept.md')
    await fs.mkdir(path.dirname(concept), { recursive: true })
    await writeSourceMetadata(workspace)
    await fs.writeFile(concept, `---
kind: concept
---

# concept
`, 'utf8')

    const inspect = await runIsomorph(runDoctorInspectEffect({ root: workspace }))
    const issueCodes = inspect.issues.map(issue => issue.code)

    expect(inspect.instance.status).toBe('origin')
    expect(issueCodes).not.toContain('missing-pin-metadata')
    expect(issueCodes).not.toContain('missing-baseline-material')
    expect(issueCodes).not.toContain('baseline-material-conflict')
    expect(issueCodes).toContain('missing-recognition-authority')
    expect(inspect.repairPlans.map(plan => plan.id)).not.toContain('install-default-recognition-primitive')

    const upgraded = await runIsomorph(runUpgradeStatusEffect({ root: workspace }))
    expect(upgraded.status).toBe('origin')
  })

  it('keeps upgrade status read-only over the local tree', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const before = await treeSnapshot(path.join(workspace, '.isomorph'))

    await runIsomorph(runUpgradeStatusEffect({ root: workspace }))

    await expect(treeSnapshot(path.join(workspace, '.isomorph'))).resolves.toEqual(before)
  })

  it('fails upgrade for a shape-valid unknown pin baseline', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    const pinPath = path.join(workspace, '.isomorph', '.isomorph-pin.json')
    await fs.writeFile(pinPath, `${JSON.stringify({
      schemaVersion: 1,
      vendor: 'isomorph',
      ref: 'unknown',
      digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      createdAt: '2026-05-26T00:00:00.000Z',
    })}\n`, 'utf8')

    await expect(runIsomorph(runUpgradeStatusEffect({ root: workspace }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('fails ordinary upgrade when .isomorph exists without pin metadata', async () => {
    const workspace = await makeWorkspace()
    await fs.mkdir(path.join(workspace, '.isomorph'), { recursive: true })
    await fs.writeFile(path.join(workspace, '.isomorph', 'local.md'), '# local\n', 'utf8')

    await expect(runIsomorph(runUpgradeStatusEffect({ root: workspace }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('lets doctor inspect and repair a pre-v0 local instance without relaxing ordinary upgrade', async () => {
    const workspace = await makeWorkspace()
    await fs.mkdir(path.join(workspace, '.isomorph'), { recursive: true })
    await fs.writeFile(path.join(workspace, '.isomorph', 'local.md'), '# local\n', 'utf8')

    const inspect = await runIsomorph(runDoctorInspectEffect({ root: workspace }))
    expect(inspect.issues.map(issue => issue.code)).toContain('missing-pin-metadata')
    expect(inspect.issues.map(issue => issue.code)).toContain('missing-recognition-authority')
    expect(inspect.repairPlans.map(plan => plan.id)).toContain('adopt-pinned-baseline')

    const repair = await runIsomorph(runDoctorRepairEffect({
      root: workspace,
      plan: 'adopt-pinned-baseline',
      now: new Date('2026-05-26T00:00:00.000Z'),
    }))
    expect(repair.applied).toBe(true)
    expect(repair.actions).toContain('write pin metadata: .isomorph-pin.json')

    const upgraded = await runIsomorph(runUpgradeStatusEffect({ root: workspace }))
    expect(upgraded.status).toBe('derived-v0')

    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')
    const recognized = await runIsomorph(runRecognitionEffect({ root: workspace, target }))
    expect(recognized.recognition.basis[0]).toBe('local recognition rule: local-kind-frontmatter')
  })

  it('decodes malformed pin JSON as a parse error', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    await fs.writeFile(path.join(workspace, '.isomorph', '.isomorph-pin.json'), '{bad json', 'utf8')

    await expect(runIsomorph(readPinEffect(path.join(workspace, '.isomorph')))).rejects.toBeInstanceOf(IsomorphParseError)
  })

  it.each([
    ['missing field', { schemaVersion: 1, vendor: 'isomorph', ref: 'isomorph-origin-v0', createdAt: '2026-05-26T00:00:00.000Z' }],
    ['wrong field type', { schemaVersion: '1', vendor: 'isomorph', ref: 'isomorph-origin-v0', digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', createdAt: '2026-05-26T00:00:00.000Z' }],
    ['unsupported schemaVersion', { schemaVersion: 99, vendor: 'isomorph', ref: 'isomorph-origin-v0', digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', createdAt: '2026-05-26T00:00:00.000Z' }],
    ['invalid digest', { schemaVersion: 1, vendor: 'isomorph', ref: 'isomorph-origin-v0', digest: 'not-a-digest', createdAt: '2026-05-26T00:00:00.000Z' }],
    ['invalid createdAt', { schemaVersion: 1, vendor: 'isomorph', ref: 'isomorph-origin-v0', digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', createdAt: 'not-a-date' }],
  ])('decodes invalid pin metadata as config error: %s', async (_name, pin) => {
    const workspace = await makeWorkspace()
    await runIsomorph(runInitEffect({ root: workspace }))
    await fs.writeFile(path.join(workspace, '.isomorph', '.isomorph-pin.json'), `${JSON.stringify(pin)}\n`, 'utf8')

    await expect(runIsomorph(readPinEffect(path.join(workspace, '.isomorph')))).rejects.toBeInstanceOf(IsomorphConfigError)
  })
})
