import type { ContextaCapabilityDefinition, ContextaInstallResult, ContextaInstallTarget, ContextaRuntimePaths } from './domain.js'
import process from 'node:process'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { Effect, Option } from 'effect'
import * as Argument from 'effect/unstable/cli/Argument'
import * as Command from 'effect/unstable/cli/Command'
import * as Flag from 'effect/unstable/cli/Flag'
import { activationResult, capabilityResult, contextaInfraPackage, installCapability, listCapabilityDefinitions, resolveContextaPaths } from './runtime.js'

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
  Flag.withDescription('Workspace root or .contexta path'),
  Flag.withDefault(''),
)
const jsonFlag = Flag.boolean('json').pipe(
  Flag.withDescription('Print machine-readable JSON'),
)
const targetFlag = Flag.string('target').pipe(
  Flag.withDescription('Install target: codex-project or codex-user'),
  Flag.withDefault('codex-project'),
)
const targetDirFlag = Flag.string('target-dir').pipe(
  Flag.withDescription('Explicit install directory for materialized assets'),
  Flag.withDefault(''),
)
const forceFlag = Flag.boolean('force').pipe(
  Flag.withDescription('Replace an existing materialized skill'),
)
const dryRunFlag = Flag.boolean('dry-run').pipe(
  Flag.withDescription('Preview install paths without writing files'),
)

const contexta = Command.make('contexta').pipe(
  Command.withSharedFlags({
    root: rootFlag,
  }),
  Command.withDescription('Context infra CLI for capability/catalog/install/activation entrypoints'),
)

const capability = Command.make('capability', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const context = yield* contexta
    const root = context.root
    const workspace = yield* resolveWorkspace(root)
    const payload = {
      command: 'capability' as const,
      root: workspace,
    }
    yield* runCli(
      Effect.succeed(json ? capabilityResult(payload) : formatCapability(payload, resolveContextaPaths(workspace))),
      result => ({
        output: result,
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Enter the capability surface definitions'),
)

const catalog = Command.make('catalog', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const context = yield* contexta
    const root = context.root
    const workspace = yield* resolveWorkspace(root)
    const payload = {
      command: 'catalog' as const,
      root: workspace,
    }
    const catalog = listCapabilityDefinitions(workspace)
    yield* runCli(
      Effect.succeed(json ? formatJson(catalog) : formatCatalog(payload, resolveContextaPaths(workspace), catalog.items)),
      result => ({
        output: result,
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Resolve catalog locations for infra-backed assets'),
)

const installPlan = Command.make('plan', {
  capability: Argument.string('capability'),
  target: targetFlag,
  targetDir: targetDirFlag,
  json: jsonFlag,
}, ({ capability, json, target, targetDir }) =>
  Effect.gen(function* () {
    const context = yield* contexta
    const root = context.root
    const workspace = yield* resolveWorkspace(root)
    const resolvedTarget = yield* parseInstallTarget(target)
    yield* runCli(
      Effect.tryPromise({
        try: () => installCapability({
          capability,
          dryRun: true,
          force: false,
          root: workspace,
          target: resolvedTarget,
          targetDir,
        }),
        catch: toContextaCliError,
      }),
      result => ({
        output: json ? formatJson(result) : formatInstallResult(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Preview capability install paths without writing files'),
)

const installRoot = Command.make('install', {
  capability: Argument.string('capability').pipe(
    Argument.optional,
  ),
  target: targetFlag,
  targetDir: targetDirFlag,
  force: forceFlag,
  dryRun: dryRunFlag,
  json: jsonFlag,
}, ({ capability, dryRun, force, json, target, targetDir }) =>
  Effect.gen(function* () {
    const context = yield* contexta
    const root = context.root
    const workspace = yield* resolveWorkspace(root)
    const resolvedTarget = yield* parseInstallTarget(target)
    const capabilityId = Option.isSome(capability) ? capability.value : ''
    yield* runCli(
      capabilityId.trim().length === 0
        ? Effect.fail(new ContextaCliError('missing capability argument for install'))
        : Effect.tryPromise({
            try: () => installCapability({
              capability: capabilityId,
              dryRun,
              force,
              root: workspace,
              target: resolvedTarget,
              targetDir,
            }),
            catch: toContextaCliError,
          }),
      result => ({
        output: json ? formatJson(result) : formatInstallResult(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Install capability by identifier for the infra context'),
  Command.withSubcommands([installPlan]),
)

const activation = Command.make('activation', {
  mode: Argument.string('mode').pipe(
    Argument.optional,
  ),
  json: jsonFlag,
}, ({ mode, json }) =>
  Effect.gen(function* () {
    const context = yield* contexta
    const root = context.root
    const workspace = yield* resolveWorkspace(root)
    const resolvedMode = Option.getOrElse(mode, () => 'runtime')
    const payload = {
      command: 'activation' as const,
      mode: resolvedMode,
      root: workspace,
    }
    yield* runCli(
      Effect.succeed(json ? activationResult(payload) : formatActivation(payload, resolveContextaPaths(workspace))),
      result => ({
        output: result,
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Resolve activation entrypoint for a mode'),
)

const asset = Command.make('asset', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const context = yield* contexta
    const root = context.root
    const workspace = yield* resolveWorkspace(root)
    const payload = {
      command: 'asset' as const,
      root: workspace,
    }
    yield* runCli(
      Effect.succeed(json ? JSON.stringify(payload, null, 2) : formatAsset(payload, resolveContextaPaths(workspace))),
      result => ({
        output: result,
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Show capability asset location'),
)

const command = contexta.pipe(
  Command.withSubcommands([capability, catalog, installRoot, activation, asset]),
)

export const main: Effect.Effect<void, unknown> = Command.run(command, {
  version,
}).pipe(
  Effect.provide(NodeServices.layer),
)

function runCli<A>(run: Effect.Effect<A, unknown>, onSuccess: (result: A) => CliSuccess): Effect.Effect<void, never> {
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

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

function toContextaCliError(error: unknown): ContextaCliError {
  if (error instanceof ContextaCliError) {
    return error
  }
  if (error instanceof Error) {
    return new ContextaCliError(error.message)
  }
  return new ContextaCliError(String(error))
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

function resolveWorkspace(root: string): Effect.Effect<string> {
  return Effect.sync(() => root.trim().length === 0 ? process.cwd() : root)
}

function parseInstallTarget(target: string): Effect.Effect<ContextaInstallTarget, ContextaCliError> {
  if (target === 'codex-project' || target === 'codex-user') {
    return Effect.succeed(target)
  }
  return Effect.fail(new ContextaCliError(`invalid install target '${target}'. Expected codex-project or codex-user.`))
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function formatCapability(payload: { command: string }, paths: ContextaRuntimePaths): string {
  return [
    contextaInfraPackage,
    `command: ${payload.command}`,
    `contextaRoot: ${paths.contextaRoot}`,
    `capabilityRoot: ${paths.capabilityRoot}`,
    `catalogRoot: ${paths.catalogRoot}`,
  ].join('\n')
}

function formatCatalog(payload: { command: string }, paths: ContextaRuntimePaths, items: readonly ContextaCapabilityDefinition[]): string {
  return [
    contextaInfraPackage,
    `command: ${payload.command}`,
    `catalogRoot: ${paths.catalogRoot}`,
    'capabilities:',
    ...items.map(item => `- ${item.id} -> ${item.kind}:${item.materializedName}`),
  ].join('\n')
}

function formatInstallResult(result: ContextaInstallResult): string {
  return [
    contextaInfraPackage,
    `command: ${result.command}`,
    `capability: ${result.capability}`,
    `kind: ${result.kind}`,
    `materializedName: ${result.materializedName}`,
    `sourcePath: ${result.sourcePath}`,
    `targetPath: ${result.targetPath}`,
    `status: ${result.dryRun ? 'dry-run' : 'installed'}`,
    `overwritten: ${String(result.overwritten)}`,
  ].join('\n')
}

function formatActivation(payload: { command: string, mode: string }, paths: ContextaRuntimePaths): string {
  return [
    contextaInfraPackage,
    `command: ${payload.command}`,
    `mode: ${payload.mode}`,
    `activationRoot: ${paths.contextaRoot}`,
  ].join('\n')
}

function formatAsset(payload: { command: string }, paths: ContextaRuntimePaths): string {
  return [
    contextaInfraPackage,
    `command: ${payload.command}`,
    `assetRoot: ${paths.assetRoot}`,
  ].join('\n')
}
