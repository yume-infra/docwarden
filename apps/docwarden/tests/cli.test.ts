import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { beforeAll, describe, expect, it } from 'vitest'

interface ProcessResult {
  readonly stdout: string
  readonly stderr: string
  readonly exitCode: number | null
}

const testRoot = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(testRoot, '..')
const repoRoot = path.resolve(packageRoot, '../..')
const docwardenBin = path.join(packageRoot, 'dist/index.js')
const expectedRuntimeConfig = [
  'review:',
  '  mode: review-first',
  '  pending_marker: review-pending',
  '',
  'cleanup:',
  '  after_promote_pick: delete',
  '',
  'review_surface:',
  '  files:',
  '    - index.md',
  '    - lead.md',
  '    - backing.md',
  '',
  'route_targets:',
  '  - promote',
  '  - pick',
  '  - log-only',
  '  - transfer',
  '  - no-op',
  '',
].join('\n')

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

function runDocwarden(args: readonly string[], cwd: string): Promise<ProcessResult> {
  return runProcess(process.execPath, [docwardenBin, ...args], cwd)
}

async function makeWorkspace(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'docwarden-cli-test-'))
}

beforeAll(async () => {
  const result = await runProcess('pnpm', ['--filter', 'docwarden', 'build'], repoRoot)
  expect(result.exitCode, result.stderr).toBe(0)
}, 60_000)

describe('docwarden CLI contract', () => {
  it('initializes with JSON output', async () => {
    const workspace = await makeWorkspace()
    const result = await runDocwarden(['--root', workspace, 'init', '--json'], repoRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')

    const output = JSON.parse(result.stdout)
    expect(output).toMatchObject({
      command: 'init',
      workspaceRoot: workspace,
      docwardenRoot: path.join(workspace, '.docwarden'),
      filesWritten: expect.arrayContaining([
        '.docwarden/task',
        '.docwarden/review',
        '.docwarden/archive',
        '.docwarden/config.yaml',
      ]),
    })

    await expect(fs.access(path.join(workspace, '.docwarden', 'config.yaml'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.docwarden', 'task'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.docwarden', 'review'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.docwarden', 'archive'))).resolves.toBeUndefined()

    const config = await fs.readFile(path.join(workspace, '.docwarden', 'config.yaml'), 'utf8')
    expect(config).toBe(expectedRuntimeConfig)
    expect(config).not.toContain('kind: workflow')
    expect(config).not.toContain('mapping: docwarden')
    expect(config).not.toContain('structure: workflow')
  })

  it('rejects duplicate init with config error', async () => {
    const workspace = await makeWorkspace()
    const first = await runDocwarden(['--root', workspace, 'init', '--json'], repoRoot)
    expect(first.exitCode).toBe(0)

    const duplicate = await runDocwarden(['--root', workspace, 'init'], repoRoot)
    expect(duplicate.exitCode).toBe(2)
    expect(duplicate.stderr).toContain('docwarden config error')
    expect(duplicate.stderr).toContain('local .docwarden already exists')
  })

  it('initializes in cwd when --root is omitted', async () => {
    const workspace = await makeWorkspace()
    const result = await runDocwarden(['init'], workspace)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    await expect(fs.access(path.join(workspace, '.docwarden', 'config.yaml'))).resolves.toBeUndefined()
  })

  it('rejects an existing .docwarden directory as init root', async () => {
    const workspace = await makeWorkspace()
    await fs.mkdir(path.join(workspace, '.docwarden'))

    const result = await runDocwarden(['--root', path.join(workspace, '.docwarden'), 'init'], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('docwarden config error')
    expect(result.stderr).toContain('init root must be a workspace root')
  })

  it('can be imported without running the CLI', async () => {
    const result = await runProcess(process.execPath, [
      '--input-type=module',
      '--eval',
      `await import(${JSON.stringify(pathToFileURL(docwardenBin).href)}); console.log('imported')`,
    ], repoRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toBe('imported\n')
  })
})
