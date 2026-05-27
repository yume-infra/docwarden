import type { MarkdownSurface, Section } from './markdown.js'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseMarkdownSurface } from './markdown.js'
import {
  computeSeedDigest,
  seedFiles,
  seedRef,
  seedSchemaVersion,
  seedVendor,
} from './seed.js'

export type RuntimeErrorKind = 'config' | 'runtime'

export class ContextaRuntimeError extends Error {
  readonly kind: RuntimeErrorKind
  readonly exitCode = 2

  constructor(kind: RuntimeErrorKind, message: string) {
    super(message)
    this.name = 'ContextaRuntimeError'
    this.kind = kind
  }
}

export interface PinMetadata {
  readonly schemaVersion: number
  readonly vendor: string
  readonly ref: string
  readonly digest: string
  readonly createdAt: string
}

export interface ContextaRoot {
  readonly workspaceRoot: string
  readonly contextaRoot: string
  readonly source: 'explicit' | 'target' | 'cwd'
}

export interface InitOptions {
  readonly root?: string | undefined
  readonly cwd?: string | undefined
  readonly now?: Date | undefined
}

export interface InitResult {
  readonly workspaceRoot: string
  readonly contextaRoot: string
  readonly pin: PinMetadata
  readonly filesWritten: number
}

export interface ResolveOptions {
  readonly root?: string | undefined
  readonly target?: string | undefined
  readonly cwd?: string | undefined
}

export interface ContextaDocument {
  readonly absolutePath: string
  readonly contextaPath: string
  readonly surface: MarkdownSurface
  readonly title: string
  readonly kind: string | undefined
}

export interface SignalDefinition {
  readonly id: string
  readonly contextaPath: string
  readonly definition: string
  readonly triggerLines: readonly string[]
  readonly basis: readonly string[]
}

export interface ContextaModel {
  readonly root: ContextaRoot
  readonly documents: readonly ContextaDocument[]
  readonly localKinds: ReadonlySet<string>
  readonly signals: readonly SignalDefinition[]
  readonly skillPrimitiveMaterial: readonly ContextaDocument[]
}

export interface TriggerHit {
  readonly raw: string
  readonly known: boolean
  readonly matched: boolean
  readonly evidence: string
  readonly context: string | undefined
}

export interface SignalCandidate {
  readonly signal: string
  readonly contextaPath: string
  readonly applicable: boolean
  readonly matched: number
  readonly total: number
  readonly triggerHits: readonly TriggerHit[]
  readonly basis: readonly string[]
  readonly confidence: number
}

export interface RecognitionResult {
  readonly target: string
  readonly recognizedRole: string
  readonly basis: readonly string[]
  readonly confidence: number
  readonly candidateSignalScope: readonly SignalCandidate[]
}

export interface RecognitionRunResult {
  readonly root: ContextaRoot
  readonly model: ContextaModel
  readonly surface: MarkdownSurface
  readonly recognition: RecognitionResult
}

export interface LintSignal {
  readonly signal: string
  readonly target: string
  readonly context: string | undefined
  readonly locator: string | undefined
  readonly evidence: readonly string[]
  readonly basis: readonly string[]
  readonly confidence: number
}

export interface LintResult {
  readonly root: ContextaRoot
  readonly recognition: RecognitionResult
  readonly signals: readonly LintSignal[]
}

export interface PrimitiveDiagnostic {
  readonly severity: 'info' | 'warning'
  readonly message: string
}

export interface PrimitiveSkillResult {
  readonly root: ContextaRoot
  readonly target: string
  readonly recognizedRole: string
  readonly status: 'ready' | 'needs-work'
  readonly sourceMaterial: readonly string[]
  readonly requiredSections: readonly string[]
  readonly presentSections: readonly string[]
  readonly exportPosition: {
    readonly present: boolean
    readonly excerpt: string | undefined
  }
  readonly diagnostics: readonly PrimitiveDiagnostic[]
}

export interface UpgradeStatusResult {
  readonly root: ContextaRoot
  readonly pin: PinMetadata
  readonly mergeEngine: 'not-implemented-v0'
}

interface RoleCandidate {
  readonly role: string
  readonly basis: readonly string[]
  readonly confidence: number
}

export function toContextaError(error: unknown): ContextaRuntimeError {
  if (error instanceof ContextaRuntimeError) {
    return error
  }
  if (error instanceof Error) {
    return new ContextaRuntimeError('runtime', error.message)
  }
  return new ContextaRuntimeError('runtime', String(error))
}

export async function runInit(options: InitOptions = {}): Promise<InitResult> {
  const cwd = path.resolve(options.cwd ?? process.cwd())
  const workspaceRoot = path.resolve(cwd, normalizeOptionalPath(options.root) ?? '.')
  await assertDirectory(workspaceRoot, `init root does not exist or is not a directory: ${workspaceRoot}`)

  const contextaRoot = path.join(workspaceRoot, '.contexta')
  if (await exists(contextaRoot)) {
    throw new ContextaRuntimeError('config', `local .contexta already exists: ${contextaRoot}`)
  }

  await fs.mkdir(contextaRoot, { recursive: false })
  try {
    for (const file of seedFiles) {
      const destination = path.join(contextaRoot, file.path)
      assertInside(contextaRoot, destination, `seed path escapes .contexta: ${file.path}`)
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.writeFile(destination, file.content, 'utf8')
    }

    const pin: PinMetadata = {
      schemaVersion: seedSchemaVersion,
      vendor: seedVendor,
      ref: seedRef,
      digest: computeSeedDigest(),
      createdAt: (options.now ?? new Date()).toISOString(),
    }
    await fs.writeFile(
      path.join(contextaRoot, '.contexta-pin.json'),
      `${JSON.stringify(pin, null, 2)}\n`,
      'utf8',
    )

    return {
      workspaceRoot,
      contextaRoot,
      pin,
      filesWritten: seedFiles.length + 1,
    }
  }
  catch (error) {
    await fs.rm(contextaRoot, { force: true, recursive: true })
    throw error
  }
}

export async function resolveContextaRoot(options: ResolveOptions = {}): Promise<ContextaRoot> {
  const cwd = path.resolve(options.cwd ?? process.cwd())
  const explicitRoot = normalizeOptionalPath(options.root)

  if (explicitRoot !== undefined) {
    return resolveExplicitRoot(cwd, explicitRoot)
  }

  const target = normalizeOptionalPath(options.target)
  if (target !== undefined) {
    const targetPath = path.resolve(cwd, target)
    const targetStart = await directoryForSearch(targetPath)
    const found = await findWorkspaceWithContexta(targetStart)
    if (found !== undefined) {
      assertTargetInside(found, targetPath)
      return {
        workspaceRoot: found,
        contextaRoot: path.join(found, '.contexta'),
        source: 'target',
      }
    }
  }

  const found = await findWorkspaceWithContexta(cwd)
  if (found === undefined) {
    throw new ContextaRuntimeError('config', 'could not resolve local .contexta root')
  }

  return {
    workspaceRoot: found,
    contextaRoot: path.join(found, '.contexta'),
    source: 'cwd',
  }
}

export async function loadContextaModel(root: ContextaRoot): Promise<ContextaModel> {
  const files = await listMarkdownFiles(root.contextaRoot)
  const documents = await Promise.all(files.map(async (absolutePath) => {
    const content = await fs.readFile(absolutePath, 'utf8')
    const contextaPath = toPosix(path.relative(root.contextaRoot, absolutePath))
    const surface = parseMarkdownSurface(content, contextaPath)
    return {
      absolutePath,
      contextaPath,
      surface,
      title: firstHeadingText(surface) ?? path.basename(contextaPath, '.md'),
      kind: surface.frontmatter.kind,
    } satisfies ContextaDocument
  }))
  const localKinds = collectLocalKinds(documents)
  const signals = documents.flatMap(readSignalDefinition)
  const skillPrimitiveMaterial = documents.filter(document =>
    normalizeToken(document.title) === 'skill-primitive'
    || normalizeToken(document.kind) === 'skill-primitive'
    || document.contextaPath.includes('skill-primitive'))

  return {
    root,
    documents,
    localKinds,
    signals,
    skillPrimitiveMaterial,
  }
}

export async function runRecognition(options: ResolveOptions & { readonly target: string }): Promise<RecognitionRunResult> {
  const root = await resolveContextaRoot(options)
  const model = await loadContextaModel(root)
  const target = path.resolve(options.cwd ?? process.cwd(), options.target)
  assertTargetInside(root.workspaceRoot, target)
  const content = await fs.readFile(target, 'utf8')
  const surface = parseMarkdownSurface(content, toWorkspacePath(root.workspaceRoot, target))
  const recognition = recognizeSurface(model, surface)

  return {
    root,
    model,
    surface,
    recognition,
  }
}

export async function runLint(options: ResolveOptions & { readonly target: string }): Promise<LintResult> {
  const run = await runRecognition(options)
  const signals = run.recognition.candidateSignalScope
    .filter(candidate => candidate.applicable)
    .map(candidate => signalFromCandidate(run.surface, run.recognition, candidate))

  return {
    root: run.root,
    recognition: run.recognition,
    signals,
  }
}

export async function runPrimitiveSkill(options: ResolveOptions & { readonly target: string }): Promise<PrimitiveSkillResult> {
  const run = await runRecognition(options)
  const material = run.model.skillPrimitiveMaterial
  const template = material.find(document => document.contextaPath.endsWith('/templates/skill-primitive.md'))
  const requiredSections = template === undefined
    ? ['Capability', 'Trigger', 'Semantic Basis', 'Export Position']
    : template.surface.headings
        .filter(heading => heading.level === 2)
        .map(heading => heading.text)
        .filter(heading => !['Diagnostics'].includes(heading))
  const presentSections = run.surface.headings
    .filter(heading => heading.level === 2)
    .map(heading => heading.text)
  const missingSections = requiredSections.filter(section => !includesNormalized(presentSections, section))
  const exportSection = findSection(run.surface, 'Export Position')
  const diagnostics: PrimitiveDiagnostic[] = []

  if (material.length === 0) {
    diagnostics.push({
      severity: 'warning',
      message: 'local .contexta has no skill primitive material',
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
    sourceMaterial: material.map(document => document.contextaPath).sort(),
    requiredSections,
    presentSections,
    exportPosition: {
      present: exportSection !== undefined && exportSection.text.length > 0,
      excerpt: exportSection === undefined ? undefined : firstNonEmptyLine(exportSection.text),
    },
    diagnostics,
  }
}

export async function runUpgradeStatus(options: ResolveOptions = {}): Promise<UpgradeStatusResult> {
  const root = await resolveContextaRoot(options)
  const pin = await readPin(root.contextaRoot)

  return {
    root,
    pin,
    mergeEngine: 'not-implemented-v0',
  }
}

export async function readPin(contextaRoot: string): Promise<PinMetadata> {
  const pinPath = path.join(contextaRoot, '.contexta-pin.json')
  if (!(await exists(pinPath))) {
    throw new ContextaRuntimeError('config', `missing pin metadata: ${pinPath}`)
  }
  const raw = await fs.readFile(pinPath, 'utf8')
  const parsed = JSON.parse(raw) as Partial<PinMetadata>
  if (
    parsed.schemaVersion === undefined
    || parsed.vendor === undefined
    || parsed.ref === undefined
    || parsed.digest === undefined
    || parsed.createdAt === undefined
  ) {
    throw new ContextaRuntimeError('config', `invalid pin metadata: ${pinPath}`)
  }
  return {
    schemaVersion: parsed.schemaVersion,
    vendor: parsed.vendor,
    ref: parsed.ref,
    digest: parsed.digest,
    createdAt: parsed.createdAt,
  }
}

export function recognizeSurface(model: ContextaModel, surface: MarkdownSurface): RecognitionResult {
  const candidates = [
    frontmatterRoleCandidate(model, surface),
    mappingPathRoleCandidate(model, surface),
    signalSurfaceCandidate(model, surface),
    skillPrimitiveCandidate(model, surface),
  ].filter((candidate): candidate is RoleCandidate => candidate !== undefined)
  const best = candidates.sort((a, b) => b.confidence - a.confidence)[0] ?? {
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

async function resolveExplicitRoot(cwd: string, root: string): Promise<ContextaRoot> {
  const absolute = path.resolve(cwd, root)
  await assertDirectory(absolute, `explicit root does not exist or is not a directory: ${absolute}`)

  if (path.basename(absolute) === '.contexta') {
    return {
      workspaceRoot: path.dirname(absolute),
      contextaRoot: absolute,
      source: 'explicit',
    }
  }

  const contextaRoot = path.join(absolute, '.contexta')
  await assertDirectory(contextaRoot, `explicit root does not contain .contexta: ${absolute}`)
  return {
    workspaceRoot: absolute,
    contextaRoot,
    source: 'explicit',
  }
}

async function directoryForSearch(targetPath: string): Promise<string> {
  try {
    const stat = await fs.stat(targetPath)
    return stat.isDirectory() ? targetPath : path.dirname(targetPath)
  }
  catch {
    return path.dirname(targetPath)
  }
}

async function findWorkspaceWithContexta(start: string): Promise<string | undefined> {
  let current = path.resolve(start)
  for (;;) {
    if (await isDirectory(path.join(current, '.contexta'))) {
      return current
    }
    const parent = path.dirname(current)
    if (parent === current) {
      return undefined
    }
    current = parent
  }
}

async function listMarkdownFiles(root: string): Promise<readonly string[]> {
  const result: string[] = []
  const walk = async (directory: string): Promise<void> => {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        await walk(absolute)
      }
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        result.push(absolute)
      }
    }
  }
  await walk(root)
  return result.sort()
}

function collectLocalKinds(documents: readonly ContextaDocument[]): ReadonlySet<string> {
  const kinds = new Set<string>()
  for (const document of documents) {
    if (document.kind !== undefined) {
      kinds.add(normalizeToken(document.kind))
    }
    if (document.kind === 'concept') {
      kinds.add(normalizeToken(document.title))
    }
  }
  return kinds
}

function readSignalDefinition(document: ContextaDocument): readonly SignalDefinition[] {
  if (document.kind !== 'signal' && !document.contextaPath.includes('/modules/signal/')) {
    return []
  }
  return [{
    id: document.title,
    contextaPath: document.contextaPath,
    definition: findSection(document.surface, 'Definition')?.text ?? '',
    triggerLines: extractListItems(findSection(document.surface, 'Trigger')?.text ?? ''),
    basis: extractListItems(findSection(document.surface, 'Basis')?.text ?? ''),
  }]
}

function firstHeadingText(surface: MarkdownSurface): string | undefined {
  return surface.headings.find(heading => heading.level === 1)?.text
}

function frontmatterRoleCandidate(model: ContextaModel, surface: MarkdownSurface): RoleCandidate | undefined {
  const kind = surface.frontmatter.kind
  if (kind === undefined || kind.length === 0) {
    return undefined
  }
  const normalized = normalizeToken(kind)
  const known = model.localKinds.has(normalized)
  const basis = known
    ? [`frontmatter.kind == ${kind}`, `local .contexta defines kind ${kind}`]
    : [`frontmatter.kind == ${kind}`, 'kind not found in local .contexta model']
  return {
    role: kind,
    basis,
    confidence: known ? 0.9 : 0.62,
  }
}

function mappingPathRoleCandidate(model: ContextaModel, surface: MarkdownSurface): RoleCandidate | undefined {
  const contextaRelative = surface.path.startsWith('.contexta/')
    ? surface.path.slice('.contexta/'.length)
    : surface.path
  const mappingMatch = /^mapping\/([^/]+)\/(.+)$/.exec(contextaRelative)
  if (mappingMatch === null) {
    return undefined
  }
  const rest = mappingMatch[2] ?? ''
  const segments = rest.split('/')
  const pathRole = inferRoleFromMappingSegments(model, segments, surface.frontmatter.kind)
  if (pathRole === undefined) {
    return undefined
  }
  return {
    role: pathRole,
    basis: [
      `path under mapping/${mappingMatch[1] ?? '*'}`,
      `mapping path suggests ${pathRole}`,
    ],
    confidence: 0.72,
  }
}

function inferRoleFromMappingSegments(model: ContextaModel, segments: readonly string[], frontmatterKind: string | undefined): string | undefined {
  const [area, group] = segments
  if (area === undefined) {
    return frontmatterKind
  }
  if (frontmatterKind !== undefined && model.localKinds.has(normalizeToken(frontmatterKind))) {
    return frontmatterKind
  }
  if (area === 'templates' && model.localKinds.has('template')) {
    return 'template'
  }
  if (area === 'relations' && model.localKinds.has('relation')) {
    return 'relation'
  }
  if (area === 'structures' && group !== undefined && model.localKinds.has(normalizeToken(group))) {
    return group
  }
  if (area === 'modules' && group !== undefined && model.localKinds.has(normalizeToken(group))) {
    return group
  }
  return undefined
}

function signalSurfaceCandidate(model: ContextaModel, surface: MarkdownSurface): RoleCandidate | undefined {
  if (!model.localKinds.has('signal')) {
    return undefined
  }
  const sectionNames = new Set(surface.headings.filter(heading => heading.level === 2).map(heading => normalizeToken(heading.text)))
  if (!sectionNames.has('definition') || !sectionNames.has('trigger') || !sectionNames.has('basis')) {
    return undefined
  }
  return {
    role: 'signal',
    basis: ['local .contexta defines signal', 'surface has Definition / Trigger / Basis sections'],
    confidence: 0.8,
  }
}

function skillPrimitiveCandidate(model: ContextaModel, surface: MarkdownSurface): RoleCandidate | undefined {
  if (!model.localKinds.has('skill-primitive')) {
    return undefined
  }
  const sectionNames = new Set(surface.headings.filter(heading => heading.level === 2).map(heading => normalizeToken(heading.text)))
  const skillSections = ['capability', 'trigger', 'semantic-basis', 'export-position']
  const sectionHits = skillSections.filter(section => sectionNames.has(section)).length
  const frontmatterHit = normalizeToken(surface.frontmatter.kind) === 'skill-primitive'
  const pathHit = normalizeToken(surface.path).includes('skill')
  if (!frontmatterHit && sectionHits < 2 && !pathHit) {
    return undefined
  }
  return {
    role: 'skill-primitive',
    basis: [
      'local .contexta defines skill-primitive',
      frontmatterHit ? 'frontmatter.kind == skill-primitive' : `skill primitive section hits: ${sectionHits}`,
    ],
    confidence: frontmatterHit ? 0.94 : 0.7,
  }
}

function evaluateSignal(signal: SignalDefinition, surface: MarkdownSurface): SignalCandidate {
  const triggerHits: TriggerHit[] = []
  let sectionScope: readonly string[] | undefined

  for (const rawLine of signal.triggerLines) {
    const hit = evaluateTriggerLine(rawLine, surface, sectionScope)
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
    confidence: roundConfidence(total === 0 ? 0 : matched / total),
  }
}

function evaluateTriggerLine(rawLine: string, surface: MarkdownSurface, sectionScope: readonly string[] | undefined): TriggerHit {
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

function readHeadingScope(rawLine: string, surface: MarkdownSurface): readonly string[] {
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

function signalFromCandidate(surface: MarkdownSurface, recognition: RecognitionResult, candidate: SignalCandidate): LintSignal {
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
    confidence: roundConfidence(Math.min(recognition.confidence, candidate.confidence)),
  }
}

function findSection(surface: MarkdownSurface, heading: string): Section | undefined {
  return surface.sections.find(section => normalizeToken(section.heading.text) === normalizeToken(heading))
}

function extractListItems(text: string): readonly string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => stripCode(line.slice(2).trim()))
    .filter(line => line.length > 0)
}

function splitTerms(raw: string): readonly string[] {
  return raw
    .replace(/\bterms\b/gi, '')
    .replace(/\bsections\b/gi, '')
    .replace(/\bwith concrete subject\b/gi, '')
    .replace(/\bdescriptions\b/gi, '')
    .split(/\s*\/\s*|\s*,\s*|\s+or\s+/i)
    .map(term => term.trim())
    .filter(term => term.length > 0)
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

function stripCode(value: string): string {
  return value.replace(/^`(.+)`$/, '$1').trim()
}

function stripWrappingSlash(value: string): string {
  return value.replace(/^\/+/, '').replace(/\/+$/, '')
}

function includesNormalized(values: readonly string[], expected: string): boolean {
  return values.some(value => normalizeToken(value) === normalizeToken(expected))
}

function normalizeToken(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/\s+/g, '-')
}

function firstNonEmptyLine(value: string): string | undefined {
  return value.split('\n').map(line => line.trim()).find(line => line.length > 0)
}

function normalizeOptionalPath(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed === undefined || trimmed.length === 0 ? undefined : trimmed
}

function toWorkspacePath(workspaceRoot: string, absolutePath: string): string {
  return toPosix(path.relative(workspaceRoot, absolutePath))
}

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join('/')
}

function assertTargetInside(workspaceRoot: string, targetPath: string): void {
  assertInside(workspaceRoot, targetPath, `target is outside resolved root: ${targetPath}`)
}

function assertInside(root: string, target: string, message: string): void {
  const relative = path.relative(root, target)
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new ContextaRuntimeError('config', message)
  }
}

async function assertDirectory(directory: string, message: string): Promise<void> {
  if (!(await isDirectory(directory))) {
    throw new ContextaRuntimeError('config', message)
  }
}

async function isDirectory(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath)
    return stat.isDirectory()
  }
  catch {
    return false
  }
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  }
  catch {
    return false
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function roundConfidence(value: number): number {
  return Math.round(value * 100) / 100
}
