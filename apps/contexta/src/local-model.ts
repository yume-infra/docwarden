import type { ContextaDocument, ContextaModel, ContextaRoot, RecognitionRule, SignalDefinition } from './domain.js'
import type { ContextaError } from './errors.js'
import { Effect, FileSystem, Path } from 'effect'
import { ContextaRuntimeError, formatUnknownCause } from './errors.js'
import {
  extractListItems,
  extractListItemsAfterLabel,
  findSection,
  firstNonEmptyLine,
  normalizeToken,
  readField,
} from './markdown-helpers.js'
import { parseMarkdownSurface } from './markdown.js'
import { toPosix } from './root.js'

export function loadContextaModelEffect(root: ContextaRoot): Effect.Effect<ContextaModel, ContextaError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    const files = yield* listMarkdownFiles(root.contextaRoot)
    const documents: ContextaDocument[] = []

    for (const absolutePath of files) {
      const content = yield* fs.readFileString(absolutePath, 'utf8').pipe(
        Effect.mapError(error => new ContextaRuntimeError({
          message: `failed to read contexta document: ${absolutePath}: ${formatUnknownCause(error)}`,
        })),
      )
      const contextaPath = toPosix(path.relative(root.contextaRoot, absolutePath), path.sep)
      const surface = parseMarkdownSurface(content, contextaPath)
      documents.push({
        absolutePath,
        contextaPath,
        surface,
        title: firstHeadingText(surface) ?? path.basename(contextaPath, '.md'),
        kind: surface.frontmatter.kind,
      })
    }

    const localKinds = collectLocalKinds(documents)
    const recognitionRules = documents.flatMap(readRecognitionRules)
    const signals = documents.flatMap(readSignalDefinition)
    const skillPrimitiveMaterial = documents.filter(document =>
      normalizeToken(document.title) === 'skill-primitive'
      || normalizeToken(document.kind) === 'skill-primitive'
      || document.contextaPath.includes('skill-primitive'))

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

function listMarkdownFiles(root: string): Effect.Effect<readonly string[], ContextaRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    const result: string[] = []

    const walk = (directory: string): Effect.Effect<void, ContextaRuntimeError> =>
      Effect.gen(function* () {
        const entries = yield* fs.readDirectory(directory).pipe(
          Effect.mapError(error => new ContextaRuntimeError({
            message: `failed to list contexta directory: ${directory}: ${formatUnknownCause(error)}`,
          })),
        )
        for (const entry of entries) {
          const absolute = path.join(directory, entry)
          const info = yield* fs.stat(absolute).pipe(
            Effect.mapError(error => new ContextaRuntimeError({
              message: `failed to stat contexta path: ${absolute}: ${formatUnknownCause(error)}`,
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

function collectLocalKinds(documents: readonly ContextaDocument[]): ReadonlySet<string> {
  const kinds = new Set<string>()
  for (const document of documents) {
    if (document.kind !== undefined) {
      kinds.add(normalizeToken(document.kind))
    }
    if (document.kind === 'concept') {
      kinds.add(normalizeToken(document.title))
    }
  }
  return kinds
}

function readRecognitionRules(document: ContextaDocument): readonly RecognitionRule[] {
  if (document.kind !== 'recognition-primitive' && !document.contextaPath.includes('/modules/recognition/')) {
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
        contextaPath: document.contextaPath,
        role,
        confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0.7,
        triggerLines,
        basis: extractListItemsAfterLabel(section.text, 'Basis'),
      }
    })
    .filter((rule): rule is RecognitionRule => rule !== undefined)
}

function readSignalDefinition(document: ContextaDocument): readonly SignalDefinition[] {
  if (document.kind !== 'signal' && !document.contextaPath.includes('/modules/signal/')) {
    return []
  }
  return [{
    id: document.title,
    contextaPath: document.contextaPath,
    definition: findSection(document.surface, 'Definition')?.text ?? '',
    lossModel: findSection(document.surface, 'Loss Model')?.text ?? firstNonEmptyLine(findSection(document.surface, 'Definition')?.text ?? '') ?? '',
    triggerLines: extractListItems(findSection(document.surface, 'Trigger')?.text ?? ''),
    basis: extractListItems(findSection(document.surface, 'Basis')?.text ?? ''),
  }]
}

function firstHeadingText(surface: ContextaDocument['surface']): string | undefined {
  return surface.headings.find(heading => heading.level === 1)?.text
}
