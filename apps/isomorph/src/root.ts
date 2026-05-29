import type { IsomorphRoot, ResolveOptions } from './domain.js'
import type { IsomorphError } from './errors.js'
import type { CurrentWorkingDirectoryService } from './services.js'
import { Effect, FileSystem, Path } from 'effect'
import { formatUnknownCause, IsomorphConfigError, IsomorphRuntimeError } from './errors.js'
import { CurrentWorkingDirectory } from './services.js'

export function resolveIsomorphRootEffect(options: ResolveOptions = {}): Effect.Effect<IsomorphRoot, IsomorphError, CurrentWorkingDirectoryService | FileSystem.FileSystem | Path.Path> {
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
      const found = yield* findWorkspaceWithIsomorph(targetStart)
      if (found !== undefined) {
        yield* assertTargetInside(found, targetPath)
        return {
          workspaceRoot: found,
          isomorphRoot: path.join(found, '.isomorph'),
          source: 'target',
        }
      }
    }

    const found = yield* findWorkspaceWithIsomorph(cwd)
    if (found === undefined) {
      return yield* Effect.fail(new IsomorphConfigError({ message: 'could not resolve local .isomorph root' }))
    }

    return {
      workspaceRoot: found,
      isomorphRoot: path.join(found, '.isomorph'),
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

export function assertTargetInside(workspaceRoot: string, targetPath: string): Effect.Effect<void, IsomorphConfigError, Path.Path> {
  return assertInside(workspaceRoot, targetPath, `target is outside resolved root: ${targetPath}`)
}

export function assertInside(root: string, target: string, message: string): Effect.Effect<void, IsomorphConfigError, Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const relative = path.relative(root, target)
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return yield* Effect.fail(new IsomorphConfigError({ message }))
    }
  })
}

export function assertDirectory(directory: string, message: string): Effect.Effect<void, IsomorphConfigError | IsomorphRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const info = yield* stat(directory, message)
    if (info.type !== 'Directory') {
      return yield* Effect.fail(new IsomorphConfigError({ message }))
    }
  })
}

export function pathExists(filePath: string): Effect.Effect<boolean, IsomorphRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.exists(filePath).pipe(
      Effect.mapError(error => new IsomorphRuntimeError({
        message: `failed to check path existence: ${filePath}: ${formatUnknownCause(error)}`,
      })),
    )
  })
}

function resolveExplicitRoot(cwd: string, root: string): Effect.Effect<IsomorphRoot, IsomorphError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const absolute = path.resolve(cwd, root)
    yield* assertDirectory(absolute, `explicit root does not exist or is not a directory: ${absolute}`)

    if (path.basename(absolute) === '.isomorph') {
      return {
        workspaceRoot: path.dirname(absolute),
        isomorphRoot: absolute,
        source: 'explicit',
      }
    }

    const isomorphRoot = path.join(absolute, '.isomorph')
    yield* assertDirectory(isomorphRoot, `explicit root does not contain .isomorph: ${absolute}`)
    return {
      workspaceRoot: absolute,
      isomorphRoot,
      source: 'explicit',
    }
  })
}

function directoryForSearch(targetPath: string): Effect.Effect<string, IsomorphRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(targetPath).pipe(
      Effect.map(info => info.type === 'Directory' ? targetPath : path.dirname(targetPath)),
      Effect.catch(() => Effect.succeed(path.dirname(targetPath))),
    )
  })
}

function findWorkspaceWithIsomorph(start: string): Effect.Effect<string | undefined, IsomorphRuntimeError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const path = yield* Path.Path
    let current = path.resolve(start)
    for (;;) {
      const hasIsomorph = yield* isDirectory(path.join(current, '.isomorph'))
      if (hasIsomorph) {
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

function isDirectory(filePath: string): Effect.Effect<boolean, IsomorphRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(filePath).pipe(
      Effect.map(info => info.type === 'Directory'),
      Effect.catch(() => Effect.succeed(false)),
    )
  })
}

function stat(filePath: string, message: string): Effect.Effect<FileSystem.File.Info, IsomorphConfigError | IsomorphRuntimeError, FileSystem.FileSystem> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(filePath).pipe(
      Effect.mapError(error => new IsomorphConfigError({
        message: `${message}: ${formatUnknownCause(error)}`,
      })),
    )
  })
}
