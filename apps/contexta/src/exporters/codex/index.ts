import type { ContextaAsset, ContextaAssetExportResult } from '../../domain.js'
import { constants, promises as fs } from 'node:fs'
import path from 'node:path'

interface ExportAssetOptions {
  readonly asset: ContextaAsset
  readonly destinationPath: string
  readonly dryRun: boolean
  readonly force: boolean
}

interface ExportSkillOptions {
  readonly asset: ContextaAsset
  readonly destinationDir: string
  readonly skillMarkdown: string
  readonly dryRun: boolean
  readonly force: boolean
}

interface WriteHooksOptions {
  readonly outputPath: string
  readonly payload: unknown
  readonly force: boolean
  readonly dryRun: boolean
}

export async function exportAssetToCodex(options: ExportAssetOptions): Promise<ContextaAssetExportResult> {
  const { asset, destinationPath, dryRun, force } = options
  const sourceIsDirectory = await fs.stat(asset.sourcePath).then(stat => stat.isDirectory(), () => false)
  const destination = destinationPath

  if (!dryRun) {
    const destinationExists = await pathExists(destination)
    if (destinationExists && !force) {
      throw new Error(`destination exists for asset '${asset.id}', use force mode to overwrite`)
    }

    if (sourceIsDirectory) {
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.rm(destination, { force: true, recursive: true })
      await fs.cp(asset.sourcePath, destination, { recursive: true })
    }
    else {
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.copyFile(asset.sourcePath, destination)
    }
  }

  return {
    assetId: asset.id,
    kind: asset.kind,
    destinationPaths: [destination],
    skipped: dryRun,
  }
}

export async function exportSkillToCodex(options: ExportSkillOptions): Promise<ContextaAssetExportResult> {
  const skillPath = path.resolve(options.destinationDir, 'SKILL.md')
  const sourceIsDirectory = await fs.stat(options.asset.sourcePath).then(stat => stat.isDirectory(), () => false)

  if (!options.dryRun) {
    const destinationExists = await pathExists(options.destinationDir)
    if (destinationExists && !options.force) {
      throw new Error(`destination exists for asset '${options.asset.id}', use force mode to overwrite`)
    }

    await fs.mkdir(path.dirname(options.destinationDir), { recursive: true })
    await fs.rm(options.destinationDir, { force: true, recursive: true })

    if (sourceIsDirectory) {
      await fs.cp(options.asset.sourcePath, options.destinationDir, { recursive: true })
    }
    else {
      await fs.mkdir(options.destinationDir, { recursive: true })
    }

    await fs.writeFile(skillPath, options.skillMarkdown, 'utf8')
  }

  return {
    assetId: options.asset.id,
    kind: options.asset.kind,
    destinationPaths: [skillPath],
    skipped: options.dryRun,
  }
}

export async function writeCodexHooks(options: WriteHooksOptions): Promise<void> {
  const exists = await pathExists(options.outputPath)
  if (exists && !options.force) {
    throw new Error(`output exists at '${options.outputPath}', use force mode to overwrite`)
  }
  if (options.dryRun) {
    return
  }
  await fs.mkdir(path.dirname(options.outputPath), { recursive: true })
  await fs.writeFile(options.outputPath, `${JSON.stringify(options.payload, null, 2)}\n`, 'utf8')
}

async function pathExists(target: string): Promise<boolean> {
  return fs.access(target, constants.F_OK).then(() => true, () => false)
}
