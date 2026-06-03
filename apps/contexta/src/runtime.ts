import type {
  ContextaAsset,
  ContextaAssetExportResult,
  ContextaAssetKind,
  ContextaCatalog,
  ContextaCodexTargetConfig,
  ContextaExportCodexOptions,
  ContextaExportCodexResult,
  ContextaPackManifest,
  ContextaPackSummary,
  ContextaRuntimePaths,
} from './domain.js'
import { constants, promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parse } from 'yaml'
import { ContextaError } from './domain.js'

import {
  exportAssetToCodex,
  writeCodexHooks,
} from './exporters/codex/index.js'

export const contextaInfraPackage = 'contexta'

const catalogVersion = '0.1.0'

const allAssetKinds = [
  'skill',
  'prompt',
  'agent',
  'hook',
  'workflow',
  'profile',
  'reference',
] as const satisfies readonly ContextaAssetKind[]

const assetDirectoryByKind: Record<ContextaAssetKind, string> = {
  skill: 'skills',
  prompt: 'prompts',
  agent: 'agents',
  hook: 'hooks',
  workflow: 'workflows',
  profile: 'profiles',
  reference: 'references',
}

interface ResolvedPack {
  readonly pack: string
  readonly namespace: ContextaPackManifest['namespace']
  readonly description?: string
  readonly targets?: readonly string[]
  readonly assets?: ContextaPackManifest['assets']
  readonly packId: string
  readonly manifestPath: string
  readonly packPath: string
}

export function resolveContextaPaths(workspaceRoot: string | undefined = undefined): ContextaRuntimePaths {
  const workspace = path.resolve(workspaceRoot ?? process.cwd())
  const contextaRoot = path.resolve(workspace, '.contexta')
  return {
    workspaceRoot: workspace,
    contextaRoot,
    packsRoot: path.resolve(contextaRoot, 'packs'),
    catalogRoot: path.resolve(contextaRoot, 'catalog'),
    generatedPacksPath: path.resolve(contextaRoot, 'catalog', 'generated-packs.json'),
    generatedAssetsPath: path.resolve(contextaRoot, 'catalog', 'generated-assets.json'),
    targetsRoot: path.resolve(contextaRoot, 'targets'),
    codexTargetConfigPath: path.resolve(contextaRoot, 'targets', 'codex.yaml'),
  }
}

export async function listAssets(workspaceRoot: string): Promise<ContextaCatalog> {
  const paths = resolveContextaPaths(workspaceRoot)
  const catalog = await buildCatalog(paths)
  await writeCatalog(paths, catalog)
  return catalog
}

export async function listPacks(workspaceRoot: string): Promise<readonly ContextaPackSummary[]> {
  const catalog = await buildCatalog(resolveContextaPaths(workspaceRoot))
  return catalog.packs
}

export async function exportCodexAssets(options: ContextaExportCodexOptions): Promise<ContextaExportCodexResult> {
  const paths = resolveContextaPaths(options.workspaceRoot)
  const catalog = await buildCatalog(paths)
  const selected = pickExportSelection(catalog.assets, options.selectors, options.all)
  const targetConfig = await readCodexTargetConfig(paths)
  const targetRoot = resolveTargetRoot(paths.workspaceRoot, targetConfig.root, options.targetDir)

  const hookPayload: Record<string, unknown> = {}
  const items: ContextaAssetExportResult[] = []

  for (const asset of selected) {
    if (asset.kind === 'hook') {
      const raw = await fs.readFile(asset.sourcePath, 'utf8')
      try {
        hookPayload[asset.id] = JSON.parse(raw)
      }
      catch {
        throw new ContextaError(`hook '${asset.id}' must be JSON`)
      }
      continue
    }

    const result = await exportAssetToCodex({
      asset,
      targetRoot,
      dryRun: options.dryRun,
      force: options.force,
    })
    items.push(result)
  }

  if (Object.keys(hookPayload).length > 0) {
    if (!options.dryRun) {
      await writeCodexHooks({
        targetRoot,
        payload: hookPayload,
        force: options.force,
      })
    }
    items.push({
      assetId: 'hooks',
      kind: 'hook',
      destinationPaths: [path.resolve(targetRoot, 'hooks.json')],
      skipped: options.dryRun,
    })
  }

  return {
    command: 'export',
    target: 'codex',
    targetRoot,
    items,
    dryRun: options.dryRun,
  }
}

async function buildCatalog(paths: ContextaRuntimePaths): Promise<ContextaCatalog> {
  const packs = await resolvePacks(paths)
  const assetGroups = await Promise.all(packs.map(pack => collectPackAssets(pack)))
  const assets = dedupeAssetsById(assetGroups.flat())

  return {
    version: catalogVersion,
    generatedAt: new Date().toISOString(),
    packs: packs.map((pack): ContextaPackSummary => ({
      id: pack.packId,
      namespace: pack.namespace,
      manifestPath: pack.manifestPath,
      packPath: pack.packPath,
      ...(pack.description !== undefined ? { description: pack.description } : {}),
      ...(pack.targets !== undefined ? { targets: pack.targets } : {}),
    })),
    assets,
  }
}

async function resolvePacks(paths: ContextaRuntimePaths): Promise<readonly ResolvedPack[]> {
  let entries: import('node:fs').Dirent[] = []
  try {
    entries = await fs.readdir(paths.packsRoot, { withFileTypes: true })
  }
  catch {
    return []
  }

  const packs: ResolvedPack[] = []
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }

    const packId = entry.name
    const packPath = path.resolve(paths.packsRoot, packId)
    const manifestPath = path.resolve(packPath, 'contexta.yaml')
    const raw = await fs.readFile(manifestPath, 'utf8').catch(() => {
      throw new ContextaError(`missing contexta manifest: ${manifestPath}`)
    })
    const parsed = parseYaml(manifestPath, raw)
    const manifest = parseContextaPackManifest(packId, parsed)

    const resolvedPack: ResolvedPack = {
      packId,
      pack: manifest.pack,
      namespace: manifest.namespace,
      manifestPath,
      packPath,
      ...(
        manifest.description !== undefined
          ? { description: manifest.description }
          : {}
      ),
      ...(manifest.targets !== undefined
        ? { targets: manifest.targets }
        : {}),
      ...(manifest.assets !== undefined
        ? { assets: manifest.assets }
        : {}),
    }
    packs.push(resolvedPack)
  }

  return packs
}

async function collectPackAssets(pack: ResolvedPack): Promise<readonly ContextaAsset[]> {
  const assets: ContextaAsset[] = []

  for (const kind of allAssetKinds) {
    const configured = pack.assets?.[kind]
    const names = configured === undefined
      ? await inferAssetNames(pack.packPath, kind)
      : validateAssetList(pack.packId, kind, configured)

    for (const name of names) {
      const sourcePath = await resolveAssetSourcePath(pack.packPath, kind, name)
      assets.push({
        id: `${kind}:${pack.namespace}/${name}`,
        kind,
        packId: pack.packId,
        namespace: pack.namespace,
        name,
        sourcePath,
      })
    }
  }

  return dedupeAssetsById(assets)
}

async function inferAssetNames(packPath: string, kind: ContextaAssetKind): Promise<readonly string[]> {
  const kindPath = path.resolve(packPath, assetDirectoryByKind[kind])
  const entries = await fs.readdir(kindPath, { withFileTypes: true }).catch(() => [])
  const names = entries
    .filter(item => !item.name.startsWith('.'))
    .map(item => path.basename(item.name, item.isFile() ? path.extname(item.name) : ''))
  return [...new Set(names)]
}

async function resolveAssetSourcePath(
  packPath: string,
  kind: ContextaAssetKind,
  name: string,
): Promise<string> {
  const candidates: string[] = [
    path.resolve(packPath, assetDirectoryByKind[kind], name),
    path.resolve(packPath, assetDirectoryByKind[kind], `${name}.md`),
    path.resolve(packPath, assetDirectoryByKind[kind], `${name}.toml`),
    path.resolve(packPath, assetDirectoryByKind[kind], `${name}.json`),
    path.resolve(packPath, assetDirectoryByKind[kind], `${name}.yaml`),
    path.resolve(packPath, assetDirectoryByKind[kind], `${name}.yml`),
    path.resolve(packPath, assetDirectoryByKind[kind], `${name}.txt`),
  ]

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate
    }
  }

  throw new ContextaError(`asset source for kind '${kind}' name '${name}' not found in pack`)
}

function pickExportSelection(
  assets: readonly ContextaAsset[],
  selectors: readonly string[],
  all: boolean,
): readonly ContextaAsset[] {
  if (all) {
    return assets
  }

  if (selectors.length === 0) {
    throw new ContextaError('missing selector. use --all or pass an <asset-or-pack-id>')
  }

  const selected = new Map<string, ContextaAsset>()
  for (const selector of selectors) {
    if (selector.includes(':')) {
      const direct = assets.find(asset => asset.id === selector)
      if (direct === undefined) {
        throw new ContextaError(`unknown asset '${selector}'`)
      }
      selected.set(direct.id, direct)
      continue
    }

    const byPack = assets.filter(asset => asset.packId === selector)
    if (byPack.length === 0) {
      throw new ContextaError(`unknown pack '${selector}'`)
    }
    for (const asset of byPack) {
      selected.set(asset.id, asset)
    }
  }

  const out = [...selected.values()]
  if (out.length === 0) {
    throw new ContextaError('selection resolved to zero assets')
  }
  return out
}

async function writeCatalog(paths: ContextaRuntimePaths, catalog: ContextaCatalog): Promise<void> {
  await fs.mkdir(paths.catalogRoot, { recursive: true })
  await fs.writeFile(
    paths.generatedPacksPath,
    `${JSON.stringify({
      version: catalog.version,
      generatedAt: catalog.generatedAt,
      packs: catalog.packs,
    }, null, 2)}\n`,
    'utf8',
  )
  await fs.writeFile(
    paths.generatedAssetsPath,
    `${JSON.stringify({
      version: catalog.version,
      generatedAt: catalog.generatedAt,
      assets: catalog.assets,
    }, null, 2)}\n`,
    'utf8',
  )
}

function parseContextaPackManifest(packId: string, raw: unknown): ContextaPackManifest {
  if (typeof raw !== 'object' || raw === null) {
    throw new ContextaError(`invalid contexta.yaml in pack '${packId}': not an object`)
  }

  const source = raw as Record<string, unknown>
  const pack = source.pack
  if (typeof pack !== 'string' || pack.trim().length === 0) {
    throw new ContextaError(`invalid contexta.yaml in pack '${packId}': missing pack`)
  }

  const namespace = source.namespace
  if (typeof namespace !== 'string' || namespace.trim().length === 0) {
    throw new ContextaError(`invalid contexta.yaml in pack '${packId}': missing namespace`)
  }
  if (!/^(?:ctx|dw|iso|ym)$/.test(namespace)) {
    throw new ContextaError(`invalid namespace '${namespace}' in pack '${packId}'; expected ctx, dw, iso, ym`)
  }

  const assets = source.assets
  if (assets !== undefined && (typeof assets !== 'object' || Array.isArray(assets))) {
    throw new ContextaError(`invalid contexta.yaml in pack '${packId}': assets must be an object`)
  }

  const description = typeof source.description === 'string' && source.description.trim().length > 0
    ? source.description.trim()
    : undefined
  const targets = validateTargets(packId, source.target, source.targets)

  const manifest = {
    pack,
    namespace: namespace as ContextaPackManifest['namespace'],
    ...(description !== undefined ? { description } : {}),
    ...(assets !== undefined ? { assets: assets as ContextaPackManifest['assets'] } : {}),
    ...(targets !== undefined ? { targets } : {}),
  }

  return manifest as ContextaPackManifest
}

function validateTargets(
  packId: string,
  primaryTarget: unknown,
  legacyTargets: unknown,
): readonly string[] | undefined {
  const raw = primaryTarget ?? legacyTargets
  if (raw === undefined) {
    return ['codex']
  }
  if (!Array.isArray(raw) || !raw.every(item => typeof item === 'string')) {
    if (typeof raw === 'string' && raw.trim().length > 0) {
      return [raw.trim()]
    }
    throw new ContextaError(`invalid target in pack '${packId}': expected 'target' or 'targets' as non-empty string/string[]`)
  }
  if (raw.length === 0) {
    throw new ContextaError(`invalid targets in pack '${packId}': empty array`)
  }
  const targets = raw
    .map(item => item.trim())
    .filter(item => item.length > 0)

  if (targets.length === 0) {
    throw new ContextaError(`invalid targets in pack '${packId}': empty array`)
  }
  return targets
}

function validateAssetList(packId: string, kind: string, names: unknown): readonly string[] {
  if (!Array.isArray(names) || names.some(name => typeof name !== 'string' || name.trim().length === 0)) {
    throw new ContextaError(`invalid ${kind} declaration in pack '${packId}': expected string[]`)
  }

  const deduped: string[] = []
  const seen = new Set<string>()
  for (const name of names) {
    const normalized = name.trim()
    if (!seen.has(normalized)) {
      seen.add(normalized)
      deduped.push(normalized)
    }
  }
  return deduped
}

function resolveTargetRoot(workspaceRoot: string, configured: string, override: string): string {
  const root = override.trim().length > 0 ? override : configured
  if (root.length === 0) {
    throw new ContextaError('missing codex target root in config')
  }
  return path.isAbsolute(root)
    ? path.resolve(root)
    : path.resolve(workspaceRoot, root)
}

async function readCodexTargetConfig(paths: ContextaRuntimePaths): Promise<ContextaCodexTargetConfig> {
  const raw = await fs.readFile(paths.codexTargetConfigPath, 'utf8').catch(() => {
    throw new ContextaError(`missing .contexta/targets/codex.yaml: ${paths.codexTargetConfigPath}`)
  })
  const parsed = parseYaml(paths.codexTargetConfigPath, raw)

  if (typeof parsed !== 'object' || parsed === null) {
    throw new ContextaError(`invalid .contexta/targets/codex.yaml: expected object`)
  }

  const source = parsed as Record<string, unknown>
  const candidate = source.root
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return { root: candidate.trim() }
  }

  throw new ContextaError(`invalid .contexta/targets/codex.yaml: missing root`)
}

function dedupeAssetsById(assets: readonly ContextaAsset[]): ContextaAsset[] {
  const byId = new Map<string, ContextaAsset>()
  for (const asset of assets) {
    if (!byId.has(asset.id)) {
      byId.set(asset.id, asset)
    }
  }
  return [...byId.values()]
}

function parseYaml(filePath: string, raw: string): unknown {
  try {
    return parse(raw)
  }
  catch (error) {
    throw new ContextaError(`invalid YAML in ${filePath}: ${(error as Error).message}`)
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  return fs.access(filePath, constants.F_OK).then(() => true, () => false)
}

export type {
  ContextaAsset,
  ContextaAssetExportResult,
  ContextaCatalog,
  ContextaCodexTargetConfig,
  ContextaExportCodexOptions,
  ContextaExportCodexResult,
  ContextaPackManifest,
  ContextaPackSummary,
  ContextaRuntimePaths,
} from './domain.js'
