import type { PrimitiveDiagnostic, PrimitiveSkillExportDraft, PrimitiveSkillResult, RecognitionRunResult } from './domain.js'
import { collectOfmLinksFromText, extractListItems, extractListItemsAfterLabel, findSection, firstNonEmptyLine, includesNormalized, normalizeToken, readField } from './markdown-helpers.js'

const defaultRequiredSections = [
  'Capability',
  'Trigger',
  'Soft Boundary',
  'Hard Boundary',
  'Workflow',
  'Export Shape',
  'Semantic Basis',
  'Validation',
] as const
const requiredSemanticBasisTargets = [
  'contract/skill-primitive/concept',
  'contract/primitive-creator/concept',
] as const

export function analyzePrimitiveSkill(run: RecognitionRunResult): PrimitiveSkillResult {
  const material = run.model.skillPrimitiveMaterial
  const template = material.find(document => document.isomorphPath === 'contract/skill-primitive/template.md')
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
  const capabilitySection = findSection(run.surface, 'Capability')
  const triggerSection = findSection(run.surface, 'Trigger')
  const softBoundarySection = findSection(run.surface, 'Soft Boundary')
  const hardBoundarySection = findSection(run.surface, 'Hard Boundary')
  const workflowSection = findSection(run.surface, 'Workflow')
  const exportShapeSection = findSection(run.surface, 'Export Shape')
  const semanticBasisSection = findSection(run.surface, 'Semantic Basis')
  const referencesSection = findSection(run.surface, 'References')
  const scriptsSection = findSection(run.surface, 'Scripts')
  const assetsSection = findSection(run.surface, 'Assets')
  const validationSection = findSection(run.surface, 'Validation')
  const capabilityText = capabilitySection?.text ?? ''
  const triggerText = triggerSection?.text ?? ''
  const exportShapeText = exportShapeSection?.text ?? ''
  const capability = readField(capabilityText, 'Summary') ?? firstNonEmptyLine(capabilityText)
  const pressureScenarios = withFallbackList(
    extractListItemsAfterLabel(capabilityText, 'Pressure Scenarios'),
    extractListItemsAfterLabel(capabilityText, 'Pressure'),
  )
  const triggerDescription = readField(triggerText, 'Description') ?? firstNonEmptyLine(triggerText)
  const triggerExamples = withFallbackList(
    extractListItemsAfterLabel(triggerText, 'Triggers'),
    extractListItemsAfterLabel(triggerText, 'Trigger Examples'),
  )
  const triggerExclusions = extractListItemsAfterLabel(triggerText, 'Exclusions')
  const softBoundary = extractListItems(softBoundarySection?.text ?? '')
  const hardBoundary = extractListItems(hardBoundarySection?.text ?? '')
  const workflow = extractListItems(workflowSection?.text ?? '')
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
  if (capability === undefined) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing capability material',
    })
  }
  if (triggerDescription === undefined) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing trigger description material for future skill description',
    })
  }
  if (triggerExamples.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing trigger examples for trigger boundary',
    })
  }
  if (softBoundary.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing soft boundary items for skill behavior',
    })
  }
  if (hardBoundary.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing hard boundary items for CLI/script guardrails',
    })
  }
  if (workflow.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing workflow items for skill behavior',
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
  addPlaceholderDiagnostic(diagnostics, 'capability', capability)
  addPlaceholderDiagnostic(diagnostics, 'pressure scenarios', pressureScenarios)
  addPlaceholderDiagnostic(diagnostics, 'trigger description', triggerDescription)
  addPlaceholderDiagnostic(diagnostics, 'trigger examples', triggerExamples)
  addPlaceholderDiagnostic(diagnostics, 'trigger exclusions', triggerExclusions)
  addPlaceholderDiagnostic(diagnostics, 'soft boundary', softBoundary)
  addPlaceholderDiagnostic(diagnostics, 'hard boundary', hardBoundary)
  addPlaceholderDiagnostic(diagnostics, 'workflow', workflow)
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
    missingOrPlaceholder(capability) || pressureScenarios.length === 0 || hasAnyPlaceholder(pressureScenarios) ? 'capability' : undefined,
    missingOrPlaceholder(triggerDescription) || triggerExamples.length === 0 || hasAnyPlaceholder(triggerExamples) ? 'trigger' : undefined,
    softBoundary.length === 0 || hasAnyPlaceholder(softBoundary) ? 'soft-boundary' : undefined,
    hardBoundary.length === 0 || hasAnyPlaceholder(hardBoundary) ? 'hard-boundary' : undefined,
    workflow.length === 0 || hasAnyPlaceholder(workflow) ? 'workflow' : undefined,
    exportShape.length === 0 || hasAnyPlaceholder(exportShape) ? 'export-shape' : undefined,
    semanticBasisLinks.length === 0 || missingRequiredSemanticBasis.length > 0 || brokenSemanticBasisLinks.length > 0 ? 'semantic-basis' : undefined,
    validation.length === 0 || hasAnyPlaceholder(validation) ? 'validation' : undefined,
  ].filter((item): item is string => item !== undefined)
  const status = diagnostics.some(diagnostic => diagnostic.severity === 'warning') ? 'needs-work' : 'ready'
  const skillName = normalizeToken(run.surface.headings.find(heading => heading.level === 1)?.text ?? run.recognition.recognizedRole)
  const exportDraft = makeExportDraft({
    assets,
    capability,
    exportShape,
    hardBoundary,
    missingForExport,
    pressureScenarios,
    references,
    scripts,
    semanticBasisLinks,
    skillName,
    softBoundary,
    status,
    target: run.recognition.target,
    triggerDescription,
    triggerExamples,
    triggerExclusions,
    validation,
    workflow,
  })

  return {
    root: run.root,
    target: run.recognition.target,
    recognizedRole: run.recognition.recognizedRole,
    status,
    model: {
      capability,
      pressureScenarios,
      triggerDescription,
      triggerExamples,
      triggerExclusions,
      softBoundary,
      hardBoundary,
      workflow,
      exportShape,
      antiPatterns: [],
      semanticBasisLinks,
      references,
      scripts,
      assets,
      progressiveLoading: extractListItemsAfterLabel(exportShapeText, 'Progressive Loading'),
      validation,
      exportPosition: exportShape[0],
      exportRequirements: exportShape,
    },
    plan: {
      compiler: 'draft-skill-v0',
      exportable: missingForExport.length === 0 && status === 'ready',
      missingForExport,
      exportRequirements: exportShape,
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
  readonly pressureScenarios: readonly string[]
  readonly capability: string | undefined
  readonly triggerDescription: string | undefined
  readonly triggerExamples: readonly string[]
  readonly triggerExclusions: readonly string[]
  readonly softBoundary: readonly string[]
  readonly hardBoundary: readonly string[]
  readonly workflow: readonly string[]
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
    description: input.triggerDescription,
    readiness: input.status === 'ready' && input.missingForExport.length === 0 ? 'ready' : 'blocked',
    missingForExport: input.missingForExport,
    frontmatter: {
      name: input.skillName,
      description: input.triggerDescription,
    },
    bodyOutline: [
      'Capability',
      'Trigger',
      ...(input.softBoundary.length === 0 ? [] : ['Soft Boundary']),
      ...(input.hardBoundary.length === 0 ? [] : ['Hard Boundary']),
      ...(input.workflow.length === 0 ? [] : ['Workflow']),
      'Semantic Basis',
      ...(input.validation.length === 0 ? [] : ['Validation']),
    ],
    capability: input.capability,
    pressureScenarios: input.pressureScenarios,
    triggerDescription: input.triggerDescription,
    triggerExamples: input.triggerExamples,
    triggerExclusions: input.triggerExclusions,
    softBoundary: input.softBoundary,
    hardBoundary: input.hardBoundary,
    workflow: input.workflow,
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
