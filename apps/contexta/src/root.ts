import type { ContextaRoot, ResolveOptions } from './domain.js'
import type { ContextaError } from './errors.js'
import type { CurrentWorkingDirectoryService } from './services.js'
import { Effect, FileSystem, Path } from 'effect'
import { ContextaConfigError, ContextaRuntimeError, formatUnknownCause } from './errors.js'
import { CurrentWorkingDirectory } from './services.js'

export function resolveContextaRootEffect(options: ResolveOptions = {}): Effect.Effect<ContextaRoot, ContextaError, CurrentWorkingDirectoryService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const cwdService = yield* CurrentWorkingDirectory
    const cwd = path.resolve(options.cwd ?? (yield* cwdService.current))
    const explicitRoot = normalizeOptionalPath(options.root)

    if (explicitRoot !== undefined) {
      return yield* resolveExplicitRoot(cwd, explicitRoot)
    }

    const target = normalizeOptionalPath(options.target)
    if (target !== undefined) {
      const targetPath = path.resolve(cwd, target)
      const targetStart = yield* directoryForSearch(targetPath)
      const found = yield* findWorkspaceWithContexta(targetStart)
      if (found !== undefined) {
        yield* assertTargetInside(found, targetPath)
        return {
          workspaceRoot: found,
          contextaRoot: path.join(found, '.contexta'),
          source: 'target',
        }
      }
    }

    const found = yield* findWorkspaceWithContexta(cwd)
    if (found === undefined) {
      return yield* Effect.fail(new ContextaConfigError({ message: 'could not resolve local .contexta root' }))
    }

    return {
      workspaceRoot: found,
      contextaRoot: path.join(found, '.contexta'),
      source: 'cwd',
    }
  })
}

export function normalizeOptionalPath(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed === undefined || trimmed.length === 0 ? undefined : trimmed
}

export function toWorkspacePath(workspaceRoot: string, absolutePath: string): Effect.Effect<string, never, Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    return toPosix(path.relative(workspaceRoot, absolutePath), path.sep)
  })
}

export function toPosix(filePath: string, separator: string): string {
  return filePath.split(separator).join('/')
}

export function assertTargetInside(workspaceRoot: string, targetPath: string): Effect.Effect<void, ContextaConfigError, Path.Path> {
  return assertInside(workspaceRoot, targetPath, `target is outside resolved root: ${targetPath}`)
}

export function assertInside(root: string, target: string, message: string): Effect.Effect<void, ContextaConfigError, Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const relative = path.relative(root, target)
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return yield* Effect.fail(new ContextaConfigError({ message }))
    }
  })
}

export function assertDirectory(directory: string, message: string): Effect.Effect<void, ContextaConfigError | ContextaRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const info = yield* stat(directory, message)
    if (info.type !== 'Directory') {
      return yield* Effect.fail(new ContextaConfigError({ message }))
    }
  })
}

export function pathExists(filePath: string): Effect.Effect<boolean, ContextaRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.exists(filePath).pipe(
      Effect.mapError(error => new ContextaRuntimeError({
        message: `failed to check path existence: ${filePath}: ${formatUnknownCause(error)}`,
      })),
    )
  })
}

function resolveExplicitRoot(cwd: string, root: string): Effect.Effect<ContextaRoot, ContextaError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const absolute = path.resolve(cwd, root)
    yield* assertDirectory(absolute, `explicit root does not exist or is not a directory: ${absolute}`)

    if (path.basename(absolute) === '.contexta') {
      return {
        workspaceRoot: path.dirname(absolute),
        contextaRoot: absolute,
        source: 'explicit',
      }
    }

    const contextaRoot = path.join(absolute, '.contexta')
    yield* assertDirectory(contextaRoot, `explicit root does not contain .contexta: ${absolute}`)
    return {
      workspaceRoot: absolute,
      contextaRoot,
      source: 'explicit',
    }
  })
}

function directoryForSearch(targetPath: string): Effect.Effect<string, ContextaRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(targetPath).pipe(
      Effect.map(info => info.type === 'Directory' ? targetPath : path.dirname(targetPath)),
      Effect.catch(() => Effect.succeed(path.dirname(targetPath))),
    )
  })
}

function findWorkspaceWithContexta(start: string): Effect.Effect<string | undefined, ContextaRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    let current = path.resolve(start)
    for (;;) {
      const hasContexta = yield* isDirectory(path.join(current, '.contexta'))
      if (hasContexta) {
        return current
      }
      const parent = path.dirname(current)
      if (parent === current) {
        return undefined
      }
      current = parent
    }
  })
}

function isDirectory(filePath: string): Effect.Effect<boolean, ContextaRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(filePath).pipe(
      Effect.map(info => info.type === 'Directory'),
      Effect.catch(() => Effect.succeed(false)),
    )
  })
}

function stat(filePath: string, message: string): Effect.Effect<FileSystem.File.Info, ContextaConfigError | ContextaRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(filePath).pipe(
      Effect.mapError(error => new ContextaConfigError({
        message: `${message}: ${formatUnknownCause(error)}`,
      })),
    )
  })
}
