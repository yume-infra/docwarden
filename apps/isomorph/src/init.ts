import type { InitOptions, InitResult, PinMetadata } from './domain.js'
import type { IsomorphError } from './errors.js'
import type { CurrentWorkingDirectoryService, VendorSnapshotProviderService } from './services.js'
import { Clock, Effect, FileSystem, Path } from 'effect'
import { formatUnknownCause, IsomorphConfigError, IsomorphRuntimeError } from './errors.js'
import { assertDirectory, assertInside, normalizeOptionalPath, pathExists } from './root.js'
import { CurrentWorkingDirectory, VendorSnapshotProvider } from './services.js'

export function runInitEffect(options: InitOptions = {}): Effect.Effect<InitResult, IsomorphError, CurrentWorkingDirectoryService | VendorSnapshotProviderService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const cwdService = yield* CurrentWorkingDirectory
    const snapshotProvider = yield* VendorSnapshotProvider
    const cwd = path.resolve(options.cwd ?? (yield* cwdService.current))
    const workspaceRoot = path.resolve(cwd, normalizeOptionalPath(options.root) ?? '.')
    yield* assertDirectory(workspaceRoot, `init root does not exist or is not a directory: ${workspaceRoot}`)
    if (path.basename(workspaceRoot) === '.isomorph') {
      return yield* Effect.fail(new IsomorphConfigError({
        message: `init root must be a workspace root, not an existing .isomorph root: ${workspaceRoot}`,
      }))
    }

    const isomorphRoot = path.join(workspaceRoot, '.isomorph')
    if (yield* pathExists(isomorphRoot)) {
      return yield* Effect.fail(new IsomorphConfigError({ message: `local .isomorph already exists: ${isomorphRoot}` }))
    }

    const snapshot = yield* snapshotProvider.current
    yield* fs.makeDirectory(isomorphRoot, { recursive: false }).pipe(
      Effect.mapError(error => new IsomorphRuntimeError({
        message: `failed to create local .isomorph: ${isomorphRoot}: ${formatUnknownCause(error)}`,
      })),
    )

    const writeSeed = Effect.gen(function* () {
      for (const file of snapshot.files) {
        const destination = path.join(isomorphRoot, file.path)
        yield* assertInside(isomorphRoot, destination, `seed path escapes .isomorph: ${file.path}`)
        yield* fs.makeDirectory(path.dirname(destination), { recursive: true }).pipe(
          Effect.mapError(error => new IsomorphRuntimeError({
            message: `failed to create seed directory: ${path.dirname(destination)}: ${formatUnknownCause(error)}`,
          })),
        )
        yield* fs.writeFileString(destination, file.content).pipe(
          Effect.mapError(error => new IsomorphRuntimeError({
            message: `failed to write seed file: ${destination}: ${formatUnknownCause(error)}`,
          })),
        )
      }

      const createdAt = options.now?.toISOString() ?? new Date(yield* Clock.currentTimeMillis).toISOString()
      const pin: PinMetadata = {
        schemaVersion: snapshot.schemaVersion,
        vendor: snapshot.vendor,
        ref: snapshot.ref,
        digest: snapshot.digest,
        createdAt,
      }
      yield* fs.writeFileString(
        path.join(isomorphRoot, '.isomorph-pin.json'),
        `${JSON.stringify(pin, null, 2)}\n`,
      ).pipe(
        Effect.mapError(error => new IsomorphRuntimeError({
          message: `failed to write pin metadata: ${isomorphRoot}: ${formatUnknownCause(error)}`,
        })),
      )

      return {
        workspaceRoot,
        isomorphRoot,
        pin,
        filesWritten: snapshot.files.length + 1,
      }
    })

    return yield* writeSeed.pipe(
      Effect.catch((error: IsomorphError) =>
        fs.remove(isomorphRoot, { force: true, recursive: true }).pipe(
          Effect.catch(() => Effect.void),
          Effect.andThen(Effect.fail(error)),
        )),
    )
  })
}
