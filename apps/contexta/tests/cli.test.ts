import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { beforeAll, describe, expect, it } from 'vitest'

interface ProcessResult {
  readonly stdout: string
  readonly stderr: string
  readonly exitCode: number | null
}

const testRoot = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(testRoot, '..')
const repoRoot = path.resolve(packageRoot, '../..')
const contextaBin = path.join(packageRoot, 'dist/index.js')

async function makeWorkspace(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'contexta-cli-test-'))
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

function runContexta(args: readonly string[], cwd: string): Promise<ProcessResult> {
  return runProcess(process.execPath, [contextaBin, ...args], cwd)
}

beforeAll(async () => {
  const result = await runProcess('pnpm', ['--filter', 'contexta', 'build'], repoRoot)
  expect(result.exitCode, result.stderr).toBe(0)
}, 60_000)

describe('contexta CLI contract', () => {
  it('prints help', async () => {
    const result = await runContexta(['--help'], repoRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('contexta')
  })

  it('initializes with JSON output and rejects duplicate init as config error', async () => {
    const workspace = await makeWorkspace()
    const init = await runContexta(['--root', workspace, 'init', '--json'], repoRoot)

    expect(init.exitCode).toBe(0)
    expect(init.stderr).toBe('')
    expect(JSON.parse(init.stdout)).toMatchObject({
      contextaRoot: path.join(workspace, '.contexta'),
      pin: {
        schemaVersion: 1,
        vendor: 'contexta',
      },
    })

    const duplicate = await runContexta(['--root', workspace, 'init'], repoRoot)
    expect(duplicate.exitCode).toBe(2)
    expect(duplicate.stderr).toContain('contexta config error:')

    const nested = await runContexta(['--root', path.join(workspace, '.contexta'), 'init'], repoRoot)
    expect(nested.exitCode).toBe(2)
    expect(nested.stderr).toContain('contexta config error:')
    expect(nested.stderr).toContain('workspace root')
    await expect(fs.access(path.join(workspace, '.contexta', '.contexta'))).rejects.toThrow()
  })

  it('initializes in cwd when root is omitted', async () => {
    const workspace = await makeWorkspace()
    const result = await runContexta(['init'], workspace)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    await expect(fs.access(path.join(workspace, '.contexta', '.contexta-pin.json'))).resolves.toBeUndefined()
  })

  it('recognizes a target with JSON output', async () => {
    const workspace = await makeWorkspace()
    await runContexta(['--root', workspace, 'init'], repoRoot)
    const target = path.join(workspace, 'concept.md')
    await fs.writeFile(target, `---
kind: concept
---

# concept
`, 'utf8')

    const result = await runContexta(['--root', workspace, 'recognize', target, '--json'], repoRoot)
    const output = JSON.parse(result.stdout)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    expect(output.recognition.recognizedRole).toBe('concept')
    expect(output.recognition.features.frontmatter.kind).toBe('concept')
  })

  it('returns contexta errors for missing and unreadable targets', async () => {
    const workspace = await makeWorkspace()
    await runContexta(['--root', workspace, 'init'], repoRoot)
    const missingArg = await runContexta(['--root', workspace, 'recognize'], repoRoot)
    const missingFile = await runContexta(['--root', workspace, 'lint', path.join(workspace, 'missing.md')], repoRoot)

    expect(missingArg.exitCode).toBe(2)
    expect(missingArg.stderr).toContain('contexta config error:')
    expect(missingArg.stderr).toContain('missing target argument')
    expect(missingFile.exitCode).toBe(2)
    expect(missingFile.stderr).toContain('contexta runtime error:')
    expect(missingFile.stderr).toContain('failed to read target')
  })

  it('returns lint exit 0 with no signals and exit 1 with signals', async () => {
    const workspace = await makeWorkspace()
    await runContexta(['--root', workspace, 'init'], repoRoot)
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

    const cleanResult = await runContexta(['--root', workspace, 'lint', clean], repoRoot)
    const driftResult = await runContexta(['--root', workspace, 'lint', drift, '--json'], repoRoot)
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
    await runContexta(['--root', workspace, 'init'], repoRoot)
    const target = path.join(outsideWorkspace, 'outside.md')
    await fs.writeFile(target, '# outside\n', 'utf8')

    const result = await runContexta(['--root', workspace, 'lint', target], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('contexta config error:')
    expect(result.stderr).toContain('outside resolved root')
  })

  it('returns exit 2 for invalid explicit roots', async () => {
    const workspace = await makeWorkspace()
    const target = path.join(workspace, 'target.md')
    await fs.writeFile(target, '# target\n', 'utf8')

    const result = await runContexta(['--root', path.join(workspace, 'missing'), 'lint', target], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('contexta config error:')
    expect(result.stderr).toContain('explicit root does not exist')
  })

  it('returns primitive skill exit 0 for ready and exit 1 for needs-work', async () => {
    const workspace = await makeWorkspace()
    await runContexta(['--root', workspace, 'init'], repoRoot)
    const ready = path.join(workspace, 'ready-skill.md')
    const needsWork = path.join(workspace, 'needs-work-skill.md')
    await fs.writeFile(ready, `---
kind: skill-primitive
---

# ready-skill

## Capability

Create a local skill primitive.

## Trigger

Use when needed.

## Semantic Basis

- [[mapping/bootstrap/modules/concept/skill-primitive|skill-primitive]]
- [[mapping/bootstrap/modules/concept/primitive-creator|primitive-creator]]

## Export Position

Future SKILL.md export must preserve model material.
`, 'utf8')
    await fs.writeFile(needsWork, `---
kind: skill-primitive
---

# needs-work

## Capability

Create a local skill primitive.
`, 'utf8')

    const readyResult = await runContexta(['--root', workspace, 'primitive', 'skill', ready], repoRoot)
    const needsWorkResult = await runContexta(['--root', workspace, 'primitive', 'skill', needsWork, '--json'], repoRoot)
    const needsWorkJson = JSON.parse(needsWorkResult.stdout)

    expect(readyResult.exitCode).toBe(0)
    expect(readyResult.stderr).toBe('')
    expect(readyResult.stdout).toContain('status: ready')
    expect(needsWorkResult.exitCode).toBe(1)
    expect(needsWorkJson.status).toBe('needs-work')
  })

  it('reports pinned upgrade status and malformed pin parse errors', async () => {
    const workspace = await makeWorkspace()
    await runContexta(['--root', workspace, 'init'], repoRoot)

    const pinned = await runContexta(['--root', workspace, 'upgrade'], repoRoot)
    expect(pinned.exitCode).toBe(0)
    expect(pinned.stderr).toBe('')
    expect(pinned.stdout).toContain('local instance: pinned-v0')

    await fs.writeFile(path.join(workspace, '.contexta', '.contexta-pin.json'), '{bad json', 'utf8')
    const malformed = await runContexta(['--root', workspace, 'upgrade'], repoRoot)
    expect(malformed.exitCode).toBe(2)
    expect(malformed.stderr).toContain('contexta parse error:')
  })

  it('fails upgrade for missing and unknown pins', async () => {
    const missingPinWorkspace = await makeWorkspace()
    await fs.mkdir(path.join(missingPinWorkspace, '.contexta'), { recursive: true })
    await fs.writeFile(path.join(missingPinWorkspace, '.contexta', 'local.md'), '# local\n', 'utf8')

    const missing = await runContexta(['--root', missingPinWorkspace, 'upgrade'], repoRoot)
    expect(missing.exitCode).toBe(2)
    expect(missing.stderr).toContain('contexta config error:')
    expect(missing.stderr).toContain('missing pin metadata')

    const unknownPinWorkspace = await makeWorkspace()
    await runContexta(['--root', unknownPinWorkspace, 'init'], repoRoot)
    await fs.writeFile(path.join(unknownPinWorkspace, '.contexta', '.contexta-pin.json'), `${JSON.stringify({
      schemaVersion: 1,
      vendor: 'contexta',
      ref: 'unknown',
      digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      createdAt: '2026-05-26T00:00:00.000Z',
    })}\n`, 'utf8')

    const unknown = await runContexta(['--root', unknownPinWorkspace, 'upgrade'], repoRoot)
    expect(unknown.exitCode).toBe(2)
    expect(unknown.stderr).toContain('unknown pinned baseline')
  })

  it('doctor inspects and repairs a pre-v0 local instance', async () => {
    const workspace = await makeWorkspace()
    await fs.mkdir(path.join(workspace, '.contexta'), { recursive: true })
    await fs.writeFile(path.join(workspace, '.contexta', 'local.md'), '# local\n', 'utf8')

    const inspect = await runContexta(['--root', workspace, 'doctor', '--json'], repoRoot)
    const inspectJson = JSON.parse(inspect.stdout)

    expect(inspect.exitCode).toBe(2)
    expect(inspectJson.issues.map((issue: { code: string }) => issue.code)).toContain('missing-pin-metadata')
    expect(inspectJson.repairPlans.map((plan: { id: string }) => plan.id)).toContain('adopt-packaged-baseline')

    const repair = await runContexta(['--root', workspace, 'doctor', 'repair', '--plan', 'adopt-packaged-baseline', '--json'], repoRoot)
    const repairJson = JSON.parse(repair.stdout)
    expect(repair.exitCode).toBe(0)
    expect(repair.stderr).toBe('')
    expect(repairJson.applied).toBe(true)

    const upgraded = await runContexta(['--root', workspace, 'upgrade'], repoRoot)
    expect(upgraded.exitCode).toBe(0)
    expect(upgraded.stdout).toContain('local instance: pinned-v0')
  })
})
