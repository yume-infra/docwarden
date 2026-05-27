export interface Frontmatter {
  readonly [key: string]: string
}

export interface Heading {
  readonly level: number
  readonly text: string
  readonly line: number
}

export interface LocatorMarker {
  readonly marker: string
  readonly line: number
  readonly text: string
}

export interface OfmLink {
  readonly raw: string
  readonly target: string
  readonly label: string | undefined
}

export interface Section {
  readonly heading: Heading
  readonly text: string
  readonly startLine: number
  readonly endLine: number
  readonly locatorMarkers: readonly LocatorMarker[]
}

export interface MarkdownSurface {
  readonly path: string
  readonly content: string
  readonly frontmatter: Frontmatter
  readonly body: string
  readonly headings: readonly Heading[]
  readonly sections: readonly Section[]
  readonly locatorMarkers: readonly LocatorMarker[]
  readonly ofmLinks: readonly OfmLink[]
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
  readonly source: 'recognition' | 'surface'
}

export interface ContextaDiagnostic {
  readonly severity: 'info' | 'warning' | 'error'
  readonly code: string
  readonly message: string
  readonly target: string | undefined
  readonly evidence: string | undefined
}

export interface RecognitionFeatures {
  readonly path: string
  readonly frontmatter: Readonly<Record<string, string>>
  readonly headings: readonly string[]
  readonly locatorMarkers: readonly string[]
  readonly ofmLinks: readonly string[]
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
  readonly applicabilityBasis: 'recognition-role' | 'surface-feature' | 'mixed' | 'none'
  readonly diagnostics: readonly ContextaDiagnostic[]
}

export interface RecognitionResult {
  readonly target: string
  readonly recognizedRole: string
  readonly basis: readonly string[]
  readonly confidence: number
  readonly features: RecognitionFeatures
  readonly diagnostics: readonly ContextaDiagnostic[]
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
  readonly diagnostics: readonly ContextaDiagnostic[]
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

export interface BaselineStatus {
  readonly vendor: string
  readonly ref: string
  readonly schemaVersion: number
  readonly digest: string
}

export interface UpgradeStatusResult {
  readonly root: ContextaRoot
  readonly localInstance: {
    readonly status: 'pinned-v0'
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

export type DoctorIssueCode
  = | 'missing-recognition-authority'
    | 'invalid-recognition-trigger'
    | 'missing-pin-metadata'
    | 'invalid-pin-metadata'
    | 'unknown-pin-baseline'
    | 'baseline-material-conflict'
    | 'missing-baseline-material'
    | 'missing-signal-loss-model'
    | 'unparsed-signal-trigger'
    | 'broken-primitive-semantic-basis-link'
    | 'empty-contexta-instance'
    | 'nested-contexta-root'

export interface DoctorIssue {
  readonly code: DoctorIssueCode
  readonly severity: 'error' | 'warning' | 'info'
  readonly target: string
  readonly summary: string
  readonly evidence: string
  readonly impact: string
  readonly repairability: 'auto' | 'plan-only' | 'manual'
  readonly repair: string | undefined
}

export interface DoctorRepairPlan {
  readonly id: string
  readonly issues: readonly DoctorIssueCode[]
  readonly strategy: string
  readonly preconditions: readonly string[]
  readonly actions: readonly string[]
  readonly postconditions: readonly string[]
  readonly verification: readonly string[]
  readonly rollback: string
}

export interface DoctorInspectResult {
  readonly root: ContextaRoot
  readonly status: 'clean' | 'issues'
  readonly issues: readonly DoctorIssue[]
  readonly repairPlans: readonly DoctorRepairPlan[]
}

export interface DoctorRepairOptions extends ResolveOptions {
  readonly plan: string
  readonly now?: Date | undefined
}

export interface DoctorRepairResult {
  readonly root: ContextaRoot
  readonly plan: DoctorRepairPlan
  readonly applied: boolean
  readonly actions: readonly string[]
  readonly issuesBefore: readonly DoctorIssue[]
  readonly issuesAfter: readonly DoctorIssue[]
  readonly verification: readonly string[]
}
