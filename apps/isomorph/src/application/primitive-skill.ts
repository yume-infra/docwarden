import type { FileSystem, Path } from 'effect'
import type { PrimitiveSkillResult, ResolveOptions } from '../domain.js'
import type { IsomorphError } from '../errors.js'
import type { CurrentWorkingDirectoryService } from '../services.js'
import { Effect } from 'effect'
import { analyzePrimitiveSkill } from '../primitive-skill.js'
import { runRecognitionEffect } from './recognize.js'

export function runPrimitiveSkillEffect(options: ResolveOptions & { readonly target: string }): Effect.Effect<PrimitiveSkillResult, IsomorphError, CurrentWorkingDirectoryService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const run = yield* runRecognitionEffect(options)
    return analyzePrimitiveSkill(run)
  })
}
