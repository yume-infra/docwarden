import type { PrimitiveDiagnostic, PrimitiveSkillResult, RecognitionRunResult } from './domain.js'
import { collectOfmLinksFromText, extractListItems, findSection, firstNonEmptyLine, includesNormalized } from './markdown-helpers.js'

const defaultRequiredSections = ['Capability', 'Trigger', 'Semantic Basis', 'Export Position'] as const
const requiredSemanticBasisTargets = [
  'mapping/bootstrap/modules/concept/skill-primitive',
  'mapping/bootstrap/modules/concept/primitive-creator',
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
  const capabilitySection = findSection(run.surface, 'Capability')
  const triggerSection = findSection(run.surface, 'Trigger')
  const semanticBasisSection = findSection(run.surface, 'Semantic Basis')
  const exportSection = findSection(run.surface, 'Export Position')
  const semanticBasisLinks = collectOfmLinksFromText(semanticBasisSection?.text ?? '').map(link => link.target)
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
  if (exportSection === undefined || exportSection.text.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'missing export position material for future SKILL.md compiler',
    })
  }
  for (const target of requiredSemanticBasisTargets) {
    if (!semanticBasisLinks.includes(target)) {
      diagnostics.push({
        severity: 'warning',
        message: `missing semantic basis link: ${target}`,
      })
    }
  }
  for (const target of semanticBasisLinks) {
    if (!localMaterialTargets.has(stripMdExtension(target))) {
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

  return {
    root: run.root,
    target: run.recognition.target,
    recognizedRole: run.recognition.recognizedRole,
    status: diagnostics.some(diagnostic => diagnostic.severity === 'warning') ? 'needs-work' : 'ready',
    model: {
      capability: capabilitySection === undefined ? undefined : firstNonEmptyLine(capabilitySection.text),
      trigger: triggerSection === undefined ? undefined : firstNonEmptyLine(triggerSection.text),
      semanticBasisLinks,
      exportPosition: exportSection === undefined ? undefined : firstNonEmptyLine(exportSection.text),
      futureSkillExportRequirements: extractListItems(exportSection?.text ?? ''),
    },
    plan: {
      compiler: 'not-implemented-v0',
      futureSkillExportRequirements: extractListItems(exportSection?.text ?? ''),
    },
    sourceMaterial: material.map(document => document.isomorphPath).sort(),
    requiredSections,
    presentSections,
    exportPosition: {
      present: exportSection !== undefined && exportSection.text.length > 0,
      excerpt: exportSection === undefined ? undefined : firstNonEmptyLine(exportSection.text),
    },
    diagnostics,
  }
}

function stripMdExtension(target: string): string {
  return target.endsWith('.md') ? target.slice(0, -'.md'.length) : target
}
