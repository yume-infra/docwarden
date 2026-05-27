import type { ContextaModel, RecognitionResult, RecognitionRule, RoleCandidate, TriggerHit } from './domain.js'
import type { MarkdownSurface } from './markdown.js'
import { normalizeToken, roundConfidence } from './markdown-helpers.js'
import { evaluateSignal } from './signal.js'
import { evaluateSurfaceTriggerLine, readHeadingScope } from './trigger.js'

export function recognizeSurface(model: ContextaModel, surface: MarkdownSurface): RecognitionResult {
  const ruleCandidates = model.recognitionRules
    .map(rule => recognitionRuleCandidate(model, surface, rule))
    .filter((candidate): candidate is RoleCandidate => candidate !== undefined)
  const candidates = ruleCandidates.length > 0 ? ruleCandidates : defaultRecognitionCandidates(model, surface)
  const best = [...candidates].sort((a, b) => b.confidence - a.confidence)[0] ?? {
    role: 'unknown',
    basis: ['md surface parsed; no local recognition rule matched'],
    confidence: 0.2,
  }
  const candidateSignalScope = model.signals.map(signal => evaluateSignal(signal, surface))

  return {
    target: surface.path,
    recognizedRole: best.role,
    basis: best.basis,
    confidence: roundConfidence(best.confidence),
    candidateSignalScope,
  }
}

function recognitionRuleCandidate(model: ContextaModel, surface: MarkdownSurface, rule: RecognitionRule): RoleCandidate | undefined {
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
    return undefined
  }

  return {
    role,
    basis: [
      `local recognition rule: ${rule.id}`,
      ...triggerHits.map(hit => hit.evidence),
      ...rule.basis,
    ],
    confidence: rule.confidence,
  }
}

function evaluateRecognitionTriggerLine(model: ContextaModel, surface: MarkdownSurface, rawLine: string, sectionScope: readonly string[] | undefined): TriggerHit {
  const raw = rawLine.replace(/^-\s+/, '').replace(/^`(.+)`$/, '$1').trim()
  if (raw === 'frontmatter.kind is local kind') {
    const kind = surface.frontmatter.kind
    const matched = kind !== undefined && model.localKinds.has(normalizeToken(kind))
    return {
      raw,
      known: true,
      matched,
      evidence: matched
        ? `frontmatter.kind ${kind} is defined by local .contexta`
        : `frontmatter.kind ${kind ?? 'missing'} is not defined by local .contexta`,
      context: undefined,
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
        ? `local .contexta defines kind ${expected}`
        : `local .contexta does not define kind ${expected}`,
      context: undefined,
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

function defaultRecognitionCandidates(model: ContextaModel, surface: MarkdownSurface): readonly RoleCandidate[] {
  const kind = surface.frontmatter.kind
  if (kind === undefined || !model.localKinds.has(normalizeToken(kind))) {
    return []
  }
  return [{
    role: kind,
    basis: [
      'fallback recognition interpreter',
      `frontmatter.kind ${kind} is defined by local .contexta`,
    ],
    confidence: 0.65,
  }]
}
