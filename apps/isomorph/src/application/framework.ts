import type { FileSystem, Path } from 'effect'
import type { FrameworkListResult, ResolveOptions } from '../domain.js'
import type { IsomorphError } from '../errors.js'
import type { CurrentWorkingDirectoryService } from '../services.js'
import { Effect } from 'effect'
import { collectFrameworkSummaries } from '../framework-model.js'
import { loadIsomorphModelEffect } from '../local-model.js'
import { resolveIsomorphRootEffect } from '../root.js'

export function runFrameworkListEffect(options: ResolveOptions = {}): Effect.Effect<FrameworkListResult, IsomorphError, CurrentWorkingDirectoryService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const root = yield* resolveIsomorphRootEffect(options)
    const model = yield* loadIsomorphModelEffect(root)
    return {
      root,
      frameworks: collectFrameworkSummaries(model.documents),
    }
  })
}
