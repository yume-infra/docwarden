import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

interface ProcessResult {
  readonly stdout: string
  readonly stderr: string
  readonly exitCode: number | null
}

const testRoot = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(testRoot, '..')
const repoRoot = path.resolve(packageRoot, '../..')
const isomorphBin = path.join(packageRoot, 'dist/index.js')

async function makeWorkspace(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'isomorph-cli-test-'))
}

function runProcess(command: string, args: readonly string[], cwd: string): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, [...args], {
      cwd,
      env: process.env,
    })
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []

    child.stdout.on('data', chunk => stdout.push(Buffer.from(chunk)))
    child.stderr.on('data', chunk => stderr.push(Buffer.from(chunk)))
    child.on('error', reject)
    child.on('close', exitCode => resolve({
      stdout: Buffer.concat(stdout).toString('utf8'),
      stderr: Buffer.concat(stderr).toString('utf8'),
      exitCode,
    }))
  })
}

function runIsomorph(args: readonly string[], cwd: string): Promise<ProcessResult> {
  return runProcess(process.execPath, [isomorphBin, ...args], cwd)
}

describe('isomorph CLI contract', () => {
  it('prints help', async () => {
    const result = await runIsomorph(['--help'], repoRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('isomorph')
  })

  it('initializes with JSON output and rejects duplicate init as config error', async () => {
    const workspace = await makeWorkspace()
    const init = await runIsomorph(['--root', workspace, 'init', '--json'], repoRoot)

    expect(init.exitCode).toBe(0)
    expect(init.stderr).toBe('')
    expect(JSON.parse(init.stdout)).toMatchObject({
      isomorphRoot: path.join(workspace, '.isomorph'),
      pin: {
        schemaVersion: 1,
        vendor: 'isomorph',
      },
    })

    const duplicate = await runIsomorph(['--root', workspace, 'init'], repoRoot)
    expect(duplicate.exitCode).toBe(2)
    expect(duplicate.stderr).toContain('isomorph config error:')

    const nested = await runIsomorph(['--root', path.join(workspace, '.isomorph'), 'init'], repoRoot)
    expect(nested.exitCode).toBe(2)
    expect(nested.stderr).toContain('isomorph config error:')
    expect(nested.stderr).toContain('workspace root')
    await expect(fs.access(path.join(workspace, '.isomorph', '.isomorph'))).rejects.toThrow()
  })

  it('initializes in cwd when root is omitted', async () => {
    const workspace = await makeWorkspace()
    const result = await runIsomorph(['init'], workspace)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    await expect(fs.access(path.join(workspace, '.isomorph', '.isomorph-pin.json'))).resolves.toBeUndefined()
  })

  it('recognizes a target with JSON output', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(['--root', workspace, 'init'], repoRoot)
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    const result = await runIsomorph(['--root', workspace, 'recognize', target, '--json'], repoRoot)
    const output = JSON.parse(result.stdout)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    expect(output.recognition.recognizedRole).toBe('concept')
    expect(output.recognition.features.frontmatter.kind).toBe('concept')
  })

  it('returns isomorph errors for missing and unreadable targets', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(['--root', workspace, 'init'], repoRoot)
    const missingArg = await runIsomorph(['--root', workspace, 'recognize'], repoRoot)
    const missingFile = await runIsomorph(['--root', workspace, 'lint', path.join(workspace, 'missing.md')], repoRoot)

    expect(missingArg.exitCode).toBe(2)
    expect(missingArg.stderr).toContain('isomorph config error:')
    expect(missingArg.stderr).toContain('missing target argument')
    expect(missingFile.exitCode).toBe(2)
    expect(missingFile.stderr).toContain('isomorph runtime error:')
    expect(missingFile.stderr).toContain('failed to read target')
  })

  it('returns lint exit 0 with no signals and exit 1 with signals', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(['--root', workspace, 'init'], repoRoot)
    const clean = path.join(workspace, 'clean.md')
    const drift = path.join(workspace, 'drift.md')
    await fs.writeFile(clean, `---
kind: concept
---

# clean

## Definition

plain definition.
`, 'utf8')
    await fs.writeFile(drift, `---
kind: concept
---

# drift

## Definition

agent MUST treat this as a rule. ^def-1
`, 'utf8')

    const cleanResult = await runIsomorph(['--root', workspace, 'lint', clean], repoRoot)
    const driftResult = await runIsomorph(['--root', workspace, 'lint', drift, '--json'], repoRoot)
    const driftJson = JSON.parse(driftResult.stdout)

    expect(cleanResult.exitCode).toBe(0)
    expect(cleanResult.stderr).toBe('')
    expect(cleanResult.stdout).toContain('signals: 0')
    expect(cleanResult.stdout).toContain('diagnostics:')
    expect(driftResult.exitCode).toBe(1)
    expect(driftResult.stderr).toBe('')
    expect(driftJson.signals[0]).toMatchObject({
      signal: 'concept-as-policy',
      locator: '^def-1',
    })
  })

  it('returns exit 2 for a target outside the resolved root', async () => {
    const workspace = await makeWorkspace()
    const outsideWorkspace = await makeWorkspace()
    await runIsomorph(['--root', workspace, 'init'], repoRoot)
    const target = path.join(outsideWorkspace, 'outside.md')
    await fs.writeFile(target, '# outside\n', 'utf8')

    const result = await runIsomorph(['--root', workspace, 'lint', target], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('isomorph config error:')
    expect(result.stderr).toContain('outside resolved root')
  })

  it('returns exit 2 for invalid explicit roots', async () => {
    const workspace = await makeWorkspace()
    const target = path.join(workspace, 'target.md')
    await fs.writeFile(target, '# target\n', 'utf8')

    const result = await runIsomorph(['--root', path.join(workspace, 'missing'), 'lint', target], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('isomorph config error:')
    expect(result.stderr).toContain('explicit root does not exist')
  })

  it('returns primitive skill exit 0 for ready and exit 1 for needs-work', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(['--root', workspace, 'init'], repoRoot)
    const ready = path.join(workspace, 'ready-skill.md')
    const needsWork = path.join(workspace, 'needs-work-skill.md')
    await fs.writeFile(ready, `---
kind: skill-primitive
---

# ready-skill

## Capability

Create or update Codex skills as behavior interventions before files are materialized.

Pressure Scenarios:

- User asks for a skill and the agent starts with files first.

## Trigger

Description: Use when creating or updating a Codex skill from primitive material.

Triggers:

- create a skill from primitive material

Exclusions:

- run an existing validation script only.

## Soft Boundary

- Decide whether the skill corrects a real agent drift.

## Hard Boundary

- Run deterministic validation scripts before accepting the skill.

## Workflow

- Name the pressure scenario before export.
- Separate agent judgment from deterministic guardrails.
- Ask the user to confirm the pressure scenario before materialization.

## Export Shape

- SKILL.md export must preserve capability, trigger, soft boundary, hard boundary, workflow, semantic basis, and validation.

## Semantic Basis

- [[primitives/modules/concept/skill-primitive|skill-primitive]]
- [[primitives/modules/concept/primitive-creator|primitive-creator]]

## Validation

- Run quick_validate.py on the materialized skill.
`, 'utf8')
    await fs.writeFile(needsWork, `---
kind: skill-primitive
---

# needs-work

## Capability

Create a local skill primitive.
`, 'utf8')

    const readyResult = await runIsomorph(['--root', workspace, 'primitive', 'skill', ready], repoRoot)
    const needsWorkResult = await runIsomorph(['--root', workspace, 'primitive', 'skill', needsWork, '--json'], repoRoot)
    const needsWorkJson = JSON.parse(needsWorkResult.stdout)

    expect(readyResult.exitCode).toBe(0)
    expect(readyResult.stderr).toBe('')
    expect(readyResult.stdout).toContain('status: ready')
    expect(needsWorkResult.exitCode).toBe(1)
    expect(needsWorkJson.status).toBe('needs-work')
  })

  it('lists local source layers, kinds, and templates', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(['--root', workspace, 'init'], repoRoot)

    const result = await runIsomorph(['--root', workspace, 'source', 'list', '--json'], repoRoot)
    const output = JSON.parse(result.stdout)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    const scopes = output.scopes.map((scope: { scope: string }) => scope.scope)
    expect(scopes).toContain('primitives')
    expect(scopes).toContain('grammars')
    expect(scopes).toContain('lint')
    expect(scopes).toContain('exports')
    const primitives = output.scopes.find((scope: { scope: string }) => scope.scope === 'primitives')
    const exports = output.scopes.find((scope: { scope: string }) => scope.scope === 'exports')
    expect(primitives.path).toBe('primitives/')
    expect(primitives.kinds).toContain('concept')
    expect(exports.path).toBe('exports/')
    expect(exports.templates).toContain('concept')
    expect(exports.templates).toContain('policy')

    const plain = await runIsomorph(['--root', workspace, 'source', 'list'], repoRoot)
    expect(plain.exitCode).toBe(0)
    expect(plain.stdout).toContain('isomorph source list')
    expect(plain.stdout).toContain('## primitives')
  })

  it('reports pinned upgrade status and malformed pin parse errors', async () => {
    const workspace = await makeWorkspace()
    await runIsomorph(['--root', workspace, 'init'], repoRoot)

    const pinned = await runIsomorph(['--root', workspace, 'upgrade'], repoRoot)
    expect(pinned.exitCode).toBe(0)
    expect(pinned.stderr).toBe('')
    expect(pinned.stdout).toContain('local instance: derived-v0')

    await fs.writeFile(path.join(workspace, '.isomorph', '.isomorph-pin.json'), '{bad json', 'utf8')
    const malformed = await runIsomorph(['--root', workspace, 'upgrade'], repoRoot)
    expect(malformed.exitCode).toBe(2)
    expect(malformed.stderr).toContain('isomorph parse error:')
  })

  it('fails upgrade for missing and unknown pins', async () => {
    const missingPinWorkspace = await makeWorkspace()
    await fs.mkdir(path.join(missingPinWorkspace, '.isomorph'), { recursive: true })
    await fs.writeFile(path.join(missingPinWorkspace, '.isomorph', 'local.md'), '# local\n', 'utf8')

    const missing = await runIsomorph(['--root', missingPinWorkspace, 'upgrade'], repoRoot)
    expect(missing.exitCode).toBe(2)
    expect(missing.stderr).toContain('isomorph config error:')
    expect(missing.stderr).toContain('missing pin metadata')

    const unknownPinWorkspace = await makeWorkspace()
    await runIsomorph(['--root', unknownPinWorkspace, 'init'], repoRoot)
    await fs.writeFile(path.join(unknownPinWorkspace, '.isomorph', '.isomorph-pin.json'), `${JSON.stringify({
      schemaVersion: 1,
      vendor: 'isomorph',
      ref: 'unknown',
      digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      createdAt: '2026-05-26T00:00:00.000Z',
    })}\n`, 'utf8')

    const unknown = await runIsomorph(['--root', unknownPinWorkspace, 'upgrade'], repoRoot)
    expect(unknown.exitCode).toBe(2)
    expect(unknown.stderr).toContain('unknown pinned baseline')
  })

  it('doctor inspects and repairs a pre-v0 local instance', async () => {
    const workspace = await makeWorkspace()
    await fs.mkdir(path.join(workspace, '.isomorph'), { recursive: true })
    await fs.writeFile(path.join(workspace, '.isomorph', 'local.md'), '# local\n', 'utf8')

    const inspect = await runIsomorph(['--root', workspace, 'doctor', '--json'], repoRoot)
    const inspectJson = JSON.parse(inspect.stdout)

    expect(inspect.exitCode).toBe(2)
    expect(inspectJson.issues.map((issue: { code: string }) => issue.code)).toContain('missing-pin-metadata')
    expect(inspectJson.repairPlans.map((plan: { id: string }) => plan.id)).toContain('adopt-packaged-baseline')

    const repair = await runIsomorph(['--root', workspace, 'doctor', 'repair', '--plan', 'adopt-packaged-baseline', '--json'], repoRoot)
    const repairJson = JSON.parse(repair.stdout)
    expect(repair.exitCode).toBe(0)
    expect(repair.stderr).toBe('')
    expect(repairJson.applied).toBe(true)

    const upgraded = await runIsomorph(['--root', workspace, 'upgrade'], repoRoot)
    expect(upgraded.exitCode).toBe(0)
    expect(upgraded.stdout).toContain('local instance: derived-v0')
  })
})
