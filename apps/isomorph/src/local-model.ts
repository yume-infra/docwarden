import type { IsomorphDocument, IsomorphModel, IsomorphRoot, RecognitionRule, SignalDefinition } from './domain.js'
import type { IsomorphError } from './errors.js'
import { Effect, FileSystem, Path } from 'effect'
import { formatUnknownCause, IsomorphRuntimeError } from './errors.js'
import { collectVocabularyTerms } from './framework-model.js'
import {
  extractListItems,
  extractListItemsAfterLabel,
  findSection,
  normalizeToken,
  readField,
} from './markdown-helpers.js'
import { parseMarkdownSurface } from './markdown.js'
import {
  readPinnedBaselineFiles,
} from './pinned-baseline.js'
import { toPosix } from './root.js'

export function loadIsomorphModelEffect(root: IsomorphRoot): Effect.Effect<IsomorphModel, IsomorphError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    const localFiles = yield* listMarkdownFiles(root.isomorphRoot)
    const documents: IsomorphDocument[] = []

    for (const absolutePath of localFiles) {
      const content = yield* fs.readFileString(absolutePath, 'utf8').pipe(
        Effect.mapError(error => new IsomorphRuntimeError({
          message: `failed to read isomorph document: ${absolutePath}: ${formatUnknownCause(error)}`,
        })),
      )
      const isomorphPath = toPosix(path.relative(root.isomorphRoot, absolutePath), path.sep)
      const surface = parseMarkdownSurface(content, isomorphPath)
      documents.push({
        absolutePath,
        isomorphPath,
        source: 'local',
        surface,
        title: firstHeadingText(surface) ?? path.basename(isomorphPath, '.md'),
        kind: surface.frontmatter.kind,
      })
    }

    const hasPin = yield* fs.exists(path.join(root.isomorphRoot, '.isomorph-pin.json')).pipe(
      Effect.match({
        onFailure: () => false,
        onSuccess: exists => exists,
      }),
    )
    if (hasPin) {
      const sourceFiles = readPinnedBaselineFiles()
      const localPaths = new Set(documents.map(document => document.isomorphPath))
      for (const file of sourceFiles) {
        if (localPaths.has(file.path)) {
          continue
        }
        const surface = parseMarkdownSurface(file.content, file.path)
        documents.push({
          absolutePath: path.join(root.isomorphRoot, file.path),
          isomorphPath: file.path,
          source: 'pinned',
          surface,
          title: firstHeadingText(surface) ?? path.basename(file.path, '.md'),
          kind: surface.frontmatter.kind,
        })
      }
    }

    const localKinds = collectLocalKinds(documents)
    const recognitionRules = documents.flatMap(readRecognitionRules)
    const signals = documents.flatMap(readSignalDefinition)
    const skillPrimitiveMaterial = documents.filter(document =>
      normalizeToken(document.title) === 'skill-primitive'
      || normalizeToken(document.kind) === 'skill-primitive'
      || document.isomorphPath.includes('skill-primitive'))

    return {
      root,
      documents,
      localKinds,
      recognitionRules,
      signals,
      skillPrimitiveMaterial,
    }
  })
}

function listMarkdownFiles(root: string): Effect.Effect<readonly string[], IsomorphRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    const result: string[] = []

    const walk = (directory: string): Effect.Effect<void, IsomorphRuntimeError> =>
      Effect.gen(function* () {
        const entries = yield* fs.readDirectory(directory).pipe(
          Effect.mapError(error => new IsomorphRuntimeError({
            message: `failed to list isomorph directory: ${directory}: ${formatUnknownCause(error)}`,
          })),
        )
        for (const entry of entries) {
          const absolute = path.join(directory, entry)
          const info = yield* fs.stat(absolute).pipe(
            Effect.mapError(error => new IsomorphRuntimeError({
              message: `failed to stat isomorph path: ${absolute}: ${formatUnknownCause(error)}`,
            })),
          )
          if (info.type === 'Directory') {
            yield* walk(absolute)
          }
          else if (info.type === 'File' && entry.endsWith('.md')) {
            result.push(absolute)
          }
        }
      })

    yield* walk(root)
    return result.sort()
  })
}

function collectLocalKinds(documents: readonly IsomorphDocument[]): ReadonlySet<string> {
  const kinds = new Set<string>()
  for (const document of documents) {
    if (document.kind === 'concept') {
      kinds.add(normalizeToken(document.title))
    }
    for (const term of collectVocabularyTerms(document)) {
      kinds.add(term.id)
    }
  }
  return kinds
}

function readRecognitionRules(document: IsomorphDocument): readonly RecognitionRule[] {
  if (document.kind !== 'recognition-primitive' && !document.isomorphPath.includes('/recognition/')) {
    return []
  }

  return document.surface.sections
    .filter(section => section.heading.level === 2)
    .map((section): RecognitionRule | undefined => {
      const role = readField(section.text, 'Role')
      const triggerLines = extractListItemsAfterLabel(section.text, 'When')
      if (role === undefined || triggerLines.length === 0) {
        return undefined
      }
      const confidence = Number(readField(section.text, 'Confidence') ?? '0.7')
      return {
        id: section.heading.text,
        isomorphPath: document.isomorphPath,
        role,
        confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0.7,
        triggerLines,
        basis: extractListItemsAfterLabel(section.text, 'Basis'),
      }
    })
    .filter((rule): rule is RecognitionRule => rule !== undefined)
}

function readSignalDefinition(document: IsomorphDocument): readonly SignalDefinition[] {
  if (document.kind !== 'signal' && !document.isomorphPath.includes('/signal/')) {
    return []
  }
  return [{
    id: document.title,
    isomorphPath: document.isomorphPath,
    definition: findSection(document.surface, 'Definition')?.text ?? '',
    lossModel: findSection(document.surface, 'Loss Model')?.text ?? '',
    triggerLines: extractListItems(findSection(document.surface, 'Trigger')?.text ?? ''),
    basis: extractListItems(findSection(document.surface, 'Basis')?.text ?? ''),
  }]
}

function firstHeadingText(surface: IsomorphDocument['surface']): string | undefined {
  return surface.headings.find(heading => heading.level === 1)?.text
}
