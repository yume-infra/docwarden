import type { ContextaDiagnostic, LintSignal, MarkdownSurface, RecognitionResult, SignalCandidate, SignalDefinition, TriggerHit } from './domain.js'
import { findSection, roundConfidence } from './markdown-helpers.js'
import { evaluateSurfaceTriggerLine, readHeadingScope } from './trigger.js'

export function evaluateSignal(signal: SignalDefinition, surface: MarkdownSurface, recognition: Pick<RecognitionResult, 'recognizedRole'>): SignalCandidate {
  const triggerHits: TriggerHit[] = []
  let sectionScope: readonly string[] | undefined

  for (const rawLine of signal.triggerLines) {
    const hit = evaluateSignalTriggerLine(rawLine, surface, recognition, sectionScope)
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
  const diagnostics = signalDiagnostics(signal, triggerHits)

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
    applicabilityBasis: applicabilityBasis(triggerHits),
    diagnostics,
  }
}

function evaluateSignalTriggerLine(rawLine: string, surface: MarkdownSurface, recognition: Pick<RecognitionResult, 'recognizedRole'>, sectionScope: readonly string[] | undefined): TriggerHit {
  const raw = rawLine.replace(/^-\s+/, '').replace(/^`(.+)`$/, '$1').trim()
  const roleEquals = /^recognized role == ([\w.-]+)$/.exec(raw)
  if (roleEquals !== null) {
    const expected = roleEquals[1] ?? ''
    const matched = recognition.recognizedRole === expected
    return {
      raw,
      known: true,
      matched,
      evidence: matched
        ? `recognized role == ${expected}`
        : `recognized role is ${recognition.recognizedRole}`,
      context: undefined,
      source: 'recognition',
    }
  }

  return evaluateSurfaceTriggerLine(raw, surface, sectionScope)
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

function signalDiagnostics(signal: SignalDefinition, triggerHits: readonly TriggerHit[]): readonly ContextaDiagnostic[] {
  const diagnostics: ContextaDiagnostic[] = []

  if (signal.lossModel.trim().length === 0) {
    diagnostics.push({
      severity: 'warning',
      code: 'missing-signal-loss-model',
      message: `signal is missing Loss Model: ${signal.id}`,
      target: signal.contextaPath,
      evidence: '## Loss Model not found',
    })
  }

  for (const hit of triggerHits) {
    if (!hit.known) {
      diagnostics.push({
        severity: 'warning',
        code: 'unparsed-signal-trigger',
        message: `signal trigger could not be parsed: ${signal.id}`,
        target: signal.contextaPath,
        evidence: hit.raw,
      })
    }
  }

  return diagnostics
}

function applicabilityBasis(triggerHits: readonly TriggerHit[]): SignalCandidate['applicabilityBasis'] {
  const known = triggerHits.filter(hit => hit.known)
  const hasRecognition = known.some(hit => hit.source === 'recognition')
  const hasSurface = known.some(hit => hit.source === 'surface')
  if (hasRecognition && hasSurface) {
    return 'mixed'
  }
  if (hasRecognition) {
    return 'recognition-role'
  }
  if (hasSurface) {
    return 'surface-feature'
  }
  return 'none'
}
