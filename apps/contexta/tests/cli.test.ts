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

async function makeWorkspace(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'contexta-cli-test-'))
}

beforeAll(async () => {
  const result = await runProcess('pnpm', ['--filter', 'contexta', 'build'], repoRoot)
  expect(result.exitCode, result.stderr).toBe(0)
}, 60_000)

describe('contexta CLI contract', () => {
  it('prints command entrypoints', async () => {
    const result = await runContexta(['--help'], repoRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('contexta')
    expect(result.stdout).toContain(' capability ')
    expect(result.stdout).toContain(' catalog ')
    expect(result.stdout).toContain(' install ')
    expect(result.stdout).toContain(' activation ')
    expect(result.stdout).toContain(' asset ')
  })

  it('resolves capability entry in json mode', async () => {
    const workspace = await makeWorkspace()
    const result = await runContexta(['--root', workspace, 'capability', '--json'], repoRoot)

    expect(result.exitCode).toBe(0)
    const output = JSON.parse(result.stdout)
    expect(output).toMatchObject({
      command: 'capability',
    })
    expect(output.contextaRoot).toBe(path.join(workspace, '.contexta'))
  })

  it('resolves catalog and activation entrypoints', async () => {
    const workspace = await makeWorkspace()
    const catalog = await runContexta(['--root', workspace, 'catalog'], repoRoot)
    const activation = await runContexta(['--root', workspace, 'activation', 'runtime'], repoRoot)

    expect(catalog.exitCode).toBe(0)
    expect(catalog.stdout).toContain('catalogRoot:')
    expect(activation.exitCode).toBe(0)
    expect(activation.stdout).toContain('mode: runtime')
  })
})
