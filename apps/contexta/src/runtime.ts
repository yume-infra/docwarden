import type { ContextaActivationPayload, ContextaCapabilityPayload, ContextaInstallPayload, ContextaRuntimePaths } from './domain.js'
import { resolve } from 'node:path'
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

export type {
  ContextaActivationPayload,
  ContextaCapabilityPayload,
  ContextaInstallPayload,
  ContextaRuntimePaths,
} from './domain.js'
