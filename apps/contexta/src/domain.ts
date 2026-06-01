export interface ContextaRuntimePaths {
  readonly workspaceRoot: string
  readonly contextaRoot: string
  readonly catalogRoot: string
  readonly capabilityRoot: string
  readonly assetRoot: string
}

export type ContextaCapabilityNamespace = 'ctx' | 'dw' | 'iso' | 'ym'

export type ContextaCapabilityKind = 'codex-skill'

export type ContextaInstallTarget = 'codex-project' | 'codex-user'

export interface ContextaCapabilityDefinition {
  readonly id: string
  readonly namespace: ContextaCapabilityNamespace
  readonly name: string
  readonly kind: ContextaCapabilityKind
  readonly sourcePath: string
  readonly materializedName: string
}

export interface CapabilityCatalog {
  readonly items: readonly ContextaCapabilityDefinition[]
  readonly refreshedAt: string
}

export interface ContextaCapabilityPayload {
  readonly command: 'capability' | 'catalog' | 'install' | 'activation' | 'asset'
  readonly root: string
}

export interface ContextaInstallPayload extends ContextaCapabilityPayload {
  readonly command: 'install'
  readonly capability: string
}

export interface ContextaInstallOptions {
  readonly root: string
  readonly capability: string
  readonly target: ContextaInstallTarget
  readonly targetDir: string
  readonly force: boolean
  readonly dryRun: boolean
}

export interface ContextaInstallResult {
  readonly command: 'install'
  readonly capability: string
  readonly kind: ContextaCapabilityKind
  readonly sourcePath: string
  readonly targetPath: string
  readonly materializedName: string
  readonly installed: boolean
  readonly dryRun: boolean
  readonly overwritten: boolean
}

export interface ContextaActivationPayload extends ContextaCapabilityPayload {
  readonly command: 'activation'
  readonly mode: string
}
