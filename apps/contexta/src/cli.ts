import type { InitResult, LintResult, PrimitiveSkillResult, RecognitionRunResult, UpgradeStatusResult } from './runtime.js'

import process from 'node:process'
import * as NodeServices from '@effect/platform-node/NodeServices'
import * as Effect from 'effect/Effect'
import * as Argument from 'effect/unstable/cli/Argument'
import * as Command from 'effect/unstable/cli/Command'
import * as Flag from 'effect/unstable/cli/Flag'
import {
  runInit,
  runLint,
  runPrimitiveSkill,
  runRecognition,
  runUpgradeStatus,
  toContextaError,
} from './runtime.js'

export const version = '0.0.0'

interface CliSuccess {
  readonly output: string
  readonly exitCode: number
}

const rootFlag = Flag.string('root').pipe(
  Flag.withDescription('Project root or local .contexta path'),
  Flag.withDefault(''),
)

const jsonFlag = Flag.boolean('json').pipe(
  Flag.withDescription('Print machine-readable JSON'),
)

const contexta = Command.make('contexta').pipe(
  Command.withSharedFlags({
    root: rootFlag,
  }),
  Command.withDescription('Run the local contexta runtime'),
)

const init = Command.make('init', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const root = yield* contexta
    yield* runCli(
      () => runInit({ root: root.root }),
      result => ({
        output: json ? formatJson(result) : formatInit(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Materialize a local .contexta instance from the packaged seed snapshot'),
)

const recognize = Command.make('recognize', {
  target: Argument.file('target', { mustExist: true }).pipe(
    Argument.withDescription('Markdown target to recognize'),
  ),
  json: jsonFlag,
}, ({ target, json }) =>
  Effect.gen(function* () {
    const root = yield* contexta
    yield* runCli(
      () => runRecognition({ root: root.root, target }),
      result => ({
        output: json ? formatJson(trimRecognitionRun(result)) : formatRecognition(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Parse md surface and run local recognition'),
)

const lint = Command.make('lint', {
  target: Argument.file('target', { mustExist: true }).pipe(
    Argument.withDescription('Markdown target to lint after recognition'),
  ),
  json: jsonFlag,
}, ({ target, json }) =>
  Effect.gen(function* () {
    const root = yield* contexta
    yield* runCli(
      () => runLint({ root: root.root, target }),
      result => ({
        output: json ? formatJson(result) : formatLint(result),
        exitCode: result.signals.length > 0 ? 1 : 0,
      }),
    )
  })).pipe(
  Command.withDescription('Emit semantic-lint signals from local contexta definitions'),
)

const primitiveSkill = Command.make('skill', {
  target: Argument.file('target', { mustExist: true }).pipe(
    Argument.withDescription('Skill primitive markdown target'),
  ),
  json: jsonFlag,
}, ({ target, json }) =>
  Effect.gen(function* () {
    const root = yield* contexta
    yield* runCli(
      () => runPrimitiveSkill({ root: root.root, target }),
      result => ({
        output: json ? formatJson(result) : formatPrimitiveSkill(result),
        exitCode: result.status === 'ready' ? 0 : 1,
      }),
    )
  })).pipe(
  Command.withDescription('Validate and report a local skill primitive model'),
)

const primitive = Command.make('primitive').pipe(
  Command.withDescription('Run primitive-creator v0 commands'),
  Command.withSubcommands([primitiveSkill]),
)

const upgrade = Command.make('upgrade', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const root = yield* contexta
    yield* runCli(
      () => runUpgradeStatus({ root: root.root }),
      result => ({
        output: json ? formatJson(result) : formatUpgrade(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Report the pinned vendor baseline; merge engine is not implemented in v0'),
)

export const command = contexta.pipe(
  Command.withSubcommands([init, recognize, lint, primitive, upgrade]),
)

export const main = Command.run(command, {
  version,
}).pipe(
  Effect.provide(NodeServices.layer),
)

function runCli<A>(run: () => Promise<A>, onSuccess: (result: A) => CliSuccess): Effect.Effect<void> {
  return Effect.tryPromise({
    try: run,
    catch: toContextaError,
  }).pipe(
    Effect.matchEffect({
      onFailure: (error) => {
        const contextaError = toContextaError(error)
        return writeStderr(`contexta ${contextaError.kind} error: ${contextaError.message}`).pipe(
          Effect.andThen(setExitCode(contextaError.exitCode)),
        )
      },
      onSuccess: (result) => {
        const success = onSuccess(result)
        return writeStdout(success.output).pipe(
          Effect.andThen(setExitCode(success.exitCode)),
        )
      },
    }),
  )
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

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function formatInit(result: InitResult): string {
  return [
    'contexta init',
    `created: ${result.contextaRoot}`,
    `files: ${result.filesWritten}`,
    'pin:',
    `  schemaVersion: ${result.pin.schemaVersion}`,
    `  vendor: ${result.pin.vendor}`,
    `  ref: ${result.pin.ref}`,
    `  digest: ${result.pin.digest}`,
    `  createdAt: ${result.pin.createdAt}`,
  ].join('\n')
}

function formatRecognition(result: RecognitionRunResult): string {
  const scope = result.recognition.candidateSignalScope
    .filter(candidate => candidate.matched > 0)
    .map(candidate =>
      `- ${candidate.signal} (${candidate.matched}/${candidate.total}${candidate.applicable ? ', applicable' : ''})`)

  return [
    'contexta recognize',
    `target: ${result.recognition.target}`,
    `root: ${result.root.contextaRoot}`,
    `recognized: ${result.recognition.recognizedRole} (${result.recognition.confidence.toFixed(2)})`,
    'basis:',
    ...result.recognition.basis.map(basis => `- ${basis}`),
    'candidate signal scope:',
    ...(scope.length === 0 ? ['- none'] : scope),
  ].join('\n')
}

function trimRecognitionRun(result: RecognitionRunResult): object {
  return {
    root: result.root,
    recognition: result.recognition,
    surface: {
      path: result.surface.path,
      frontmatter: result.surface.frontmatter,
      headings: result.surface.headings,
      locatorMarkers: result.surface.locatorMarkers,
      ofmLinks: result.surface.ofmLinks,
    },
  }
}

function formatLint(result: LintResult): string {
  const header = [
    'contexta lint',
    `target: ${result.recognition.target}`,
    `recognized: ${result.recognition.recognizedRole} (${result.recognition.confidence.toFixed(2)})`,
    `signals: ${result.signals.length}`,
  ]

  if (result.signals.length === 0) {
    return header.join('\n')
  }

  const signals = result.signals.flatMap(signal => [
    '',
    `[${signal.signal}] ${signal.context ?? 'target'}`,
    ...(signal.locator === undefined ? [] : [`locator: ${signal.locator}`]),
    `confidence: ${signal.confidence.toFixed(2)}`,
    'evidence:',
    ...signal.evidence.map(evidence => `- ${evidence}`),
    'basis:',
    ...signal.basis.map(basis => `- ${basis}`),
  ])

  return [...header, ...signals].join('\n')
}

function formatPrimitiveSkill(result: PrimitiveSkillResult): string {
  return [
    'contexta primitive skill',
    `target: ${result.target}`,
    `recognized: ${result.recognizedRole}`,
    `status: ${result.status}`,
    'source material:',
    ...(result.sourceMaterial.length === 0 ? ['- none'] : result.sourceMaterial.map(item => `- ${item}`)),
    'required sections:',
    ...result.requiredSections.map(item => `- ${item}`),
    'present sections:',
    ...(result.presentSections.length === 0 ? ['- none'] : result.presentSections.map(item => `- ${item}`)),
    `export position: ${result.exportPosition.present ? 'present' : 'missing'}`,
    ...(result.exportPosition.excerpt === undefined ? [] : [`export excerpt: ${result.exportPosition.excerpt}`]),
    'diagnostics:',
    ...(result.diagnostics.length === 0
      ? ['- none']
      : result.diagnostics.map(diagnostic => `- ${diagnostic.severity}: ${diagnostic.message}`)),
  ].join('\n')
}

function formatUpgrade(result: UpgradeStatusResult): string {
  return [
    'contexta upgrade',
    `root: ${result.root.contextaRoot}`,
    'pinned vendor baseline:',
    `  schemaVersion: ${result.pin.schemaVersion}`,
    `  vendor: ${result.pin.vendor}`,
    `  ref: ${result.pin.ref}`,
    `  digest: ${result.pin.digest}`,
    `  createdAt: ${result.pin.createdAt}`,
    'merge engine: not implemented in v0',
    'local customization: not overwritten',
  ].join('\n')
}
