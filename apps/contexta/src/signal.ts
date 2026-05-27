import type { LintSignal, RecognitionResult, SignalCandidate, SignalDefinition, TriggerHit } from './domain.js'
import type { MarkdownSurface } from './markdown.js'
import { findSection, roundConfidence } from './markdown-helpers.js'
import { evaluateSurfaceTriggerLine, readHeadingScope } from './trigger.js'

export function evaluateSignal(signal: SignalDefinition, surface: MarkdownSurface): SignalCandidate {
  const triggerHits: TriggerHit[] = []
  let sectionScope: readonly string[] | undefined

  for (const rawLine of signal.triggerLines) {
    const hit = evaluateSurfaceTriggerLine(rawLine, surface, sectionScope)
    triggerHits.push(hit)
    const headingScope = readHeadingScope(rawLine, surface)
    if (headingScope.length > 0) {
      sectionScope = headingScope
    }
  }

  const known = triggerHits.filter(hit => hit.known)
  const matched = known.filter(hit => hit.matched).length
  const total = known.length
  const applicable = total > 0 && matched === total && triggerHits.every(hit => hit.known)

  return {
    signal: signal.id,
    contextaPath: signal.contextaPath,
    applicable,
    matched,
    total,
    triggerHits,
    basis: signal.basis,
    lossModel: signal.lossModel,
    confidence: roundConfidence(total === 0 ? 0 : matched / total),
  }
}

export function signalFromCandidate(surface: MarkdownSurface, recognition: RecognitionResult, candidate: SignalCandidate): LintSignal {
  const context = candidate.triggerHits.find(hit => hit.context !== undefined)?.context
  const section = context === undefined ? undefined : findSection(surface, context)
  const locator = section?.locatorMarkers[0]?.marker ?? surface.locatorMarkers[0]?.marker

  return {
    signal: candidate.signal,
    target: recognition.target,
    context,
    locator,
    evidence: candidate.triggerHits.filter(hit => hit.matched).map(hit => hit.evidence),
    basis: candidate.basis,
    lossModel: candidate.lossModel,
    confidence: roundConfidence(Math.min(recognition.confidence, candidate.confidence)),
  }
}
