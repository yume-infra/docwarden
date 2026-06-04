import type { Effect } from 'effect'
import type { IsomorphError } from './errors.js'
import type { IsomorphRuntimeServices } from './services.js'

export {
  runLintEffect,
} from './application/lint.js'
export {
  runPrimitiveSkillEffect,
} from './application/primitive-skill.js'
export {
  runRecognitionEffect,
} from './application/recognize.js'
export {
  runDoctorInspectEffect,
  runDoctorRepairEffect,
} from './doctor.js'
export type {
  BaselineStatus,
  DoctorInspectResult,
  DoctorIssue,
  DoctorIssueCode,
  DoctorRepairOptions,
  DoctorRepairPlan,
  DoctorRepairResult,
  InitOptions,
  InitResult,
  IsomorphDiagnostic,
  IsomorphRoot,
  LintResult,
  LintSignal,
  PinMetadata,
  PinStatus,
  PrimitiveDiagnostic,
  PrimitiveSkillExportDraft,
  PrimitiveSkillModel,
  PrimitiveSkillPlan,
  PrimitiveSkillResult,
  RecognitionFeatures,
  RecognitionResult,
  RecognitionRunResult,
  ResolveOptions,
  SignalCandidate,
  SourceListResult,
  SourceScopeSummary,
  TriggerHit,
  UpgradeStatusResult,
} from './domain.js'
export {
  IsomorphConfigError,
  type IsomorphError,
  IsomorphParseError,
  IsomorphRuntimeError,
  type RuntimeErrorKind,
  toIsomorphError,
} from './errors.js'
export {
  runInitEffect,
} from './init.js'
export {
  runSourceListEffect,
} from './mapping.js'
export { readPinEffect } from './pin.js'
export { resolveIsomorphRootEffect } from './root.js'
export { isomorphLiveLayer, type IsomorphRuntimeServices } from './services.js'
export {
  runUpgradeStatusEffect,
} from './upgrade.js'

export type IsomorphProgram<A> = Effect.Effect<A, IsomorphError, IsomorphRuntimeServices>
