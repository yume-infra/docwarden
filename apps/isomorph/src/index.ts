#!/usr/bin/env node

import { realpathSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import * as NodeRuntime from '@effect/platform-node/NodeRuntime'

import { main } from './cli.js'

export {
  main,
  version,
} from './cli.js'
export {
  IsomorphConfigError,
  isomorphLiveLayer,
  IsomorphParseError,
  IsomorphRuntimeError,
  readPinEffect,
  resolveIsomorphRootEffect,
  runDoctorInspectEffect,
  runDoctorRepairEffect,
  runInitEffect,
  runLintEffect,
  runMappingListEffect,
  runPrimitiveSkillEffect,
  runRecognitionEffect,
  runUpgradeStatusEffect,
  toIsomorphError,
} from './runtime.js'
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
  IsomorphError,
  IsomorphProgram,
  IsomorphRoot,
  IsomorphRuntimeServices,
  LintResult,
  LintSignal,
  MappingListResult,
  MappingScopeSummary,
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
  RuntimeErrorKind,
  SignalCandidate,
  TriggerHit,
  UpgradeStatusResult,
} from './runtime.js'

function isMain(): boolean {
  const entry = process.argv[1]
  return entry !== undefined && realpathSync(path.resolve(entry)) === fileURLToPath(import.meta.url)
}

if (isMain()) {
  NodeRuntime.runMain(main)
}
