import process from 'node:process'

import * as NodeServices from '@effect/platform-node/NodeServices'
import { Effect, FileSystem, Path } from 'effect'
import * as Command from 'effect/unstable/cli/Command'
import * as Flag from 'effect/unstable/cli/Flag'

export const version = '0.0.0'

interface CliSuccess {
  readonly output: string
  readonly exitCode: number
}

interface DocwardenInitResult {
  readonly command: 'init'
  readonly workspaceRoot: string
  readonly docwardenRoot: string
  readonly configPath: string
  readonly filesWritten: readonly string[]
}

type DocwardenRuntimeServices = FileSystem.FileSystem | Path.Path

class DocwardenConfigError extends Error {
  readonly _tag = 'DocwardenConfigError' as const
  readonly kind = 'config' as const

  constructor(message: string) {
    super(message)
    this.name = 'DocwardenConfigError'
  }
}

class DocwardenRuntimeError extends Error {
  readonly _tag = 'DocwardenRuntimeError' as const
  readonly kind = 'runtime' as const

  constructor(message: string) {
    super(message)
    this.name = 'DocwardenRuntimeError'
  }
}

type DocwardenError = DocwardenConfigError | DocwardenRuntimeError

const rootFlag = Flag.string('root').pipe(
  Flag.withDescription('Workspace root'),
  Flag.withDefault(''),
)

const jsonFlag = Flag.boolean('json').pipe(
  Flag.withDescription('Print machine-readable JSON'),
)

const docwarden = Command.make('docwarden').pipe(
  Command.withSharedFlags({
    root: rootFlag,
  }),
  Command.withDescription('Materialize a local .docwarden runtime skeleton'),
)

const init = Command.make('init', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const root = yield* docwarden
    yield* runCli(
      runInitEffect({ root: root.root }),
      result => ({
        output: json ? formatJson(result) : formatInit(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Create .docwarden runtime defaults for review workflow execution'),
)

const command = docwarden.pipe(
  Command.withSubcommands([init]),
)

export const main: Effect.Effect<void, unknown> = Command.run(command, {
  version,
}).pipe(
  Effect.provide(NodeServices.layer),
)

function runCli<A>(run: Effect.Effect<A, DocwardenError, DocwardenRuntimeServices>, onSuccess: (result: A) => CliSuccess): Effect.Effect<void, never, DocwardenRuntimeServices> {
  return run.pipe(
    Effect.matchEffect({
      onFailure: (error) => {
        const docwardenError = toDocwardenError(error)
        return writeStderr(`docwarden ${docwardenError.kind} error: ${docwardenError.message}`).pipe(
          Effect.andThen(setExitCode(docwardenError.kind === 'config' ? 2 : 1)),
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

function runInitEffect(options: { readonly root: string }): Effect.Effect<DocwardenInitResult, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const workspaceRoot = path.resolve(normalizeOptionalPath(options.root) ?? '.')
    yield* assertDirectory(workspaceRoot, `init root does not exist or is not a directory: ${workspaceRoot}`)

    if (path.basename(workspaceRoot) === '.docwarden') {
      return yield* Effect.fail(new DocwardenConfigError(
        `init root must be a workspace root, not an existing .docwarden root: ${workspaceRoot}`,
      ))
    }

    const docwardenRoot = path.join(workspaceRoot, '.docwarden')
    if (yield* pathExists(docwardenRoot)) {
      return yield* Effect.fail(new DocwardenConfigError(`local .docwarden already exists: ${docwardenRoot}`))
    }

    const taskDirectory = path.join(docwardenRoot, 'task')
    const reviewDirectory = path.join(docwardenRoot, 'review')
    const archiveDirectory = path.join(docwardenRoot, 'archive')
    const configPath = path.join(docwardenRoot, 'config.yaml')
    const config = runtimeConfigTemplate()
    const filesWritten = [
      '.docwarden/task',
      '.docwarden/review',
      '.docwarden/archive',
      '.docwarden/config.yaml',
    ]
    const create = Effect.gen(function* () {
      yield* fs.makeDirectory(docwardenRoot, { recursive: false }).pipe(
        Effect.mapError(error => new DocwardenRuntimeError(`failed to create local .docwarden: ${docwardenRoot}: ${formatUnknownCause(error)}`)),
      )
      yield* fs.makeDirectory(taskDirectory, { recursive: false }).pipe(
        Effect.mapError(error => new DocwardenRuntimeError(`failed to create task directory: ${taskDirectory}: ${formatUnknownCause(error)}`)),
      )
      yield* fs.makeDirectory(reviewDirectory, { recursive: false }).pipe(
        Effect.mapError(error => new DocwardenRuntimeError(`failed to create review directory: ${reviewDirectory}: ${formatUnknownCause(error)}`)),
      )
      yield* fs.makeDirectory(archiveDirectory, { recursive: false }).pipe(
        Effect.mapError(error => new DocwardenRuntimeError(`failed to create archive directory: ${archiveDirectory}: ${formatUnknownCause(error)}`)),
      )
      yield* fs.writeFileString(configPath, config).pipe(
        Effect.mapError(error => new DocwardenRuntimeError(`failed to write config: ${configPath}: ${formatUnknownCause(error)}`)),
      )

      return {
        command: 'init' as const,
        workspaceRoot,
        docwardenRoot,
        configPath,
        filesWritten,
      }
    })

    return yield* create.pipe(
      Effect.catch((error) => {
        const cleanup = fs.remove(docwardenRoot, { force: true, recursive: true }).pipe(
          Effect.catch(() => Effect.void),
        )
        return cleanup.pipe(Effect.andThen(Effect.fail(toDocwardenError(error))))
      }),
    )
  })
}

function formatInit(result: DocwardenInitResult): string {
  return [
    'docwarden init',
    `root: ${result.workspaceRoot}`,
    `created: ${result.docwardenRoot}`,
    'files:',
    ...result.filesWritten.map(file => `- ${file}`),
    `config: ${result.configPath}`,
  ].join('\n')
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function runtimeConfigTemplate(): string {
  return [
    'review:',
    '  mode: review-first',
    '  pending_marker: review-pending',
    '',
    'cleanup:',
    '  after_promote_pick: delete',
    '',
    'review_surface:',
    '  files:',
    '    - index.md',
    '    - lead.md',
    '    - backing.md',
    '',
    'route_targets:',
    '  - promote',
    '  - pick',
    '  - log-only',
    '  - transfer',
    '  - no-op',
    '',
  ].join('\n')
}

function assertDirectory(directory: string, message: string): Effect.Effect<void, DocwardenError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const info = yield* stat(directory, message)
    if (info.type !== 'Directory') {
      return yield* Effect.fail(new DocwardenConfigError(message))
    }
  })
}

function pathExists(filePath: string): Effect.Effect<boolean, DocwardenRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.exists(filePath).pipe(
      Effect.mapError(error => new DocwardenRuntimeError(`failed to check path existence: ${filePath}: ${formatUnknownCause(error)}`)),
    )
  })
}

function stat(filePath: string, message: string): Effect.Effect<FileSystem.File.Info, DocwardenConfigError | DocwardenRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(filePath).pipe(
      Effect.mapError(error => new DocwardenConfigError(`${message}: ${formatUnknownCause(error)}`)),
    )
  })
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

function toDocwardenError(error: unknown): DocwardenError {
  if (error instanceof DocwardenConfigError || error instanceof DocwardenRuntimeError) {
    return error
  }
  if (error instanceof Error) {
    return new DocwardenRuntimeError(error.message)
  }
  return new DocwardenRuntimeError(String(error))
}

function normalizeOptionalPath(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed === undefined || trimmed.length === 0 ? undefined : trimmed
}

function formatUnknownCause(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
