import type { FrameworkSummary, FrameworkVocabularyTerm, IsomorphDocument } from './domain.js'
import { extractListItems, findSection, firstNonEmptyLine, normalizeToken } from './markdown-helpers.js'

export function collectFrameworkSummaries(documents: readonly IsomorphDocument[]): readonly FrameworkSummary[] {
  const summaries = new Map<string, {
    path: string
    domain: string | undefined
    vocabularyTerms: FrameworkVocabularyTerm[]
    signals: Set<string>
  }>()

  for (const document of documents.filter(document => document.source === 'local')) {
    const frameworkId = frameworkIdFromPath(document.isomorphPath)
    if (frameworkId === undefined) {
      continue
    }
    const current = summaries.get(frameworkId) ?? {
      path: `framework/${frameworkId}/`,
      domain: undefined,
      vocabularyTerms: [],
      signals: new Set<string>(),
    }

    if (document.kind === 'semantic-framework') {
      current.domain = firstNonEmptyLine(findSection(document.surface, 'Domain')?.text ?? '') ?? current.domain
    }
    if (document.kind === 'signal') {
      current.signals.add(document.title)
    }
    current.vocabularyTerms.push(...collectVocabularyTerms(document))
    summaries.set(frameworkId, current)
  }

  return [...summaries.entries()]
    .map(([id, summary]) => ({
      id,
      path: summary.path,
      domain: summary.domain,
      vocabularyTerms: dedupeTerms(summary.vocabularyTerms),
      signals: [...summary.signals].sort(),
    }))
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function collectVocabularyTerms(document: IsomorphDocument): readonly FrameworkVocabularyTerm[] {
  if (document.kind !== 'vocabulary') {
    return []
  }
  const items = [
    ...extractListItems(findSection(document.surface, 'Terms')?.text ?? ''),
    ...extractListItems(findSection(document.surface, 'Naming Surface')?.text ?? ''),
  ]

  return items
    .map(item => termFromListItem(item, document.isomorphPath))
    .filter((term): term is FrameworkVocabularyTerm => term !== undefined)
}

function frameworkIdFromPath(isomorphPath: string): string | undefined {
  const match = /^framework\/([^/]+)\//.exec(isomorphPath)
  return match?.[1]
}

function termFromListItem(item: string, source: string): FrameworkVocabularyTerm | undefined {
  const term = readTermToken(item)
  if (term === undefined) {
    return undefined
  }
  return {
    id: normalizeToken(term),
    term,
    source,
  }
}

function readTermToken(item: string): string | undefined {
  const trimmed = item.trim()
  const code = /^`([^`]+)`/.exec(trimmed)
  if (code?.[1] !== undefined) {
    return code[1].trim()
  }

  const link = /^\[\[[^\]|]+(?:\|([^\]]+))?\]\]/.exec(trimmed)
  if (link !== null) {
    return (link[1] ?? trimmed.slice(2, -2)).trim()
  }

  const separatorIndex = findTermSeparator(trimmed)
  const raw = separatorIndex === undefined
    ? trimmed.split(/\s+/)[0]
    : trimmed.slice(0, separatorIndex)
  const token = raw?.trim()
  return token === undefined || token.length === 0 ? undefined : token
}

function findTermSeparator(value: string): number | undefined {
  const indexes = [
    value.indexOf(':'),
    value.indexOf(' - '),
    value.indexOf(' -- '),
  ].filter(index => index >= 0)
  return indexes.length === 0 ? undefined : Math.min(...indexes)
}

function dedupeTerms(terms: readonly FrameworkVocabularyTerm[]): readonly FrameworkVocabularyTerm[] {
  const seen = new Set<string>()
  const result: FrameworkVocabularyTerm[] = []
  for (const term of terms) {
    if (seen.has(term.id)) {
      continue
    }
    seen.add(term.id)
    result.push(term)
  }
  return result.sort((a, b) => a.id.localeCompare(b.id))
}
