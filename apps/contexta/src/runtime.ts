import type { Effect } from 'effect'
import type { ContextaError } from './errors.js'
import type { ContextaRuntimeServices } from './services.js'

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
  ContextaDiagnostic,
  ContextaRoot,
  DoctorInspectResult,
  DoctorIssue,
  DoctorIssueCode,
  DoctorRepairOptions,
  DoctorRepairPlan,
  DoctorRepairResult,
  InitOptions,
  InitResult,
  LintResult,
  LintSignal,
  PinMetadata,
  PinStatus,
  PrimitiveDiagnostic,
  PrimitiveSkillModel,
  PrimitiveSkillPlan,
  PrimitiveSkillResult,
  RecognitionFeatures,
  RecognitionResult,
  RecognitionRunResult,
  ResolveOptions,
  SignalCandidate,
  TriggerHit,
  UpgradeStatusResult,
} from './domain.js'
export {
  ContextaConfigError,
  type ContextaError,
  ContextaParseError,
  ContextaRuntimeError,
  type RuntimeErrorKind,
  toContextaError,
} from './errors.js'
export {
  runInitEffect,
} from './init.js'
export { readPinEffect } from './pin.js'
export { resolveContextaRootEffect } from './root.js'
export { contextaLiveLayer, type ContextaRuntimeServices } from './services.js'
export {
  runUpgradeStatusEffect,
} from './upgrade.js'

export type ContextaProgram<A> = Effect.Effect<A, ContextaError, ContextaRuntimeServices>
