import type { PrimitiveDiagnostic, PrimitiveSkillExportDraft, PrimitiveSkillResult, RecognitionRunResult } from './domain.js'
import { collectOfmLinksFromText, extractListItems, extractListItemsAfterLabel, findSection, firstNonEmptyLine, includesNormalized, normalizeToken, readField } from './markdown-helpers.js'

const defaultRequiredSections = [
  'Drift Pressure',
  'Intervention',
  'Activation',
  'Judgment Surface',
  'Deterministic Boundary',
  'Review Gate',
  'Export Shape',
  'Semantic Basis',
  'Validation',
] as const
const requiredSemanticBasisTargets = [
  'primitives/modules/concept/skill-primitive',
  'primitives/modules/concept/primitive-creator',
] as const

export function analyzePrimitiveSkill(run: RecognitionRunResult): PrimitiveSkillResult {
  const material = run.model.skillPrimitiveMaterial
  const template = material.find(document => document.isomorphPath.endsWith('/templates/skill-primitive.md'))
  const requiredSections = template === undefined
    ? [...defaultRequiredSections]
    : template.surface.headings
        .filter(heading => heading.level === 2)
        .map(heading => heading.text)
        .filter(heading => !['Diagnostics'].includes(heading))
  const presentSections = run.surface.headings
    .filter(heading => heading.level === 2)
    .map(heading => heading.text)
  const missingSections = requiredSections.filter(section => !includesNormalized(presentSections, section))
  const driftPressureSection = findSection(run.surface, 'Drift Pressure')
  const interventionSection = findSection(run.surface, 'Intervention')
  const activationSection = findSection(run.surface, 'Activation')
  const judgmentSurfaceSection = findSection(run.surface, 'Judgment Surface')
  const deterministicBoundarySection = findSection(run.surface, 'Deterministic Boundary')
  const reviewGateSection = findSection(run.surface, 'Review Gate')
  const exportShapeSection = findSection(run.surface, 'Export Shape')
  const semanticBasisSection = findSection(run.surface, 'Semantic Basis')
  const referencesSection = findSection(run.surface, 'References')
  const scriptsSection = findSection(run.surface, 'Scripts')
  const assetsSection = findSection(run.surface, 'Assets')
  const validationSection = findSection(run.surface, 'Validation')
  const driftPressureText = driftPressureSection?.text ?? ''
  const interventionText = interventionSection?.text ?? ''
  const activationText = activationSection?.text ?? ''
  const exportShapeText = exportShapeSection?.text ?? ''
  const driftPressure = firstNonEmptyLine(driftPressureText)
  const pressureScenarios = withFallbackList(
    extractListItemsAfterLabel(driftPressureText, 'Pressure Scenarios'),
    extractListItems(driftPressureText),
  )
  const intervention = firstNonEmptyLine(interventionText)
  const interventionMoves = extractListItems(interventionText)
  const activation = readField(activationText, 'Description') ?? firstNonEmptyLine(activationText)
  const activationTriggers = withFallbackList(
    extractListItemsAfterLabel(activationText, 'Triggers'),
    extractListItemsAfterLabel(activationText, 'Trigger Examples'),
  )
  const activationExclusions = extractListItemsAfterLabel(activationText, 'Exclusions')
  const judgmentSurface = extractListItems(judgmentSurfaceSection?.text ?? '')
  const deterministicBoundary = extractListItems(deterministicBoundarySection?.text ?? '')
  const reviewGate = extractListItems(reviewGateSection?.text ?? '')
  const exportShape = extractListItems(exportShapeText)
  const semanticBasisLinks = collectOfmLinksFromText(semanticBasisSection?.text ?? '').map(link => link.target)
  const references = extractListItems(referencesSection?.text ?? '')
  const scripts = extractListItems(scriptsSection?.text ?? '')
  const assets = extractListItems(assetsSection?.text ?? '')
  const validation = extractListItems(validationSection?.text ?? '')
  const diagnostics: PrimitiveDiagnostic[] = []
  const localMaterialTargets = new Set(run.model.documents.map(document => stripMdExtension(document.isomorphPath)))

  if (material.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'local .isomorph has no skill primitive material',
    })
  }
  if (run.surface.frontmatter.kind !== 'skill-primitive') {
    diagnostics.push({
      severity: 'warning',
      message: 'target frontmatter.kind is not skill-primitive',
    })
  }
  for (const missingSection of missingSections) {
    diagnostics.push({
      severity: 'warning',
      message: `missing skill primitive section: ${missingSection}`,
    })
  }
  if (driftPressure === undefined) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing drift pressure material',
    })
  }
  if (intervention === undefined) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing intervention material',
    })
  }
  if (activation === undefined) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing activation material for future skill description',
    })
  }
  if (judgmentSurface.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing judgment surface items for skill behavior',
    })
  }
  if (deterministicBoundary.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing deterministic boundary items for CLI/script guardrails',
    })
  }
  if (reviewGate.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing review gate items for user intervention',
    })
  }
  if (exportShape.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing export shape material for future SKILL.md compiler',
    })
  }
  if (validation.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing validation items for skill export',
    })
  }
  addPlaceholderDiagnostic(diagnostics, 'drift pressure', driftPressure)
  addPlaceholderDiagnostic(diagnostics, 'pressure scenarios', pressureScenarios)
  addPlaceholderDiagnostic(diagnostics, 'intervention', intervention)
  addPlaceholderDiagnostic(diagnostics, 'intervention moves', interventionMoves)
  addPlaceholderDiagnostic(diagnostics, 'activation', activation)
  addPlaceholderDiagnostic(diagnostics, 'activation triggers', activationTriggers)
  addPlaceholderDiagnostic(diagnostics, 'activation exclusions', activationExclusions)
  addPlaceholderDiagnostic(diagnostics, 'judgment surface', judgmentSurface)
  addPlaceholderDiagnostic(diagnostics, 'deterministic boundary', deterministicBoundary)
  addPlaceholderDiagnostic(diagnostics, 'review gate', reviewGate)
  addPlaceholderDiagnostic(diagnostics, 'export shape', exportShape)
  addPlaceholderDiagnostic(diagnostics, 'validation', validation)
  const missingRequiredSemanticBasis = requiredSemanticBasisTargets.filter(target => !semanticBasisLinks.includes(target))
  for (const target of missingRequiredSemanticBasis) {
    diagnostics.push({
      severity: 'warning',
      message: `missing semantic basis link: ${target}`,
    })
  }
  const brokenSemanticBasisLinks: string[] = []
  for (const target of semanticBasisLinks) {
    if (!localMaterialTargets.has(stripMdExtension(target))) {
      brokenSemanticBasisLinks.push(target)
      diagnostics.push({
        severity: 'warning',
        message: `broken semantic basis link: ${target}`,
      })
    }
  }
  if (run.recognition.recognizedRole !== 'skill-primitive') {
    diagnostics.push({
      severity: 'info',
      message: `recognition result is ${run.recognition.recognizedRole}`,
    })
  }

  const missingForExport = [
    missingOrPlaceholder(driftPressure) || pressureScenarios.length === 0 || hasAnyPlaceholder(pressureScenarios) ? 'drift-pressure' : undefined,
    missingOrPlaceholder(intervention) || interventionMoves.length === 0 || hasAnyPlaceholder(interventionMoves) ? 'intervention' : undefined,
    missingOrPlaceholder(activation) ? 'activation' : undefined,
    judgmentSurface.length === 0 || hasAnyPlaceholder(judgmentSurface) ? 'judgment-surface' : undefined,
    deterministicBoundary.length === 0 || hasAnyPlaceholder(deterministicBoundary) ? 'deterministic-boundary' : undefined,
    reviewGate.length === 0 || hasAnyPlaceholder(reviewGate) ? 'review-gate' : undefined,
    exportShape.length === 0 || hasAnyPlaceholder(exportShape) ? 'export-shape' : undefined,
    semanticBasisLinks.length === 0 || missingRequiredSemanticBasis.length > 0 || brokenSemanticBasisLinks.length > 0 ? 'semantic-basis' : undefined,
    validation.length === 0 || hasAnyPlaceholder(validation) ? 'validation' : undefined,
  ].filter((item): item is string => item !== undefined)
  const status = diagnostics.some(diagnostic => diagnostic.severity === 'warning') ? 'needs-work' : 'ready'
  const skillName = normalizeToken(run.surface.headings.find(heading => heading.level === 1)?.text ?? run.recognition.recognizedRole)
  const exportDraft = makeExportDraft({
    activation,
    assets,
    deterministicBoundary,
    driftPressure,
    exportShape,
    intervention,
    judgmentSurface,
    missingForExport,
    pressureScenarios,
    references,
    reviewGate,
    scripts,
    semanticBasisLinks,
    skillName,
    status,
    target: run.recognition.target,
    validation,
  })

  return {
    root: run.root,
    target: run.recognition.target,
    recognizedRole: run.recognition.recognizedRole,
    status,
    model: {
      driftPressure,
      pressureScenarios,
      intervention,
      interventionMoves,
      activation,
      activationTriggers,
      activationExclusions,
      judgmentSurface,
      deterministicBoundary,
      reviewGate,
      exportShape,
      confirmationGates: reviewGate,
      outputContract: exportShape,
      antiPatterns: [],
      semanticBasisLinks,
      references,
      scripts,
      assets,
      progressiveLoading: extractListItemsAfterLabel(exportShapeText, 'Progressive Loading'),
      validation,
      exportPosition: exportShape[0],
      futureSkillExportRequirements: exportShape,
    },
    plan: {
      compiler: 'draft-skill-v0',
      exportable: missingForExport.length === 0 && status === 'ready',
      missingForExport,
      futureSkillExportRequirements: exportShape,
    },
    exportDraft,
    sourceMaterial: material.map(document => document.isomorphPath).sort(),
    requiredSections,
    presentSections,
    exportPosition: {
      present: exportShape.length > 0,
      excerpt: exportShape[0],
    },
    diagnostics,
  }
}

function makeExportDraft(input: {
  readonly skillName: string
  readonly driftPressure: string | undefined
  readonly pressureScenarios: readonly string[]
  readonly intervention: string | undefined
  readonly activation: string | undefined
  readonly judgmentSurface: readonly string[]
  readonly deterministicBoundary: readonly string[]
  readonly reviewGate: readonly string[]
  readonly exportShape: readonly string[]
  readonly references: readonly string[]
  readonly scripts: readonly string[]
  readonly assets: readonly string[]
  readonly semanticBasisLinks: readonly string[]
  readonly validation: readonly string[]
  readonly missingForExport: readonly string[]
  readonly status: 'ready' | 'needs-work'
  readonly target: string
}): PrimitiveSkillExportDraft {
  return {
    artifact: 'codex-skill',
    skillName: input.skillName,
    description: input.activation,
    readiness: input.status === 'ready' && input.missingForExport.length === 0 ? 'ready' : 'blocked',
    missingForExport: input.missingForExport,
    frontmatter: {
      name: input.skillName,
      description: input.activation,
    },
    bodyOutline: [
      'Drift Pressure',
      'Intervention',
      'Activation',
      ...(input.judgmentSurface.length === 0 ? [] : ['Judgment Surface']),
      ...(input.deterministicBoundary.length === 0 ? [] : ['Deterministic Boundary']),
      ...(input.reviewGate.length === 0 ? [] : ['Review Gate']),
      'Semantic Basis',
      ...(input.validation.length === 0 ? [] : ['Validation']),
    ],
    driftPressure: input.driftPressure,
    pressureScenarios: input.pressureScenarios,
    intervention: input.intervention,
    judgmentSurface: input.judgmentSurface,
    deterministicBoundary: input.deterministicBoundary,
    reviewGate: input.reviewGate,
    exportShape: input.exportShape,
    antiPatterns: [],
    resources: {
      references: input.references,
      scripts: input.scripts,
      assets: input.assets,
    },
    progressiveLoading: [],
    validation: input.validation,
    trace: [
      input.target,
      ...input.semanticBasisLinks,
    ],
  }
}

function stripMdExtension(target: string): string {
  return target.endsWith('.md') ? target.slice(0, -'.md'.length) : target
}

function withFallbackList(primary: readonly string[], fallback: readonly string[]): readonly string[] {
  return primary.length > 0 ? primary : fallback
}

function addPlaceholderDiagnostic(diagnostics: PrimitiveDiagnostic[], label: string, value: string | readonly string[] | undefined): void {
  if (typeof value === 'string') {
    if (hasPlaceholder(value)) {
      diagnostics.push({
        severity: 'warning',
        message: `${label} contains placeholder material`,
      })
    }
    return
  }
  if (value !== undefined && hasAnyPlaceholder(value)) {
    diagnostics.push({
      severity: 'warning',
      message: `${label} contains placeholder material`,
    })
  }
}

function missingOrPlaceholder(value: string | undefined): boolean {
  return value === undefined || hasPlaceholder(value)
}

function hasAnyPlaceholder(values: readonly string[]): boolean {
  return values.some(value => hasPlaceholder(value))
}

function hasPlaceholder(value: string | undefined): boolean {
  return value !== undefined && /<[^>]+>/.test(value)
}
