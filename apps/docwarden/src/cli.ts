import path from 'node:path'
import process from 'node:process'

import * as NodeServices from '@effect/platform-node/NodeServices'
import { Effect, FileSystem } from 'effect'
import * as Command from 'effect/unstable/cli/Command'
import * as Flag from 'effect/unstable/cli/Flag'

export const version = '0.0.0'

type TaskLayer = 'spec' | 'guide' | 'wiki'
type ReviewMode = 'target' | 'task'
type PromoteKind = 'promote' | 'pick'
type SpecModuleKind = string

interface TaskMaterialSummary {
  readonly taskId: string
  readonly title: string
  readonly context: readonly string[]
  readonly objective: readonly string[]
  readonly boundary: readonly string[]
  readonly nextEntry: readonly string[]
  readonly planObjective: readonly string[]
  readonly planSteps: readonly string[]
  readonly logEvents: readonly string[]
  readonly gaps: readonly string[]
}

interface CliSuccess {
  readonly output: string
  readonly exitCode: number
}

interface CliResultBase {
  readonly workspaceRoot: string
  readonly docwardenRoot: string
}

interface DocwardenInitResult extends CliResultBase {
  readonly command: 'init'
  readonly configPath: string
  readonly filesWritten: readonly string[]
  readonly filesSkipped: readonly string[]
}

interface DocwardenTaskCreateResult extends CliResultBase {
  readonly command: 'task-create'
  readonly taskId: string
  readonly taskTitle: string
  readonly taskDirectory: string
  readonly nextEntry: string
  readonly filesWritten: readonly string[]
}

interface DocwardenReviewBaseResult extends CliResultBase {
  readonly command: 'review'
  readonly reviewMode: ReviewMode
  readonly reviewDirectory: string
  readonly statePath: string
  readonly filesWritten: readonly string[]
  readonly reviewId: string
  readonly configPath: string
}

interface DocwardenTaskReviewResult extends DocwardenReviewBaseResult {
  readonly reviewMode: 'task'
  readonly taskId: string
  readonly taskDirectory: string
  readonly sourceFiles: readonly string[]
}

interface DocwardenTargetReviewResult extends DocwardenReviewBaseResult {
  readonly reviewMode: 'target'
  readonly targetPath: string
}

type DocwardenReviewResult = DocwardenTaskReviewResult | DocwardenTargetReviewResult

interface DocwardenPromoteResult extends CliResultBase {
  readonly command: 'promote'
  readonly taskId: string
  readonly taskDirectory: string
  readonly targetLayer: TaskLayer
  readonly specTarget?: string
  readonly specKind?: SpecModuleKind
  readonly artifactPath: string
  readonly filesWritten: readonly string[]
}

interface DocwardenPickResult extends CliResultBase {
  readonly command: 'pick'
  readonly taskId: string
  readonly taskDirectory: string
  readonly artifactPath: string
  readonly filesWritten: readonly string[]
}

type DocwardenRuntimeServices = FileSystem.FileSystem

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

const taskRefFlag = Flag.string('task').pipe(
  Flag.withDescription('Task id'),
  Flag.withDefault(''),
)

const taskIdFlag = Flag.string('id').pipe(
  Flag.withDescription('Task id'),
  Flag.withDefault(''),
)

const taskTitleFlag = Flag.string('title').pipe(
  Flag.withDescription('Task title'),
  Flag.withDefault(''),
)

const toFlag = Flag.string('to').pipe(
  Flag.withDescription('Destination layer (spec|guide|wiki)'),
  Flag.withDefault(''),
)

const specKindFlag = Flag.string('kind').pipe(
  Flag.withDescription('Content kind for a missing spec target'),
  Flag.withDefault(''),
)

const specTargetFlag = Flag.string('target').pipe(
  Flag.withDescription('Spec target path for --to spec, without .md'),
  Flag.withDefault(''),
)

const docwarden = Command.make('docwarden').pipe(
  Command.withSharedFlags({
    root: rootFlag,
  }),
  Command.withDescription('Document maintenance workflow tooling'),
)

const init = Command.make('init', {
  json: jsonFlag,
}, ({ json }) =>
  Effect.gen(function* () {
    const root = yield* docwarden
    yield* runCli(
      runInitEffect(root.root),
      result => ({
        output: json ? formatJson(result) : formatInit(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Create missing .docwarden harness assets for the workflow'),
)

const taskCreate = Command.make('create', {
  id: taskIdFlag,
  title: taskTitleFlag,
  json: jsonFlag,
}, ({ id, title, json }) =>
  Effect.gen(function* () {
    const root = yield* docwarden
    yield* runCli(
      runTaskCreateEffect(root.root, id, title),
      result => ({
        output: json ? formatJson(result) : formatTaskCreate(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Create task materials'),
)

const task = Command.make('task').pipe(
  Command.withDescription('Task working-material controls'),
  Command.withSubcommands([taskCreate]),
)

const review = Command.make('review', {
  target: targetFlag,
  task: taskRefFlag,
  json: jsonFlag,
}, ({ target, task, json }) =>
  Effect.gen(function* () {
    const root = yield* docwarden
    yield* runCli(
      runReviewEffect(root.root, target, task),
      result => ({
        output: json ? formatJson(result) : formatReview(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Generate review artifacts from task material or target'),
)

const promote = Command.make('promote', {
  task: taskRefFlag,
  to: toFlag,
  specKind: specKindFlag,
  specTarget: specTargetFlag,
  json: jsonFlag,
}, ({ task, to, specKind, specTarget, json }) =>
  Effect.gen(function* () {
    const root = yield* docwarden
    yield* runCli(
      runPromoteEffect({
        root: root.root,
        task,
        to,
        specKind,
        specTarget,
        kind: 'promote',
      } satisfies PromoteInput & { kind: 'promote' }),
      result => ({
        output: json ? formatJson(result) : formatPromote(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Promote task outputs to spec / guide / wiki'),
)

const pick = Command.make('pick', {
  task: taskRefFlag,
  to: toFlag,
  json: jsonFlag,
}, ({ task, to, json }) =>
  Effect.gen(function* () {
    const root = yield* docwarden
    yield* runCli(
      runPromoteEffect({
        root: root.root,
        task,
        to,
        specKind: '',
        specTarget: '',
        kind: 'pick',
      } satisfies PromoteInput & { kind: 'pick' }),
      result => ({
        output: json ? formatJson(result) : formatPick(result),
        exitCode: 0,
      }),
    )
  })).pipe(
  Command.withDescription('Pick task outputs into wiki'),
)

const command = docwarden.pipe(
  Command.withSubcommands([init, task, review, promote, pick]),
)

export const main: Effect.Effect<void, unknown> = Command.run(command, {
  version,
}).pipe(
  Effect.provide(NodeServices.layer),
)

function runCli<A>(
  run: Effect.Effect<A, DocwardenError, DocwardenRuntimeServices>,
  onSuccess: (result: A) => CliSuccess,
): Effect.Effect<void, never, DocwardenRuntimeServices> {
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

function runInitEffect(rootRaw: string): Effect.Effect<DocwardenInitResult, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const workspaceRoot = resolveWorkspaceRoot(rootRaw)
    yield* assertDirectory(workspaceRoot, `init root does not exist or is not a directory: ${workspaceRoot}`)

    if (path.basename(workspaceRoot) === '.docwarden') {
      return yield* Effect.fail(new DocwardenConfigError(
        `init root must be a workspace root, not an existing .docwarden root: ${workspaceRoot}`,
      ))
    }

    const docwardenRoot = path.join(workspaceRoot, '.docwarden')
    if (yield* pathExists(docwardenRoot)) {
      yield* assertDirectory(docwardenRoot, `local .docwarden exists but is not a directory: ${docwardenRoot}`)
    }

    const createdAt = new Date().toISOString()
    const directories = [
      docwardenRoot,
      path.join(docwardenRoot, 'task'),
      path.join(docwardenRoot, 'review'),
      path.join(docwardenRoot, 'spec'),
      path.join(docwardenRoot, 'guide'),
      path.join(docwardenRoot, 'wiki'),
      path.join(docwardenRoot, 'archive'),
    ] as const
    const files = [
      ['.docwarden/task/index.md', taskRootIndexTemplate(createdAt)],
      ['.docwarden/review/index.md', reviewIndexTemplate()],
      ['.docwarden/spec/index.md', specIndexTemplate()],
      ['.docwarden/guide/index.md', guideIndexTemplate()],
      ['.docwarden/wiki/index.md', wikiIndexTemplate()],
      ['.docwarden/config.yaml', runtimeConfigTemplate()],
    ] as const

    const filesWritten: string[] = []
    const filesSkipped: string[] = []

    for (const directory of directories) {
      const relativeDirectory = workspaceRelative(workspaceRoot, directory)
      if (yield* pathExists(directory)) {
        yield* assertDirectory(directory, `docwarden init expected a directory at ${directory}`)
        filesSkipped.push(relativeDirectory)
        continue
      }
      yield* writeDirectory(directory, `failed to create directory: ${directory}:`)
      filesWritten.push(relativeDirectory)
    }

    for (const [relativePath, content] of files) {
      const absolutePath = path.join(workspaceRoot, relativePath)
      if (yield* pathExists(absolutePath)) {
        filesSkipped.push(relativePath)
        continue
      }
      yield* writeTextFile(absolutePath, content)
      filesWritten.push(relativePath)
    }

    return {
      command: 'init' as const,
      workspaceRoot,
      docwardenRoot,
      configPath: path.join(docwardenRoot, 'config.yaml'),
      filesWritten,
      filesSkipped,
    } satisfies DocwardenInitResult
  })
}

function runTaskCreateEffect(rootRaw: string, rawId: string, rawTitle: string): Effect.Effect<DocwardenTaskCreateResult, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const workspaceRoot = resolveWorkspaceRoot(rootRaw)
    yield* assertDirectory(workspaceRoot, `init root does not exist or is not a directory: ${workspaceRoot}`)

    if (path.basename(workspaceRoot) === '.docwarden') {
      return yield* Effect.fail(new DocwardenConfigError(
        `init root must be a workspace root, not an existing .docwarden root: ${workspaceRoot}`,
      ))
    }

    const taskId = yield* parseTaskId(rawId, '--id')
    const taskTitle = parseTaskTitle(rawTitle)
    const { docwardenRoot, configPath } = yield* assertDocwardenRuntime(workspaceRoot)
    yield* assertReadableConfig(configPath)

    const taskDirectory = path.join(docwardenRoot, 'task', taskId)
    if (yield* pathExists(taskDirectory)) {
      return yield* Effect.fail(new DocwardenConfigError(`task already exists: .docwarden/task/${taskId}`))
    }

    const createdAt = new Date().toISOString()
    const createdAtCompact = timestampForFiles(createdAt)
    const taskIndexPath = path.join(taskDirectory, 'index.md')
    const taskPlanPath = path.join(taskDirectory, 'plan.md')
    const taskLogPath = path.join(taskDirectory, 'log.md')
    const taskCatalogPath = path.join(docwardenRoot, 'task', 'index.md')

    const catalogSource = yield* readTaskCatalog(taskCatalogPath)
    const catalogNext = appendTaskToCatalog(catalogSource, taskId, taskTitle)

    const create = Effect.gen(function* () {
      yield* writeDirectory(taskDirectory)
      yield* writeTextFile(taskIndexPath, taskWorkingIndexTemplate(taskId, taskTitle, createdAt))
      yield* writeTextFile(taskPlanPath, taskPlanTemplate(taskId, taskTitle, createdAt))
      yield* writeTextFile(taskLogPath, taskLogTemplate(taskId, taskTitle, createdAt, createdAtCompact))
      yield* writeTextFile(taskCatalogPath, catalogNext)

      return {
        command: 'task-create' as const,
        workspaceRoot,
        docwardenRoot,
        taskId,
        taskTitle,
        taskDirectory,
        nextEntry: taskPlanPath,
        filesWritten: ['index.md', 'plan.md', 'log.md'],
      } satisfies DocwardenTaskCreateResult
    })

    return yield* create.pipe(
      Effect.catch((error) => {
        const cleanup = fs.remove(taskDirectory, { force: true, recursive: true }).pipe(
          Effect.catch(() => Effect.void),
        )
        return cleanup.pipe(Effect.andThen(Effect.fail(toDocwardenError(error))))
      }),
    )
  })
}

function runReviewEffect(rootRaw: string, targetRaw: string, taskRaw: string): Effect.Effect<DocwardenReviewResult, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const targetInput = normalizeOptionalPath(targetRaw)
    const taskInput = normalizeOptionalPath(taskRaw)

    if (targetInput !== undefined && taskInput !== undefined) {
      return yield* Effect.fail(new DocwardenConfigError('provide only one of --task or --target'))
    }
    if (targetInput === undefined && taskInput === undefined) {
      return yield* Effect.fail(new DocwardenConfigError('missing required --task or --target'))
    }

    if (targetInput !== undefined) {
      return yield* runLegacyReviewEffect(rootRaw, targetInput)
    }

    if (taskInput === undefined) {
      return yield* Effect.fail(new DocwardenConfigError('missing required --task'))
    }
    const parsedTaskId = yield* parseTaskId(taskInput, '--task')
    return yield* runTaskReviewEffect(rootRaw, parsedTaskId)
  })
}

function runLegacyReviewEffect(rootRaw: string, targetRaw: string): Effect.Effect<DocwardenTargetReviewResult, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const runtime = yield* assertDocwardenRuntime(resolveWorkspaceRoot(rootRaw))
    const targetPath = path.resolve(runtime.workspaceRoot, targetRaw)
    const targetInfo = yield* stat(targetPath, `review target does not exist or is inaccessible: ${targetPath}`)

    const reviewRunId = makeReviewRunId('target', targetPath)
    const reviewDirectory = path.join(runtime.docwardenRoot, 'review', reviewRunId)
    const statePath = path.join(reviewDirectory, 'state.yaml')
    const createdAt = new Date().toISOString()
    const sourceFiles = [targetPath]

    const source = yield* makeTargetBackingContent({
      path: targetPath,
      info: targetInfo,
    })
    const fileEntries = [
      ['index.md', formatLegacyReviewIndex(targetPath, targetInfo.type, reviewDirectory, createdAt)],
      ['lead.md', formatLegacyReviewLead(targetPath, targetInfo.type)],
      ['backing.md', source],
      [
        'state.yaml',
        formatStateYaml({
          mode: 'target',
          reviewId: reviewRunId,
          reviewDirectory,
          status: 'review-surface-ready',
          createdAt,
          configPath: runtime.configPath,
          sourceFiles,
          targetPath,
        }),
      ],
    ] as const

    yield* writeDirectory(reviewDirectory)
    yield* Effect.forEach(fileEntries, ([fileName, content]) =>
      writeTextFile(path.join(reviewDirectory, fileName), content))

    return {
      command: 'review' as const,
      reviewMode: 'target' as const,
      workspaceRoot: runtime.workspaceRoot,
      docwardenRoot: runtime.docwardenRoot,
      configPath: runtime.configPath,
      reviewDirectory,
      statePath,
      filesWritten: ['index.md', 'lead.md', 'backing.md', 'state.yaml'],
      targetPath,
      reviewId: reviewRunId,
    } satisfies DocwardenTargetReviewResult
  })
}

function runTaskReviewEffect(rootRaw: string, taskId: string): Effect.Effect<DocwardenTaskReviewResult, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const runtime = yield* assertDocwardenRuntime(resolveWorkspaceRoot(rootRaw))
    const taskDirectory = path.join(runtime.docwardenRoot, 'task', taskId)

    if (!(yield* pathExists(taskDirectory))) {
      return yield* Effect.fail(new DocwardenConfigError(`task does not exist: .docwarden/task/${taskId}`))
    }

    const taskIndexPath = path.join(taskDirectory, 'index.md')
    const taskPlanPath = path.join(taskDirectory, 'plan.md')
    const taskLogPath = path.join(taskDirectory, 'log.md')
    const taskIndex = yield* readTaskFile(taskIndexPath, `missing task index: ${taskIndexPath}`)
    const taskPlan = yield* readTaskFile(taskPlanPath, `missing task plan: ${taskPlanPath}`)
    const taskLog = yield* readTaskFile(taskLogPath, `missing task log: ${taskLogPath}`)

    const reviewRunId = makeReviewRunId('task', taskId)
    const reviewDirectory = path.join(runtime.docwardenRoot, 'review', reviewRunId)
    const statePath = path.join(reviewDirectory, 'state.yaml')
    const createdAt = new Date().toISOString()
    const sourceFiles = [taskIndexPath, taskPlanPath, taskLogPath]

    const fileEntries = [
      ['index.md', formatTaskReviewIndex(taskId, taskDirectory, reviewRunId, reviewDirectory, createdAt)],
      ['lead.md', formatTaskReviewLead(taskId, taskIndex, taskPlan)],
      ['backing.md', formatTaskReviewBacking(taskId, taskIndexPath, taskPlanPath, taskLogPath, taskIndex, taskPlan, taskLog)],
      [
        'state.yaml',
        formatStateYaml({
          mode: 'task',
          reviewId: reviewRunId,
          reviewDirectory,
          status: 'review-surface-ready',
          createdAt,
          configPath: runtime.configPath,
          sourceFiles,
          taskId,
        }),
      ],
    ] as const

    yield* writeDirectory(reviewDirectory)
    yield* Effect.forEach(fileEntries, ([fileName, content]) =>
      writeTextFile(path.join(reviewDirectory, fileName), content))
    yield* appendTaskLog({
      logPath: taskLogPath,
      taskId,
      event: 'review generated from task',
      artifactPath: reviewDirectory,
      createdAt,
    })

    return {
      command: 'review' as const,
      reviewMode: 'task' as const,
      workspaceRoot: runtime.workspaceRoot,
      docwardenRoot: runtime.docwardenRoot,
      configPath: runtime.configPath,
      reviewDirectory,
      statePath,
      filesWritten: ['index.md', 'lead.md', 'backing.md', 'state.yaml'],
      taskId,
      taskDirectory,
      sourceFiles,
      reviewId: reviewRunId,
    } satisfies DocwardenTaskReviewResult
  })
}

interface PromoteInput {
  readonly root: string
  readonly task: string
  readonly to: string
  readonly specKind: string
  readonly specTarget: string
}

function runPromoteEffect(input: PromoteInput & { readonly kind: 'promote' }): Effect.Effect<DocwardenPromoteResult, DocwardenError, DocwardenRuntimeServices>
function runPromoteEffect(input: PromoteInput & { readonly kind: 'pick' }): Effect.Effect<DocwardenPickResult, DocwardenError, DocwardenRuntimeServices>
function runPromoteEffect(input: PromoteInput & { readonly kind: PromoteKind }): Effect.Effect<DocwardenPromoteResult | DocwardenPickResult, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const runtime = yield* assertDocwardenRuntime(resolveWorkspaceRoot(input.root))
    const taskId = yield* parseTaskId(input.task, '--task')
    const targetLayer = yield* parseDestinationLayer(input.to, input.kind)
    const specTarget = targetLayer === 'spec'
      ? yield* parseSpecTarget(input.specTarget, input.specKind)
      : undefined

    const taskDirectory = path.join(runtime.docwardenRoot, 'task', taskId)
    if (!(yield* pathExists(taskDirectory))) {
      return yield* Effect.fail(new DocwardenConfigError(`task does not exist: .docwarden/task/${taskId}`))
    }

    const taskIndexPath = path.join(taskDirectory, 'index.md')
    const taskPlanPath = path.join(taskDirectory, 'plan.md')
    const taskLogPath = path.join(taskDirectory, 'log.md')
    const taskIndex = yield* readTaskFile(taskIndexPath, `missing task index: ${taskIndexPath}`)
    const taskPlan = yield* readTaskFile(taskPlanPath, `missing task plan: ${taskPlanPath}`)
    const taskLog = yield* readTaskFile(taskLogPath, `missing task log: ${taskLogPath}`)

    const createdAt = new Date().toISOString()
    const artifactTimestamp = timestampForFiles(createdAt)
    const artifactName = input.kind === 'promote'
      ? `${taskId}-${targetLayer}-${artifactTimestamp}.md`
      : `${taskId}-wiki-pick-${artifactTimestamp}.md`
    const artifactPath = specTarget === undefined
      ? path.join(runtime.docwardenRoot, input.kind === 'pick' ? 'wiki' : targetLayer, artifactName)
      : path.join(runtime.docwardenRoot, 'spec', `${specTarget.target}.md`)

    const sourcePaths = input.kind === 'promote'
      ? [taskIndexPath, taskPlanPath, taskLogPath]
      : [taskIndexPath, taskPlanPath]

    const taskTitle = extractTaskTitle(taskIndex, taskId)

    const artifact = input.kind === 'promote'
      ? specTarget === undefined
        ? formatPromoteArtifact(taskId, taskTitle, targetLayer, createdAt, sourcePaths, taskIndex, taskPlan)
        : yield* formatSpecModulePromoteArtifact(artifactPath, specTarget.target, specTarget.kind, taskId, taskIndex, taskPlan, taskLog, createdAt, sourcePaths)
      : formatPickArtifact(taskId, taskTitle, createdAt, sourcePaths, taskIndex)

    if (specTarget !== undefined) {
      yield* ensureDirectory(path.dirname(artifactPath))
    }
    yield* writeTextFile(artifactPath, artifact)
    yield* appendTaskLog({
      logPath: taskLogPath,
      taskId,
      artifactPath,
      event: specTarget === undefined
        ? input.kind === 'promote' ? `promote to ${targetLayer}` : 'pick to wiki'
        : `promote to spec ${specTarget.target}`,
      createdAt,
    })

    if (input.kind === 'promote') {
      return {
        command: 'promote' as const,
        workspaceRoot: runtime.workspaceRoot,
        docwardenRoot: runtime.docwardenRoot,
        taskId,
        taskDirectory,
        targetLayer,
        ...(specTarget === undefined
          ? {}
          : {
              specTarget: specTarget.target,
            }),
        ...(specTarget?.kind === undefined ? {} : { specKind: specTarget.kind }),
        artifactPath,
        filesWritten: [workspaceRelative(runtime.workspaceRoot, artifactPath)],
      } satisfies DocwardenPromoteResult
    }

    return {
      command: 'pick' as const,
      workspaceRoot: runtime.workspaceRoot,
      docwardenRoot: runtime.docwardenRoot,
      taskId,
      taskDirectory,
      artifactPath,
      filesWritten: [workspaceRelative(runtime.workspaceRoot, artifactPath)],
    } satisfies DocwardenPickResult
  })
}

function formatInit(result: DocwardenInitResult): string {
  return [
    'docwarden init',
    `root: ${result.workspaceRoot}`,
    `harness: ${result.docwardenRoot}`,
    'created:',
    ...formatPathList(result.filesWritten),
    'skipped existing:',
    ...formatPathList(result.filesSkipped),
    `config: ${result.configPath}`,
  ].join('\n')
}

function formatTaskCreate(result: DocwardenTaskCreateResult): string {
  return [
    'docwarden task create',
    `task: ${result.taskDirectory}`,
    `title: ${result.taskTitle}`,
    `next entry: ${result.nextEntry}`,
    'files:',
    ...result.filesWritten.map(file => `- ${file}`),
  ].join('\n')
}

function formatReview(result: DocwardenReviewResult): string {
  if (result.reviewMode === 'target') {
    return [
      'docwarden review',
      `mode: target`,
      `target: ${result.targetPath}`,
      `review directory: ${result.reviewDirectory}`,
      `state: ${result.statePath}`,
      'files:',
      ...result.filesWritten.map(file => `- ${file}`),
    ].join('\n')
  }

  return [
    'docwarden review',
    `mode: task`,
    `task: ${result.taskId}`,
    `task directory: ${result.taskDirectory}`,
    `review directory: ${result.reviewDirectory}`,
    `state: ${result.statePath}`,
    'source files:',
    ...result.sourceFiles.map(file => `- ${file}`),
    'files:',
    ...result.filesWritten.map(file => `- ${file}`),
  ].join('\n')
}

function formatPromote(result: DocwardenPromoteResult): string {
  return [
    'docwarden promote',
    `task: ${result.taskId}`,
    `to: ${result.targetLayer}`,
    `artifact: ${result.artifactPath}`,
    'files:',
    ...result.filesWritten.map(file => `- ${file}`),
  ].join('\n')
}

function formatPick(result: DocwardenPickResult): string {
  return [
    'docwarden pick',
    `task: ${result.taskId}`,
    'to: wiki',
    `artifact: ${result.artifactPath}`,
    'files:',
    ...result.filesWritten.map(file => `- ${file}`),
  ].join('\n')
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function formatPathList(paths: readonly string[]): readonly string[] {
  return paths.length === 0 ? ['- (none)'] : paths.map(file => `- ${file}`)
}

function makeReviewRunId(scope: string, seed: string): string {
  return `${timestampForFiles(new Date().toISOString())}-${slugify(`${scope}-${seed}`)}`
}

function slugify(value: string): string {
  const baseName = value.trim().split(/[\\/]/).filter(Boolean).at(-1) ?? 'review'
  const normalized = baseName
    .toLowerCase()
    .replace(/[^\w.-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

  if (normalized.length === 0) {
    return 'entry'
  }

  return normalized.length > 64 ? normalized.slice(0, 64) : normalized
}

function formatLegacyReviewIndex(targetPath: string, targetType: FileSystem.File.Type, reviewDirectory: string, createdAt: string): string {
  return [
    '# Review Surface',
    '',
    `- mode: target`,
    `- target: ${targetPath}`,
    `- type: ${targetType}`,
    `- review_directory: ${reviewDirectory}`,
    `- created_at: ${createdAt}`,
    '',
  ].join('\n')
}

function formatLegacyReviewLead(targetPath: string, targetType: FileSystem.File.Type): string {
  return [
    '# Review Lead',
    '',
    `Target: ${targetPath}`,
    `Type: ${targetType}`,
    '',
    '检查点：',
    '- 目标摘要是否足够支撑 review',
    '- 是否需要补齐上下文再进入 promote/pick',
    '',
  ].join('\n')
}

function makeTargetBackingContent(input: {
  readonly path: string
  readonly info: FileSystem.File.Info
}): Effect.Effect<string, DocwardenRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    if (input.info.type === 'Directory') {
      const children = yield* fs.readDirectory(input.path).pipe(
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
    }

    if (input.info.type === 'File') {
      const fileText = yield* fs.readFileString(input.path).pipe(
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
    }

    return [
      `Target type: ${input.info.type}`,
      `Path: ${input.path}`,
      '',
      'Unsupported target kind for deeper backing extraction.',
      '',
    ].join('\n')
  })
}

function formatTaskReviewIndex(taskId: string, taskDirectory: string, reviewId: string, reviewDirectory: string, createdAt: string): string {
  return [
    '# Review Surface',
    '',
    `- mode: task`,
    `- task_id: ${taskId}`,
    `- task_directory: ${taskDirectory}`,
    `- review_id: ${reviewId}`,
    `- review_directory: ${reviewDirectory}`,
    `- created_at: ${createdAt}`,
    '',
    '## 审查目标',
    '- 从 task/index.md / task/plan.md / task/log.md 提炼可审查决策边界',
    '- 决定哪些内容进入 spec / guide / wiki',
    '',
  ].join('\n')
}

function formatTaskReviewLead(taskId: string, taskIndex: string, taskPlan: string): string {
  const summary = summarizeTaskMaterial(taskId, taskIndex, taskPlan, '')
  return [
    '# Review Lead',
    '',
    `Task: ${summary.title} (${taskId})`,
    '',
    '## Decision',
    '- 本轮需要判断：哪些 task material 已经可以进入 spec / guide / wiki，哪些只能作为 side material 或继续留在 task。',
    `- 推荐路径：${recommendRoute(summary)}`,
    '',
    '## Mainline Candidate',
    ...formatSummaryBullets(summary.objective, '尚未提炼出明确目标，暂不建议直接 promote。'),
    '',
    '## Side Material Candidate',
    ...formatSummaryBullets(summary.context, '当前没有明显 side material；可继续从 log 或 review 反馈中 pick。'),
    '',
    '## Missing Context',
    ...formatSummaryBullets(summary.gaps, '未发现阻塞性缺口。'),
    '',
    '## Review Options',
    '- promote: 目标、边界和执行规则已经足够稳定。',
    '- pick: 出现了可复用判断、协作偏好或 side knowledge，但不属于主线规范。',
    '- continue-task: 目标或边界仍缺失，需要继续补 task material。',
    '- no-op: 本轮没有值得沉淀的新增内容。',
    '',
  ].join('\n')
}

function formatTaskReviewBacking(
  taskId: string,
  taskIndexPath: string,
  taskPlanPath: string,
  taskLogPath: string,
  taskIndex: string,
  taskPlan: string,
  taskLog: string,
): string {
  const summary = summarizeTaskMaterial(taskId, taskIndex, taskPlan, taskLog)
  return [
    '# Review Backing',
    '',
    `Task: ${summary.title} (${taskId})`,
    '',
    'Source files:',
    `- ${taskIndexPath}`,
    `- ${taskPlanPath}`,
    `- ${taskLogPath}`,
    '',
    '## Extracted Material',
    '',
    '### Context',
    ...formatSummaryBullets(summary.context, '未提取到 context。'),
    '',
    '### Objective',
    ...formatSummaryBullets(summary.objective, '未提取到 objective。'),
    '',
    '### Boundary',
    ...formatSummaryBullets(summary.boundary, '未提取到 boundary。'),
    '',
    '### Plan Steps',
    ...formatSummaryBullets(summary.planSteps, '未提取到 plan steps。'),
    '',
    '### Recent Log',
    ...formatSummaryBullets(summary.logEvents, '暂无 log event。'),
    '',
  ].join('\n')
}

function formatStateYaml(input: {
  readonly mode: ReviewMode
  readonly reviewId: string
  readonly reviewDirectory: string
  readonly status: string
  readonly createdAt: string
  readonly configPath: string
  readonly sourceFiles: readonly string[]
  readonly targetPath?: string
  readonly taskId?: string
}): string {
  const lines = [
    `mode: ${input.mode}`,
    `review_id: ${input.reviewId}`,
    `status: ${input.status}`,
    `created_at: ${input.createdAt}`,
    `review_dir: ${input.reviewDirectory}`,
    `config_path: ${input.configPath}`,
  ]

  if (input.targetPath !== undefined) {
    lines.push(`target: ${input.targetPath}`)
  }
  if (input.taskId !== undefined) {
    lines.push(`task_id: ${input.taskId}`)
  }

  return [
    ...lines,
    'source_files:',
    ...input.sourceFiles.map(file => `  - ${file}`),
    '',
  ].join('\n')
}

function formatSpecModulePromoteArtifact(
  modulePath: string,
  target: string,
  kind: SpecModuleKind | undefined,
  taskId: string,
  taskIndex: string,
  taskPlan: string,
  taskLog: string,
  createdAt: string,
  sourcePaths: readonly string[],
): Effect.Effect<string, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const existing = (yield* pathExists(modulePath))
      ? yield* readTaskFile(modulePath, `failed to read spec module: ${modulePath}`)
      : kind === undefined
        ? yield* Effect.fail(new DocwardenConfigError('promote --to spec requires --kind when creating a missing target'))
        : formatNewSpecModule(kind, path.basename(target))
    const summary = summarizeTaskMaterial(taskId, taskIndex, taskPlan, taskLog)
    const assertion = firstOrFallback(summary.objective, `task ${taskId} produced a reviewed spec candidate.`)
    const marker = `^task-${taskId.replace(/[^a-z0-9]+/gi, '-')}-${timestampForFiles(createdAt).slice(0, 14)}`
    const addition = [
      '',
      '## Assertions',
      '',
      `- ${assertion} ${marker}`,
      '',
      '## Trace',
      '',
      `- task: \`.docwarden/task/${taskId}/\``,
      `- promoted_at: ${createdAt}`,
      ...sourcePaths.map(path => `- source: ${path}`),
      '',
    ].join('\n')

    if (existing.includes(marker)) {
      return existing
    }
    return `${existing.trimEnd()}\n${addition}`
  })
}

function formatPromoteArtifact(
  taskId: string,
  taskTitle: string,
  layer: TaskLayer,
  createdAt: string,
  sourcePaths: readonly string[],
  taskIndex: string,
  taskPlan: string,
): string {
  const summary = summarizeTaskMaterial(taskId, taskIndex, taskPlan, '')
  if (layer === 'guide') {
    return formatGuideArtifact(summary, createdAt, sourcePaths)
  }
  if (layer === 'wiki') {
    return formatWikiArtifact(summary, createdAt, sourcePaths, 'promote')
  }
  return [
    `# Spec: ${taskTitle}`,
    '',
    `Task: ${summary.taskId}`,
    `Generated at: ${createdAt}`,
    'Layer: spec',
    '',
    '## Trace',
    ...sourcePaths.map(path => `- ${path}`),
    '',
    '## Stable Contract',
    ...formatSummaryBullets(summary.objective, '目标尚未稳定；本产物只能作为待 review 草案。'),
    '',
    '## Execution Rules',
    ...formatSummaryBullets(summary.planSteps, '尚未形成可执行规则。'),
    '',
    '## Boundary',
    ...formatSummaryBullets(summary.boundary, '边界尚未稳定。'),
    '',
    '## Review Notes',
    ...formatSummaryBullets(summary.gaps, '没有发现阻塞性缺口。'),
    '',
  ].join('\n')
}

function formatPickArtifact(
  taskId: string,
  taskTitle: string,
  createdAt: string,
  sourcePaths: readonly string[],
  taskIndex: string,
): string {
  const summary = summarizeTaskMaterial(taskId, taskIndex, '', '')
  const signal = firstOrFallback(summary.context, 'task material 中存在可能长期复用的判断或上下文。')
  return [
    `# Wiki Pick: ${taskTitle}`,
    '',
    `Task: ${summary.taskId}`,
    `Generated at: ${createdAt}`,
    '',
    '## Trace',
    ...sourcePaths.map(path => `- ${path}`),
    '',
    '## Pick Reason',
    `- ${signal}`,
    '',
    '## Reusable Pattern',
    ...formatSummaryBullets(summary.objective, '需要继续观察，多次 signal 后再提升为长期默认模式。'),
    '',
    '## Applicability',
    ...formatSummaryBullets(summary.boundary, '适用于相似上下文中的后续判断，不能覆盖用户当前明确指令。'),
    '',
    '## Review State',
    '- status: picked-from-task',
    '- next: 多次相似 signal 后再考虑提升为 user-context 或 spec。',
    '',
  ].join('\n')
}

function formatGuideArtifact(
  summary: TaskMaterialSummary,
  createdAt: string,
  sourcePaths: readonly string[],
): string {
  return [
    `# Guide: ${summary.title}`,
    '',
    `Task: ${summary.taskId}`,
    `Generated at: ${createdAt}`,
    'Layer: guide',
    '',
    '## Trace',
    ...sourcePaths.map(path => `- ${path}`),
    '',
    '## Why This Exists',
    ...formatSummaryBullets(summary.context, '尚未形成足够背景叙事。'),
    '',
    '## How To Read This Work',
    ...formatSummaryBullets(summary.objective, '尚未形成稳定阅读目标。'),
    '',
    '## Current Boundary',
    ...formatSummaryBullets(summary.boundary, '边界仍需用户 review。'),
    '',
  ].join('\n')
}

function formatWikiArtifact(
  summary: TaskMaterialSummary,
  createdAt: string,
  sourcePaths: readonly string[],
  source: 'promote' | 'pick',
): string {
  return [
    `# Wiki: ${summary.title}`,
    '',
    `Task: ${summary.taskId}`,
    `Generated at: ${createdAt}`,
    'Layer: wiki',
    `Source: ${source}`,
    '',
    '## Trace',
    ...sourcePaths.map(path => `- ${path}`),
    '',
    '## Concept',
    ...formatSummaryBullets(summary.objective, '尚未形成稳定概念。'),
    '',
    '## Signals',
    ...formatSummaryBullets(summary.context, '暂无可复用 signal。'),
    '',
    '## Boundaries',
    ...formatSummaryBullets(summary.boundary, '适用边界仍需补充。'),
    '',
  ].join('\n')
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

function taskRootIndexTemplate(createdAt: string): string {
  return [
    '# task index',
    '',
    '本层承载 process 任务过程材料（task / plan / log）。',
    `生成时间: ${createdAt}`,
    '',
    '## 当前 active task',
    '',
  ].join('\n')
}

function reviewIndexTemplate(): string {
  return [
    '# review index',
    '',
    'review surface 由 `task` 或 `target` 触发，产物保存到 `.docwarden/review/<id>/`。',
    '',
    '- 目标文件：`index.md`',
    '- 判断文件：`lead.md`',
    '- 证据文件：`backing.md`',
    '- 状态文件：`state.yaml`',
    '',
  ].join('\n')
}

function specIndexTemplate(): string {
  return [
    '# spec index',
    '',
    '`.docwarden/spec/` 承载当前 workspace 已 review 的稳定 md module。',
    '',
    '`docwarden init` 只创建这个入口和空目录，不推断项目层级，不写入真实 spec 内容。',
    '',
    '具体目录、module 和 assertion 由后续 review / promote 依据当前项目映射生成。',
    '',
    '## Entry',
    '',
    '```text',
    '.docwarden/spec/<target>.md',
    '```',
    '',
    '如果项目使用 isomorph mapping，mapping 负责约束 `<target>` 的实际形状。',
    '',
    '## Boundary',
    '',
    '- 不保存 task summary。',
    '- 不保存 review surface。',
    '- 不替代 `docs/`。',
    '',
    '没有明确 `<target>` 的内容不能进入 stable spec。',
    '',
  ].join('\n')
}

function formatNewSpecModule(kind: SpecModuleKind, moduleName: string): string {
  return [
    '---',
    `kind: ${kind}`,
    '---',
    '',
    `# ${moduleName}`,
    '',
  ].join('\n')
}

function guideIndexTemplate(): string {
  return [
    '# guide index',
    '',
    '用户文档在 `docwarden promote --to guide` 后沉淀。',
    '',
  ].join('\n')
}

function wikiIndexTemplate(): string {
  return [
    '# wiki index',
    '',
    '知识与经验条目由 `promote --to wiki` 或 `pick --to wiki` 产出。',
    '',
  ].join('\n')
}

function taskWorkingIndexTemplate(taskId: string, taskTitle: string, createdAt: string): string {
  return [
    '---',
    'status: active',
    'workspace_status: working',
    `created: ${createdAt}`,
    `updated: ${createdAt}`,
    `title: ${taskTitle}`,
    `id: ${taskId}`,
    '---',
    '',
    `# ${taskTitle}`,
    '',
    '## Context',
    '- ',
    '',
    '## Objective',
    '- ',
    '',
    '## Boundary',
    '- ',
    '',
    '## Next Entry',
    '- plan.md',
    '',
  ].join('\n')
}

function taskPlanTemplate(taskId: string, taskTitle: string, createdAt: string): string {
  return [
    `# ${taskId} plan`,
    '',
    `Task title: ${taskTitle}`,
    `Created: ${createdAt}`,
    '',
    '## Objective',
    '- ',
    '',
    '## Steps',
    '- [ ] 定义边界与验收标准',
    '- [ ] 生成 review surface',
    '- [ ] 完成 promote / pick 决策',
    '',
  ].join('\n')
}

function taskLogTemplate(taskId: string, taskTitle: string, createdAt: string, compact: string): string {
  return [
    '---',
    'status: active',
    `created: ${createdAt}`,
    `updated: ${createdAt}`,
    `title: ${taskTitle}`,
    `id: ${taskId}`,
    '---',
    '',
    '# Log',
    '',
    `- [${compact}] task created: ${taskTitle} (${taskId})`,
    '',
  ].join('\n')
}

function appendTaskToCatalog(content: string, taskId: string, taskTitle: string): string {
  const entry = `- \`.docwarden/task/${taskId}/\`：${taskTitle}`
  if (content.includes(`.docwarden/task/${taskId}/`)) {
    return content
  }

  const marker = /^## 当前 active task|^## Active tasks?/m
  if (marker.test(content)) {
    return content.replace(marker, match => `${match}\n\n${entry}`)
  }

  return `${content}\n## 当前 active task\n\n${entry}\n`
}

function appendTaskLog(input: {
  readonly logPath: string
  readonly taskId: string
  readonly event: string
  readonly artifactPath: string
  readonly createdAt: string
}): Effect.Effect<void, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const exists = yield* pathExists(input.logPath)
    const existing = exists
      ? yield* fs.readFileString(input.logPath).pipe(
        Effect.mapError(error => new DocwardenRuntimeError(`failed to read task log: ${input.logPath}: ${formatUnknownCause(error)}`)),
      )
      : taskLogTemplate(input.taskId, input.taskId, input.createdAt, timestampForFiles(input.createdAt))

    const next = `${existing.trimEnd()}\n- [${input.createdAt}] ${input.event}: ${input.artifactPath}\n`
    yield* writeTextFile(input.logPath, next)
  })
}

function readTaskCatalog(taskCatalogPath: string): Effect.Effect<string, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    if (!(yield* pathExists(taskCatalogPath))) {
      return taskRootIndexTemplate(new Date().toISOString())
    }
    return yield* fs.readFileString(taskCatalogPath).pipe(
      Effect.mapError(error => new DocwardenConfigError(`failed to read task index: ${taskCatalogPath}: ${formatUnknownCause(error)}`)),
    )
  })
}

function readTaskFile(filePath: string, missingMessage: string): Effect.Effect<string, DocwardenConfigError | DocwardenRuntimeError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.readFileString(filePath).pipe(
      Effect.mapError(error => new DocwardenConfigError(`${missingMessage}: ${formatUnknownCause(error)}`)),
    )
  })
}

function assertDocwardenRuntime(workspaceRoot: string): Effect.Effect<{ workspaceRoot: string, docwardenRoot: string, configPath: string }, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    yield* assertDirectory(workspaceRoot, `review root does not exist or is not a directory: ${workspaceRoot}`)
    if (path.basename(workspaceRoot) === '.docwarden') {
      return yield* Effect.fail(new DocwardenConfigError(
        `review root must be a workspace root, not an existing .docwarden root: ${workspaceRoot}`,
      ))
    }

    const docwardenRoot = path.join(workspaceRoot, '.docwarden')
    const configPath = path.join(docwardenRoot, 'config.yaml')
    if (!(yield* pathExists(configPath))) {
      return yield* Effect.fail(new DocwardenConfigError(`docwarden config missing at ${configPath}; run docwarden init first`))
    }

    yield* assertReadableConfig(configPath)
    return { workspaceRoot, docwardenRoot, configPath }
  })
}

function parseTaskId(raw: string, flagName: '--id' | '--task'): Effect.Effect<string, DocwardenConfigError> {
  const value = normalizeOptionalPath(raw)
  if (value === undefined) {
    return Effect.fail(new DocwardenConfigError(`missing required ${flagName}`))
  }
  if (value.includes('/') || value.includes('\\') || value === '.') {
    return Effect.fail(new DocwardenConfigError(`invalid task id: ${value}`))
  }
  if (!/^[a-z0-9][\w.-]*$/i.test(value)) {
    return Effect.fail(new DocwardenConfigError(`invalid task id: ${value}`))
  }
  return Effect.succeed(value)
}

function parseTaskTitle(raw: string): string {
  return normalizeOptionalPath(raw) ?? 'untitled task'
}

function parseDestinationLayer(raw: string, kind: PromoteKind): Effect.Effect<TaskLayer, DocwardenConfigError> {
  const value = normalizeOptionalPath(raw)
  if (value === undefined) {
    return kind === 'promote'
      ? Effect.fail(new DocwardenConfigError('missing required --to'))
      : Effect.fail(new DocwardenConfigError('missing required --to wiki'))
  }

  if (value === 'spec' || value === 'guide' || value === 'wiki') {
    if (kind === 'pick' && value !== 'wiki') {
      return Effect.fail(new DocwardenConfigError('pick only supports --to wiki'))
    }
    return Effect.succeed(value)
  }

  return Effect.fail(new DocwardenConfigError(`invalid --to destination: ${value}; expected spec, guide, wiki`))
}

function parseSpecTarget(
  rawTarget: string,
  rawKind: string,
): Effect.Effect<{ readonly target: string, readonly kind?: SpecModuleKind }, DocwardenConfigError> {
  const target = normalizeOptionalPath(rawTarget)
  const kind = normalizeOptionalPath(rawKind)
  if (target === undefined) {
    return Effect.fail(new DocwardenConfigError('promote --to spec requires --target'))
  }
  const normalizedTarget = target.endsWith('.md') ? target.slice(0, -3) : target
  if (normalizedTarget.length === 0 || normalizedTarget.startsWith('/') || normalizedTarget.includes('\\')) {
    return Effect.fail(new DocwardenConfigError(`invalid spec target: ${target}`))
  }
  const segments = normalizedTarget.split('/')
  if (segments.length < 2) {
    return Effect.fail(new DocwardenConfigError(`invalid spec target: ${target}; expected <scope>/<module>`))
  }
  if (segments.some(segment => segment.length === 0 || segment === '.' || segment === '..' || !/^[a-z0-9][\w.-]*$/i.test(segment))) {
    return Effect.fail(new DocwardenConfigError(`invalid spec target: ${target}`))
  }
  if (kind !== undefined && (kind.includes('/') || kind.includes('\\') || kind === '.')) {
    return Effect.fail(new DocwardenConfigError(`invalid spec kind: ${kind}`))
  }
  if (kind !== undefined && !/^[a-z0-9][\w.-]*$/i.test(kind)) {
    return Effect.fail(new DocwardenConfigError(`invalid spec kind: ${kind}`))
  }
  return Effect.succeed({
    target: normalizedTarget,
    ...(kind === undefined ? {} : { kind }),
  })
}

function assertDirectory(directory: string, message: string): Effect.Effect<void, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const info = yield* stat(directory, message)
    if (info.type !== 'Directory') {
      return yield* Effect.fail(new DocwardenConfigError(message))
    }
  })
}

function assertReadableConfig(configPath: string): Effect.Effect<void, DocwardenError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const config = yield* readTaskFile(configPath, `docwarden config is not readable at ${configPath}`)
    if (config.trim().length === 0) {
      return yield* Effect.fail(new DocwardenConfigError(`docwarden config is empty at ${configPath}; run docwarden init again`))
    }
  })
}

function resolveWorkspaceRoot(rawRoot: string): string {
  return path.resolve(normalizeOptionalPath(rawRoot) ?? '.')
}

function workspaceRelative(workspaceRoot: string, absolutePath: string): string {
  return path.relative(workspaceRoot, absolutePath).split(path.sep).join('/')
}

function writeDirectory(directory: string, messagePrefix = 'failed to create directory:'): Effect.Effect<void, DocwardenRuntimeError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    yield* fs.makeDirectory(directory, { recursive: false }).pipe(
      Effect.mapError(error => new DocwardenRuntimeError(`${messagePrefix} ${directory}: ${formatUnknownCause(error)}`)),
    )
  })
}

function ensureDirectory(directory: string): Effect.Effect<void, DocwardenRuntimeError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    yield* fs.makeDirectory(directory, { recursive: true }).pipe(
      Effect.mapError(error => new DocwardenRuntimeError(`failed to create directory: ${directory}: ${formatUnknownCause(error)}`)),
    )
  })
}

function writeTextFile(filePath: string, content: string): Effect.Effect<void, DocwardenRuntimeError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    yield* fs.writeFileString(filePath, content).pipe(
      Effect.mapError(error => new DocwardenRuntimeError(`failed to write file: ${filePath}: ${formatUnknownCause(error)}`)),
    )
  })
}

function pathExists(filePath: string): Effect.Effect<boolean, DocwardenRuntimeError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.exists(filePath).pipe(
      Effect.mapError(error => new DocwardenRuntimeError(`failed to check path existence: ${filePath}: ${formatUnknownCause(error)}`)),
    )
  })
}

function stat(filePath: string, message: string): Effect.Effect<FileSystem.File.Info, DocwardenConfigError | DocwardenRuntimeError, DocwardenRuntimeServices> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(filePath).pipe(
      Effect.mapError(error => new DocwardenConfigError(`${message}: ${formatUnknownCause(error)}`)),
    )
  })
}

function timestampForFiles(value: string): string {
  return value.replace(/[-:.TZ]/g, '')
}

function summarizeTaskMaterial(taskId: string, taskIndex: string, taskPlan: string, taskLog: string): TaskMaterialSummary {
  const title = extractTaskTitle(taskIndex, taskId)
  const context = cleanMaterialLines(extractSection(taskIndex, 'Context'))
  const indexObjective = cleanMaterialLines(extractSection(taskIndex, 'Objective'))
  const planObjective = cleanMaterialLines(extractSection(taskPlan, 'Objective'))
  const boundary = cleanMaterialLines(extractSection(taskIndex, 'Boundary'))
  const nextEntry = cleanMaterialLines(extractSection(taskIndex, 'Next Entry'))
  const planSteps = extractPlanSteps(taskPlan)
  const logEvents = extractLogEvents(taskLog)
  const objective = indexObjective.length > 0 ? indexObjective : planObjective
  const gaps = [
    objective.length === 0 ? '缺少明确 objective。' : undefined,
    boundary.length === 0 ? '缺少明确 boundary。' : undefined,
    planSteps.length === 0 ? '缺少可执行 plan steps。' : undefined,
  ].filter((value): value is string => value !== undefined)

  return {
    taskId,
    title,
    context,
    objective,
    boundary,
    nextEntry,
    planObjective,
    planSteps,
    logEvents,
    gaps,
  }
}

function cleanMaterialLines(lines: readonly string[]): readonly string[] {
  return lines
    .map(line => line.trim())
    .map(line => line.replace(/^- \[[ x]\]\s+/i, ''))
    .map(line => line.replace(/^[-*]\s*/, ''))
    .map(line => line.replace(/^\d+\.\s*/, ''))
    .filter(line => line.length > 0)
    .filter(line => line !== '---')
    .filter(line => !line.startsWith('```'))
    .filter(line => line !== '-')
}

function extractLogEvents(taskLog: string): readonly string[] {
  return taskLog
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => /^- \[.+\]/.test(line))
    .map(line => line.replace(/^-\s*/, ''))
    .slice(-5)
}

function formatSummaryBullets(lines: readonly string[], fallback: string): readonly string[] {
  const source = lines.length === 0 ? [fallback] : lines
  return source.map(line => `- ${line}`)
}

function firstOrFallback(lines: readonly string[], fallback: string): string {
  const useful = lines.filter(line => !line.endsWith(':') && !line.endsWith('：'))
  return useful.slice(0, 2).join(' ') || lines.slice(0, 2).join(' ') || fallback
}

function recommendRoute(summary: TaskMaterialSummary): string {
  if (summary.gaps.length > 0) {
    return 'continue-task'
  }
  if (summary.objective.length > 0 && summary.boundary.length > 0) {
    return 'promote or pick after user review'
  }
  return 'review-first'
}

function extractPlanSteps(taskPlan: string): readonly string[] {
  const explicitSteps = cleanMaterialLines(extractSection(taskPlan, 'Steps'))
  if (explicitSteps.length > 0) {
    return explicitSteps
  }

  return taskPlan
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => /^## Step\s+\d+/i.test(line))
    .map(line => line.replace(/^##\s*/, ''))
}

function extractSection(text: string, heading: string): string[] {
  const lines = text.split(/\r?\n/)
  const headingIndex = lines.findIndex(line => line.trim().toLowerCase().startsWith(`## ${heading.toLowerCase()}`))
  if (headingIndex < 0) {
    return []
  }
  const out: string[] = []
  const rest = lines.slice(headingIndex + 1)
  for (const line of rest) {
    if (line.startsWith('## ') && out.length > 0) {
      break
    }
    if (line.trim().length > 0) {
      out.push(line.trim())
    }
  }
  return out
}

function extractTaskTitle(taskIndex: string, taskId: string): string {
  const heading = taskIndex.split(/\r?\n/).find(line => line.startsWith('# '))
  if (heading !== undefined && heading !== '# ') {
    return heading.slice(2).trim()
  }
  return taskId
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
