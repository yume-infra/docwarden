import type { IsomorphModel, MarkdownSurface, RecognitionResult, RecognitionRule, RoleCandidate, TriggerHit } from './domain.js'
import { Effect } from 'effect'
import { IsomorphConfigError } from './errors.js'
import { normalizeToken, roundConfidence } from './markdown-helpers.js'
import { evaluateSurfaceTriggerLine, readHeadingScope } from './trigger.js'

export function recognizeSurfaceEffect(model: IsomorphModel, surface: MarkdownSurface): Effect.Effect<Omit<RecognitionResult, 'candidateSignalScope'>, IsomorphConfigError> {
  return Effect.gen(function* () {
    if (model.recognitionRules.length === 0) {
      return yield* Effect.fail(new IsomorphConfigError({
        message: 'missing local recognition authority: no recognition primitive rule found in .isomorph',
      }))
    }

    const evaluatedRules = model.recognitionRules.map(rule => recognitionRuleCandidate(model, surface, rule))
    const invalidHits = evaluatedRules.flatMap(rule => rule.triggerHits.filter(hit => !hit.known).map(hit => ({
      rule,
      hit,
    })))
    if (invalidHits.length > 0) {
      const first = invalidHits[0]
      return yield* Effect.fail(new IsomorphConfigError({
        message: `invalid recognition trigger in ${first?.rule.rule.isomorphPath}#${first?.rule.rule.id}: ${first?.hit.raw}`,
      }))
    }

    const candidates = evaluatedRules
      .map(rule => rule.candidate)
      .filter((candidate): candidate is RoleCandidate => candidate !== undefined)

    const best = [...candidates].sort((a, b) => b.confidence - a.confidence)[0] ?? {
      role: 'unknown',
      basis: ['md surface parsed; local recognition authority found no matching role'],
      confidence: 0.2,
    }

    return {
      target: surface.path,
      recognizedRole: best.role,
      basis: best.basis,
      confidence: roundConfidence(best.confidence),
      features: recognitionFeatures(surface),
      diagnostics: [],
    }
  })
}

function recognitionRuleCandidate(model: IsomorphModel, surface: MarkdownSurface, rule: RecognitionRule): {
  readonly rule: RecognitionRule
  readonly triggerHits: readonly TriggerHit[]
  readonly candidate: RoleCandidate | undefined
} {
  const triggerHits: TriggerHit[] = []
  let sectionScope: readonly string[] | undefined

  for (const rawLine of rule.triggerLines) {
    const hit = evaluateRecognitionTriggerLine(model, surface, rawLine, sectionScope)
    triggerHits.push(hit)
    const headingScope = readHeadingScope(rawLine, surface)
    if (headingScope.length > 0) {
      sectionScope = headingScope
    }
  }

  const known = triggerHits.filter(hit => hit.known)
  const matched = known.filter(hit => hit.matched).length
  const applicable = known.length > 0 && matched === known.length && triggerHits.every(hit => hit.known)
  const role = resolveRuleRole(rule.role, surface)

  if (!applicable || role === undefined) {
    return {
      rule,
      triggerHits,
      candidate: undefined,
    }
  }

  return {
    rule,
    triggerHits,
    candidate: {
      role,
      basis: [
        `local recognition rule: ${rule.id}`,
        ...triggerHits.map(hit => hit.evidence),
        ...rule.basis,
      ],
      confidence: rule.confidence,
    },
  }
}

export function evaluateRecognitionTriggerLine(model: IsomorphModel, surface: MarkdownSurface, rawLine: string, sectionScope: readonly string[] | undefined): TriggerHit {
  const raw = rawLine.replace(/^-\s+/, '').replace(/^`(.+)`$/, '$1').trim()
  if (raw === 'frontmatter.kind is local kind') {
    const kind = surface.frontmatter.kind
    const matched = kind !== undefined && model.localKinds.has(normalizeToken(kind))
    return {
      raw,
      known: true,
      matched,
      evidence: matched
        ? `frontmatter.kind ${kind} is defined by local .isomorph`
        : `frontmatter.kind ${kind ?? 'missing'} is not defined by local .isomorph`,
      context: undefined,
      source: 'surface',
    }
  }

  const localKind = /^local kind exists ([\w.-]+)$/.exec(raw)
  if (localKind !== null) {
    const expected = localKind[1] ?? ''
    const matched = model.localKinds.has(normalizeToken(expected))
    return {
      raw,
      known: true,
      matched,
      evidence: matched
        ? `local .isomorph defines kind ${expected}`
        : `local .isomorph does not define kind ${expected}`,
      context: undefined,
      source: 'surface',
    }
  }

  return evaluateSurfaceTriggerLine(raw, surface, sectionScope)
}

function resolveRuleRole(role: string, surface: MarkdownSurface): string | undefined {
  if (role === '$frontmatter.kind') {
    return surface.frontmatter.kind
  }
  return role
}

function recognitionFeatures(surface: MarkdownSurface): RecognitionResult['features'] {
  return {
    path: surface.path,
    frontmatter: surface.frontmatter,
    headings: surface.headings.map(heading => heading.text),
    locatorMarkers: surface.locatorMarkers.map(marker => marker.marker),
    ofmLinks: surface.ofmLinks.map(link => link.target),
  }
}
