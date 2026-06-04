import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export interface BaselineFile {
  readonly path: string
  readonly content: string
}

export const pinnedBaselineVendor = 'isomorph'
export const pinnedBaselineRef = 'isomorph-origin-v0'
export const pinnedBaselineSchemaVersion = 1

export function readPinnedBaselineFiles(): readonly BaselineFile[] {
  const isomorphRoot = resolveBaselineIsomorphRoot()
  const files: BaselineFile[] = []
  walkMarkdownFiles(isomorphRoot, isomorphRoot, files)
  return files.sort((a, b) => a.path.localeCompare(b.path))
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

function resolveBaselineIsomorphRoot(): string {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.resolve(moduleDirectory, '../../..', '.isomorph'),
    findAncestorIsomorphRoot(process.cwd()),
  ].filter((candidate): candidate is string => candidate !== undefined)

  const match = candidates.find(candidate => existsSync(candidate) && statSync(candidate).isDirectory())
  if (match === undefined) {
    throw new Error('cannot resolve pinned isomorph baseline: missing repository .isomorph')
  }
  return match
}

function findAncestorIsomorphRoot(start: string): string | undefined {
  let current = path.resolve(start)
  while (true) {
    const candidate = path.join(current, '.isomorph')
    if (existsSync(candidate) && statSync(candidate).isDirectory()) {
      return candidate
    }
    const parent = path.dirname(current)
    if (parent === current) {
      return undefined
    }
    current = parent
  }
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
