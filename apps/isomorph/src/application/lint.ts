import type { FileSystem, Path } from 'effect'
import type { LintResult, ResolveOptions } from '../domain.js'
import type { IsomorphError } from '../errors.js'
import type { CurrentWorkingDirectoryService } from '../services.js'
import { Effect } from 'effect'
import { signalFromCandidate } from '../signal.js'
import { runRecognitionEffect } from './recognize.js'

export function runLintEffect(options: ResolveOptions & { readonly target: string }): Effect.Effect<LintResult, IsomorphError, CurrentWorkingDirectoryService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const run = yield* runRecognitionEffect(options)
    const signals = run.recognition.candidateSignalScope
      .filter(candidate => candidate.applicable)
      .map(candidate => signalFromCandidate(run.surface, run.recognition, candidate))

    return {
      root: run.root,
      recognition: run.recognition,
      signals,
      diagnostics: [
        ...run.recognition.diagnostics,
        ...run.recognition.candidateSignalScope.flatMap(candidate => candidate.diagnostics),
      ],
    }
  })
}
