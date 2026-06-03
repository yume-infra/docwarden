import type { DoctorInspectResult, DoctorRepairResult, InitResult, IsomorphError, IsomorphRuntimeServices, LintResult, MappingListResult, PrimitiveSkillResult, RecognitionRunResult, UpgradeStatusResult } from './runtime.js'

import process from 'node:process'
import { Effect, Option } from 'effect'
import * as Argument from 'effect/unstable/cli/Argument'
import * as Command from 'effect/unstable/cli/Command'
import * as Flag from 'effect/unstable/cli/Flag'
import { IsomorphConfigError, isomorphLiveLayer, runDoctorInspectEffect, runDoctorRepairEffect, runInitEffect, runLintEffect, runMappingListEffect, runPrimitiveSkillEffect, runRecognitionEffect, runUpgradeStatusEffect, toIsomorphError } from './runtime.js'

export const version = '0.0.0'

interface CliSuccess {
  readonly output: string
  readonly exitCode: number
}

const rootFlag = Flag.string('root').pipe(
  Flag.withDescription('Project root or local .isomorph path'),
  Flag.withDefault(''),
)

const jsonFlag = Flag.boolean('json').pipe(
  Flag.withDescription('Print machine-readable JSON'),
)

const targetArgument = Argument.string('target').pipe(
  Argument.withDescription('Markdown target'),
  Argument.optional,
)

const isomorph = Command.make('isomorph').pipe(
  Command.withSharedFlags({
    root: rootFlag,
  }),
  Command.withDescription('Run the local isomorph semantic runtime'),
)

const init = Command.make('init', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const root = yield* isomorph
    yield* runCli(
      runInitEffect({ root: root.root }),
      result => ({
        output: json ? formatJson(result) : formatInit(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Materialize a local .isomorph instance from the packaged seed snapshot'),
)

const recognize = Command.make('recognize', {
  target: targetArgument,
  json: jsonFlag,
}, ({ target, json }) =>
  Effect.gen(function* () {
    const root = yield* isomorph
    const targetPath = targetFromOption(target)
    yield* runCli(
      targetPath === undefined
        ? missingTargetEffect('recognize')
        : runRecognitionEffect({ root: root.root, target: targetPath }),
      result => ({
        output: json ? formatJson(trimRecognitionRun(result)) : formatRecognition(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Parse md surface and run local recognition'),
)

const lint = Command.make('lint', {
  target: targetArgument,
  json: jsonFlag,
}, ({ target, json }) =>
  Effect.gen(function* () {
    const root = yield* isomorph
    const targetPath = targetFromOption(target)
    yield* runCli(
      targetPath === undefined
        ? missingTargetEffect('lint')
        : runLintEffect({ root: root.root, target: targetPath }),
      result => ({
        output: json ? formatJson(result) : formatLint(result),
        exitCode: result.signals.length > 0 ? 1 : 0,
      }),
    )
  })).pipe(
  Command.withDescription('Emit semantic-lint signals from local isomorph definitions'),
)

const primitiveSkill = Command.make('skill', {
  target: targetArgument,
  json: jsonFlag,
}, ({ target, json }) =>
  Effect.gen(function* () {
    const root = yield* isomorph
    const targetPath = targetFromOption(target)
    yield* runCli(
      targetPath === undefined
        ? missingTargetEffect('primitive skill')
        : runPrimitiveSkillEffect({ root: root.root, target: targetPath }),
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

const mapping = Command.make('mapping', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const root = yield* isomorph
    yield* runCli(
      runMappingListEffect({ root: root.root }),
      result => ({
        output: json ? formatJson(result) : formatMapping(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('List local isomorph mapping scopes, content kinds, and templates'),
)

const upgrade = Command.make('upgrade', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const root = yield* isomorph
    yield* runCli(
      runUpgradeStatusEffect({ root: root.root }),
      result => ({
        output: json ? formatJson(result) : formatUpgrade(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Report the pinned vendor baseline; merge engine is not implemented in v0'),
)

const doctorInspect = Command.make('inspect', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const root = yield* isomorph
    yield* runCli(
      runDoctorInspectEffect({ root: root.root }),
      result => ({
        output: json ? formatJson(result) : formatDoctorInspect(result),
        exitCode: result.issues.some(issue => issue.severity === 'error') ? 2 : 0,
      }),
    )
  })).pipe(
  Command.withDescription('Inspect local .isomorph issues and repair plans'),
)

const doctorRepair = Command.make('repair', {
  plan: Flag.string('plan').pipe(
    Flag.withDescription('Repair plan id'),
    Flag.withDefault(''),
  ),
  json: jsonFlag,
}, ({ json, plan }) =>
  Effect.gen(function* () {
    const root = yield* isomorph
    yield* runCli(
      plan.trim().length === 0
        ? Effect.fail(new IsomorphConfigError({ message: 'missing doctor repair plan: --plan <id>' }))
        : runDoctorRepairEffect({ root: root.root, plan }),
      result => ({
        output: json ? formatJson(result) : formatDoctorRepair(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Apply an explicit doctor repair plan'),
)

const doctor = Command.make('doctor', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const root = yield* isomorph
    yield* runCli(
      runDoctorInspectEffect({ root: root.root }),
      result => ({
        output: json ? formatJson(result) : formatDoctorInspect(result),
        exitCode: result.issues.some(issue => issue.severity === 'error') ? 2 : 0,
      }),
    )
  })).pipe(
  Command.withDescription('Inspect and repair local .isomorph runtime readiness'),
  Command.withSubcommands([doctorInspect, doctorRepair]),
)

const command = isomorph.pipe(
  Command.withSubcommands([init, recognize, lint, primitive, mapping, upgrade, doctor]),
)

export const main: Effect.Effect<void, unknown> = Command.run(command, {
  version,
}).pipe(
  Effect.provide(isomorphLiveLayer),
)

function runCli<A>(run: Effect.Effect<A, IsomorphError, IsomorphRuntimeServices>, onSuccess: (result: A) => CliSuccess): Effect.Effect<void, never, IsomorphRuntimeServices> {
  return run.pipe(
    Effect.matchEffect({
      onFailure: (error) => {
        const isomorphError = toIsomorphError(error)
        return writeStderr(`isomorph ${isomorphError.kind} error: ${isomorphError.message}`).pipe(
          Effect.andThen(setExitCode(exitCodeForErrorKind(isomorphError.kind))),
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

function targetFromOption(target: Option.Option<string>): string | undefined {
  return Option.isSome(target) ? target.value : undefined
}

function missingTargetEffect(commandName: string): Effect.Effect<never, IsomorphError, IsomorphRuntimeServices> {
  return Effect.fail(new IsomorphConfigError({ message: `missing target argument for ${commandName}` }))
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

function exitCodeForErrorKind(_kind: IsomorphError['kind']): number {
  return 2
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function formatInit(result: InitResult): string {
  return [
    'isomorph init',
    `created: ${result.isomorphRoot}`,
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
    'isomorph recognize',
    `target: ${result.recognition.target}`,
    `root: ${result.root.isomorphRoot}`,
    `recognized: ${result.recognition.recognizedRole} (${result.recognition.confidence.toFixed(2)})`,
    `features: frontmatter=${Object.keys(result.recognition.features.frontmatter).length}, headings=${result.recognition.features.headings.length}, locators=${result.recognition.features.locatorMarkers.length}, links=${result.recognition.features.ofmLinks.length}`,
    'basis:',
    ...result.recognition.basis.map(basis => `- ${basis}`),
    'diagnostics:',
    ...(result.recognition.diagnostics.length === 0
      ? ['- none']
      : result.recognition.diagnostics.map(diagnostic => `- ${diagnostic.severity}: ${diagnostic.code}: ${diagnostic.message}`)),
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
    'isomorph lint',
    `target: ${result.recognition.target}`,
    `recognized: ${result.recognition.recognizedRole} (${result.recognition.confidence.toFixed(2)})`,
    `signals: ${result.signals.length}`,
    'diagnostics:',
    ...(result.diagnostics.length === 0
      ? ['- none']
      : result.diagnostics.map(diagnostic => `- ${diagnostic.severity}: ${diagnostic.code}: ${diagnostic.message}${diagnostic.evidence === undefined ? '' : ` (${diagnostic.evidence})`}`)),
  ]

  if (result.signals.length === 0) {
    return header.join('\n')
  }

  const signals = result.signals.flatMap(signal => [
    '',
    `[${signal.signal}] ${signal.context ?? 'target'}`,
    ...(signal.locator === undefined ? [] : [`locator: ${signal.locator}`]),
    `confidence: ${signal.confidence.toFixed(2)}`,
    'loss model:',
    `- ${firstLine(signal.lossModel)}`,
    'evidence:',
    ...signal.evidence.map(evidence => `- ${evidence}`),
    'basis:',
    ...signal.basis.map(basis => `- ${basis}`),
  ])

  return [...header, ...signals].join('\n')
}

function formatPrimitiveSkill(result: PrimitiveSkillResult): string {
  return [
    'isomorph primitive skill',
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
    'model:',
    ...(result.model.driftPressure === undefined ? ['- drift pressure: missing'] : [`- drift pressure: ${result.model.driftPressure}`]),
    ...(result.model.pressureScenarios.length === 0
      ? ['- pressure scenario: none']
      : result.model.pressureScenarios.map(item => `- pressure scenario: ${item}`)),
    ...(result.model.intervention === undefined ? ['- intervention: missing'] : [`- intervention: ${result.model.intervention}`]),
    ...(result.model.interventionMoves.length === 0
      ? ['- intervention move: none']
      : result.model.interventionMoves.map(item => `- intervention move: ${item}`)),
    ...(result.model.activation === undefined ? ['- activation: missing'] : [`- activation: ${result.model.activation}`]),
    ...(result.model.activationTriggers.length === 0
      ? ['- activation trigger: none']
      : result.model.activationTriggers.map(item => `- activation trigger: ${item}`)),
    ...(result.model.activationExclusions.length === 0
      ? ['- activation exclusion: none']
      : result.model.activationExclusions.map(item => `- activation exclusion: ${item}`)),
    ...(result.model.judgmentSurface.length === 0
      ? ['- judgment surface: none']
      : result.model.judgmentSurface.map(item => `- judgment surface: ${item}`)),
    ...(result.model.deterministicBoundary.length === 0
      ? ['- deterministic boundary: none']
      : result.model.deterministicBoundary.map(item => `- deterministic boundary: ${item}`)),
    ...(result.model.reviewGate.length === 0
      ? ['- review gate: none']
      : result.model.reviewGate.map(item => `- review gate: ${item}`)),
    ...(result.model.exportShape.length === 0
      ? ['- export shape: none']
      : result.model.exportShape.map(item => `- export shape: ${item}`)),
    ...(result.model.semanticBasisLinks.length === 0
      ? ['- semantic basis links: none']
      : result.model.semanticBasisLinks.map(link => `- semantic basis: ${link}`)),
    ...(result.model.references.length === 0
      ? ['- references: none']
      : result.model.references.map(item => `- reference: ${item}`)),
    ...(result.model.scripts.length === 0
      ? ['- scripts: none']
      : result.model.scripts.map(item => `- script: ${item}`)),
    ...(result.model.assets.length === 0
      ? ['- assets: none']
      : result.model.assets.map(item => `- asset: ${item}`)),
    ...(result.model.validation.length === 0
      ? ['- validation: none']
      : result.model.validation.map(item => `- validation: ${item}`)),
    ...(result.model.exportPosition === undefined ? ['- export position: missing'] : [`- export position: ${result.model.exportPosition}`]),
    'plan:',
    `- compiler: ${result.plan.compiler}`,
    `- exportable: ${String(result.plan.exportable)}`,
    ...(result.plan.missingForExport.length === 0
      ? ['- missing for export: none']
      : result.plan.missingForExport.map(item => `- missing for export: ${item}`)),
    ...(result.plan.futureSkillExportRequirements.length === 0
      ? ['- future skill export requirements: none']
      : result.plan.futureSkillExportRequirements.map(item => `- future skill export requirement: ${item}`)),
    'export draft:',
    `- artifact: ${result.exportDraft.artifact}`,
    `- skill name: ${result.exportDraft.skillName}`,
    ...(result.exportDraft.description === undefined ? ['- description: missing'] : [`- description: ${result.exportDraft.description}`]),
    `- readiness: ${result.exportDraft.readiness}`,
    ...(result.exportDraft.bodyOutline.length === 0
      ? ['- body outline: none']
      : result.exportDraft.bodyOutline.map(item => `- body outline: ${item}`)),
    'diagnostics:',
    ...(result.diagnostics.length === 0
      ? ['- none']
      : result.diagnostics.map(diagnostic => `- ${diagnostic.severity}: ${diagnostic.message}`)),
  ].join('\n')
}

function formatMapping(result: MappingListResult): string {
  const lines = [
    'isomorph mapping',
    `root: ${result.root.isomorphRoot}`,
    `scopes: ${result.scopes.length}`,
  ]
  for (const scope of result.scopes) {
    lines.push('')
    lines.push(`## ${scope.scope}`)
    lines.push(`path: ${scope.path}`)
    lines.push(`modules: ${scope.modules}`)
    lines.push(`kinds: ${scope.kinds.length === 0 ? '(none)' : scope.kinds.join(', ')}`)
    lines.push(`templates: ${scope.templates.length === 0 ? '(none)' : scope.templates.join(', ')}`)
  }
  return lines.join('\n')
}

function formatUpgrade(result: UpgradeStatusResult): string {
  if (result.status === 'origin') {
    return [
      'isomorph upgrade',
      `root: ${result.root.isomorphRoot}`,
      `local instance: ${result.localInstance.status}`,
      'origin source:',
      `  type: ${result.localInstance.source.source.type}`,
      `  url: ${result.localInstance.source.source.url}`,
      `  path: ${result.localInstance.source.source.path}`,
      'merge engine: not implemented in v0',
      'local customization: source authoring',
    ].join('\n')
  }

  return [
    'isomorph upgrade',
    `root: ${result.root.isomorphRoot}`,
    `local instance: ${result.localInstance.status}`,
    'pinned vendor baseline:',
    `  schemaVersion: ${result.pinStatus.pin.schemaVersion}`,
    `  vendor: ${result.pinStatus.pin.vendor}`,
    `  ref: ${result.pinStatus.pin.ref}`,
    `  digest: ${result.pinStatus.pin.digest}`,
    `  createdAt: ${result.pinStatus.pin.createdAt}`,
    'new vendor baseline:',
    `  schemaVersion: ${result.newBaseline.schemaVersion}`,
    `  vendor: ${result.newBaseline.vendor}`,
    `  ref: ${result.newBaseline.ref}`,
    `  digest: ${result.newBaseline.digest}`,
    'merge engine: not implemented in v0',
    'local customization: not overwritten',
  ].join('\n')
}

function formatDoctorInspect(result: DoctorInspectResult): string {
  return [
    'isomorph doctor',
    `root: ${result.root.isomorphRoot}`,
    `instance: ${result.instance.status}`,
    `status: ${result.status}`,
    'issues:',
    ...(result.issues.length === 0
      ? ['- none']
      : result.issues.map(issue => `- ${issue.severity}: ${issue.code}: ${issue.summary} [${issue.repairability}${issue.repair === undefined ? '' : `, repair=${issue.repair}`}]`)),
    'repair plans:',
    ...(result.repairPlans.length === 0
      ? ['- none']
      : result.repairPlans.map(plan => `- ${plan.id}: ${plan.strategy}`)),
  ].join('\n')
}

function formatDoctorRepair(result: DoctorRepairResult): string {
  return [
    'isomorph doctor repair',
    `root: ${result.root.isomorphRoot}`,
    `plan: ${result.plan.id}`,
    `applied: ${result.applied ? 'yes' : 'no'}`,
    'actions:',
    ...(result.actions.length === 0 ? ['- none'] : result.actions.map(action => `- ${action}`)),
    'verification:',
    ...result.verification.map(item => `- ${item}`),
    'remaining issues:',
    ...(result.issuesAfter.length === 0
      ? ['- none']
      : result.issuesAfter.map(issue => `- ${issue.severity}: ${issue.code}: ${issue.summary}`)),
  ].join('\n')
}

function firstLine(value: string): string {
  return value.split('\n').map(line => line.trim()).find(line => line.length > 0) ?? 'not recorded'
}
