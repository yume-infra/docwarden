import type {
  ContextaDocument,
  ContextaModel,
  ContextaRoot,
  DoctorInspectResult,
  DoctorIssue,
  DoctorIssueCode,
  DoctorRepairOptions,
  DoctorRepairPlan,
  DoctorRepairResult,
  PinMetadata,
  ResolveOptions,
} from './domain.js'
import type { ContextaError } from './errors.js'
import type { CurrentWorkingDirectoryService, VendorSnapshot, VendorSnapshotProviderService } from './services.js'
import { createHash } from 'node:crypto'
import { Clock, Effect, FileSystem, Path } from 'effect'
import { ContextaConfigError, ContextaRuntimeError, formatUnknownCause, isContextaError } from './errors.js'
import { loadContextaModelEffect } from './local-model.js'
import { collectOfmLinksFromText, findSection } from './markdown-helpers.js'
import { parseMarkdownSurface } from './markdown.js'
import { pinMetadataPath, readPinEffect } from './pin.js'
import { evaluateRecognitionTriggerLine, recognizeSurfaceEffect } from './recognition.js'
import { pathExists, resolveContextaRootEffect } from './root.js'
import { VendorSnapshotProvider } from './services.js'
import { evaluateSignal } from './signal.js'
import { runUpgradeStatusEffect } from './upgrade.js'

const adoptPackagedBaselinePlanId = 'adopt-packaged-baseline'
const installDefaultRecognitionPlanId = 'install-default-recognition-primitive'

export function runDoctorInspectEffect(options: ResolveOptions = {}): Effect.Effect<DoctorInspectResult, ContextaError, CurrentWorkingDirectoryService | VendorSnapshotProviderService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const root = yield* resolveContextaRootEffect(options)
    const snapshotProvider = yield* VendorSnapshotProvider
    const snapshot = yield* snapshotProvider.current
    const model = yield* loadContextaModelEffect(root)
    const issues = [
      ...yield* inspectPin(root, snapshot),
      ...yield* inspectBaselineMaterial(root, snapshot),
      ...inspectLocalModel(model),
      ...yield* inspectNestedContexta(root),
    ]

    return {
      root,
      status: issues.length === 0 ? 'clean' : 'issues',
      issues,
      repairPlans: repairPlansForIssues(issues),
    }
  })
}

export function runDoctorRepairEffect(options: DoctorRepairOptions): Effect.Effect<DoctorRepairResult, ContextaError, CurrentWorkingDirectoryService | VendorSnapshotProviderService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const before = yield* runDoctorInspectEffect(options)
    const plan = repairPlansForIssues(before.issues).find(plan => plan.id === options.plan) ?? knownRepairPlan(options.plan)
    if (plan === undefined) {
      return yield* Effect.fail(new ContextaConfigError({ message: `unknown doctor repair plan: ${options.plan}` }))
    }

    const snapshotProvider = yield* VendorSnapshotProvider
    const snapshot = yield* snapshotProvider.current
    const beforeFingerprint = fingerprintIssues(before.issues)
    const actions = options.plan === adoptPackagedBaselinePlanId
      ? yield* applyAdoptPackagedBaseline(before.root, snapshot, options.now)
      : yield* applyInstallDefaultRecognitionPrimitive(before.root, snapshot)

    const after = yield* runDoctorInspectEffect({ root: before.root.contextaRoot })
    const afterFingerprint = fingerprintIssues(after.issues)
    yield* writeRepairLog(before.root, {
      plan: options.plan,
      beforeFingerprint,
      afterFingerprint,
      actions,
      appliedAt: options.now,
    })

    yield* runUpgradeStatusEffect({ root: before.root.contextaRoot })
    const model = yield* loadContextaModelEffect(before.root)
    yield* recognizeSurfaceEffect(model, parseMarkdownSurface(`---
kind: concept
---

# doctor concept fixture
`, 'doctor-fixture.md'))

    return {
      root: before.root,
      plan,
      applied: actions.length > 0,
      actions,
      issuesBefore: before.issues,
      issuesAfter: after.issues,
      verification: [
        'doctor inspect rerun completed',
        'strict upgrade resolved pinned baseline',
        'synthetic concept recognition used local recognition authority',
      ],
    }
  })
}

function inspectPin(root: ContextaRoot, snapshot: VendorSnapshot): Effect.Effect<readonly DoctorIssue[], never, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const pinPath = yield* pinMetadataPath(root.contextaRoot)
    const pin = yield* readPinEffect(root.contextaRoot).pipe(
      Effect.match({
        onFailure: error => error,
        onSuccess: pin => pin,
      }),
    )

    if (isContextaError(pin)) {
      if (pin._tag === 'ContextaConfigError' && pin.message.startsWith('missing pin metadata')) {
        return [issue({
          code: 'missing-pin-metadata',
          severity: 'error',
          target: pinPath,
          summary: 'local .contexta has no pin metadata',
          evidence: pin.message,
          impact: 'ordinary upgrade fails until the local instance has an explicit baseline',
          repairability: 'plan-only',
          repair: adoptPackagedBaselinePlanId,
        })]
      }
      return [issue({
        code: 'invalid-pin-metadata',
        severity: 'error',
        target: pinPath,
        summary: 'local .contexta pin metadata is invalid',
        evidence: pin.message,
        impact: 'ordinary upgrade cannot resolve a trusted baseline',
        repairability: 'manual',
        repair: undefined,
      })]
    }

    if (!pinMatchesSnapshot(pin, snapshot)) {
      return [issue({
        code: 'unknown-pin-baseline',
        severity: 'error',
        target: pinPath,
        summary: 'local .contexta pin points at an unknown baseline',
        evidence: `vendor=${pin.vendor} ref=${pin.ref} digest=${pin.digest}`,
        impact: 'ordinary upgrade refuses shape-valid pins that do not resolve to packaged baseline material',
        repairability: 'manual',
        repair: undefined,
      })]
    }

    return []
  })
}

function inspectBaselineMaterial(root: ContextaRoot, snapshot: VendorSnapshot): Effect.Effect<readonly DoctorIssue[], ContextaRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const missing: string[] = []
    const conflicting: string[] = []

    for (const file of snapshot.files) {
      const destination = path.join(root.contextaRoot, file.path)
      if (!(yield* pathExists(destination))) {
        missing.push(file.path)
        continue
      }
      const content = yield* fs.readFileString(destination, 'utf8').pipe(
        Effect.mapError(error => new ContextaRuntimeError({
          message: `failed to read baseline material: ${destination}: ${formatUnknownCause(error)}`,
        })),
      )
      if (content !== file.content) {
        conflicting.push(file.path)
      }
    }

    const issues: DoctorIssue[] = []
    if (missing.length > 0) {
      issues.push(issue({
        code: 'missing-baseline-material',
        severity: 'warning',
        target: root.contextaRoot,
        summary: 'local .contexta is missing packaged baseline material',
        evidence: summarizeList(missing),
        impact: 'strict runtime commands may fail because required local authority material is absent',
        repairability: 'auto',
        repair: adoptPackagedBaselinePlanId,
      }))
    }
    if (conflicting.length > 0) {
      issues.push(issue({
        code: 'baseline-material-conflict',
        severity: 'warning',
        target: root.contextaRoot,
        summary: 'local .contexta baseline paths contain local changes',
        evidence: summarizeList(conflicting),
        impact: 'doctor will not overwrite these paths during baseline adoption',
        repairability: 'manual',
        repair: undefined,
      }))
    }
    return issues
  })
}

function inspectLocalModel(model: ContextaModel): readonly DoctorIssue[] {
  const issues: DoctorIssue[] = []
  const emptySurface = parseMarkdownSurface('', 'doctor-empty.md')

  if (model.documents.length === 0) {
    issues.push(issue({
      code: 'empty-contexta-instance',
      severity: 'error',
      target: model.root.contextaRoot,
      summary: 'local .contexta contains no markdown material',
      evidence: 'no .md files found',
      impact: 'recognition, lint, primitive, and upgrade cannot rely on local authority material',
      repairability: 'auto',
      repair: adoptPackagedBaselinePlanId,
    }))
  }

  if (model.recognitionRules.length === 0) {
    issues.push(issue({
      code: 'missing-recognition-authority',
      severity: 'error',
      target: model.root.contextaRoot,
      summary: 'local .contexta has no recognition primitive rule',
      evidence: 'no recognition rule parsed from local material',
      impact: 'ordinary recognize and lint fail strictly instead of using fallback authority',
      repairability: 'auto',
      repair: installDefaultRecognitionPlanId,
    }))
  }

  for (const rule of model.recognitionRules) {
    for (const rawLine of rule.triggerLines) {
      const hit = evaluateRecognitionTriggerLine(model, emptySurface, rawLine, undefined)
      if (!hit.known) {
        issues.push(issue({
          code: 'invalid-recognition-trigger',
          severity: 'error',
          target: rule.contextaPath,
          summary: 'recognition rule uses an unsupported trigger',
          evidence: `${rule.id}: ${hit.raw}`,
          impact: 'ordinary recognize and lint fail strictly because recognition authority is invalid',
          repairability: 'manual',
          repair: undefined,
        }))
      }
    }
  }

  for (const signal of model.signals) {
    const candidate = evaluateSignal(signal, emptySurface, { recognizedRole: 'unknown' })
    for (const diagnostic of candidate.diagnostics) {
      issues.push(issue({
        code: diagnostic.code as DoctorIssueCode,
        severity: diagnostic.severity === 'error' ? 'error' : 'warning',
        target: diagnostic.target ?? signal.contextaPath,
        summary: diagnostic.message,
        evidence: diagnostic.evidence ?? signal.id,
        impact: diagnostic.code === 'missing-signal-loss-model'
          ? 'lint output cannot explain the protected loss model'
          : 'lint applicability cannot be trusted for this signal trigger',
        repairability: diagnostic.code === 'missing-signal-loss-model' ? 'plan-only' : 'manual',
        repair: undefined,
      }))
    }
  }

  issues.push(...inspectPrimitiveSemanticBasisLinks(model))
  return issues
}

function inspectPrimitiveSemanticBasisLinks(model: ContextaModel): readonly DoctorIssue[] {
  const issues: DoctorIssue[] = []
  const materialTargets = new Set(model.documents.map(document => materialTarget(document)))
  for (const document of model.documents.filter(document => document.kind === 'skill-primitive')) {
    const section = findSection(document.surface, 'Semantic Basis')
    for (const link of collectOfmLinksFromText(section?.text ?? '')) {
      const target = stripMdExtension(link.target)
      if (!materialTargets.has(target)) {
        issues.push(issue({
          code: 'broken-primitive-semantic-basis-link',
          severity: 'warning',
          target: document.contextaPath,
          summary: 'skill primitive semantic basis link does not resolve to local material',
          evidence: link.target,
          impact: 'primitive skill diagnostics cannot prove that semantic basis material exists locally',
          repairability: 'manual',
          repair: undefined,
        }))
      }
    }
  }
  return issues
}

function inspectNestedContexta(root: ContextaRoot): Effect.Effect<readonly DoctorIssue[], ContextaRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const nested = path.join(root.contextaRoot, '.contexta')
    const exists = yield* pathExists(nested)
    return exists
      ? [issue({
          code: 'nested-contexta-root',
          severity: 'error',
          target: nested,
          summary: 'local .contexta contains a nested .contexta root',
          evidence: nested,
          impact: 'root resolution and init semantics become ambiguous',
          repairability: 'manual',
          repair: undefined,
        })]
      : []
  })
}

function applyAdoptPackagedBaseline(root: ContextaRoot, snapshot: VendorSnapshot, now: Date | undefined): Effect.Effect<readonly string[], ContextaError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const pinPath = yield* pinMetadataPath(root.contextaRoot)
    const pinExists = yield* pathExists(pinPath)
    const actions: string[] = []

    if (pinExists) {
      const pin = yield* readPinEffect(root.contextaRoot)
      if (!pinMatchesSnapshot(pin, snapshot)) {
        return yield* Effect.fail(new ContextaConfigError({
          message: `cannot adopt packaged baseline while pin metadata already exists: ${pinPath}`,
        }))
      }
    }

    for (const file of snapshot.files) {
      const destination = path.join(root.contextaRoot, file.path)
      if (yield* pathExists(destination)) {
        continue
      }
      yield* fs.makeDirectory(path.dirname(destination), { recursive: true }).pipe(
        Effect.mapError(error => new ContextaRuntimeError({
          message: `failed to create repair directory: ${path.dirname(destination)}: ${formatUnknownCause(error)}`,
        })),
      )
      yield* writeAtomicString(destination, file.content)
      actions.push(`write missing baseline file: ${file.path}`)
    }

    if (!pinExists) {
      const createdAt = now?.toISOString() ?? new Date(yield* Clock.currentTimeMillis).toISOString()
      const pin: PinMetadata = {
        schemaVersion: snapshot.schemaVersion,
        vendor: snapshot.vendor,
        ref: snapshot.ref,
        digest: snapshot.digest,
        createdAt,
      }
      yield* writeAtomicString(pinPath, `${JSON.stringify(pin, null, 2)}\n`)
      actions.push('write pin metadata: .contexta-pin.json')
    }

    return actions
  })
}

function applyInstallDefaultRecognitionPrimitive(root: ContextaRoot, snapshot: VendorSnapshot): Effect.Effect<readonly string[], ContextaError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const file = snapshot.files.find(file => file.path === 'mapping/bootstrap/modules/recognition/default.md')
    if (file === undefined) {
      return yield* Effect.fail(new ContextaConfigError({
        message: 'packaged baseline has no default recognition primitive',
      }))
    }
    const destination = path.join(root.contextaRoot, file.path)
    if (yield* pathExists(destination)) {
      return []
    }
    yield* writeAtomicString(destination, file.content)
    return [`write default recognition primitive: ${file.path}`]
  })
}

function writeRepairLog(root: ContextaRoot, event: {
  readonly plan: string
  readonly beforeFingerprint: string
  readonly afterFingerprint: string
  readonly actions: readonly string[]
  readonly appliedAt: Date | undefined
}): Effect.Effect<void, ContextaRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const logPath = path.join(root.contextaRoot, '.contexta-repair-log.ndjson')
    const previous = (yield* pathExists(logPath))
      ? yield* fs.readFileString(logPath, 'utf8').pipe(
        Effect.mapError(error => new ContextaRuntimeError({
          message: `failed to read repair log: ${logPath}: ${formatUnknownCause(error)}`,
        })),
      )
      : ''
    const appliedAt = event.appliedAt?.toISOString() ?? new Date(yield* Clock.currentTimeMillis).toISOString()
    const entry = JSON.stringify({
      plan: event.plan,
      appliedAt,
      beforeFingerprint: event.beforeFingerprint,
      afterFingerprint: event.afterFingerprint,
      actions: event.actions,
    })
    yield* writeAtomicString(logPath, `${previous}${entry}\n`)
  })
}

function writeAtomicString(destination: string, content: string): Effect.Effect<void, ContextaRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    yield* fs.makeDirectory(path.dirname(destination), { recursive: true }).pipe(
      Effect.mapError(error => new ContextaRuntimeError({
        message: `failed to create directory for atomic write: ${path.dirname(destination)}: ${formatUnknownCause(error)}`,
      })),
    )
    const temp = path.join(path.dirname(destination), `.${path.basename(destination)}.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`)
    yield* fs.writeFileString(temp, content).pipe(
      Effect.mapError(error => new ContextaRuntimeError({
        message: `failed to write temp file: ${temp}: ${formatUnknownCause(error)}`,
      })),
    )
    yield* fs.rename(temp, destination).pipe(
      Effect.mapError(error => new ContextaRuntimeError({
        message: `failed to commit atomic write: ${destination}: ${formatUnknownCause(error)}`,
      })),
    )
  })
}

function repairPlansForIssues(issues: readonly DoctorIssue[]): readonly DoctorRepairPlan[] {
  const codes = new Set(issues.map(issue => issue.code))
  return [
    ...(codes.has('missing-pin-metadata') || codes.has('missing-baseline-material') || codes.has('empty-contexta-instance')
      ? [knownRepairPlan(adoptPackagedBaselinePlanId)]
      : []),
    ...(codes.has('missing-recognition-authority')
      && !codes.has('missing-pin-metadata')
      && !codes.has('invalid-pin-metadata')
      && !codes.has('unknown-pin-baseline')
      ? [knownRepairPlan(installDefaultRecognitionPlanId)]
      : []),
  ].filter((plan): plan is DoctorRepairPlan => plan !== undefined)
}

function knownRepairPlan(id: string): DoctorRepairPlan | undefined {
  if (id === adoptPackagedBaselinePlanId) {
    return {
      id,
      issues: ['missing-pin-metadata', 'missing-baseline-material', 'missing-recognition-authority', 'empty-contexta-instance'],
      strategy: 'adopt-packaged-baseline',
      preconditions: [
        '.contexta exists',
        '.contexta/.contexta-pin.json is absent or already resolves to the packaged baseline',
        'baseline paths are only written when absent',
      ],
      actions: [
        'write absent packaged baseline files',
        'write .contexta/.contexta-pin.json when absent',
        'record repair log',
      ],
      postconditions: [
        'pin metadata decodes',
        'pin baseline resolves to packaged snapshot',
        'missing baseline files now exist',
      ],
      verification: [
        'doctor inspect rerun',
        'strict upgrade succeeds',
        'synthetic concept recognition succeeds through local recognition material',
      ],
      rollback: 'failed atomic writes leave existing material untouched; repair log records only after apply',
    }
  }
  if (id === installDefaultRecognitionPlanId) {
    return {
      id,
      issues: ['missing-recognition-authority'],
      strategy: 'install-default-recognition-primitive',
      preconditions: [
        'packaged baseline contains default recognition primitive',
        'target recognition primitive path is absent',
      ],
      actions: [
        'write packaged default recognition primitive when absent',
        'record repair log',
      ],
      postconditions: [
        'local model loads at least one recognition rule',
      ],
      verification: [
        'doctor inspect rerun',
        'synthetic concept recognition succeeds through local recognition material',
      ],
      rollback: 'failed atomic write leaves existing recognition material untouched',
    }
  }
  return undefined
}

function issue(input: DoctorIssue): DoctorIssue {
  return input
}

function pinMatchesSnapshot(pin: PinMetadata, snapshot: VendorSnapshot): boolean {
  return pin.schemaVersion === snapshot.schemaVersion
    && pin.vendor === snapshot.vendor
    && pin.ref === snapshot.ref
    && pin.digest === snapshot.digest
}

function materialTarget(document: ContextaDocument): string {
  return stripMdExtension(document.contextaPath)
}

function stripMdExtension(target: string): string {
  return target.endsWith('.md') ? target.slice(0, -'.md'.length) : target
}

function summarizeList(values: readonly string[]): string {
  const head = values.slice(0, 8).join(', ')
  return values.length > 8 ? `${head}, +${values.length - 8} more` : head
}

function fingerprintIssues(issues: readonly DoctorIssue[]): string {
  const hash = createHash('sha256')
  for (const issue of [...issues].sort((a, b) => `${a.code}:${a.target}:${a.evidence}`.localeCompare(`${b.code}:${b.target}:${b.evidence}`))) {
    hash.update(issue.code)
    hash.update('\0')
    hash.update(issue.target)
    hash.update('\0')
    hash.update(issue.evidence)
    hash.update('\0')
  }
  return `sha256:${hash.digest('hex')}`
}
