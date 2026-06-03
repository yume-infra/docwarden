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

export interface SourceReference {
  readonly type: 'git'
  readonly url: string
  readonly path: string
}

export interface SourceMetadata {
  readonly schemaVersion: number
  readonly role: 'origin'
  readonly source: SourceReference
  readonly createdAt: string
}

export type IsomorphInstance
  = | {
    readonly status: 'origin'
    readonly root: string
    readonly source: SourceMetadata
  }
  | {
    readonly status: 'derived-v0'
    readonly root: string
    readonly pin: PinMetadata
  }
  | {
    readonly status: 'unclassified'
    readonly root: string
    readonly reason: 'missing-pin-metadata' | 'invalid-pin-metadata'
  }

export interface IsomorphRoot {
  readonly workspaceRoot: string
  readonly isomorphRoot: string
  readonly source: 'explicit' | 'target' | 'cwd'
}

export interface InitOptions {
  readonly root?: string | undefined
  readonly cwd?: string | undefined
  readonly now?: Date | undefined
}

export interface InitResult {
  readonly workspaceRoot: string
  readonly isomorphRoot: string
  readonly pin: PinMetadata
  readonly filesWritten: number
}

export interface ResolveOptions {
  readonly root?: string | undefined
  readonly target?: string | undefined
  readonly cwd?: string | undefined
}

export interface IsomorphDocument {
  readonly absolutePath: string
  readonly isomorphPath: string
  readonly surface: MarkdownSurface
  readonly title: string
  readonly kind: string | undefined
}

export interface RecognitionRule {
  readonly id: string
  readonly isomorphPath: string
  readonly role: string
  readonly confidence: number
  readonly triggerLines: readonly string[]
  readonly basis: readonly string[]
}

export interface SignalDefinition {
  readonly id: string
  readonly isomorphPath: string
  readonly definition: string
  readonly lossModel: string
  readonly triggerLines: readonly string[]
  readonly basis: readonly string[]
}

export interface IsomorphModel {
  readonly root: IsomorphRoot
  readonly documents: readonly IsomorphDocument[]
  readonly localKinds: ReadonlySet<string>
  readonly recognitionRules: readonly RecognitionRule[]
  readonly signals: readonly SignalDefinition[]
  readonly skillPrimitiveMaterial: readonly IsomorphDocument[]
}

export interface SourceScopeSummary {
  readonly scope: string
  readonly path: string
  readonly modules: number
  readonly kinds: readonly string[]
  readonly templates: readonly string[]
}

export interface SourceListResult {
  readonly root: IsomorphRoot
  readonly scopes: readonly SourceScopeSummary[]
}

export interface TriggerHit {
  readonly raw: string
  readonly known: boolean
  readonly matched: boolean
  readonly evidence: string
  readonly context: string | undefined
  readonly source: 'recognition' | 'surface'
}

export interface IsomorphDiagnostic {
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
  readonly isomorphPath: string
  readonly applicable: boolean
  readonly matched: number
  readonly total: number
  readonly triggerHits: readonly TriggerHit[]
  readonly basis: readonly string[]
  readonly lossModel: string
  readonly confidence: number
  readonly applicabilityBasis: 'recognition-role' | 'surface-feature' | 'mixed' | 'none'
  readonly diagnostics: readonly IsomorphDiagnostic[]
}

export interface RecognitionResult {
  readonly target: string
  readonly recognizedRole: string
  readonly basis: readonly string[]
  readonly confidence: number
  readonly features: RecognitionFeatures
  readonly diagnostics: readonly IsomorphDiagnostic[]
  readonly candidateSignalScope: readonly SignalCandidate[]
}

export interface RecognitionRunResult {
  readonly root: IsomorphRoot
  readonly model: IsomorphModel
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
  readonly root: IsomorphRoot
  readonly recognition: RecognitionResult
  readonly signals: readonly LintSignal[]
  readonly diagnostics: readonly IsomorphDiagnostic[]
}

export interface PrimitiveDiagnostic {
  readonly severity: 'info' | 'warning'
  readonly message: string
}

export interface PrimitiveSkillModel {
  readonly driftPressure: string | undefined
  readonly pressureScenarios: readonly string[]
  readonly intervention: string | undefined
  readonly interventionMoves: readonly string[]
  readonly activation: string | undefined
  readonly activationTriggers: readonly string[]
  readonly activationExclusions: readonly string[]
  readonly judgmentSurface: readonly string[]
  readonly deterministicBoundary: readonly string[]
  readonly reviewGate: readonly string[]
  readonly exportShape: readonly string[]
  readonly confirmationGates: readonly string[]
  readonly outputContract: readonly string[]
  readonly antiPatterns: readonly string[]
  readonly semanticBasisLinks: readonly string[]
  readonly references: readonly string[]
  readonly scripts: readonly string[]
  readonly assets: readonly string[]
  readonly progressiveLoading: readonly string[]
  readonly validation: readonly string[]
  readonly exportPosition: string | undefined
  readonly futureSkillExportRequirements: readonly string[]
}

export interface PrimitiveSkillExportDraft {
  readonly artifact: 'codex-skill'
  readonly skillName: string
  readonly description: string | undefined
  readonly readiness: 'ready' | 'blocked'
  readonly missingForExport: readonly string[]
  readonly frontmatter: {
    readonly name: string
    readonly description: string | undefined
  }
  readonly bodyOutline: readonly string[]
  readonly driftPressure: string | undefined
  readonly intervention: string | undefined
  readonly judgmentSurface: readonly string[]
  readonly deterministicBoundary: readonly string[]
  readonly reviewGate: readonly string[]
  readonly exportShape: readonly string[]
  readonly pressureScenarios: readonly string[]
  readonly antiPatterns: readonly string[]
  readonly resources: {
    readonly references: readonly string[]
    readonly scripts: readonly string[]
    readonly assets: readonly string[]
  }
  readonly progressiveLoading: readonly string[]
  readonly validation: readonly string[]
  readonly trace: readonly string[]
}

export interface PrimitiveSkillPlan {
  readonly compiler: 'draft-skill-v0'
  readonly exportable: boolean
  readonly missingForExport: readonly string[]
  readonly futureSkillExportRequirements: readonly string[]
}

export interface PrimitiveSkillResult {
  readonly root: IsomorphRoot
  readonly target: string
  readonly recognizedRole: string
  readonly status: 'ready' | 'needs-work'
  readonly model: PrimitiveSkillModel
  readonly plan: PrimitiveSkillPlan
  readonly exportDraft: PrimitiveSkillExportDraft
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

export interface DerivedUpgradeStatusResult {
  readonly status: 'derived-v0'
  readonly root: IsomorphRoot
  readonly localInstance: {
    readonly status: 'derived-v0'
    readonly root: string
  }
  readonly pinStatus: PinStatus
  readonly pinnedBaseline: BaselineStatus | undefined
  readonly newBaseline: BaselineStatus
  readonly localCustomization: 'untouched'
  readonly mergeEngine: 'not-implemented-v0'
}

export interface OriginUpgradeStatusResult {
  readonly status: 'origin'
  readonly root: IsomorphRoot
  readonly localInstance: {
    readonly status: 'origin'
    readonly root: string
    readonly source: SourceMetadata
  }
  readonly sourceStatus: {
    readonly status: 'origin'
    readonly source: SourceMetadata
  }
  readonly localCustomization: 'source-authoring'
  readonly mergeEngine: 'not-implemented-v0'
}

export type UpgradeStatusResult = DerivedUpgradeStatusResult | OriginUpgradeStatusResult

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
    | 'empty-isomorph-instance'
    | 'nested-isomorph-root'

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
  readonly root: IsomorphRoot
  readonly instance: IsomorphInstance
  readonly status: 'clean' | 'issues'
  readonly issues: readonly DoctorIssue[]
  readonly repairPlans: readonly DoctorRepairPlan[]
}

export interface DoctorRepairOptions extends ResolveOptions {
  readonly plan: string
  readonly now?: Date | undefined
}

export interface DoctorRepairResult {
  readonly root: IsomorphRoot
  readonly plan: DoctorRepairPlan
  readonly applied: boolean
  readonly actions: readonly string[]
  readonly issuesBefore: readonly DoctorIssue[]
  readonly issuesAfter: readonly DoctorIssue[]
  readonly verification: readonly string[]
}
