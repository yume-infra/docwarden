import type { ContextaAsset, ContextaAssetExportResult } from '../../domain.js'
import { constants, promises as fs } from 'node:fs'
import path from 'node:path'

interface ExportAssetOptions {
  readonly asset: ContextaAsset
  readonly targetRoot: string
  readonly dryRun: boolean
  readonly force: boolean
}

interface WriteHooksOptions {
  readonly targetRoot: string
  readonly payload: Record<string, unknown>
  readonly force: boolean
}

export async function exportAssetToCodex(options: ExportAssetOptions): Promise<ContextaAssetExportResult> {
  const { asset, targetRoot, dryRun, force } = options
  const sourceIsDirectory = await fs.stat(asset.sourcePath).then(stat => stat.isDirectory(), () => false)
  const destination = destinationForAsset(targetRoot, asset, sourceIsDirectory)

  if (!dryRun) {
    const destinationDir = destination.kind === 'file' ? path.dirname(destination.path) : destination.path
    await fs.mkdir(destinationDir, { recursive: true })

    const destinationExists = await pathExists(destination.path)
    if (destinationExists && !force) {
      throw new Error(`destination exists for asset '${asset.id}', use force mode to overwrite`)
    }

    if (destination.kind === 'directory') {
      await fs.rm(destination.path, { force: true, recursive: true })
      await fs.cp(asset.sourcePath, destination.path, { recursive: true })
    }
    else {
      await fs.copyFile(asset.sourcePath, destination.path)
    }
  }

  return {
    assetId: asset.id,
    kind: asset.kind,
    destinationPaths: [destination.path],
    skipped: dryRun,
  }
}

export async function writeCodexHooks(options: WriteHooksOptions): Promise<void> {
  const hooksPath = path.resolve(options.targetRoot, 'hooks.json')
  const exists = await pathExists(hooksPath)
  if (exists && !options.force) {
    throw new Error('hooks.json already exists, use force mode to overwrite')
  }
  await fs.mkdir(path.dirname(hooksPath), { recursive: true })
  await fs.writeFile(hooksPath, `${JSON.stringify(options.payload, null, 2)}\n`, 'utf8')
}

function destinationForAsset(
  targetRoot: string,
  asset: ContextaAsset,
  sourceIsDirectory: boolean,
): { readonly path: string, readonly kind: 'file' | 'directory' } {
  const normalizedTargetRoot = path.resolve(targetRoot)
  const sourceExt = path.extname(asset.sourcePath).toLowerCase()

  if (asset.kind === 'skill') {
    const targetDir = path.resolve(normalizedTargetRoot, 'skills', asset.name)
    if (sourceIsDirectory) {
      return { path: targetDir, kind: 'directory' }
    }
    return { path: path.resolve(targetDir, 'SKILL.md'), kind: 'file' }
  }

  if (asset.kind === 'agent') {
    const ext = sourceExt.length > 0 ? sourceExt : '.toml'
    return { path: path.resolve(normalizedTargetRoot, 'agents', `${asset.name}${ext}`), kind: 'file' }
  }

  if (asset.kind === 'prompt' || asset.kind === 'workflow' || asset.kind === 'profile' || asset.kind === 'reference') {
    const ext = sourceExt.length > 0 ? sourceExt : '.md'
    return { path: path.resolve(normalizedTargetRoot, `${asset.kind}s`, `${asset.name}${ext}`), kind: 'file' }
  }

  return { path: path.resolve(normalizedTargetRoot, `${asset.kind}s`, `${asset.name}${sourceExt}`), kind: 'file' }
}

async function pathExists(target: string): Promise<boolean> {
  return fs.access(target, constants.F_OK).then(() => true, () => false)
}
