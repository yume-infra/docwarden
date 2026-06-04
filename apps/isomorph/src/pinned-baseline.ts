import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface BaselineFile {
  readonly path: string
  readonly content: string
}

export const isomorphSourceAbilities = {
  language: 'language',
  framework: 'framework',
  contract: 'contract',
  loop: 'loop',
} as const

export type IsomorphSourceAbility = (typeof isomorphSourceAbilities)[keyof typeof isomorphSourceAbilities]

export const pinnedBaselineVendor = 'isomorph'
export const pinnedBaselineRef = 'isomorph-origin-v0'
export const pinnedBaselineSchemaVersion = 1

export const initSeedFiles: readonly BaselineFile[] = [{
  path: 'README.md',
  content: `---
status: active
updated: 2026-06-04T00:00:00.000Z
---

# Initialized isomorph project workspace

This workspace is initialized by the isomorph CLI.

- Keep project-specific semantic framework material under this .isomorph tree.
- Keep vocabulary, relations, boundaries, loss models, examples and usage contracts owned by this project.
- The isomorph CLI reads pinned package authority from language, framework, contract and loop source abilities.
- Package-owned source material does not belong in this .isomorph tree.
`,
}]

export function readPinnedBaselineFiles(): readonly BaselineFile[] {
  const isomorphRoot = resolvePackageRoot()
  const files: BaselineFile[] = []
  for (const ability of Object.values(isomorphSourceAbilities)) {
    walkMarkdownFiles(isomorphRoot, path.join(isomorphRoot, ability), files)
  }
  return files.sort((a, b) => a.path.localeCompare(b.path))
}

export function readPinnedBaselineFilesForAbility(ability: IsomorphSourceAbility): readonly BaselineFile[] {
  return readPinnedBaselineFiles().filter(file => abilityOfPath(file.path) === ability)
}

export function readPinnedBaselineFilesForAbilities(abilities: readonly IsomorphSourceAbility[]): readonly BaselineFile[] {
  const abilitySet = new Set(abilities)
  return readPinnedBaselineFiles().filter(file => abilitySet.has(abilityOfPath(file.path)))
}

export function abilityOfPath(filePath: string): IsomorphSourceAbility {
  const prefix = filePath.includes('/') ? filePath.slice(0, filePath.indexOf('/')) : filePath
  if (
    prefix === isomorphSourceAbilities.language
    || prefix === isomorphSourceAbilities.framework
    || prefix === isomorphSourceAbilities.contract
    || prefix === isomorphSourceAbilities.loop
  ) {
    return prefix
  }

  throw new Error(`unknown isomorph source ability: ${filePath}`)
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

function resolvePackageRoot(): string {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.resolve(moduleDirectory, '..'),
  ]

  const match = candidates.find(candidate =>
    existsSync(candidate)
    && statSync(candidate).isDirectory()
    && Object.values(isomorphSourceAbilities).every((ability) => {
      const abilityRoot = path.join(candidate, ability)
      return existsSync(abilityRoot) && statSync(abilityRoot).isDirectory()
    }))
  if (match === undefined) {
    throw new Error('cannot resolve pinned isomorph baseline: missing packaged source abilities')
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
