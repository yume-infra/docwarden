import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface BaselineFile {
  readonly path: string
  readonly content: string
}

export const isomorphSourceLayers = {
  basis: 'basis',
  bootstrap: 'bootstrap',
  init: 'init',
} as const

export type IsomorphSourceLayer = (typeof isomorphSourceLayers)[keyof typeof isomorphSourceLayers]

export const pinnedBaselineVendor = 'isomorph'
export const pinnedBaselineRef = 'isomorph-origin-v0'
export const pinnedBaselineSchemaVersion = 1

export function readPinnedBaselineFiles(): readonly BaselineFile[] {
  const isomorphRoot = resolveBaselineSourceRoot()
  const files: BaselineFile[] = []
  walkMarkdownFiles(isomorphRoot, isomorphRoot, files)
  return files.sort((a, b) => a.path.localeCompare(b.path))
}

export function readPinnedBaselineFilesForLayer(layer: IsomorphSourceLayer): readonly BaselineFile[] {
  return readPinnedBaselineFiles().filter(file => layerOfPath(file.path) === layer)
}

export function readPinnedBaselineFilesForLayers(layers: readonly IsomorphSourceLayer[]): readonly BaselineFile[] {
  const layerSet = new Set(layers)
  return readPinnedBaselineFiles().filter(file => layerSet.has(layerOfPath(file.path)))
}

export function layerOfPath(filePath: string): IsomorphSourceLayer {
  const prefix = filePath.includes('/') ? filePath.slice(0, filePath.indexOf('/')) : filePath
  if (prefix === isomorphSourceLayers.basis || prefix === isomorphSourceLayers.bootstrap || prefix === isomorphSourceLayers.init) {
    return prefix
  }

  throw new Error(`unknown isomorph source layer: ${filePath}`)
}

export function initOutputPath(filePath: string): string {
  const prefix = `${isomorphSourceLayers.init}/`
  if (!filePath.startsWith(prefix)) {
    throw new Error(`init output path requires init layer file: ${filePath}`)
  }
  const outputPath = filePath.slice(prefix.length)
  if (outputPath.length === 0) {
    throw new Error(`init output path is empty: ${filePath}`)
  }
  return outputPath
}

export function computeBaselineDigest(files: readonly BaselineFile[]): string {
  const hash = createHash('sha256')
  for (const file of [...files].sort((a, b) => a.path.localeCompare(b.path))) {
    hash.update(file.path)
    hash.update('\0')
    hash.update(file.content)
    hash.update('\0')
  }
  return `sha256:${hash.digest('hex')}`
}

function resolveBaselineSourceRoot(): string {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.resolve(moduleDirectory, '..', 'isomorph-source'),
  ]

  const match = candidates.find(candidate => existsSync(candidate) && statSync(candidate).isDirectory())
  if (match === undefined) {
    throw new Error('cannot resolve pinned isomorph baseline: missing packaged isomorph-source')
  }
  return match
}

function walkMarkdownFiles(root: string, directory: string, files: BaselineFile[]): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) {
      continue
    }
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      walkMarkdownFiles(root, absolutePath, files)
      continue
    }
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue
    }
    files.push({
      path: path.relative(root, absolutePath).split(path.sep).join('/'),
      content: readFileSync(absolutePath, 'utf8'),
    })
  }
}
