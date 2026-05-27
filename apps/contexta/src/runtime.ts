import type { LintResult, PrimitiveSkillResult, RecognitionRunResult, ResolveOptions } from './domain.js'
import type { ContextaError } from './errors.js'
import type { ContextaRuntimeServices, CurrentWorkingDirectoryService } from './services.js'
import { Effect, FileSystem, Path } from 'effect'
import { ContextaRuntimeError, formatUnknownCause } from './errors.js'
import { runInitEffect } from './init.js'
import { loadContextaModelEffect } from './local-model.js'
import { parseMarkdownSurface } from './markdown.js'
import { analyzePrimitiveSkill } from './primitive-skill.js'
import { recognizeSurface } from './recognition.js'
import { assertTargetInside, resolveContextaRootEffect, toWorkspacePath } from './root.js'
import { CurrentWorkingDirectory } from './services.js'
import { signalFromCandidate } from './signal.js'
import { runUpgradeStatusEffect } from './upgrade.js'

export type {
  BaselineStatus,
  ContextaDocument,
  ContextaModel,
  ContextaRoot,
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
  RecognitionResult,
  RecognitionRule,
  RecognitionRunResult,
  ResolveOptions,
  SignalCandidate,
  SignalDefinition,
  TriggerHit,
  UpgradeStatusResult,
} from './domain.js'
export {
  ContextaConfigError,
  type ContextaError,
  ContextaParseError,
  ContextaRuntimeError,
  formatUnknownCause,
  isContextaError,
  type RuntimeErrorKind,
  toContextaError,
} from './errors.js'
export { readPinEffect } from './pin.js'
export { resolveContextaRootEffect } from './root.js'
export { contextaLiveLayer, type ContextaRuntimeServices } from './services.js'

export function runRecognitionEffect(options: ResolveOptions & { readonly target: string }): Effect.Effect<RecognitionRunResult, ContextaError, CurrentWorkingDirectoryService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    const cwdService = yield* CurrentWorkingDirectory
    const root = yield* resolveContextaRootEffect(options)
    const model = yield* loadContextaModelEffect(root)
    const cwd = path.resolve(options.cwd ?? (yield* cwdService.current))
    const target = path.resolve(cwd, options.target)
    yield* assertTargetInside(root.workspaceRoot, target)
    const content = yield* fs.readFileString(target, 'utf8').pipe(
      Effect.mapError(error => new ContextaRuntimeError({
        message: `failed to read target: ${target}: ${formatUnknownCause(error)}`,
      })),
    )
    const surface = parseMarkdownSurface(content, yield* toWorkspacePath(root.workspaceRoot, target))
    const recognition = recognizeSurface(model, surface)

    return {
      root,
      model,
      surface,
      recognition,
    }
  })
}

export function runLintEffect(options: ResolveOptions & { readonly target: string }): Effect.Effect<LintResult, ContextaError, CurrentWorkingDirectoryService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const run = yield* runRecognitionEffect(options)
    const signals = run.recognition.candidateSignalScope
      .filter(candidate => candidate.applicable)
      .map(candidate => signalFromCandidate(run.surface, run.recognition, candidate))

    return {
      root: run.root,
      recognition: run.recognition,
      signals,
    }
  })
}

export function runPrimitiveSkillEffect(options: ResolveOptions & { readonly target: string }): Effect.Effect<PrimitiveSkillResult, ContextaError, CurrentWorkingDirectoryService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const run = yield* runRecognitionEffect(options)
    return analyzePrimitiveSkill(run)
  })
}

export {
  runInitEffect,
  runUpgradeStatusEffect,
}

export const runInit: typeof runInitEffect = runInitEffect
export const runRecognition: typeof runRecognitionEffect = runRecognitionEffect
export const runLint: typeof runLintEffect = runLintEffect
export const runPrimitiveSkill: typeof runPrimitiveSkillEffect = runPrimitiveSkillEffect
export const runUpgradeStatus: typeof runUpgradeStatusEffect = runUpgradeStatusEffect

export type ContextaProgram<A> = Effect.Effect<A, ContextaError, ContextaRuntimeServices>
