import type { SourceListResult, SourceScopeSummary } from './domain.js'
import type { IsomorphError } from './errors.js'
import type { IsomorphRuntimeServices } from './services.js'
import { Effect } from 'effect'
import { loadIsomorphModelEffect } from './local-model.js'
import { resolveIsomorphRootEffect } from './root.js'

export interface SourceListOptions {
  readonly root?: string | undefined
}

export function runSourceListEffect(options: SourceListOptions): Effect.Effect<SourceListResult, IsomorphError, IsomorphRuntimeServices> {
  return Effect.gen(function* () {
    const root = yield* resolveIsomorphRootEffect({ root: options.root })
    const model = yield* loadIsomorphModelEffect(root)
    const summaries = new Map<string, {
      modules: number
      kinds: Set<string>
      templates: Set<string>
    }>()

    for (const document of model.documents) {
      const match = /^([^/]+)\//.exec(document.isomorphPath)
      if (!match) {
        continue
      }
      const scope = match[1]!
      const current = summaries.get(scope) ?? {
        modules: 0,
        kinds: new Set<string>(),
        templates: new Set<string>(),
      }
      current.modules += 1
      if (document.kind !== undefined) {
        current.kinds.add(document.kind)
      }
      const template = /(?:^|\/)templates\/(.+)\.md$/.exec(document.isomorphPath)
      if (template) {
        current.templates.add(template[1]!)
      }
      summaries.set(scope, current)
    }

    const scopes: SourceScopeSummary[] = [...summaries.entries()]
      .map(([scope, summary]) => ({
        scope,
        path: `${scope}/`,
        modules: summary.modules,
        kinds: [...summary.kinds].sort(),
        templates: [...summary.templates].sort(),
      }))
      .sort((a, b) => a.scope.localeCompare(b.scope))

    return {
      root,
      scopes,
    }
  })
}
