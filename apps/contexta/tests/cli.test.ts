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

async function writeDocwardenManifest(workspace: string, manifest: string): Promise<void> {
  await fs.writeFile(path.join(workspace, '.contexta/packs/docwarden/contexta.yaml'), manifest, 'utf8')
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
        readonly generatedAt: string
        readonly packs: readonly { readonly id: string }[]
        readonly assets: readonly { readonly id: string }[]
      }
    }
    expect(output.command).toBe('assets')
    expect(output.contextaRoot).toBe(path.join(workspace, '.contexta'))
    expect(output.catalog.packs).toContainEqual(expect.objectContaining({ id: 'docwarden' }))
    expect(output.catalog.packs).toContainEqual(expect.objectContaining({ id: 'isomorph-authoring' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'skill:dw/review-doc' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'skill:dw/pick' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'skill:iso/skill-creator' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'prompt:dw/review-guidance' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'agent:dw/doc-assistant' }))
    expect(output.catalog.assets).toContainEqual(expect.objectContaining({ id: 'hook:dw/bootstrap' }))
    expect(output.catalog.generatedAt).toBe('1970-01-01T00:00:00.000Z')

    const generatedAssets = JSON.parse(
      await fs.readFile(path.join(workspace, '.contexta/catalog/generated-assets.json'), 'utf8'),
    ) as { readonly generatedAt: string, readonly assets: readonly { readonly id: string, readonly sourcePath: string }[] }
    const generatedPacks = JSON.parse(
      await fs.readFile(path.join(workspace, '.contexta/catalog/generated-packs.json'), 'utf8'),
    ) as { readonly generatedAt: string, readonly packs: readonly { readonly id: string, readonly manifestPath: string }[] }
    expect(generatedAssets.generatedAt).toBe('1970-01-01T00:00:00.000Z')
    expect(generatedPacks.generatedAt).toBe('1970-01-01T00:00:00.000Z')
    expect(generatedAssets.assets).toHaveLength(10)
    expect(generatedPacks.packs).toHaveLength(2)
    expect(generatedAssets.assets).toContainEqual(expect.objectContaining({
      id: 'skill:dw/review-doc',
      sourcePath: '.contexta/packs/docwarden/skills/review-doc.md',
    }))
    expect(generatedAssets.assets).toContainEqual(expect.objectContaining({
      id: 'skill:iso/lead-review',
      sourcePath: '.contexta/packs/isomorph-authoring/skills/lead-review',
    }))
    expect(generatedPacks.packs).toContainEqual(expect.objectContaining({
      id: 'docwarden',
      manifestPath: '.contexta/packs/docwarden/contexta.yaml',
    }))
  })

  it('exports selected skill to repo-skill runtime root', async () => {
    const workspace = await makeWorkspaceWithContexta()
    const targetRoot = path.join(workspace, 'runtime-root')
    const result = await runContexta([
      '--root',
      workspace,
      'export',
      'codex',
      'skill:dw/review-doc',
      '--target-dir',
      targetRoot,
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
    expect(output.targetRoot).toBe(targetRoot)
    expect(output.items).toStrictEqual([
      expect.objectContaining({
        kind: 'skill',
        assetId: 'skill:dw/review-doc',
        destinationPaths: [path.join(targetRoot, '.agents', 'skills', 'dw-review-doc', 'SKILL.md')],
      }),
    ])
    await expect(fs.readFile(path.join(targetRoot, '.agents', 'skills', 'dw-review-doc', 'SKILL.md'), 'utf8')).resolves.toContain('name: dw-review-doc')
    await expect(fs.access(path.join(targetRoot, '.agents', 'prompts', 'review-guidance.md'))).rejects.toThrow()
    await expect(fs.access(path.join(targetRoot, '.agents', 'agents', 'doc-assistant.toml'))).rejects.toThrow()
  })

  it('supports dry-run and keeps destination untouched', async () => {
    const workspace = await makeWorkspaceWithContexta()
    const targetRoot = path.join(workspace, 'runtime-root')
    const result = await runContexta([
      '--root',
      workspace,
      'export',
      'codex',
      'skill:dw/review-doc',
      '--target-dir',
      targetRoot,
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
    await expect(fs.access(path.join(targetRoot, '.agents', 'skills', 'dw-review-doc', 'SKILL.md'))).rejects.toThrow()
  })

  it('rejects non-repo-skill assets without writing runtime files', async () => {
    const workspace = await makeWorkspaceWithContexta()
    const targetRoot = path.join(workspace, 'runtime-root')
    const result = await runContexta([
      '--root',
      workspace,
      'export',
      'codex',
      'prompt:dw/review-guidance',
      '--target-dir',
      targetRoot,
      '--json',
    ], workspace)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('asset \'prompt:dw/review-guidance\' is not exportable to codex.repo-skill')
    await expect(fs.access(path.join(targetRoot, '.agents', 'prompts', 'review-guidance.md'))).rejects.toThrow()
  })

  it('rejects hook assets that are not Codex hooks.json payloads', async () => {
    const workspace = await makeWorkspaceWithContexta()
    const targetRoot = path.join(workspace, 'runtime-root')
    const result = await runContexta([
      '--root',
      workspace,
      'export',
      'codex',
      'hook:dw/bootstrap',
      '--target-dir',
      targetRoot,
      '--json',
    ], workspace)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('hook \'hook:dw/bootstrap\' must be a Codex hooks.json payload')
    await expect(fs.access(path.join(targetRoot, '.codex', 'hooks.json'))).rejects.toThrow()
  })

  it('rejects pack export with unsupported v1 assets before writing plugin files', async () => {
    const workspace = await makeWorkspaceWithContexta()
    const targetRoot = path.join(workspace, 'runtime-root')
    const result = await runContexta([
      '--root',
      workspace,
      'export',
      'codex',
      'docwarden',
      '--target-dir',
      targetRoot,
      '--json',
    ], workspace)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toMatch(/not supported in codex\.plugin v1/)
    await expect(fs.access(path.join(targetRoot, 'plugins', 'dw-docwarden'))).rejects.toThrow()
  })

  it('exports a supported pack as Codex plugin surfaces', async () => {
    const workspace = await makeWorkspaceWithContexta()
    await writeDocwardenManifest(workspace, `pack: docwarden
namespace: dw
description: Docwarden context assets distributed through contexta.
target: codex
assets:
  skill:
    - review-doc
  agent: []
  hook: []
  prompt:
    - review-guidance
  workflow:
    - review-workflow
  profile: []
  reference:
    - glossary
`)
    const targetRoot = path.join(workspace, 'runtime-root')
    const result = await runContexta([
      '--root',
      workspace,
      'export',
      'codex',
      'docwarden',
      '--target-dir',
      targetRoot,
      '--json',
    ], workspace)

    expect(result.exitCode).toBe(0)
    const output = JSON.parse(result.stdout) as {
      readonly targetRoot: string
      readonly items: readonly { readonly assetId: string, readonly destinationPaths: readonly string[] }[]
    }
    expect(output.targetRoot).toBe(targetRoot)
    expect(output.items).toContainEqual(expect.objectContaining({
      assetId: 'skill:dw/review-doc',
      destinationPaths: [path.join(targetRoot, 'plugins', 'dw-docwarden', 'skills', 'dw-review-doc', 'SKILL.md')],
    }))
    expect(output.items).toContainEqual(expect.objectContaining({
      assetId: 'plugin:dw-docwarden',
      destinationPaths: [
        path.join(targetRoot, 'plugins', 'dw-docwarden', '.codex-plugin', 'plugin.json'),
        path.join(targetRoot, '.agents', 'plugins', 'marketplace.json'),
      ],
    }))

    await expect(fs.readFile(path.join(targetRoot, 'plugins', 'dw-docwarden', 'skills', 'dw-review-doc', 'SKILL.md'), 'utf8')).resolves.toContain('name: dw-review-doc')
    await expect(fs.access(path.join(targetRoot, 'plugins', 'dw-docwarden', 'skills', 'dw-review-doc', 'references', 'contexta', 'prompts', 'review-guidance.md'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(targetRoot, 'plugins', 'dw-docwarden', 'skills', 'dw-review-doc', 'references', 'contexta', 'workflows', 'review-workflow.md'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(targetRoot, 'plugins', 'dw-docwarden', 'skills', 'dw-review-doc', 'references', 'contexta', 'references', 'glossary.md'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(targetRoot, 'plugins', 'dw-docwarden', 'references'))).rejects.toThrow()
    await expect(fs.access(path.join(targetRoot, '.codex', 'hooks.json'))).rejects.toThrow()

    const manifest = JSON.parse(await fs.readFile(path.join(targetRoot, 'plugins', 'dw-docwarden', '.codex-plugin', 'plugin.json'), 'utf8')) as {
      readonly name: string
      readonly version: string
      readonly description: string
      readonly skills: string
      readonly author: { readonly name: string }
      readonly interface: { readonly displayName: string, readonly capabilities: readonly string[] }
    }
    expect(manifest).toMatchObject({
      name: 'dw-docwarden',
      version: '0.1.0',
      description: 'Docwarden context assets distributed through contexta.',
      skills: './skills/',
      author: { name: 'contexta' },
    })
    expect(manifest.interface.displayName).toBe('Dw Docwarden')
    expect(manifest.interface.capabilities).toContain('Skills')

    const marketplace = JSON.parse(await fs.readFile(path.join(targetRoot, '.agents', 'plugins', 'marketplace.json'), 'utf8')) as {
      readonly name: string
      readonly plugins: readonly unknown[]
    }
    expect(marketplace.name).toBe('local-repo')
    expect(marketplace.plugins).toContainEqual({
      name: 'dw-docwarden',
      source: {
        source: 'local',
        path: './plugins/dw-docwarden',
      },
      policy: {
        installation: 'AVAILABLE',
        authentication: 'ON_INSTALL',
      },
      category: 'Productivity',
    })
  })
})
