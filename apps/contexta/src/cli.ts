import type {
  ContextaAssetExportResult,
  ContextaExportCodexResult,
  ContextaListAssetsResult,
} from './domain.js'
import process from 'node:process'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { Effect, Option } from 'effect'
import * as Argument from 'effect/unstable/cli/Argument'
import * as Command from 'effect/unstable/cli/Command'
import * as Flag from 'effect/unstable/cli/Flag'
import { ContextaError } from './domain.js'

import {
  contextaInfraPackage,
  exportCodexAssets,
  listAssets,
  resolveContextaPaths,
} from './runtime.js'

export const version = '0.0.0'

interface CliSuccess {
  readonly output: string
  readonly exitCode: number
}

class ContextaCliError extends Error {
  readonly _tag = 'ContextaCliError' as const

  constructor(message: string) {
    super(message)
    this.name = 'ContextaCliError'
  }
}

const rootFlag = Flag.string('root').pipe(
  Flag.withDescription('Project root containing .contexta'),
  Flag.withDefault(''),
)

const jsonFlag = Flag.boolean('json').pipe(
  Flag.withDescription('Print machine-readable JSON'),
)

const targetDirFlag = Flag.string('target-dir').pipe(
  Flag.withDescription('Explicit target root override for Codex exports'),
  Flag.withDefault(''),
)

const dryRunFlag = Flag.boolean('dry-run').pipe(
  Flag.withDescription('Preview export output paths without writing files'),
)

const forceFlag = Flag.boolean('force').pipe(
  Flag.withDescription('Overwrite existing Codex targets'),
)

const contexta = Command.make('contexta').pipe(
  Command.withSharedFlags({
    root: rootFlag,
  }),
  Command.withDescription('Pack-first context source and Codex export CLI'),
)

const assets = Command.make('assets', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const context = yield* contexta
    const workspace = resolveWorkspace(context.root)
    const payload = runContextaEffect(() => listAssets(workspace)).pipe(
      Effect.map((catalog): ContextaListAssetsResult => ({
        command: 'assets',
        workspaceRoot: workspace,
        contextaRoot: resolveContextaPaths(workspace).contextaRoot,
        catalog,
      })),
    )
    yield* runCli(
      payload,
      payload => runAssetsResult(payload, json),
    )
  })).pipe(
  Command.withDescription('List discovered assets from .contexta/packs/**'),
)

const exportCodex = Command.make('codex', {
  all: Flag.boolean('all').pipe(
    Flag.withDescription('Export all assets'),
    Flag.withDefault(false),
  ),
  assetOrPackId: Argument.string('asset-or-pack-id').pipe(
    Argument.optional,
  ),
  targetDir: targetDirFlag,
  dryRun: dryRunFlag,
  force: forceFlag,
  json: jsonFlag,
}, ({ all, assetOrPackId, targetDir, dryRun, force, json }) =>
  Effect.gen(function* () {
    const context = yield* contexta
    const workspace = resolveWorkspace(context.root)
    const selectors = Option.isSome(assetOrPackId)
      ? [assetOrPackId.value]
      : []

    if (!all && selectors.length === 0) {
      yield* runCli(
        Effect.fail(new ContextaCliError('missing export selector. use --all or pass <asset-or-pack-id>')),
        result => runExportCodexResult(result, json),
      )
      return
    }
    if (all && selectors.length > 0) {
      yield* runCli(
        Effect.fail(new ContextaCliError('do not pass both --all and <asset-or-pack-id>')),
        result => runExportCodexResult(result, json),
      )
      return
    }

    yield* runCli(
      runContextaEffect(() => exportCodexAssets({
        workspaceRoot: workspace,
        selectors,
        all,
        dryRun,
        force,
        targetDir,
      })),
      result => runExportCodexResult(result, json),
    )
  })).pipe(
  Command.withDescription('Export contexta assets to Codex'),
)

const exportCommand = Command.make('export').pipe(
  Command.withSubcommands([exportCodex]),
)

const command = contexta.pipe(
  Command.withSubcommands([assets, exportCommand]),
)

export const main: Effect.Effect<void, unknown> = Command.run(command, {
  version,
}).pipe(
  Effect.provide(NodeServices.layer),
)

function runContextaEffect<T>(run: () => Promise<T>): Effect.Effect<T, ContextaError | ContextaCliError, never> {
  return Effect.tryPromise({
    try: () => run(),
    catch: toContextaError,
  })
}

function runCli<A>(run: Effect.Effect<A, ContextaError | ContextaCliError, never>, onSuccess: (result: A) => CliSuccess): Effect.Effect<void, never> {
  return run.pipe(
    Effect.matchEffect({
      onFailure: error => writeStderr(`contexta error: ${formatError(error)}`).pipe(
        Effect.andThen(setExitCode(2)),
      ),
      onSuccess: (result) => {
        const success = onSuccess(result)
        return writeStdout(success.output).pipe(
          Effect.andThen(setExitCode(success.exitCode)),
        )
      },
    }),
  )
}

function runAssetsResult(payload: ContextaListAssetsResult, json: boolean): CliSuccess {
  if (json) {
    return {
      output: formatJson(payload),
      exitCode: 0,
    }
  }

  return {
    output: formatAssets(payload),
    exitCode: 0,
  }
}

function runExportCodexResult(result: ContextaExportCodexResult, json: boolean): CliSuccess {
  if (json) {
    return {
      output: formatJson(result),
      exitCode: 0,
    }
  }

  return {
    output: formatExportResult(result),
    exitCode: 0,
  }
}

function formatAssets(input: ContextaListAssetsResult): string {
  const lines = [
    contextaInfraPackage,
    `contextaRoot: ${input.contextaRoot}`,
    `workspaceRoot: ${input.workspaceRoot}`,
    `packs: ${input.catalog.packs.length}`,
    `assets: ${input.catalog.assets.length}`,
    'assetIds:',
  ]

  for (const asset of input.catalog.assets) {
    lines.push(`- ${asset.id} -> ${asset.sourcePath}`)
  }

  return lines.join('\n')
}

function formatExportResult(result: ContextaExportCodexResult): string {
  const lines = [
    contextaInfraPackage,
    `command: ${result.command}`,
    `target: ${result.target}`,
    `targetRoot: ${result.targetRoot}`,
    `dryRun: ${String(result.dryRun)}`,
    `items: ${result.items.length}`,
  ]
  for (const item of result.items) {
    lines.push(`- ${formatExportItem(item)}`)
  }
  return lines.join('\n')
}

function formatExportItem(item: ContextaAssetExportResult): string {
  const status = item.skipped ? 'skip' : 'write'
  return `${item.kind} ${item.assetId} -> ${item.destinationPaths.join(', ')} (${status})`
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function toContextaError(error: unknown): ContextaError | ContextaCliError {
  if (error instanceof ContextaError) {
    return error
  }
  if (error instanceof ContextaCliError) {
    return error
  }
  if (error instanceof Error) {
    return new ContextaError(error.message)
  }
  return new ContextaError(String(error))
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

function writeStdout(message: string): Effect.Effect<void> {
  return Effect.sync(() => {
    process.stdout.write(message.length === 0 ? '' : `${message}\n`)
  })
}

function writeStderr(message: string): Effect.Effect<void> {
  return Effect.sync(() => {
    process.stderr.write(`${message}\n`)
  })
}

function setExitCode(exitCode: number): Effect.Effect<void> {
  return Effect.sync(() => {
    process.exitCode = exitCode
  })
}

function resolveWorkspace(root: string): string {
  return root.trim().length === 0 ? process.cwd() : root
}
