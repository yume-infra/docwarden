import type { Frontmatter, Heading, LocatorMarker, MarkdownSurface, OfmLink, Section } from './domain.js'

interface HeadingWithBodyIndex extends Heading {
  readonly bodyIndex: number
}

export function parseMarkdownSurface(content: string, filePath: string): MarkdownSurface {
  const normalized = content.replace(/\r\n?/g, '\n')
  const lines = normalized.split('\n')
  const frontmatterEnd = lines[0]?.trim() === '---'
    ? lines.findIndex((line, index) => index > 0 && line.trim() === '---')
    : -1
  const frontmatter = frontmatterEnd > 0
    ? parseFrontmatter(lines.slice(1, frontmatterEnd))
    : {}
  const bodyLines = frontmatterEnd > 0
    ? lines.slice(frontmatterEnd + 1)
    : lines
  const bodyStartLine = frontmatterEnd > 0 ? frontmatterEnd + 2 : 1
  const body = bodyLines.join('\n')
  const headingsWithIndex = collectHeadings(bodyLines, bodyStartLine)
  const headings = headingsWithIndex.map(({ bodyIndex: _bodyIndex, ...heading }) => heading)
  const locatorMarkers = collectLocatorMarkers(lines)
  const sections = collectSections(bodyLines, bodyStartLine, headingsWithIndex, locatorMarkers)

  return {
    path: filePath,
    content: normalized,
    frontmatter,
    body,
    headings,
    sections,
    locatorMarkers,
    ofmLinks: collectOfmLinks(normalized),
  }
}

function parseFrontmatter(lines: readonly string[]): Frontmatter {
  const result: Record<string, string> = {}
  for (const line of lines) {
    const separator = line.indexOf(':')
    if (separator <= 0) {
      continue
    }
    const key = line.slice(0, separator).trim()
    if (!isFrontmatterKey(key)) {
      continue
    }
    const rawValue = line.slice(separator + 1)
    result[key] = stripWrappingQuotes(rawValue.trim())
  }
  return result
}

function isFrontmatterKey(value: string): boolean {
  for (const character of value) {
    const code = character.charCodeAt(0)
    const isDigit = code >= 48 && code <= 57
    const isUpper = code >= 65 && code <= 90
    const isLower = code >= 97 && code <= 122
    if (!isDigit && !isUpper && !isLower && character !== '_' && character !== '.' && character !== '-') {
      return false
    }
  }
  return value.length > 0
}

function stripWrappingQuotes(value: string): string {
  if (value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\'')))) {
    return value.slice(1, -1)
  }
  return value
}

function collectHeadings(bodyLines: readonly string[], bodyStartLine: number): readonly HeadingWithBodyIndex[] {
  const headings: HeadingWithBodyIndex[] = []
  bodyLines.forEach((line, bodyIndex) => {
    const heading = parseHeadingLine(line)
    if (heading === undefined) {
      return
    }
    headings.push({
      level: heading.level,
      text: heading.text,
      line: bodyStartLine + bodyIndex,
      bodyIndex,
    })
  })
  return headings
}

function parseHeadingLine(line: string): { readonly level: number, readonly text: string } | undefined {
  if (!line.startsWith('#')) {
    return undefined
  }
  let level = 0
  while (line[level] === '#' && level < 6) {
    level += 1
  }
  if (line[level] !== ' ') {
    return undefined
  }
  const text = stripClosingHashes(line.slice(level + 1))
  return text.length === 0 ? undefined : { level, text }
}

function stripClosingHashes(text: string): string {
  let trimmed = text.trim()
  while (trimmed.endsWith('#')) {
    trimmed = trimmed.slice(0, -1).trimEnd()
  }
  return trimmed
}

function collectLocatorMarkers(lines: readonly string[]): readonly LocatorMarker[] {
  const markers: LocatorMarker[] = []
  lines.forEach((line, index) => {
    const matcher = /\^([A-Z][A-Z0-9]*-\d+)\b/gi
    for (const match of line.matchAll(matcher)) {
      markers.push({
        marker: `^${match[1] ?? ''}`,
        line: index + 1,
        text: line.trim(),
      })
    }
  })
  return markers
}

function collectSections(bodyLines: readonly string[], bodyStartLine: number, headings: readonly HeadingWithBodyIndex[], allMarkers: readonly LocatorMarker[]): readonly Section[] {
  return headings.map((heading, index) => {
    const next = findNextPeerOrParentHeading(headings, index)
    const startBodyIndex = heading.bodyIndex + 1
    const endBodyIndexExclusive = next?.bodyIndex ?? bodyLines.length
    const startLine = bodyStartLine + startBodyIndex
    const endLine = Math.max(startLine, bodyStartLine + endBodyIndexExclusive - 1)
    const text = bodyLines.slice(startBodyIndex, endBodyIndexExclusive).join('\n').trim()

    return {
      heading,
      text,
      startLine,
      endLine,
      locatorMarkers: allMarkers.filter(marker => marker.line >= heading.line && marker.line <= endLine),
    }
  })
}

function findNextPeerOrParentHeading(headings: readonly HeadingWithBodyIndex[], index: number): HeadingWithBodyIndex | undefined {
  const current = headings[index]
  if (current === undefined) {
    return undefined
  }
  for (let nextIndex = index + 1; nextIndex < headings.length; nextIndex += 1) {
    const candidate = headings[nextIndex]
    if (candidate !== undefined && candidate.level <= current.level) {
      return candidate
    }
  }
  return undefined
}

function collectOfmLinks(content: string): readonly OfmLink[] {
  const links: OfmLink[] = []
  for (const match of content.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)) {
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
