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

interface DocwardenReviewResult {
  readonly command: 'review'
  readonly workspaceRoot: string
  readonly docwardenRoot: string
  readonly configPath: string
  readonly reviewDirectory: string
  readonly statePath: string
  readonly targetPath: string
  readonly filesWritten: readonly string[]
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

const targetFlag = Flag.string('target').pipe(
  Flag.withDescription('Path to review target'),
  Flag.withDefault(''),
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

const review = Command.make('review', {
  target: targetFlag,
  json: jsonFlag,
}, ({ target, json }) =>
  Effect.gen(function* () {
    const root = yield* docwarden
    yield* runCli(
      runReviewEffect({ root: root.root, target }),
      result => ({
        output: json ? formatJson(result) : formatReview(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Generate minimal review surface and state for a target'),
)

const command = docwarden.pipe(
  Command.withSubcommands([init, review]),
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

function runReviewEffect(options: { readonly root: string, readonly target: string }): Effect.Effect<DocwardenReviewResult, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const workspaceRoot = path.resolve(normalizeOptionalPath(options.root) ?? '.')
    yield* assertDirectory(workspaceRoot, `review root does not exist or is not a directory: ${workspaceRoot}`)

    if (path.basename(workspaceRoot) === '.docwarden') {
      return yield* Effect.fail(new DocwardenConfigError(
        `review root must be a workspace root, not an existing .docwarden root: ${workspaceRoot}`,
      ))
    }

    const docwardenRoot = path.join(workspaceRoot, '.docwarden')
    const configPath = path.join(docwardenRoot, 'config.yaml')
    if (!(yield* pathExists(configPath))) {
      return yield* Effect.fail(new DocwardenConfigError(
        `docwarden config missing at ${configPath}; run docwarden init first`,
      ))
    }
    yield* assertReadableConfig(configPath)

    const targetInput = normalizeOptionalPath(options.target)
    if (targetInput === undefined) {
      return yield* Effect.fail(new DocwardenConfigError('missing required --target'))
    }
    const targetPath = path.resolve(workspaceRoot, targetInput)
    const targetInfo = yield* stat(targetPath, `review target does not exist or is inaccessible: ${targetPath}`)

    const reviewRunId = makeReviewRunId(targetPath)
    const reviewDirectory = path.join(docwardenRoot, 'review', reviewRunId)
    const statePath = path.join(reviewDirectory, 'state.yaml')

    const files = [
      'index.md',
      'lead.md',
      'backing.md',
      'state.yaml',
    ] as const

    const backingContent = yield* makeBackingContent({
      path: targetPath,
      info: targetInfo,
      fs,
    })

    const reviewCreatedAt = new Date().toISOString()
    const stateYaml = formatStateYaml({
      targetPath,
      reviewDirectory,
      status: 'review-surface-ready',
      createdAt: reviewCreatedAt,
      configPath,
      surfaceFiles: files,
    })
    const fileEntries = [
      ['index.md', formatIndex(targetPath, targetInfo.type, reviewDirectory, reviewCreatedAt)],
      ['lead.md', formatLead(targetPath, targetInfo.type)],
      ['backing.md', backingContent],
      ['state.yaml', stateYaml],
    ] as const

    yield* fs.makeDirectory(reviewDirectory, { recursive: false }).pipe(
      Effect.mapError(error => new DocwardenRuntimeError(`failed to create review directory: ${reviewDirectory}: ${formatUnknownCause(error)}`)),
    )

    yield* Effect.forEach(fileEntries, ([fileName, content]) =>
      fs.writeFileString(path.join(reviewDirectory, fileName), content).pipe(
        Effect.mapError(error => new DocwardenRuntimeError(`failed to write review file: ${path.join(reviewDirectory, fileName)}: ${formatUnknownCause(error)}`)),
      ))

    return {
      command: 'review',
      workspaceRoot,
      docwardenRoot,
      configPath,
      reviewDirectory,
      statePath,
      targetPath,
      filesWritten: files,
    }
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

function formatReview(result: DocwardenReviewResult): string {
  return [
    'docwarden review',
    `root: ${result.workspaceRoot}`,
    `target: ${result.targetPath}`,
    `review directory: ${result.reviewDirectory}`,
    `state: ${result.statePath}`,
    'files:',
    ...result.filesWritten.map(file => `- ${file}`),
  ].join('\n')
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function makeReviewRunId(targetPath: string): string {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '')
  const slug = slugify(targetPath)
  return `${timestamp}-${slug}`
}

function slugify(value: string): string {
  const baseName = value.trim().split(/[\\/]/).filter(Boolean).at(-1) ?? 'target'
  const normalized = baseName
    .toLowerCase()
    .replace(/[^\w.-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

  if (normalized.length === 0) {
    return 'target'
  }

  return normalized.length > 64 ? normalized.slice(0, 64) : normalized
}

function formatIndex(targetPath: string, targetType: FileSystem.File.Type, reviewDirectory: string, createdAt: string): string {
  return [
    `# Review Surface`,
    '',
    `- target: ${targetPath}`,
    `- type: ${targetType}`,
    `- review_directory: ${reviewDirectory}`,
    `- created_at: ${createdAt}`,
    '',
  ].join('\n')
}

function formatLead(targetPath: string, targetType: FileSystem.File.Type): string {
  return [
    `# Review Lead`,
    '',
    `Target: ${targetPath}`,
    `Type: ${targetType}`,
  ].join('\n')
}

function formatStateYaml(input: {
  readonly targetPath: string
  readonly reviewDirectory: string
  readonly status: string
  readonly createdAt: string
  readonly configPath: string
  readonly surfaceFiles: readonly string[]
}): string {
  return [
    `target: ${input.targetPath}`,
    `review_dir: ${input.reviewDirectory}`,
    `status: ${input.status}`,
    `created_at: ${input.createdAt}`,
    `config_path: ${input.configPath}`,
    'surface_files:',
    ...input.surfaceFiles.map(file => `  - ${file}`),
    '',
  ].join('\n')
}

function makeBackingContent(input: {
  readonly path: string
  readonly info: FileSystem.File.Info
  readonly fs: FileSystem.FileSystem
}): Effect.Effect<string, DocwardenRuntimeError, never> {
  if (input.info.type === 'Directory') {
    return Effect.gen(function* () {
      const children = yield* input.fs.readDirectory(input.path).pipe(
        Effect.mapError(error => new DocwardenRuntimeError(`failed to read directory contents: ${input.path}: ${formatUnknownCause(error)}`)),
      )
      const preview = children.sort().slice(0, 20)
      return [
        `Target type: directory`,
        `Path: ${input.path}`,
        '',
        'Entries (first layer, up to 20):',
        ...preview.map(entry => `- ${entry}`),
        '',
      ].join('\n')
    })
  }

  if (input.info.type === 'File') {
    return Effect.gen(function* () {
      const fileText = yield* input.fs.readFileString(input.path).pipe(
        Effect.mapError(error => new DocwardenRuntimeError(`failed to read target file: ${input.path}: ${formatUnknownCause(error)}`)),
      )
      const excerpt = fileText.split(/\r?\n/).slice(0, 30).join('\n').trim()
      return [
        `Target type: file`,
        `Path: ${input.path}`,
        '',
        'Excerpt (up to 30 lines):',
        excerpt,
        '',
      ].join('\n')
    })
  }

  return Effect.succeed([
    `Target type: ${input.info.type}`,
    `Path: ${input.path}`,
    '',
    'Unsupported target kind for deeper backing extraction.',
    '',
  ].join('\n'))
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

function assertReadableConfig(configPath: string): Effect.Effect<void, DocwardenError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const config = yield* fs.readFileString(configPath).pipe(
      Effect.mapError(error => new DocwardenConfigError(`docwarden config is not readable at ${configPath}: ${formatUnknownCause(error)}`)),
    )
    if (config.trim().length === 0) {
      return yield* Effect.fail(new DocwardenConfigError(`docwarden config is empty at ${configPath}; run docwarden init again`))
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
