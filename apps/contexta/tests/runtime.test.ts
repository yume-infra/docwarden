import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { parseMarkdownSurface } from '../src/markdown.js'
import {
  ContextaRuntimeError,
  resolveContextaRoot,
  runInit,
  runLint,
  runPrimitiveSkill,
  runUpgradeStatus,
} from '../src/runtime.js'

async function makeWorkspace(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'contexta-test-'))
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
    const result = await runInit({
      root: workspace,
      now: new Date('2026-05-26T00:00:00.000Z'),
    })

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
    await runInit({ root: workspace })

    await expect(runInit({ root: workspace })).rejects.toBeInstanceOf(ContextaRuntimeError)
    await expect(runInit({ root: workspace })).rejects.toMatchObject({
      kind: 'config',
      exitCode: 2,
    })
  })

  it('resolves .contexta from a target path before falling back to cwd', async () => {
    const workspace = await makeWorkspace()
    await runInit({ root: workspace })
    const nested = path.join(workspace, 'nested', 'target.md')
    await fs.mkdir(path.dirname(nested), { recursive: true })
    await fs.writeFile(nested, '# target\n', 'utf8')

    const root = await resolveContextaRoot({
      target: nested,
      cwd: path.dirname(nested),
    })

    expect(root.source).toBe('target')
    expect(root.workspaceRoot).toBe(workspace)
    expect(root.contextaRoot).toBe(path.join(workspace, '.contexta'))
  })

  it('runs recognition before lint and emits local signal definitions', async () => {
    const workspace = await makeWorkspace()
    await runInit({ root: workspace })
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# drift

## Definition

agent MUST treat this as a rule. ^def-1
`, 'utf8')

    const result = await runLint({
      root: workspace,
      target,
    })

    expect(result.recognition.recognizedRole).toBe('concept')
    expect(result.recognition.candidateSignalScope.some(candidate => candidate.signal === 'concept-as-policy')).toBe(true)
    expect(result.signals).toHaveLength(1)
    expect(result.signals[0]).toMatchObject({
      signal: 'concept-as-policy',
      context: 'Definition',
      locator: '^def-1',
    })
  })

  it('validates skill primitive material through primitive-creator v0', async () => {
    const workspace = await makeWorkspace()
    await runInit({ root: workspace })
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

    const result = await runPrimitiveSkill({
      root: workspace,
      target,
    })

    expect(result.recognizedRole).toBe('skill-primitive')
    expect(result.status).toBe('ready')
    expect(result.exportPosition.present).toBe(true)
    expect(result.sourceMaterial).toContain('mapping/bootstrap/templates/skill-primitive.md')
  })

  it('reports pinned vendor baseline for upgrade without running a merge engine', async () => {
    const workspace = await makeWorkspace()
    await runInit({
      root: workspace,
      now: new Date('2026-05-26T00:00:00.000Z'),
    })

    const result = await runUpgradeStatus({ root: workspace })

    expect(result.pin.ref).toBe('contexta-seed-v0')
    expect(result.mergeEngine).toBe('not-implemented-v0')
  })
})
