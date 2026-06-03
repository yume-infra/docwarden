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
import { parse, stringify } from 'yaml'
import { ContextaError } from './domain.js'

import {
  exportAssetToCodex,
  exportSkillToCodex,
  writeCodexHooks,
} from './exporters/codex/index.js'

export const contextaInfraPackage = 'contexta'

const catalogVersion = '0.1.0'

const skillNamePattern = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
const codexTargetAliases: Record<string, string> = {
  codex: 'codex.plugin',
}
const supportedTargets = new Set([
  'codex',
  'codex.repo-skill',
  'codex.plugin',
  'codex.project-hooks',
  'codex.project-config',
])

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

interface CodexPackExportSelection {
  readonly mode: 'asset' | 'pack'
  readonly assets: readonly ContextaAsset[]
  readonly packIds: readonly string[]
}

interface MaterializedSkill {
  readonly asset: ContextaAsset
  readonly name: string
  readonly description: string
  readonly markdown: string
}

interface PluginSkillReference {
  readonly asset: ContextaAsset
  readonly destinationPath: string
}

interface CodexPluginManifest {
  readonly name: string
  readonly version: string
  readonly description: string
  readonly author: {
    readonly name: string
  }
  readonly skills: './skills/'
  readonly interface: {
    readonly displayName: string
    readonly shortDescription: string
    readonly longDescription: string
    readonly developerName: string
    readonly category: 'Productivity'
    readonly capabilities: readonly string[]
    readonly defaultPrompt: readonly string[]
  }
}

interface CodexMarketplaceEntry {
  readonly name: string
  readonly source: {
    readonly source: 'local'
    readonly path: string
  }
  readonly policy: {
    readonly installation: 'AVAILABLE'
    readonly authentication: 'ON_INSTALL'
  }
  readonly category: 'Productivity'
}

interface CodexPluginMetadata {
  readonly manifest: CodexPluginManifest
  readonly marketplaceEntry: CodexMarketplaceEntry
  readonly pluginDir: string
  readonly pluginPath: string
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
  const packSummaries = new Map(catalog.packs.map(pack => [pack.id, pack]))
  let hookPayload: Record<string, unknown> | undefined
  const items: ContextaAssetExportResult[] = []

  if (selected.mode === 'asset') {
    for (const asset of selected.assets) {
      if (asset.kind === 'hook') {
        if (hookPayload !== undefined) {
          throw new ContextaError('exporting multiple Codex hooks.json assets in one request is not supported in v1')
        }
        hookPayload = await readCodexHooksPayload(asset)
        continue
      }

      if (asset.kind !== 'skill') {
        throw new ContextaError(`asset '${asset.id}' is not exportable to codex.repo-skill in v1. Use pack export for plugin output.`)
      }

      items.push(await exportRepoSkill({
        asset,
        targetRoot,
        dryRun: options.dryRun,
        force: options.force,
      }))
    }
  }
  else {
    for (const packId of selected.packIds) {
      const pack = packSummaries.get(packId)
      if (pack === undefined) {
        throw new ContextaError(`pack summary missing for '${packId}'`)
      }

      const packAssets = selected.assets.filter(asset => asset.packId === packId)
      const pluginResult = await exportPackAsPlugin({
        packId,
        namespace: pack.namespace,
        description: pack.description,
        targets: pack.targets ?? ['codex'],
        assets: packAssets,
        targetRoot,
        dryRun: options.dryRun,
        force: options.force,
      })
      items.push(...pluginResult.results)
    }
  }

  if (hookPayload !== undefined) {
    if (!options.dryRun) {
      await writeCodexHooks({
        outputPath: path.resolve(targetRoot, '.codex', 'hooks.json'),
        payload: hookPayload,
        force: options.force,
        dryRun: options.dryRun,
      })
    }
    items.push({
      assetId: 'hooks',
      kind: 'hook',
      destinationPaths: [path.resolve(targetRoot, '.codex', 'hooks.json')],
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

interface PluginExport {
  readonly results: readonly ContextaAssetExportResult[]
  readonly metadata: CodexPluginMetadata
}

async function exportRepoSkill(options: {
  readonly asset: ContextaAsset
  readonly targetRoot: string
  readonly dryRun: boolean
  readonly force: boolean
}): Promise<ContextaAssetExportResult> {
  const skill = await materializeSkill(options.asset)
  const skillBase = path.resolve(options.targetRoot, '.agents', 'skills', skill.name)
  return await exportSkillToCodex({
    asset: options.asset,
    destinationDir: skillBase,
    skillMarkdown: skill.markdown,
    dryRun: options.dryRun,
    force: options.force,
  })
}

async function exportPackAsPlugin(options: {
  readonly packId: string
  readonly namespace: string
  readonly description: string | undefined
  readonly targets: readonly string[]
  readonly assets: readonly ContextaAsset[]
  readonly targetRoot: string
  readonly dryRun: boolean
  readonly force: boolean
}): Promise<PluginExport> {
  const normalizedTargets = options.targets
    .map(target => codexTargetAliases[target] ?? target)
    .filter(target => target.length > 0)

  const canExportAsPlugin = normalizedTargets.includes('codex') || normalizedTargets.includes('codex.plugin')
  if (!canExportAsPlugin) {
    throw new ContextaError(`pack '${options.packId}' cannot be exported as codex.plugin with target [${options.targets.join(', ')}]`)
  }

  const skills = options.assets.filter(asset => asset.kind === 'skill')
  if (skills.length === 0) {
    throw new ContextaError(`pack '${options.packId}' has no skill assets; cannot export codex.plugin`)
  }

  const pluginName = makeRuntimeName(options.namespace, options.packId)
  const pluginPath = path.join('plugins', pluginName)
  const pluginDir = path.resolve(options.targetRoot, pluginPath)
  const materializedSkills: MaterializedSkill[] = []
  const references: PluginSkillReference[] = []

  for (const asset of options.assets) {
    switch (asset.kind) {
      case 'skill': {
        materializedSkills.push(await materializeSkill(asset))
        break
      }
      case 'prompt':
      case 'workflow':
      case 'reference': {
        const ext = deriveReferenceExtension(asset.sourcePath)
        references.push({
          asset,
          destinationPath: path.resolve(pluginDir, 'references', `${asset.kind}s`, `${asset.name}${ext}`),
        })
        break
      }
      case 'hook': {
        throw new ContextaError(`asset kind 'hook' for '${asset.id}' is not supported in codex.plugin v1; export the hook asset directly for codex.project-hooks`)
      }
      case 'agent':
      case 'profile': {
        throw new ContextaError(`asset kind '${asset.kind}' for '${asset.id}' is not supported in codex.plugin v1`)
      }
      default: {
        throw new ContextaError(`asset kind '${asset.kind}' for '${asset.id}' cannot be exported in codex v1`)
      }
    }
  }

  const metadata = makePluginMetadata({
    pluginName,
    pluginPath,
    pluginDir,
    description: options.description ?? `Codex plugin for ${options.packId}`,
    skills: materializedSkills,
  })

  const pluginManifestPath = path.resolve(pluginDir, '.codex-plugin', 'plugin.json')
  const marketplacePath = path.resolve(options.targetRoot, '.agents', 'plugins', 'marketplace.json')
  await assertWritableDestinations([
    ...materializedSkills.map(skill => path.resolve(pluginDir, 'skills', skill.name)),
    ...references.map(reference => reference.destinationPath),
    pluginManifestPath,
  ], options.force)

  const results: ContextaAssetExportResult[] = []

  for (const skill of materializedSkills) {
    results.push(await exportSkillToCodex({
      asset: skill.asset,
      destinationDir: path.resolve(pluginDir, 'skills', skill.name),
      skillMarkdown: skill.markdown,
      dryRun: options.dryRun,
      force: options.force,
    }))
  }

  for (const reference of references) {
    results.push(await exportAssetToCodex({
      asset: reference.asset,
      destinationPath: reference.destinationPath,
      dryRun: options.dryRun,
      force: options.force,
    }))
  }

  if (!options.dryRun) {
    await writeCodexHooks({
      outputPath: pluginManifestPath,
      payload: metadata.manifest,
      force: options.force,
      dryRun: options.dryRun,
    })
    await upsertPluginMarketplace({
      marketplacePath,
      entry: metadata.marketplaceEntry,
      force: options.force,
      dryRun: options.dryRun,
    })
  }
  results.push({
    assetId: `plugin:${pluginName}`,
    kind: 'skill',
    destinationPaths: [pluginManifestPath, marketplacePath],
    skipped: options.dryRun,
  })

  return { results, metadata }
}

async function readCodexHooksPayload(asset: ContextaAsset): Promise<Record<string, unknown>> {
  const raw = await fs.readFile(asset.sourcePath, 'utf8')
  let payload: unknown
  try {
    payload = JSON.parse(raw)
  }
  catch {
    throw new ContextaError(`hook '${asset.id}' must be JSON`)
  }

  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new ContextaError(`hook '${asset.id}' must be a Codex hooks.json object`)
  }

  const hooks = (payload as Record<string, unknown>).hooks
  if (typeof hooks !== 'object' || hooks === null || Array.isArray(hooks)) {
    throw new ContextaError(`hook '${asset.id}' must be a Codex hooks.json payload with a top-level hooks object`)
  }

  for (const [eventName, groups] of Object.entries(hooks as Record<string, unknown>)) {
    if (!isCodexHookEvent(eventName)) {
      throw new ContextaError(`hook '${asset.id}' contains unsupported Codex hook event '${eventName}'`)
    }
    if (!Array.isArray(groups)) {
      throw new ContextaError(`hook '${asset.id}' event '${eventName}' must be an array`)
    }
  }

  return payload as Record<string, unknown>
}

function deriveReferenceExtension(sourcePath: string): string {
  const ext = path.extname(sourcePath).toLowerCase()
  return ext.length > 0 ? ext : '.md'
}

async function materializeSkill(asset: ContextaAsset): Promise<MaterializedSkill> {
  const skillMarkdownPath = await resolveSkillMarkdownPath(asset)
  const raw = await fs.readFile(skillMarkdownPath, 'utf8')
  if (containsPlaceholder(raw)) {
    throw new ContextaError(`skill '${asset.id}' contains placeholder tokens`)
  }

  const match = raw.match(/^\s*---\r?\n([\s\S]*?)\r?\n---([\s\S]*)$/)
  if (match === null) {
    throw new ContextaError(`skill '${asset.id}' must contain YAML frontmatter`)
  }

  let frontmatter: unknown
  try {
    frontmatter = parse(match[1] ?? '')
  }
  catch (error) {
    throw new ContextaError(`skill '${asset.id}' has invalid YAML frontmatter: ${(error as Error).message}`)
  }

  if (frontmatter === null || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    throw new ContextaError(`skill '${asset.id}' frontmatter must be an object`)
  }

  const source = frontmatter as Record<string, unknown>
  const nameRaw = source.name
  const descriptionRaw = source.description
  if (typeof nameRaw !== 'string') {
    throw new ContextaError(`skill '${asset.id}' frontmatter missing required name`)
  }
  if (!skillNamePattern.test(nameRaw.trim())) {
    throw new ContextaError(`skill '${asset.id}' frontmatter name must be kebab-case`)
  }
  if (typeof descriptionRaw !== 'string' || descriptionRaw.trim().length === 0) {
    throw new ContextaError(`skill '${asset.id}' frontmatter missing required description`)
  }

  const runtimeName = makeRuntimeName(asset.namespace, asset.name)
  const outputFrontmatter = {
    ...source,
    name: runtimeName,
    description: descriptionRaw.trim(),
  }
  const frontmatterText = stringify(outputFrontmatter).trimEnd()
  return {
    asset,
    name: runtimeName,
    description: descriptionRaw.trim(),
    markdown: `---\n${frontmatterText}\n---${match[2] ?? ''}`,
  }
}

async function upsertPluginMarketplace(options: {
  readonly marketplacePath: string
  readonly entry: CodexMarketplaceEntry
  readonly force: boolean
  readonly dryRun: boolean
}): Promise<void> {
  if (options.dryRun) {
    return
  }

  const raw = await fs.readFile(options.marketplacePath, 'utf8').catch(() => '')
  let marketplaceName = 'local-repo'
  let marketplaceInterface: { readonly displayName: string } = { displayName: 'Local Repo' }
  let existingPlugins: unknown[] = []

  if (raw.length > 0) {
    let parsed: unknown = null
    try {
      parsed = JSON.parse(raw)
    }
    catch (error) {
      throw new ContextaError(`invalid plugin marketplace JSON at '${options.marketplacePath}': ${(error as Error).message}`)
    }
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      const rawContainer = parsed as Record<string, unknown>
      if (typeof rawContainer.name === 'string' && rawContainer.name.trim().length > 0) {
        marketplaceName = rawContainer.name.trim()
      }
      const rawInterface = rawContainer.interface
      if (typeof rawInterface === 'object' && rawInterface !== null && !Array.isArray(rawInterface)) {
        const displayName = (rawInterface as Record<string, unknown>).displayName
        if (typeof displayName === 'string' && displayName.trim().length > 0) {
          marketplaceInterface = { displayName: displayName.trim() }
        }
      }
      const entries = rawContainer.plugins
      if (Array.isArray(entries)) {
        existingPlugins = entries
      }
    }
    else if (Array.isArray(parsed)) {
      existingPlugins = parsed
    }
  }

  const existingEntry = existingPlugins.find(entry => getMarketplacePluginName(entry) === options.entry.name)
  if (existingEntry !== undefined && !options.force) {
    throw new ContextaError(`plugin marketplace entry '${options.entry.name}' already exists, use force mode to overwrite`)
  }

  const destination = [
    ...existingPlugins.filter(entry => getMarketplacePluginName(entry) !== options.entry.name),
    options.entry,
  ]
  await fs.mkdir(path.dirname(options.marketplacePath), { recursive: true })
  await fs.writeFile(options.marketplacePath, `${JSON.stringify({
    name: marketplaceName,
    interface: marketplaceInterface,
    plugins: destination,
  }, null, 2)}\n`, 'utf8')
}

async function resolveSkillMarkdownPath(asset: ContextaAsset): Promise<string> {
  const isDirectory = await sourceIsDirectory(asset.sourcePath)
  const skillMarkdownPath = isDirectory
    ? path.resolve(asset.sourcePath, 'SKILL.md')
    : asset.sourcePath

  if (!await fileExists(skillMarkdownPath)) {
    throw new ContextaError(`skill '${asset.id}' is missing SKILL.md`)
  }
  return skillMarkdownPath
}

function getMarketplacePluginName(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined
  }
  const name = (value as Record<string, unknown>).name
  return typeof name === 'string' && name.trim().length > 0 ? name.trim() : undefined
}

function isCodexHookEvent(value: string): boolean {
  return value === 'SessionStart'
    || value === 'PreToolUse'
    || value === 'PermissionRequest'
    || value === 'PostToolUse'
    || value === 'PreCompact'
    || value === 'PostCompact'
    || value === 'UserPromptSubmit'
    || value === 'SubagentStart'
    || value === 'SubagentStop'
    || value === 'Stop'
}

function makeRuntimeName(namespace: string, name: string): string {
  const normalizedName = name.trim()
  const normalizedNamespace = namespace.trim()
  const runtimeName = normalizedName.startsWith(`${normalizedNamespace}-`)
    ? normalizedName
    : `${normalizedNamespace}-${normalizedName}`

  if (!skillNamePattern.test(runtimeName)) {
    throw new ContextaError(`invalid Codex runtime name '${runtimeName}'`)
  }
  return runtimeName
}

function makePluginMetadata(options: {
  readonly pluginName: string
  readonly pluginPath: string
  readonly pluginDir: string
  readonly description: string
  readonly skills: readonly MaterializedSkill[]
}): CodexPluginMetadata {
  const displayName = toDisplayName(options.pluginName)
  const shortDescription = truncateForPrompt(options.description)
  const defaultPrompt = options.skills[0] === undefined
    ? `Use ${displayName}`
    : `Use $${options.skills[0].name}`

  return {
    pluginDir: options.pluginDir,
    pluginPath: options.pluginPath,
    manifest: {
      name: options.pluginName,
      version: '0.1.0',
      description: options.description,
      author: {
        name: 'contexta',
      },
      skills: './skills/',
      interface: {
        displayName,
        shortDescription,
        longDescription: options.description,
        developerName: 'contexta',
        category: 'Productivity',
        capabilities: ['Skills'],
        defaultPrompt: [truncateForPrompt(defaultPrompt)],
      },
    },
    marketplaceEntry: {
      name: options.pluginName,
      source: {
        source: 'local',
        path: `./${options.pluginPath.split(path.sep).join('/')}`,
      },
      policy: {
        installation: 'AVAILABLE',
        authentication: 'ON_INSTALL',
      },
      category: 'Productivity',
    },
  }
}

async function assertWritableDestinations(destinations: readonly string[], force: boolean): Promise<void> {
  if (force) {
    return
  }
  for (const destination of destinations) {
    if (await fileExists(destination)) {
      throw new ContextaError(`destination exists at '${destination}', use force mode to overwrite`)
    }
  }
}

function containsPlaceholder(raw: string): boolean {
  return /\[TODO:/i.test(raw) || /<[^>\r\n]+>/.test(raw)
}

function toDisplayName(value: string): string {
  return value
    .split('-')
    .filter(part => part.length > 0)
    .map(part => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function truncateForPrompt(value: string): string {
  const trimmed = value.trim()
  return trimmed.length <= 128 ? trimmed : trimmed.slice(0, 125).trimEnd().concat('...')
}

function dedupeByString(values: readonly string[]): readonly string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of values) {
    if (!seen.has(item)) {
      seen.add(item)
      out.push(item)
    }
  }
  return out
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
): CodexPackExportSelection {
  if (all) {
    const packIds = dedupeByString(assets.map(asset => asset.packId))
    return {
      mode: 'pack',
      assets,
      packIds,
    }
  }

  if (selectors.length === 0) {
    throw new ContextaError('missing selector. use --all or pass an <asset-or-pack-id>')
  }

  const selected = new Map<string, ContextaAsset>()
  let selectedPack = false
  let selectedAsset = false
  for (const selector of selectors) {
    if (selector.includes(':')) {
      selectedAsset = true
      const direct = assets.find(asset => asset.id === selector)
      if (direct === undefined) {
        throw new ContextaError(`unknown asset '${selector}'`)
      }
      selected.set(direct.id, direct)
      continue
    }

    selectedPack = true
    const byPack = assets.filter(asset => asset.packId === selector)
    if (byPack.length === 0) {
      throw new ContextaError(`unknown pack '${selector}'`)
    }
    for (const asset of byPack) {
      selected.set(asset.id, asset)
    }
  }

  if (selectedPack && selectedAsset) {
    throw new ContextaError('do not mix pack and asset selectors in one export request')
  }

  const out = [...selected.values()]
  if (out.length === 0) {
    throw new ContextaError('selection resolved to zero assets')
  }

  if (selectedPack) {
    const packIds = dedupeByString(
      assets
        .filter(asset => selected.has(asset.id))
        .map(asset => asset.packId),
    )
    return {
      mode: 'pack',
      assets: out,
      packIds,
    }
  }

  return {
    mode: 'asset',
    assets: out,
    packIds: [],
  }
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
  const disallowed = targets.find(target => !supportedTargets.has(target))
  if (disallowed !== undefined) {
    throw new ContextaError(`invalid target '${disallowed}' in pack '${packId}'`)
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

async function sourceIsDirectory(filePath: string): Promise<boolean> {
  return fs.stat(filePath).then(stat => stat.isDirectory(), () => false)
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
