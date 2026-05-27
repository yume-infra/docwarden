import type { RecognitionRunResult, ResolveOptions } from '../domain.js'
import type { ContextaError } from '../errors.js'
import type { CurrentWorkingDirectoryService } from '../services.js'
import { Effect, FileSystem, Path } from 'effect'
import { ContextaRuntimeError, formatUnknownCause } from '../errors.js'
import { loadContextaModelEffect } from '../local-model.js'
import { parseMarkdownSurface } from '../markdown.js'
import { recognizeSurfaceEffect } from '../recognition.js'
import { assertTargetInside, resolveContextaRootEffect, toWorkspacePath } from '../root.js'
import { CurrentWorkingDirectory } from '../services.js'
import { evaluateSignal } from '../signal.js'

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
    const recognitionBase = yield* recognizeSurfaceEffect(model, surface)
    const candidateSignalScope = model.signals.map(signal => evaluateSignal(signal, surface, recognitionBase))
    const recognition = {
      ...recognitionBase,
      candidateSignalScope,
    }

    return {
      root,
      model,
      surface,
      recognition,
    }
  })
}
