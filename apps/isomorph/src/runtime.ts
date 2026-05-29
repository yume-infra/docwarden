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
  IsomorphInstance,
  IsomorphRoot,
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
  SourceMetadata,
  SourceReference,
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
export { readPinEffect } from './pin.js'
export { resolveIsomorphRootEffect } from './root.js'
export { isomorphLiveLayer, type IsomorphRuntimeServices } from './services.js'
export { detectIsomorphInstanceEffect, readSourceMetadataEffect } from './source.js'
export {
  runUpgradeStatusEffect,
} from './upgrade.js'

export type IsomorphProgram<A> = Effect.Effect<A, IsomorphError, IsomorphRuntimeServices>
