export interface ContextaRuntimePaths {
  readonly workspaceRoot: string
  readonly contextaRoot: string
  readonly catalogRoot: string
  readonly capabilityRoot: string
  readonly assetRoot: string
}

export interface CapabilityCatalog {
  readonly items: readonly string[]
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

export interface ContextaActivationPayload extends ContextaCapabilityPayload {
  readonly command: 'activation'
  readonly mode: string
}
