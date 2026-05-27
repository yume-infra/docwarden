import type { MarkdownSurface, OfmLink, Section } from './markdown.js'

export function findSection(surface: MarkdownSurface, heading: string): Section | undefined {
  return surface.sections.find(section => normalizeToken(section.heading.text) === normalizeToken(heading))
}

export function extractListItems(text: string): readonly string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => stripCode(line.slice(2).trim()))
    .filter(line => line.length > 0)
}

export function extractListItemsAfterLabel(text: string, label: string): readonly string[] {
  const lines = text.split('\n')
  const start = lines.findIndex(line => normalizeToken(line.replace(/:$/, '')) === normalizeToken(label))
  if (start < 0) {
    return []
  }
  const result: string[] = []
  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim()
    if (/^[A-Z][A-Za-z ]+:$/.test(trimmed)) {
      break
    }
    if (trimmed.startsWith('- ')) {
      result.push(stripCode(trimmed.slice(2).trim()))
    }
  }
  return result
}

export function readField(text: string, field: string): string | undefined {
  const normalizedField = normalizeToken(field)
  for (const line of text.split('\n')) {
    const separator = line.indexOf(':')
    if (separator <= 0) {
      continue
    }
    const key = line.slice(0, separator).trim()
    if (normalizeToken(key) === normalizedField) {
      const value = line.slice(separator + 1).trim()
      return value.length === 0 ? undefined : stripCode(value)
    }
  }
  return undefined
}

export function splitTerms(raw: string): readonly string[] {
  return raw
    .replace(/\bterms\b/gi, '')
    .replace(/\bsections\b/gi, '')
    .replace(/\bwith concrete subject\b/gi, '')
    .replace(/\bdescriptions\b/gi, '')
    .split(/\s*\/\s*|\s*,\s*|\s+or\s+/i)
    .map(term => term.trim())
    .filter(term => term.length > 0)
}

export function includesNormalized(values: readonly string[], expected: string): boolean {
  return values.some(value => normalizeToken(value) === normalizeToken(expected))
}

export function normalizeToken(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/\s+/g, '-')
}

export function firstNonEmptyLine(value: string): string | undefined {
  return value.split('\n').map(line => line.trim()).find(line => line.length > 0)
}

export function stripCode(value: string): string {
  return value.replace(/^`(.+)`$/, '$1').trim()
}

export function collectOfmLinksFromText(text: string): readonly OfmLink[] {
  const links: OfmLink[] = []
  for (const match of text.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)) {
    const target = match[1]?.trim()
    if (target === undefined || target.length === 0) {
      continue
    }
    links.push({
      raw: match[0],
      target,
      label: match[2]?.trim(),
    })
  }
  return links
}

export function roundConfidence(value: number): number {
  return Math.round(value * 100) / 100
}
