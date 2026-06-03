export type ContextaNamespace = 'ctx' | 'dw' | 'iso' | 'ym'

export type ContextaAssetKind = 'skill' | 'prompt' | 'agent' | 'hook' | 'workflow' | 'profile' | 'reference'

export interface ContextaRuntimePaths {
  readonly workspaceRoot: string
  readonly contextaRoot: string
  readonly packsRoot: string
  readonly catalogRoot: string
  readonly generatedPacksPath: string
  readonly generatedAssetsPath: string
  readonly targetsRoot: string
  readonly codexTargetConfigPath: string
}

export interface ContextaPackManifest {
  readonly pack: string
  readonly namespace: ContextaNamespace
  readonly description?: string
  readonly targets?: readonly string[]
  readonly assets?: Partial<Record<ContextaAssetKind, readonly string[]>>
}

export interface ContextaPackSummary {
  readonly id: string
  readonly namespace: ContextaNamespace
  readonly manifestPath: string
  readonly packPath: string
  readonly description?: string
  readonly targets?: readonly string[]
}

export interface ContextaAsset {
  readonly id: string
  readonly kind: ContextaAssetKind
  readonly packId: string
  readonly namespace: ContextaNamespace
  readonly name: string
  readonly sourcePath: string
}

export interface ContextaCatalog {
  readonly packs: readonly ContextaPackSummary[]
  readonly assets: readonly ContextaAsset[]
  readonly generatedAt: string
  readonly version: string
}

export type ContextaExportSelector = { readonly kind: 'pack', readonly value: string } | { readonly kind: 'asset', readonly value: string }

export interface ContextaCodexTargetConfig {
  readonly root: string
}

export interface ContextaExportCodexOptions {
  readonly workspaceRoot: string
  readonly selectors: readonly string[]
  readonly all: boolean
  readonly dryRun: boolean
  readonly force: boolean
  readonly targetDir: string
}

export interface ContextaAssetExportResult {
  readonly assetId: string
  readonly kind: ContextaAssetKind
  readonly destinationPaths: readonly string[]
  readonly skipped: boolean
}

export interface ContextaExportCodexResult {
  readonly command: 'export'
  readonly target: 'codex'
  readonly targetRoot: string
  readonly items: readonly ContextaAssetExportResult[]
  readonly dryRun: boolean
}

export interface ContextaListAssetsResult {
  readonly command: 'assets'
  readonly workspaceRoot: string
  readonly contextaRoot: string
  readonly catalog: ContextaCatalog
}

export class ContextaError extends Error {
  readonly _tag = 'ContextaError' as const

  constructor(message: string) {
    super(message)
    this.name = 'ContextaError'
  }
}

export type ContextaAssetSelector = string
