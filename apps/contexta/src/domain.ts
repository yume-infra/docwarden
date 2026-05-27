import type { MarkdownSurface } from './markdown.js'

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

export interface RecognitionRule {
  readonly id: string
  readonly contextaPath: string
  readonly role: string
  readonly confidence: number
  readonly triggerLines: readonly string[]
  readonly basis: readonly string[]
}

export interface SignalDefinition {
  readonly id: string
  readonly contextaPath: string
  readonly definition: string
  readonly lossModel: string
  readonly triggerLines: readonly string[]
  readonly basis: readonly string[]
}

export interface ContextaModel {
  readonly root: ContextaRoot
  readonly documents: readonly ContextaDocument[]
  readonly localKinds: ReadonlySet<string>
  readonly recognitionRules: readonly RecognitionRule[]
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
  readonly lossModel: string
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
  readonly lossModel: string
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

export interface PrimitiveSkillModel {
  readonly capability: string | undefined
  readonly trigger: string | undefined
  readonly semanticBasisLinks: readonly string[]
  readonly exportPosition: string | undefined
  readonly futureSkillExportRequirements: readonly string[]
}

export interface PrimitiveSkillPlan {
  readonly compiler: 'not-implemented-v0'
  readonly futureSkillExportRequirements: readonly string[]
}

export interface PrimitiveSkillResult {
  readonly root: ContextaRoot
  readonly target: string
  readonly recognizedRole: string
  readonly status: 'ready' | 'needs-work'
  readonly model: PrimitiveSkillModel
  readonly plan: PrimitiveSkillPlan
  readonly sourceMaterial: readonly string[]
  readonly requiredSections: readonly string[]
  readonly presentSections: readonly string[]
  readonly exportPosition: {
    readonly present: boolean
    readonly excerpt: string | undefined
  }
  readonly diagnostics: readonly PrimitiveDiagnostic[]
}

export type PinStatus
  = | {
    readonly status: 'pinned-v0'
    readonly pin: PinMetadata
  }
  | {
    readonly status: 'pre-v0-without-pin'
    readonly pinPath: string
  }

export interface BaselineStatus {
  readonly vendor: string
  readonly ref: string
  readonly schemaVersion: number
  readonly digest: string
}

export interface UpgradeStatusResult {
  readonly root: ContextaRoot
  readonly localInstance: {
    readonly status: 'pinned-v0' | 'pre-v0-without-pin'
    readonly root: string
  }
  readonly pinStatus: PinStatus
  readonly pinnedBaseline: BaselineStatus | undefined
  readonly newBaseline: BaselineStatus
  readonly localCustomization: 'untouched'
  readonly mergeEngine: 'not-implemented-v0'
}

export interface RoleCandidate {
  readonly role: string
  readonly basis: readonly string[]
  readonly confidence: number
}
