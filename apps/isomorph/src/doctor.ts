import type {
  DoctorInspectResult,
  DoctorIssue,
  DoctorIssueCode,
  DoctorRepairOptions,
  DoctorRepairPlan,
  DoctorRepairResult,
  IsomorphDocument,
  IsomorphInstance,
  IsomorphModel,
  IsomorphRoot,
  PinMetadata,
  ResolveOptions,
} from './domain.js'
import type { IsomorphError } from './errors.js'
import type { CurrentWorkingDirectoryService, VendorSnapshot, VendorSnapshotProviderService } from './services.js'
import { createHash } from 'node:crypto'
import { Clock, Effect, FileSystem, Path } from 'effect'
import { formatUnknownCause, isIsomorphError, IsomorphConfigError, IsomorphRuntimeError } from './errors.js'
import { loadIsomorphModelEffect } from './local-model.js'
import { collectOfmLinksFromText, findSection } from './markdown-helpers.js'
import { parseMarkdownSurface } from './markdown.js'
import { pinMetadataPath, readPinEffect } from './pin.js'
import { initOutputPath, isomorphSourceLayers, readPinnedBaselineFilesForLayer } from './pinned-baseline.js'
import { evaluateRecognitionTriggerLine, recognizeSurfaceEffect } from './recognition.js'
import { pathExists, resolveIsomorphRootEffect } from './root.js'
import { VendorSnapshotProvider } from './services.js'
import { evaluateSignal } from './signal.js'
import { readSourceMetadataEffect, sourceMetadataPath } from './source.js'
import { runUpgradeStatusEffect } from './upgrade.js'

const adoptPinnedBaselinePlanId = 'adopt-pinned-baseline'

export function runDoctorInspectEffect(options: ResolveOptions = {}): Effect.Effect<DoctorInspectResult, IsomorphError, CurrentWorkingDirectoryService | VendorSnapshotProviderService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const root = yield* resolveIsomorphRootEffect(options)
    const snapshotProvider = yield* VendorSnapshotProvider
    const snapshot = yield* snapshotProvider.current
    const model = yield* loadIsomorphModelEffect(root)
    const instance = yield* inspectInstance(root)
    const baselineIssues = instance.status === 'origin'
      ? []
      : [
          ...(yield* inspectPin(root, snapshot)),
          ...(yield* inspectBaselineMaterial(root)),
        ]
    const nestedIssues = yield* inspectNestedIsomorph(root)
    const issues = [
      ...baselineIssues,
      ...inspectLocalModel(model),
      ...nestedIssues,
    ]

    return {
      root,
      instance,
      status: issues.length === 0 ? 'clean' : 'issues',
      issues,
      repairPlans: repairPlansForIssues(issues),
    }
  })
}

export function runDoctorRepairEffect(options: DoctorRepairOptions): Effect.Effect<DoctorRepairResult, IsomorphError, CurrentWorkingDirectoryService | VendorSnapshotProviderService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const before = yield* runDoctorInspectEffect(options)
    const plan = repairPlansForIssues(before.issues).find(plan => plan.id === options.plan)
    if (plan === undefined) {
      return yield* Effect.fail(new IsomorphConfigError({ message: `unavailable doctor repair plan: ${options.plan}` }))
    }

    const snapshotProvider = yield* VendorSnapshotProvider
    const snapshot = yield* snapshotProvider.current
    const beforeFingerprint = fingerprintIssues(before.issues)
    const actions = yield* applyAdoptPinnedBaseline(before.root, snapshot, options.now)

    const after = yield* runDoctorInspectEffect({ root: before.root.isomorphRoot })
    const afterFingerprint = fingerprintIssues(after.issues)
    yield* writeRepairLog(before.root, {
      plan: options.plan,
      beforeFingerprint,
      afterFingerprint,
      actions,
      appliedAt: options.now,
    })

    yield* runUpgradeStatusEffect({ root: before.root.isomorphRoot })
    const model = yield* loadIsomorphModelEffect(before.root)
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
        'synthetic concept recognition used pinned package authority',
      ],
    }
  })
}

function inspectInstance(root: IsomorphRoot): Effect.Effect<IsomorphInstance, IsomorphError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const sourcePath = yield* sourceMetadataPath(root.isomorphRoot)
    if (yield* pathExists(sourcePath)) {
      const source = yield* readSourceMetadataEffect(root.isomorphRoot)
      return {
        status: 'origin',
        root: root.isomorphRoot,
        source,
      }
    }

    const pin = yield* readPinEffect(root.isomorphRoot).pipe(
      Effect.match({
        onFailure: error => error,
        onSuccess: pin => pin,
      }),
    )
    if (isIsomorphError(pin)) {
      return {
        status: 'unclassified',
        root: root.isomorphRoot,
        reason: pin._tag === 'IsomorphConfigError' && pin.message.startsWith('missing pin metadata')
          ? 'missing-pin-metadata'
          : 'invalid-pin-metadata',
      }
    }

    return {
      status: 'derived-v0',
      root: root.isomorphRoot,
      pin,
    }
  })
}

function inspectPin(root: IsomorphRoot, snapshot: VendorSnapshot): Effect.Effect<readonly DoctorIssue[], never, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const pinPath = yield* pinMetadataPath(root.isomorphRoot)
    const pin = yield* readPinEffect(root.isomorphRoot).pipe(
      Effect.match({
        onFailure: error => error,
        onSuccess: pin => pin,
      }),
    )

    if (isIsomorphError(pin)) {
      if (pin._tag === 'IsomorphConfigError' && pin.message.startsWith('missing pin metadata')) {
        return [issue({
          code: 'missing-pin-metadata',
          severity: 'error',
          target: pinPath,
          summary: 'local .isomorph has no pin metadata',
          evidence: pin.message,
          impact: 'ordinary upgrade fails until the local instance has an explicit baseline',
          repairability: 'plan-only',
          repair: adoptPinnedBaselinePlanId,
        })]
      }
      return [issue({
        code: 'invalid-pin-metadata',
        severity: 'error',
        target: pinPath,
        summary: 'local .isomorph pin metadata is invalid',
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
        summary: 'local .isomorph pin points at an unknown baseline',
        evidence: `vendor=${pin.vendor} ref=${pin.ref} digest=${pin.digest}`,
        impact: 'ordinary upgrade refuses shape-valid pins that do not resolve to pinned baseline material',
        repairability: 'manual',
        repair: undefined,
      })]
    }

    return []
  })
}

function inspectBaselineMaterial(root: IsomorphRoot): Effect.Effect<readonly DoctorIssue[], IsomorphRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const missing: string[] = []
    const conflicting: string[] = []
    const expectedFiles = readPinnedBaselineFilesForLayer(isomorphSourceLayers.init)

    for (const file of expectedFiles) {
      const outputPath = initOutputPath(file.path)
      const destination = path.join(root.isomorphRoot, outputPath)
      if (!(yield* pathExists(destination))) {
        missing.push(outputPath)
        continue
      }
      const content = yield* fs.readFileString(destination, 'utf8').pipe(
        Effect.mapError(error => new IsomorphRuntimeError({
          message: `failed to read baseline material: ${destination}: ${formatUnknownCause(error)}`,
        })),
      )
      if (content !== file.content) {
        conflicting.push(outputPath)
      }
    }

    const issues: DoctorIssue[] = []
    if (missing.length > 0) {
      issues.push(issue({
        code: 'missing-baseline-material',
        severity: 'warning',
        target: root.isomorphRoot,
        summary: 'local .isomorph is missing pinned baseline material',
        evidence: summarizeList(missing),
        impact: 'strict runtime commands may fail because required local authority material is absent',
        repairability: 'auto',
        repair: adoptPinnedBaselinePlanId,
      }))
    }
    if (conflicting.length > 0) {
      issues.push(issue({
        code: 'baseline-material-conflict',
        severity: 'warning',
        target: root.isomorphRoot,
        summary: 'local .isomorph baseline paths contain local changes',
        evidence: summarizeList(conflicting),
        impact: 'doctor will not overwrite these paths during baseline adoption',
        repairability: 'manual',
        repair: undefined,
      }))
    }
    return issues
  })
}

function inspectLocalModel(model: IsomorphModel): readonly DoctorIssue[] {
  const issues: DoctorIssue[] = []
  const emptySurface = parseMarkdownSurface('', 'doctor-empty.md')

  if (model.documents.length === 0) {
    issues.push(issue({
      code: 'empty-isomorph-instance',
      severity: 'error',
      target: model.root.isomorphRoot,
      summary: 'local .isomorph contains no markdown material',
      evidence: 'no .md files found',
      impact: 'recognition, lint, primitive, and upgrade cannot rely on local authority material',
      repairability: 'auto',
      repair: adoptPinnedBaselinePlanId,
    }))
  }

  if (model.recognitionRules.length === 0) {
    issues.push(issue({
      code: 'missing-recognition-authority',
      severity: 'error',
      target: model.root.isomorphRoot,
      summary: 'local .isomorph has no recognition primitive rule',
      evidence: 'no recognition rule parsed from local material',
      impact: 'ordinary recognize and lint fail strictly instead of using fallback authority',
      repairability: 'manual',
      repair: undefined,
    }))
  }

  for (const rule of model.recognitionRules) {
    for (const rawLine of rule.triggerLines) {
      const hit = evaluateRecognitionTriggerLine(model, emptySurface, rawLine, undefined)
      if (!hit.known) {
        issues.push(issue({
          code: 'invalid-recognition-trigger',
          severity: 'error',
          target: rule.isomorphPath,
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
        target: diagnostic.target ?? signal.isomorphPath,
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

function inspectPrimitiveSemanticBasisLinks(model: IsomorphModel): readonly DoctorIssue[] {
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
          target: document.isomorphPath,
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

function inspectNestedIsomorph(root: IsomorphRoot): Effect.Effect<readonly DoctorIssue[], IsomorphRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const nested = path.join(root.isomorphRoot, '.isomorph')
    const exists = yield* pathExists(nested)
    return exists
      ? [issue({
          code: 'nested-isomorph-root',
          severity: 'error',
          target: nested,
          summary: 'local .isomorph contains a nested .isomorph root',
          evidence: nested,
          impact: 'root resolution and init semantics become ambiguous',
          repairability: 'manual',
          repair: undefined,
        })]
      : []
  })
}

function applyAdoptPinnedBaseline(root: IsomorphRoot, snapshot: VendorSnapshot, now: Date | undefined): Effect.Effect<readonly string[], IsomorphError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const pinPath = yield* pinMetadataPath(root.isomorphRoot)
    const pinExists = yield* pathExists(pinPath)
    const actions: string[] = []

    if (pinExists) {
      const pin = yield* readPinEffect(root.isomorphRoot)
      if (!pinMatchesSnapshot(pin, snapshot)) {
        return yield* Effect.fail(new IsomorphConfigError({
          message: `cannot adopt pinned baseline while pin metadata already exists: ${pinPath}`,
        }))
      }
    }

    const initFiles = readPinnedBaselineFilesForLayer(isomorphSourceLayers.init)
    for (const file of initFiles) {
      const outputPath = initOutputPath(file.path)
      const destination = path.join(root.isomorphRoot, outputPath)
      if (yield* pathExists(destination)) {
        continue
      }
      yield* fs.makeDirectory(path.dirname(destination), { recursive: true }).pipe(
        Effect.mapError(error => new IsomorphRuntimeError({
          message: `failed to create repair directory: ${path.dirname(destination)}: ${formatUnknownCause(error)}`,
        })),
      )
      yield* writeAtomicString(destination, file.content)
      actions.push(`write missing baseline file: ${outputPath}`)
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
      actions.push('write pin metadata: .isomorph-pin.json')
    }

    return actions
  })
}

function writeRepairLog(root: IsomorphRoot, event: {
  readonly plan: string
  readonly beforeFingerprint: string
  readonly afterFingerprint: string
  readonly actions: readonly string[]
  readonly appliedAt: Date | undefined
}): Effect.Effect<void, IsomorphRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const logPath = path.join(root.isomorphRoot, '.isomorph-repair-log.ndjson')
    const previous = (yield* pathExists(logPath))
      ? yield* fs.readFileString(logPath, 'utf8').pipe(
        Effect.mapError(error => new IsomorphRuntimeError({
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

function writeAtomicString(destination: string, content: string): Effect.Effect<void, IsomorphRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    yield* fs.makeDirectory(path.dirname(destination), { recursive: true }).pipe(
      Effect.mapError(error => new IsomorphRuntimeError({
        message: `failed to create directory for atomic write: ${path.dirname(destination)}: ${formatUnknownCause(error)}`,
      })),
    )
    const temp = path.join(path.dirname(destination), `.${path.basename(destination)}.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`)
    yield* fs.writeFileString(temp, content).pipe(
      Effect.mapError(error => new IsomorphRuntimeError({
        message: `failed to write temp file: ${temp}: ${formatUnknownCause(error)}`,
      })),
    )
    yield* fs.rename(temp, destination).pipe(
      Effect.mapError(error => new IsomorphRuntimeError({
        message: `failed to commit atomic write: ${destination}: ${formatUnknownCause(error)}`,
      })),
    )
  })
}

function repairPlansForIssues(issues: readonly DoctorIssue[]): readonly DoctorRepairPlan[] {
  const codes = new Set(issues.map(issue => issue.code))
  return [
    ...(codes.has('missing-pin-metadata') || codes.has('missing-baseline-material') || codes.has('empty-isomorph-instance')
      ? [knownRepairPlan(adoptPinnedBaselinePlanId)]
      : []),
  ].filter((plan): plan is DoctorRepairPlan => plan !== undefined)
}

function knownRepairPlan(id: string): DoctorRepairPlan | undefined {
  if (id === adoptPinnedBaselinePlanId) {
    return {
      id,
      issues: ['missing-pin-metadata', 'missing-baseline-material', 'missing-recognition-authority', 'empty-isomorph-instance'],
      strategy: 'adopt-pinned-baseline',
      preconditions: [
        '.isomorph exists',
        '.isomorph/.isomorph-pin.json is absent or already resolves to the pinned baseline',
        'init output paths are only written when absent',
      ],
      actions: [
        'write absent init output files',
        'write .isomorph/.isomorph-pin.json when absent',
        'record repair log',
      ],
      postconditions: [
        'pin metadata decodes',
        'pin baseline resolves to pinned snapshot',
        'missing init output files now exist',
      ],
      verification: [
        'doctor inspect rerun',
        'strict upgrade succeeds',
        'synthetic concept recognition succeeds through pinned package material',
      ],
      rollback: 'failed atomic writes leave existing material untouched; repair log records only after apply',
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

function materialTarget(document: IsomorphDocument): string {
  return stripMdExtension(document.isomorphPath)
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
