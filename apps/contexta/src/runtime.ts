import type {
  CapabilityCatalog,
  ContextaActivationPayload,
  ContextaCapabilityDefinition,
  ContextaCapabilityNamespace,
  ContextaCapabilityPayload,
  ContextaInstallOptions,
  ContextaInstallPayload,
  ContextaInstallResult,
  ContextaInstallTarget,
  ContextaRuntimePaths,
} from './domain.js'
import { constants, promises as fs } from 'node:fs'
import os from 'node:os'
import path, { resolve } from 'node:path'
import process from 'node:process'

export const contextaInfraPackage = 'contexta'

export function resolveContextaPaths(workspaceRoot: string | undefined = undefined): ContextaRuntimePaths {
  const workspace = resolve(workspaceRoot ?? process.cwd())
  return {
    workspaceRoot: workspace,
    contextaRoot: resolve(workspace, '.contexta'),
    catalogRoot: resolve(workspace, '.contexta', 'catalog'),
    capabilityRoot: resolve(workspace, '.contexta', 'capabilities'),
    assetRoot: resolve(workspace, '.contexta', 'assets'),
  }
}

const capabilityRegistry = [
  {
    id: 'ym:write-skill',
    namespace: 'ym',
    name: 'write-skill',
    kind: 'codex-skill',
    sourcePath: 'skills/primitive/write-skill',
    materializedName: 'write-skill',
  },
] as const satisfies readonly ContextaCapabilityDefinition[]

export function listCapabilityDefinitions(root: string): CapabilityCatalog {
  const paths = resolveContextaPaths(root)
  return {
    items: capabilityRegistry.map(item => ({
      ...item,
      sourcePath: resolve(paths.workspaceRoot, item.sourcePath),
    })),
    refreshedAt: new Date(0).toISOString(),
  }
}

export function getCapabilityDefinition(root: string, capability: string): ContextaCapabilityDefinition {
  const canonicalId = capability.trim()
  const parsed = parseCapabilityId(canonicalId)
  const item = capabilityRegistry.find(entry => entry.id === canonicalId)
  if (item === undefined) {
    const known = capabilityRegistry.map(entry => entry.id).join(', ')
    throw new Error(`unknown capability '${capability}'. Known capabilities: ${known}`)
  }
  const paths = resolveContextaPaths(root)
  return {
    ...item,
    namespace: parsed.namespace,
    sourcePath: resolve(paths.workspaceRoot, item.sourcePath),
  }
}

export async function installCapability(options: ContextaInstallOptions): Promise<ContextaInstallResult> {
  const paths = resolveContextaPaths(options.root)
  const definition = getCapabilityDefinition(paths.workspaceRoot, options.capability)
  const targetRoot = resolveInstallTargetRoot(paths.workspaceRoot, options.target, options.targetDir)
  const targetPath = resolve(targetRoot, definition.materializedName)

  await assertDirectory(definition.sourcePath, `capability source not found: ${definition.sourcePath}`)

  const existing = await pathExists(targetPath)
  if (existing && !options.force) {
    throw new Error(`install target already exists: ${targetPath}. Use --force to replace it.`)
  }

  if (!options.dryRun) {
    await fs.mkdir(targetRoot, { recursive: true })
    if (existing) {
      await fs.rm(targetPath, { recursive: true, force: true })
    }
    await fs.cp(definition.sourcePath, targetPath, {
      recursive: true,
      errorOnExist: true,
      force: false,
    })
  }

  return {
    command: 'install',
    capability: definition.id,
    kind: definition.kind,
    sourcePath: definition.sourcePath,
    targetPath,
    materializedName: definition.materializedName,
    installed: !options.dryRun,
    dryRun: options.dryRun,
    overwritten: existing && options.force && !options.dryRun,
  }
}

export function capabilityResult(payload: ContextaCapabilityPayload): string {
  const paths = resolveContextaPaths(payload.root)
  return JSON.stringify({
    command: payload.command,
    contextaRoot: paths.contextaRoot,
    catalogRoot: paths.catalogRoot,
    capabilityRoot: paths.capabilityRoot,
    assetRoot: paths.assetRoot,
  }, null, 2)
}

export function installCapabilityResult(payload: ContextaInstallPayload): string {
  const paths = resolveContextaPaths(payload.root)
  return JSON.stringify({
    command: payload.command,
    capability: payload.capability,
    contextaRoot: paths.contextaRoot,
    installPath: paths.contextaRoot,
  }, null, 2)
}

export function activationResult(payload: ContextaActivationPayload): string {
  const paths = resolveContextaPaths(payload.root)
  return JSON.stringify({
    command: payload.command,
    mode: payload.mode,
    activationPath: paths.contextaRoot,
    contextaRoot: paths.contextaRoot,
  }, null, 2)
}

function parseCapabilityId(capability: string): { namespace: ContextaCapabilityNamespace, name: string } {
  const match = /^(ctx|dw|iso|ym):([a-z0-9-]+)$/.exec(capability)
  if (match === null) {
    throw new Error(`invalid capability id '${capability}'. Expected namespace:name with ctx, dw, iso, or ym.`)
  }
  const namespace = match[1]
  const name = match[2]
  if (namespace === undefined || name === undefined) {
    throw new Error(`invalid capability id '${capability}'. Expected namespace:name with ctx, dw, iso, or ym.`)
  }
  return {
    namespace: namespace as ContextaCapabilityNamespace,
    name,
  }
}

function resolveInstallTargetRoot(workspaceRoot: string, target: ContextaInstallTarget, targetDir: string): string {
  const explicitTargetDir = targetDir.trim()
  if (explicitTargetDir.length > 0) {
    return path.isAbsolute(explicitTargetDir) ? explicitTargetDir : resolve(workspaceRoot, explicitTargetDir)
  }
  if (target === 'codex-user') {
    return resolve(process.env.CODEX_HOME ?? path.join(os.homedir(), '.codex'), 'skills')
  }
  return resolve(workspaceRoot, '.codex', 'skills')
}

async function assertDirectory(directory: string, message: string): Promise<void> {
  const stat = await fs.stat(directory).catch(() => undefined)
  if (stat === undefined || !stat.isDirectory()) {
    throw new Error(message)
  }
}

async function pathExists(targetPath: string): Promise<boolean> {
  return fs.access(targetPath, constants.F_OK).then(
    () => true,
    () => false,
  )
}

export type {
  ContextaActivationPayload,
  ContextaCapabilityDefinition,
  ContextaCapabilityPayload,
  ContextaInstallOptions,
  ContextaInstallPayload,
  ContextaInstallResult,
  ContextaInstallTarget,
  ContextaRuntimePaths,
} from './domain.js'
