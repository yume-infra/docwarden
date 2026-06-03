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
const contextaBin = path.join(packageRoot, 'dist/index.js')
const sourceContextaRoot = path.join(repoRoot, '.contexta')

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

async function makeWorkspaceWithContexta(): Promise<string> {
  const workspace = await makeWorkspace()
  await fs.cp(sourceContextaRoot, path.join(workspace, '.contexta'), {
    recursive: true,
  })
  return workspace
}

describe('contexta CLI contract', () => {
  it('reports new command surface and removes old contracts', async () => {
    const result = await runContexta(['--help'], repoRoot)
    const exportHelp = await runContexta(['export', '--help'], repoRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('contexta')
    expect(result.stdout).toContain(' assets ')
    expect(result.stdout).toContain(' export ')
    expect(exportHelp.exitCode).toBe(0)
    expect(exportHelp.stdout).toContain('codex')
    expect(result.stdout).not.toContain(' capability ')
    expect(result.stdout).not.toContain(' catalog ')
    expect(result.stdout).not.toContain(' install ')
    expect(result.stdout).not.toContain(' activation ')
    expect(result.stdout).not.toContain(' asset ')
  })

  it('lists discovered assets and writes generated catalogs', async () => {
    const workspace = await makeWorkspaceWithContexta()
    const result = await runContexta(['--root', workspace, 'assets', '--json'], workspace)

    expect(result.exitCode).toBe(0)
    const output = JSON.parse(result.stdout) as {
      readonly command: string
      readonly contextaRoot: string
      readonly catalog: {
        readonly packs: readonly { readonly id: string }[]
        readonly assets: readonly { readonly id: string }[]
      }
    }
    expect(output.command).toBe('assets')
    expect(output.contextaRoot).toBe(path.join(workspace, '.contexta'))
    expect(output.catalog.packs).toContainEqual(expect.objectContaining({ id: 'docwarden' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'skill:dw/review-doc' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'prompt:dw/review-guidance' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'agent:dw/doc-assistant' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'hook:dw/bootstrap' }))

    const generatedAssets = JSON.parse(
      await fs.readFile(path.join(workspace, '.contexta/catalog/generated-assets.json'), 'utf8'),
    ) as { readonly assets: readonly unknown[] }
    const generatedPacks = JSON.parse(
      await fs.readFile(path.join(workspace, '.contexta/catalog/generated-packs.json'), 'utf8'),
    ) as { readonly packs: readonly unknown[] }
    expect(generatedAssets.assets).toHaveLength(7)
    expect(generatedPacks.packs).toHaveLength(1)
  })

  it('exports a full pack to explicit target dir', async () => {
    const workspace = await makeWorkspaceWithContexta()
    const target = path.join(workspace, 'codex-target')
    const result = await runContexta([
      '--root',
      workspace,
      'export',
      'codex',
      'docwarden',
      '--target-dir',
      target,
      '--json',
    ], workspace)

    expect(result.exitCode).toBe(0)
    const output = JSON.parse(result.stdout) as {
      readonly command: 'export'
      readonly target: 'codex'
      readonly targetRoot: string
      readonly items: readonly { readonly kind: string, readonly assetId: string, readonly destinationPaths: readonly string[] }[]
    }

    expect(output.command).toBe('export')
    expect(output.target).toBe('codex')
    expect(output.targetRoot).toBe(target)
    expect(output.items).toContainEqual(expect.objectContaining({
      kind: 'skill',
      assetId: 'skill:dw/review-doc',
      destinationPaths: [path.join(target, 'skills', 'review-doc', 'SKILL.md')],
    }))
    expect(output.items).toContainEqual(expect.objectContaining({
      kind: 'prompt',
      assetId: 'prompt:dw/review-guidance',
      destinationPaths: [path.join(target, 'prompts', 'review-guidance.md')],
    }))
    expect(output.items).toContainEqual(expect.objectContaining({
      kind: 'agent',
      assetId: 'agent:dw/doc-assistant',
      destinationPaths: [path.join(target, 'agents', 'doc-assistant.toml')],
    }))
    expect(output.items).toContainEqual(expect.objectContaining({
      kind: 'hook',
      assetId: 'hooks',
      destinationPaths: [path.join(target, 'hooks.json')],
    }))

    await expect(fs.readFile(path.join(target, 'skills', 'review-doc', 'SKILL.md'), 'utf8')).resolves.toContain('name: review-doc')
    await expect(fs.readFile(path.join(target, 'agents', 'doc-assistant.toml'), 'utf8')).resolves.toContain('[agent]')
    await expect(fs.access(path.join(target, 'hooks.json'))).resolves.toBeUndefined()
  })

  it('supports dry-run and keeps destination untouched', async () => {
    const workspace = await makeWorkspaceWithContexta()
    const target = path.join(workspace, 'codex-target')
    const result = await runContexta([
      '--root',
      workspace,
      'export',
      'codex',
      'skill:dw/review-doc',
      '--target-dir',
      target,
      '--dry-run',
      '--json',
    ], workspace)

    expect(result.exitCode).toBe(0)
    const output = JSON.parse(result.stdout) as {
      readonly dryRun: boolean
      readonly items: readonly { readonly skipped: boolean, readonly assetId: string }[]
    }
    expect(output.dryRun).toBe(true)
    expect(output.items).toContainEqual(expect.objectContaining({
      skipped: true,
      assetId: 'skill:dw/review-doc',
    }))
    await expect(fs.access(path.join(target, 'skills', 'review-doc', 'SKILL.md'))).rejects.toThrow()
  })

  it('supports export --all for full pack space', async () => {
    const workspace = await makeWorkspaceWithContexta()
    const target = path.join(workspace, 'codex-target')
    const result = await runContexta([
      '--root',
      workspace,
      'export',
      'codex',
      '--all',
      '--target-dir',
      target,
      '--json',
    ], workspace)

    expect(result.exitCode).toBe(0)
    const output = JSON.parse(result.stdout) as {
      readonly targetRoot: string
      readonly items: readonly { readonly kind: string, readonly assetId: string }[]
    }
    expect(output.targetRoot).toBe(target)
    expect(output.items).toContainEqual(expect.objectContaining({
      kind: 'workflow',
      assetId: 'workflow:dw/review-workflow',
    }))
    expect(output.items).toContainEqual(expect.objectContaining({
      kind: 'profile',
      assetId: 'profile:dw/default',
    }))
    expect(output.items).toContainEqual(expect.objectContaining({
      kind: 'reference',
      assetId: 'reference:dw/glossary',
    }))
  })
})
