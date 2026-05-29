import type { ContextaRuntimePaths } from './domain.js'
import process from 'node:process'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { Effect, Option } from 'effect'
import * as Argument from 'effect/unstable/cli/Argument'
import * as Command from 'effect/unstable/cli/Command'
import * as Flag from 'effect/unstable/cli/Flag'
import { activationResult, capabilityResult, contextaInfraPackage, installCapabilityResult, resolveContextaPaths } from './runtime.js'

export const version = '0.0.0'

interface CliSuccess {
  readonly output: string
  readonly exitCode: number
}

const rootFlag = Flag.string('root').pipe(
  Flag.withDescription('Workspace root or .contexta path'),
  Flag.withDefault(''),
)
const jsonFlag = Flag.boolean('json').pipe(
  Flag.withDescription('Print machine-readable JSON'),
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
    yield* runCli(
      Effect.succeed(json ? capabilityResult(payload) : formatCapability(payload, resolveContextaPaths(workspace))),
      result => ({
        output: result,
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Resolve catalog locations for infra-backed assets'),
)

const install = Command.make('install', {
  capability: Argument.string('capability'),
  json: jsonFlag,
}, ({ capability, json }) =>
  Effect.gen(function* () {
    const context = yield* contexta
    const root = context.root
    const workspace = yield* resolveWorkspace(root)
    const payload = {
      command: 'install' as const,
      capability,
      root: workspace,
    }
    yield* runCli(
      Effect.succeed(json ? installCapabilityResult(payload) : formatInstall(payload, resolveContextaPaths(workspace))),
      result => ({
        output: result,
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Install capability by identifier for the infra context'),
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
  Command.withSubcommands([capability, catalog, install, activation, asset]),
)

export const main: Effect.Effect<void, unknown> = Command.run(command, {
  version,
}).pipe(
  Effect.provide(NodeServices.layer),
)

function runCli<A>(run: Effect.Effect<A>, onSuccess: (result: A) => CliSuccess): Effect.Effect<void, never> {
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

function formatCapability(payload: { command: string }, paths: ContextaRuntimePaths): string {
  return [
    contextaInfraPackage,
    `command: ${payload.command}`,
    `contextaRoot: ${paths.contextaRoot}`,
    `capabilityRoot: ${paths.capabilityRoot}`,
    `catalogRoot: ${paths.catalogRoot}`,
  ].join('\n')
}

function formatInstall(payload: { command: string, capability: string }, paths: ContextaRuntimePaths): string {
  return [
    contextaInfraPackage,
    `command: ${payload.command}`,
    `capability: ${payload.capability}`,
    `installRoot: ${paths.contextaRoot}`,
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
