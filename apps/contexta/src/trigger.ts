import type { TriggerHit } from './domain.js'
import type { MarkdownSurface, Section } from './markdown.js'
import { normalizeToken, splitTerms, stripCode } from './markdown-helpers.js'

export function evaluateSurfaceTriggerLine(rawLine: string, surface: MarkdownSurface, sectionScope: readonly string[] | undefined): TriggerHit {
  const raw = stripCode(stripListMarker(rawLine))
  const frontmatterMatch = /^frontmatter\.([\w.-]+)\s*==\s*([\w.-]+)$/.exec(raw)
  if (frontmatterMatch !== null) {
    const key = frontmatterMatch[1] ?? ''
    const expected = frontmatterMatch[2] ?? ''
    const actual = surface.frontmatter[key]
    return {
      raw,
      known: true,
      matched: actual === expected,
      evidence: actual === expected
        ? `frontmatter.${key} == ${expected}`
        : `frontmatter.${key} is ${actual ?? 'missing'}`,
      context: undefined,
    }
  }

  const headingMatch = /^heading in \[(.+)\]$/.exec(raw)
  if (headingMatch !== null) {
    const expected = splitTerms(headingMatch[1] ?? '')
    const matchedHeadings = surface.headings
      .filter(heading => expected.some(term => normalizeToken(term) === normalizeToken(heading.text)))
      .map(heading => heading.text)
    return {
      raw,
      known: true,
      matched: matchedHeadings.length > 0,
      evidence: matchedHeadings.length > 0
        ? `heading matched ${matchedHeadings.join(', ')}`
        : `heading missing ${expected.join(', ')}`,
      context: matchedHeadings[0],
    }
  }

  const sectionContains = /^section contains (.+)$/.exec(raw)
  if (sectionContains !== null) {
    const terms = splitTerms(sectionContains[1] ?? '')
    const sections = sectionsInScope(surface.sections, sectionScope)
    const hit = findSectionContaining(sections, terms)
    return {
      raw,
      known: true,
      matched: hit !== undefined,
      evidence: hit === undefined
        ? `section missing terms ${terms.join(', ')}`
        : `section ${hit.heading.text} contains ${hit.term}`,
      context: hit?.heading.text,
    }
  }

  const bodyContains = /^body contains (.+)$/.exec(raw)
  if (bodyContains !== null) {
    const bodyExpression = bodyContains[1] ?? ''
    if (bodyExpression === 'list items') {
      const matched = /^[ \t]*[-*+]\s+/m.test(surface.body)
      return {
        raw,
        known: true,
        matched,
        evidence: matched ? 'body contains list items' : 'body has no list items',
        context: undefined,
      }
    }
    const terms = splitTerms(bodyExpression)
    const hit = findTerm(surface.body, terms)
    return {
      raw,
      known: true,
      matched: hit !== undefined,
      evidence: hit === undefined ? `body missing terms ${terms.join(', ')}` : `body contains ${hit}`,
      context: undefined,
    }
  }

  const bodyMissing = /^body missing (.+)$/.exec(raw)
  if (bodyMissing !== null) {
    const terms = splitTerms(bodyMissing[1] ?? '')
    const hit = findTerm(`${surface.body}\n${surface.headings.map(heading => heading.text).join('\n')}`, terms)
    return {
      raw,
      known: true,
      matched: hit === undefined,
      evidence: hit === undefined ? `body missing ${terms.join(', ')}` : `body contains ${hit}`,
      context: undefined,
    }
  }

  const pathMatches = /^path matches (.+)$/.exec(raw)
  if (pathMatches !== null) {
    const glob = pathMatches[1] ?? ''
    const matched = pathMatchesGlob(surface.path, glob)
    return {
      raw,
      known: true,
      matched,
      evidence: matched ? `path matches ${glob}` : `path does not match ${glob}`,
      context: undefined,
    }
  }

  const pathContains = /^path contains (.+)$/.exec(raw)
  if (pathContains !== null) {
    const fragment = stripWrappingSlash(pathContains[1] ?? '')
    const matched = surface.path.includes(fragment)
    return {
      raw,
      known: true,
      matched,
      evidence: matched ? `path contains ${fragment}` : `path does not contain ${fragment}`,
      context: undefined,
    }
  }

  const directoryName = /^directory name == ([\w.-]+)$/.exec(raw)
  if (directoryName !== null) {
    const expected = directoryName[1] ?? ''
    const directories = surface.path.split('/').slice(0, -1)
    const matched = directories.includes(expected)
    return {
      raw,
      known: true,
      matched,
      evidence: matched ? `directory name == ${expected}` : `directory name is not ${expected}`,
      context: undefined,
    }
  }

  if (raw === 'text states example proves kind or content type') {
    const matched = /example\b.+\bproves\b.+\b(?:kind|content type)\b/i.test(surface.content)
      || /\b(?:kind|content type)\b.+\bbecause\b.+\bexample\b/i.test(surface.content)
    return {
      raw,
      known: true,
      matched,
      evidence: matched
        ? 'text states example proves kind or content type'
        : 'text does not state example proves kind or content type',
      context: undefined,
    }
  }

  return {
    raw,
    known: false,
    matched: false,
    evidence: `unparsed trigger: ${raw}`,
    context: undefined,
  }
}

export function readHeadingScope(rawLine: string, surface: MarkdownSurface): readonly string[] {
  const raw = stripCode(stripListMarker(rawLine))
  const headingMatch = /^heading in \[(.+)\]$/.exec(raw)
  if (headingMatch === null) {
    return []
  }
  const expected = splitTerms(headingMatch[1] ?? '')
  return surface.headings
    .filter(heading => expected.some(term => normalizeToken(term) === normalizeToken(heading.text)))
    .map(heading => heading.text)
}

function sectionsInScope(sections: readonly Section[], sectionScope: readonly string[] | undefined): readonly Section[] {
  if (sectionScope === undefined || sectionScope.length === 0) {
    return sections
  }
  return sections.filter(section =>
    sectionScope.some(scope => normalizeToken(scope) === normalizeToken(section.heading.text)))
}

function findSectionContaining(sections: readonly Section[], terms: readonly string[]): { readonly heading: Section['heading'], readonly term: string } | undefined {
  for (const section of sections) {
    const term = findTerm(section.text, terms)
    if (term !== undefined) {
      return {
        heading: section.heading,
        term,
      }
    }
  }
  return undefined
}

function findTerm(text: string, terms: readonly string[]): string | undefined {
  for (const term of terms) {
    const normalizedTerm = term.trim()
    if (normalizedTerm.length === 0) {
      continue
    }
    const pattern = new RegExp(`\\b${escapeRegExp(normalizedTerm)}\\b`, 'i')
    if (pattern.test(text)) {
      return normalizedTerm
    }
  }
  return undefined
}

function pathMatchesGlob(targetPath: string, glob: string): boolean {
  const candidates = targetPath.startsWith('.contexta/')
    ? [targetPath.slice('.contexta/'.length), targetPath]
    : [targetPath, `.contexta/${targetPath}`]
  const pattern = globToRegExp(glob)
  return candidates.some(candidate => pattern.test(candidate))
}

function globToRegExp(glob: string): RegExp {
  let source = '^'
  for (const character of glob) {
    if (character === '*') {
      source += '[^/]*'
    }
    else {
      source += escapeRegExp(character)
    }
  }
  source += '$'
  return new RegExp(source)
}

function stripListMarker(line: string): string {
  return line.replace(/^-\s+/, '').trim()
}

function stripWrappingSlash(value: string): string {
  return value.replace(/^\/+/, '').replace(/\/+$/, '')
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
