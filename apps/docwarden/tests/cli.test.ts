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
        '.docwarden/task/index.md',
        '.docwarden/review',
        '.docwarden/review/index.md',
        '.docwarden/spec',
        '.docwarden/spec/index.md',
        '.docwarden/guide',
        '.docwarden/guide/index.md',
        '.docwarden/wiki',
        '.docwarden/wiki/index.md',
        '.docwarden/archive',
        '.docwarden/config.yaml',
      ]),
    })

    await expect(fs.access(path.join(workspace, '.docwarden', 'config.yaml'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.docwarden', 'task'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.docwarden', 'review'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.docwarden', 'spec'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.docwarden', 'guide'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.docwarden', 'wiki'))).resolves.toBeUndefined()
    await expect(fs.access(path.join(workspace, '.docwarden', 'archive'))).resolves.toBeUndefined()

    const config = await fs.readFile(path.join(workspace, '.docwarden', 'config.yaml'), 'utf8')
    expect(config).toBe(expectedRuntimeConfig)
    expect(config).not.toContain('kind: workflow')
    expect(config).not.toContain('mapping: docwarden')
    expect(config).not.toContain('structure: workflow')
  })

  it('initializes complete skeleton indexes', async () => {
    const workspace = await makeWorkspace()
    const result = await runDocwarden(['--root', workspace, 'init'], repoRoot)
    expect(result.exitCode).toBe(0)

    const reviewIndex = await fs.readFile(path.join(workspace, '.docwarden', 'review', 'index.md'), 'utf8')
    const specIndex = await fs.readFile(path.join(workspace, '.docwarden', 'spec', 'index.md'), 'utf8')
    const guideIndex = await fs.readFile(path.join(workspace, '.docwarden', 'guide', 'index.md'), 'utf8')
    const wikiIndex = await fs.readFile(path.join(workspace, '.docwarden', 'wiki', 'index.md'), 'utf8')

    expect(reviewIndex).toContain('review surface')
    expect(specIndex).toContain('promote --to spec')
    expect(guideIndex).toContain('promote --to guide')
    expect(wikiIndex).toContain('promote --to wiki')
  })

  it('creates task materials with context objective boundary', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)

    const create = await runDocwarden([
      '--root',
      workspace,
      'task',
      'create',
      '--id',
      '25-docwarden-v0-dogfood-workflow',
      '--title',
      'docwarden v0 workflow',
      '--json',
    ], repoRoot)

    expect(create.exitCode).toBe(0)
    const output = JSON.parse(create.stdout)

    expect(output.command).toBe('task-create')
    expect(output.taskId).toBe('25-docwarden-v0-dogfood-workflow')
    expect(output.taskDirectory).toBe(path.join(workspace, '.docwarden', 'task', '25-docwarden-v0-dogfood-workflow'))
    expect(output.nextEntry).toBe(path.join(workspace, '.docwarden', 'task', '25-docwarden-v0-dogfood-workflow', 'plan.md'))

    const taskIndex = await fs.readFile(path.join(output.taskDirectory, 'index.md'), 'utf8')
    const taskPlan = await fs.readFile(path.join(output.taskDirectory, 'plan.md'), 'utf8')
    const taskLog = await fs.readFile(path.join(output.taskDirectory, 'log.md'), 'utf8')

    expect(taskIndex).toContain('## Context')
    expect(taskIndex).toContain('## Objective')
    expect(taskIndex).toContain('## Boundary')
    expect(taskIndex).toContain('## Next Entry')
    expect(taskPlan).toContain('## Objective')
    expect(taskLog).toContain('task created:')
    expect(output.nextEntry).toMatch(/plan\.md$/)
  })

  it('runs task-driven review and writes task-sourced artifacts', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)
    await runDocwarden([
      '--root',
      workspace,
      'task',
      'create',
      '--id',
      '25-docwarden-v0-dogfood-workflow',
      '--title',
      'docwarden v0 workflow',
    ], repoRoot)

    const reviewResult = await runDocwarden([
      '--root',
      workspace,
      'review',
      '--task',
      '25-docwarden-v0-dogfood-workflow',
      '--json',
    ], repoRoot)

    expect(reviewResult.exitCode).toBe(0)
    const output = JSON.parse(reviewResult.stdout)

    expect(output.command).toBe('review')
    expect(output.reviewMode).toBe('task')
    expect(output.taskId).toBe('25-docwarden-v0-dogfood-workflow')
    expect(output.filesWritten).toEqual(
      expect.arrayContaining(['index.md', 'lead.md', 'backing.md', 'state.yaml']),
    )

    const state = await fs.readFile(output.statePath, 'utf8')
    expect(state).toContain('mode: task')
    expect(state).toContain('task_id: 25-docwarden-v0-dogfood-workflow')
    expect(state).toContain('status: review-surface-ready')

    const lead = await fs.readFile(path.join(output.reviewDirectory, 'lead.md'), 'utf8')
    const backing = await fs.readFile(path.join(output.reviewDirectory, 'backing.md'), 'utf8')
    const taskLog = await fs.readFile(path.join(workspace, '.docwarden', 'task', '25-docwarden-v0-dogfood-workflow', 'log.md'), 'utf8')

    expect(lead).toContain('本轮需要判断')
    expect(backing).toContain('Source files')
    expect(taskLog).toContain('review generated from task')
    expect(output.reviewMode).toBe('task')
  })

  it('promote and pick create tracked outputs and append task log', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)
    await runDocwarden([
      '--root',
      workspace,
      'task',
      'create',
      '--id',
      '25-docwarden-v0-dogfood-workflow',
      '--title',
      'docwarden v0 workflow',
    ], repoRoot)
    await runDocwarden([
      '--root',
      workspace,
      'review',
      '--task',
      '25-docwarden-v0-dogfood-workflow',
    ], repoRoot)

    const promote = await runDocwarden([
      '--root',
      workspace,
      'promote',
      '--task',
      '25-docwarden-v0-dogfood-workflow',
      '--to',
      'spec',
      '--json',
    ], repoRoot)

    expect(promote.exitCode).toBe(0)
    const promoteOutput = JSON.parse(promote.stdout)
    expect(promoteOutput.command).toBe('promote')
    expect(promoteOutput.targetLayer).toBe('spec')
    await expect(fs.access(promoteOutput.artifactPath)).resolves.toBeUndefined()

    const promoteArtifact = await fs.readFile(promoteOutput.artifactPath, 'utf8')
    expect(promoteArtifact).toContain('# Promote to spec')
    expect(promoteArtifact).toContain('## Trace')

    const pick = await runDocwarden([
      '--root',
      workspace,
      'pick',
      '--task',
      '25-docwarden-v0-dogfood-workflow',
      '--to',
      'wiki',
      '--json',
    ], repoRoot)

    expect(pick.exitCode).toBe(0)
    const pickOutput = JSON.parse(pick.stdout)
    expect(pickOutput.command).toBe('pick')
    await expect(fs.access(pickOutput.artifactPath)).resolves.toBeUndefined()

    const pickArtifact = await fs.readFile(pickOutput.artifactPath, 'utf8')
    expect(pickArtifact).toContain('# Pick to wiki')

    const taskLog = await fs.readFile(path.join(workspace, '.docwarden', 'task', '25-docwarden-v0-dogfood-workflow', 'log.md'), 'utf8')
    expect(taskLog).toContain('promote to spec')
    expect(taskLog).toContain('pick to wiki')
    expect(taskLog).toContain('review generated from task')
  })

  it('requires --task for promote', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)

    const result = await runDocwarden([
      '--root',
      workspace,
      'promote',
      '--to',
      'spec',
    ], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('docwarden config error')
    expect(result.stderr).toContain('missing required --task')
  })

  it('keeps pick constrained to wiki', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)
    await runDocwarden([
      '--root',
      workspace,
      'task',
      'create',
      '--id',
      '25-docwarden-v0-dogfood-workflow',
      '--title',
      'docwarden v0 workflow',
    ], repoRoot)

    const result = await runDocwarden([
      '--root',
      workspace,
      'pick',
      '--task',
      '25-docwarden-v0-dogfood-workflow',
      '--to',
      'spec',
    ], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('docwarden config error')
    expect(result.stderr).toContain('pick only supports --to wiki')
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

  it('generates a minimal review surface', async () => {
    const workspace = await makeWorkspace()
    const initResult = await runDocwarden(['--root', workspace, 'init'], repoRoot)
    expect(initResult.exitCode).toBe(0)

    const target = path.join(workspace, 'target.txt')
    await fs.writeFile(target, 'line one\nline two\nline three\n')

    const result = await runDocwarden(['--root', workspace, 'review', '--target', 'target.txt', '--json'], repoRoot)
    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')

    const output = JSON.parse(result.stdout)
    expect(output).toMatchObject({
      command: 'review',
      workspaceRoot: workspace,
      docwardenRoot: path.join(workspace, '.docwarden'),
      targetPath: target,
      filesWritten: [
        'index.md',
        'lead.md',
        'backing.md',
        'state.yaml',
      ],
    })

    expect(output.reviewDirectory).toContain(path.join(workspace, '.docwarden', 'review'))
    expect(output.statePath).toBe(path.join(output.reviewDirectory, 'state.yaml'))

    for (const file of output.filesWritten) {
      await expect(fs.access(path.join(output.reviewDirectory, file))).resolves.toBeUndefined()
    }

    const state = await fs.readFile(output.statePath, 'utf8')
    expect(state).toContain('status: review-surface-ready')
    expect(state).toContain(`target: ${target}`)
    expect(state).toContain('review_dir:')
    expect(state).toContain(`config_path: ${output.configPath}`)

    const reviewIndex = await fs.readFile(path.join(output.reviewDirectory, 'index.md'), 'utf8')
    const reviewLead = await fs.readFile(path.join(output.reviewDirectory, 'lead.md'), 'utf8')
    const reviewBacking = await fs.readFile(path.join(output.reviewDirectory, 'backing.md'), 'utf8')

    expect(reviewIndex).toContain('Review Surface')
    expect(reviewLead).toContain('Review Lead')
    expect(reviewBacking).toContain('Target type: file')

    expect(path.dirname(output.reviewDirectory)).toBe(path.join(workspace, '.docwarden', 'review'))
  })

  it('prints useful plain output for review', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)
    const target = path.join(workspace, 'target.txt')
    await fs.writeFile(target, 'line one\nline two\nline three\n')

    const result = await runDocwarden(['--root', workspace, 'review', '--target', 'target.txt'], repoRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('review directory:')
    expect(result.stdout).toContain(path.join(workspace, '.docwarden', 'review'))
    expect(result.stdout).toContain('files:')
    expect(result.stdout).toContain('index.md')
    expect(result.stdout).toContain('lead.md')
    expect(result.stdout).toContain('backing.md')
    expect(result.stdout).toContain('state.yaml')
  })

  it('supports absolute review target paths', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)

    const target = path.join(workspace, 'absolute-target.txt')
    await fs.writeFile(target, 'sample')

    const result = await runDocwarden(['--root', workspace, 'review', '--target', target, '--json'], repoRoot)
    expect(result.exitCode).toBe(0)

    const output = JSON.parse(result.stdout)
    expect(output.targetPath).toBe(target)
    expect(output.reviewDirectory).toContain(path.join(workspace, '.docwarden', 'review'))
  })

  it('requires initialization before review', async () => {
    const workspace = await makeWorkspace()
    const target = path.join(workspace, 'target.txt')
    await fs.writeFile(target, 'data')

    const result = await runDocwarden(['--root', workspace, 'review', '--target', target], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('docwarden config error')
    expect(result.stderr).toContain('run docwarden init first')
  })

  it('requires a non-empty runtime config before review', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)
    const target = path.join(workspace, 'target.txt')
    await fs.writeFile(target, 'data')
    await fs.writeFile(path.join(workspace, '.docwarden', 'config.yaml'), '')

    const result = await runDocwarden(['--root', workspace, 'review', '--target', target], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('docwarden config error')
    expect(result.stderr).toContain('docwarden config is empty')
  })

  it('requires a valid target path for review', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)

    const missingTarget = path.join(workspace, 'does-not-exist.txt')
    const result = await runDocwarden(['--root', workspace, 'review', '--target', missingTarget], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('docwarden config error')
    expect(result.stderr).toContain('review target does not exist or is inaccessible')
  })

  it('requires --target argument for review', async () => {
    const workspace = await makeWorkspace()
    await runDocwarden(['--root', workspace, 'init'], repoRoot)

    const result = await runDocwarden(['--root', workspace, 'review'], repoRoot)

    expect(result.exitCode).toBe(2)
    expect(result.stderr).toContain('docwarden config error')
    expect(result.stderr).toContain('missing required --task or --target')
  })

  it('shows review in CLI help', async () => {
    const workspace = await makeWorkspace()
    const result = await runDocwarden(['--root', workspace, '--help'], repoRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('review')
  })

  it('shows review flags in review help', async () => {
    const workspace = await makeWorkspace()
    const result = await runDocwarden(['--root', workspace, 'review', '--help'], repoRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('--target')
    expect(result.stdout).toContain('--task')
    expect(result.stdout).toContain('--json')
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
