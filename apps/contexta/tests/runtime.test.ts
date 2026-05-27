import type { ContextaRuntimeServices } from '../src/runtime.js'
import { promises as fs } from 'node:fs'
import os from 'node:os'

import path from 'node:path'
import { Effect } from 'effect'

import { describe, expect, it } from 'vitest'
import { parseMarkdownSurface } from '../src/markdown.js'
import {
  ContextaConfigError,
  contextaLiveLayer,
  ContextaParseError,

  readPinEffect,
  resolveContextaRootEffect,
  runDoctorInspectEffect,
  runDoctorRepairEffect,
  runInitEffect,
  runLintEffect,
  runPrimitiveSkillEffect,
  runRecognitionEffect,
  runUpgradeStatusEffect,
} from '../src/runtime.js'

async function makeWorkspace(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'contexta-test-'))
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

function runContexta<A, E>(effect: Effect.Effect<A, E, ContextaRuntimeServices>): Promise<A> {
  return Effect.runPromise(effect.pipe(Effect.provide(contextaLiveLayer)))
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

See [[mapping/bootstrap/modules/concept/concept|concept]].
`, 'sample.md')

    expect(surface.frontmatter).toEqual({
      kind: 'concept',
      owner: 'test',
    })
    expect(surface.headings.map(heading => heading.text)).toEqual(['sample', 'Definition'])
    expect(surface.sections.find(section => section.heading.text === 'Definition')?.text).toContain('agent MUST')
    expect(surface.locatorMarkers[0]?.marker).toBe('^def-1')
    expect(surface.ofmLinks[0]).toMatchObject({
      target: 'mapping/bootstrap/modules/concept/concept',
      label: 'concept',
    })
  })
})

describe('contexta runtime v0', () => {
  it('initializes a non-root local .contexta instance with pin metadata', async () => {
    const workspace = await makeWorkspace()
    const result = await runContexta(runInitEffect({
      root: workspace,
      now: new Date('2026-05-26T00:00:00.000Z'),
    }))

    expect(result.contextaRoot).toBe(path.join(workspace, '.contexta'))
    expect(result.pin).toMatchObject({
      schemaVersion: 1,
      vendor: 'contexta',
      ref: 'contexta-seed-v0',
      createdAt: '2026-05-26T00:00:00.000Z',
    })
    await expect(fs.access(path.join(workspace, 'contexta.md'))).rejects.toThrow()
    await expect(fs.access(path.join(workspace, '.contexta', '.contexta-pin.json'))).resolves.toBeUndefined()
  })

  it('refuses to overwrite an existing local .contexta', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))

    await expect(runContexta(runInitEffect({ root: workspace }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('resolves .contexta from a target path before falling back to cwd', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const nested = path.join(workspace, 'nested', 'target.md')
    await fs.mkdir(path.dirname(nested), { recursive: true })
    await fs.writeFile(nested, '# target\n', 'utf8')

    const root = await runContexta(resolveContextaRootEffect({
      target: nested,
      cwd: path.dirname(nested),
    }))

    expect(root.source).toBe('target')
    expect(root.workspaceRoot).toBe(workspace)
    expect(root.contextaRoot).toBe(path.join(workspace, '.contexta'))
  })

  it('runs recognition before lint and emits local signal definitions with loss model', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# drift

## Definition

agent MUST treat this as a rule. ^def-1
`, 'utf8')

    const result = await runContexta(runLintEffect({
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
    expect(result.signals[0]?.lossModel).toContain('boundary between naming')
  })

  it('does not let an unknown frontmatter.kind become recognition authority', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'unknown.md')
    await fs.writeFile(target, `---
kind: not-local
---

# unknown
`, 'utf8')

    const result = await runContexta(runRecognitionEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('unknown')
  })

  it('does not let arbitrary local frontmatter.kind become recognition authority', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const localFile = path.join(workspace, '.contexta', 'mapping/bootstrap/modules/local/foo.md')
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

    const result = await runContexta(runRecognitionEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('unknown')
  })

  it('fails recognition when local recognition authority is missing', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    await fs.rm(path.join(workspace, '.contexta', 'mapping/bootstrap/modules/recognition'), { recursive: true })
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    await expect(runContexta(runRecognitionEffect({
      root: workspace,
      target,
    }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('fails recognition when local recognition trigger is unsupported', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const recognitionFile = path.join(workspace, '.contexta', 'mapping/bootstrap/modules/recognition/default.md')
    const original = await fs.readFile(recognitionFile, 'utf8')
    await fs.writeFile(recognitionFile, original.replace('frontmatter.kind is local kind', 'unsupported trigger syntax'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    await expect(runContexta(runRecognitionEffect({
      root: workspace,
      target,
    }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('lets local recognition material change recognition output', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const recognitionFile = path.join(workspace, '.contexta', 'mapping/bootstrap/modules/recognition/default.md')
    const original = await fs.readFile(recognitionFile, 'utf8')
    await fs.writeFile(recognitionFile, original.replace('Role: $frontmatter.kind', 'Role: locally-overridden'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    const result = await runContexta(runRecognitionEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('locally-overridden')
  })

  it('applies concept signals from recognized role instead of raw frontmatter.kind', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const recognitionFile = path.join(workspace, '.contexta', 'mapping/bootstrap/modules/recognition/default.md')
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

    const result = await runContexta(runLintEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('locally-overridden')
    expect(result.recognition.candidateSignalScope.find(candidate => candidate.signal === 'concept-as-policy')).toMatchObject({
      applicable: false,
      applicabilityBasis: 'mixed',
    })
    expect(result.signals).toHaveLength(0)
  })

  it('applies concept signals when recognition comes from a non-frontmatter rule', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const recognitionFile = path.join(workspace, '.contexta', 'mapping/bootstrap/modules/recognition/default.md')
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

    const result = await runContexta(runLintEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('concept')
    expect(result.signals.find(signal => signal.signal === 'concept-as-policy')).toBeDefined()
  })

  it('lets local kind material add a recognized role without changing TypeScript', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const localKind = path.join(workspace, '.contexta', 'mapping/bootstrap/modules/concept/decision.md')
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

    const result = await runContexta(runRecognitionEffect({
      root: workspace,
      target,
    }))

    expect(result.recognition.recognizedRole).toBe('decision')
  })

  it('uses edited local signal definitions during lint', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const signalFile = path.join(workspace, '.contexta', 'mapping/bootstrap/modules/signal/concept-as-policy.md')
    const original = await fs.readFile(signalFile, 'utf8')
    await fs.writeFile(signalFile, original.replace('section contains MUST / SHOULD / MUST NOT', 'section contains impossible-token'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# drift

## Definition

agent MUST treat this as a rule.
`, 'utf8')

    const result = await runContexta(runLintEffect({
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
    await runContexta(runInitEffect({ root: workspace }))
    const signalFile = path.join(workspace, '.contexta', 'mapping/bootstrap/modules/signal/concept-as-policy.md')
    const original = await fs.readFile(signalFile, 'utf8')
    await fs.writeFile(signalFile, original.replace(/## Loss Model\n\n[\s\S]*?\n## Trigger/, '## Trigger'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    const result = await runContexta(runLintEffect({
      root: workspace,
      target,
    }))

    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code: 'missing-signal-loss-model',
      target: 'mapping/bootstrap/modules/signal/concept-as-policy.md',
    }))
  })

  it('surfaces unsupported signal triggers as lint diagnostics', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const signalFile = path.join(workspace, '.contexta', 'mapping/bootstrap/modules/signal/concept-as-policy.md')
    const original = await fs.readFile(signalFile, 'utf8')
    await fs.writeFile(signalFile, original.replace('section contains MUST / SHOULD / MUST NOT', 'unsupported signal trigger'), 'utf8')
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    const result = await runContexta(runLintEffect({
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
      positivePath: 'mapping/custom/templates/bad-template.md',
      positive: `---
kind: template
---

# bad-template

## Rules

template MUST own source review lifecycle.
`,
      negativePath: 'mapping/custom/templates/good-template.md',
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
      positivePath: 'example.md',
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
  ])('covers seed signal positive and negative fixtures: $signal', async ({ negative, negativePath, positive, positivePath, signal }) => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const positiveTarget = path.join(workspace, positivePath)
    const negativeTarget = path.join(workspace, negativePath)
    await fs.mkdir(path.dirname(positiveTarget), { recursive: true })
    await fs.mkdir(path.dirname(negativeTarget), { recursive: true })
    await fs.writeFile(positiveTarget, positive, 'utf8')
    await fs.writeFile(negativeTarget, negative, 'utf8')

    const positiveResult = await runContexta(runLintEffect({
      root: workspace,
      target: positiveTarget,
    }))
    const negativeResult = await runContexta(runLintEffect({
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

  it('validates skill primitive material through primitive-creator v0 and returns a model', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'custom-skill.md')
    await fs.writeFile(target, `---
kind: skill-primitive
---

# custom-skill-creator

## Capability

Create a local skill primitive from contexta semantic basis.

## Trigger

Use when a user asks to create a new skill primitive.

## Semantic Basis

- [[mapping/bootstrap/modules/concept/skill-primitive|skill-primitive]]
- [[mapping/bootstrap/modules/concept/primitive-creator|primitive-creator]]

## Export Position

Future SKILL.md export must preserve trigger, capability, and semantic basis.
`, 'utf8')

    const result = await runContexta(runPrimitiveSkillEffect({
      root: workspace,
      target,
    }))

    expect(result.recognizedRole).toBe('skill-primitive')
    expect(result.status).toBe('ready')
    expect(result.model).toMatchObject({
      capability: 'Create a local skill primitive from contexta semantic basis.',
      trigger: 'Use when a user asks to create a new skill primitive.',
    })
    expect(result.plan.compiler).toBe('not-implemented-v0')
    expect(result.model.semanticBasisLinks).toContain('mapping/bootstrap/modules/concept/skill-primitive')
    expect(result.exportPosition.present).toBe(true)
    expect(result.sourceMaterial).toContain('mapping/bootstrap/templates/skill-primitive.md')
  })

  it('reports missing skill primitive semantic basis links as needs-work', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'custom-skill.md')
    await fs.writeFile(target, `---
kind: skill-primitive
---

# custom-skill-creator

## Capability

Create a local skill primitive.

## Trigger

Use when needed.

## Semantic Basis

- [[mapping/bootstrap/modules/concept/skill-primitive|skill-primitive]]

## Export Position

Future SKILL.md export must preserve model material.
`, 'utf8')

    const result = await runContexta(runPrimitiveSkillEffect({
      root: workspace,
      target,
    }))

    expect(result.status).toBe('needs-work')
    expect(result.diagnostics).toContainEqual({
      severity: 'warning',
      message: 'missing semantic basis link: mapping/bootstrap/modules/concept/primitive-creator',
    })
  })

  it('reports broken skill primitive semantic basis links as needs-work', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const target = path.join(workspace, 'custom-skill.md')
    await fs.writeFile(target, `---
kind: skill-primitive
---

# custom-skill-creator

## Capability

Create a local skill primitive.

## Trigger

Use when needed.

## Semantic Basis

- [[mapping/bootstrap/modules/concept/skill-primitive|skill-primitive]]
- [[mapping/bootstrap/modules/concept/primitive-creator|primitive-creator]]
- [[mapping/bootstrap/modules/concept/missing|missing]]

## Export Position

Future SKILL.md export must preserve model material.
`, 'utf8')

    const result = await runContexta(runPrimitiveSkillEffect({
      root: workspace,
      target,
    }))

    expect(result.status).toBe('needs-work')
    expect(result.diagnostics).toContainEqual({
      severity: 'warning',
      message: 'broken semantic basis link: mapping/bootstrap/modules/concept/missing',
    })
  })

  it('reports pinned vendor baseline for upgrade without running a merge engine', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({
      root: workspace,
      now: new Date('2026-05-26T00:00:00.000Z'),
    }))

    const result = await runContexta(runUpgradeStatusEffect({ root: workspace }))

    expect(result.localInstance.status).toBe('pinned-v0')
    expect(result.pinStatus.status).toBe('pinned-v0')
    expect(result.pinnedBaseline?.ref).toBe('contexta-seed-v0')
    expect(result.pinnedBaseline?.digest).toBe(result.newBaseline.digest)
    expect(result.mergeEngine).toBe('not-implemented-v0')
  })

  it('keeps upgrade status read-only over the local tree', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const before = await treeSnapshot(path.join(workspace, '.contexta'))

    await runContexta(runUpgradeStatusEffect({ root: workspace }))

    await expect(treeSnapshot(path.join(workspace, '.contexta'))).resolves.toEqual(before)
  })

  it('fails upgrade for a shape-valid unknown pin baseline', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    const pinPath = path.join(workspace, '.contexta', '.contexta-pin.json')
    await fs.writeFile(pinPath, `${JSON.stringify({
      schemaVersion: 1,
      vendor: 'contexta',
      ref: 'unknown',
      digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      createdAt: '2026-05-26T00:00:00.000Z',
    })}\n`, 'utf8')

    await expect(runContexta(runUpgradeStatusEffect({ root: workspace }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('fails ordinary upgrade when .contexta exists without pin metadata', async () => {
    const workspace = await makeWorkspace()
    await fs.mkdir(path.join(workspace, '.contexta'), { recursive: true })
    await fs.writeFile(path.join(workspace, '.contexta', 'local.md'), '# local\n', 'utf8')

    await expect(runContexta(runUpgradeStatusEffect({ root: workspace }))).rejects.toMatchObject({
      kind: 'config',
    })
  })

  it('lets doctor inspect and repair a pre-v0 local instance without relaxing ordinary upgrade', async () => {
    const workspace = await makeWorkspace()
    await fs.mkdir(path.join(workspace, '.contexta'), { recursive: true })
    await fs.writeFile(path.join(workspace, '.contexta', 'local.md'), '# local\n', 'utf8')

    const inspect = await runContexta(runDoctorInspectEffect({ root: workspace }))
    expect(inspect.issues.map(issue => issue.code)).toContain('missing-pin-metadata')
    expect(inspect.issues.map(issue => issue.code)).toContain('missing-recognition-authority')
    expect(inspect.repairPlans.map(plan => plan.id)).toContain('adopt-packaged-baseline')

    const repair = await runContexta(runDoctorRepairEffect({
      root: workspace,
      plan: 'adopt-packaged-baseline',
      now: new Date('2026-05-26T00:00:00.000Z'),
    }))
    expect(repair.applied).toBe(true)
    expect(repair.actions).toContain('write pin metadata: .contexta-pin.json')

    const upgraded = await runContexta(runUpgradeStatusEffect({ root: workspace }))
    expect(upgraded.localInstance.status).toBe('pinned-v0')

    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')
    const recognized = await runContexta(runRecognitionEffect({ root: workspace, target }))
    expect(recognized.recognition.basis[0]).toBe('local recognition rule: local-kind-frontmatter')
  })

  it('decodes malformed pin JSON as a parse error', async () => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    await fs.writeFile(path.join(workspace, '.contexta', '.contexta-pin.json'), '{bad json', 'utf8')

    await expect(runContexta(readPinEffect(path.join(workspace, '.contexta')))).rejects.toBeInstanceOf(ContextaParseError)
  })

  it.each([
    ['missing field', { schemaVersion: 1, vendor: 'contexta', ref: 'contexta-seed-v0', createdAt: '2026-05-26T00:00:00.000Z' }],
    ['wrong field type', { schemaVersion: '1', vendor: 'contexta', ref: 'contexta-seed-v0', digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', createdAt: '2026-05-26T00:00:00.000Z' }],
    ['unsupported schemaVersion', { schemaVersion: 99, vendor: 'contexta', ref: 'contexta-seed-v0', digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', createdAt: '2026-05-26T00:00:00.000Z' }],
    ['invalid digest', { schemaVersion: 1, vendor: 'contexta', ref: 'contexta-seed-v0', digest: 'not-a-digest', createdAt: '2026-05-26T00:00:00.000Z' }],
    ['invalid createdAt', { schemaVersion: 1, vendor: 'contexta', ref: 'contexta-seed-v0', digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', createdAt: 'not-a-date' }],
  ])('decodes invalid pin metadata as config error: %s', async (_name, pin) => {
    const workspace = await makeWorkspace()
    await runContexta(runInitEffect({ root: workspace }))
    await fs.writeFile(path.join(workspace, '.contexta', '.contexta-pin.json'), `${JSON.stringify(pin)}\n`, 'utf8')

    await expect(runContexta(readPinEffect(path.join(workspace, '.contexta')))).rejects.toBeInstanceOf(ContextaConfigError)
  })
})
