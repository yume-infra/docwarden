import type { PinMetadata } from './domain.js'
import type { ContextaError } from './errors.js'
import { Effect, FileSystem, Path } from 'effect'
import { ContextaConfigError, ContextaParseError, ContextaRuntimeError, formatUnknownCause } from './errors.js'
import { pathExists } from './root.js'

const supportedPinSchemaVersion = 1

export function pinMetadataPath(contextaRoot: string): Effect.Effect<string, never, Path.Path> {
  return Path.Path.pipe(
    Effect.map(path => path.join(contextaRoot, '.contexta-pin.json')),
  )
}

export function readPinEffect(contextaRoot: string): Effect.Effect<PinMetadata, ContextaError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const pinPath = yield* pinMetadataPath(contextaRoot)
    const exists = yield* pathExists(pinPath)
    if (!exists) {
      return yield* Effect.fail(new ContextaConfigError({ message: `missing pin metadata: ${pinPath}` }))
    }
    const raw = yield* fs.readFileString(pinPath, 'utf8').pipe(
      Effect.mapError(error => new ContextaRuntimeError({
        message: `failed to read pin metadata: ${pinPath}: ${formatUnknownCause(error)}`,
      })),
    )
    return yield* decodePinMetadata(raw, pinPath)
  })
}

function decodePinMetadata(raw: string, pinPath: string): Effect.Effect<PinMetadata, ContextaConfigError | ContextaParseError> {
  return Effect.gen(function* () {
    const parsed = yield* Effect.try({
      try: () => JSON.parse(raw) as unknown,
      catch: error => new ContextaParseError({
        message: `malformed pin metadata JSON: ${pinPath}: ${formatUnknownCause(error)}`,
      }),
    })
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return yield* Effect.fail(new ContextaConfigError({ message: `invalid pin metadata object: ${pinPath}` }))
    }
    const record = parsed as Record<string, unknown>
    const schemaVersion = yield* readNumber(record, 'schemaVersion', pinPath)
    const vendor = yield* readString(record, 'vendor', pinPath)
    const ref = yield* readString(record, 'ref', pinPath)
    const digest = yield* readString(record, 'digest', pinPath)
    const createdAt = yield* readString(record, 'createdAt', pinPath)

    if (schemaVersion !== supportedPinSchemaVersion) {
      return yield* Effect.fail(new ContextaConfigError({
        message: `unsupported pin schemaVersion ${schemaVersion}: ${pinPath}`,
      }))
    }
    if (!/^sha256:[a-f0-9]{64}$/.test(digest)) {
      return yield* Effect.fail(new ContextaConfigError({ message: `invalid pin digest: ${pinPath}` }))
    }
    if (!isIsoDate(createdAt)) {
      return yield* Effect.fail(new ContextaConfigError({ message: `invalid pin createdAt: ${pinPath}` }))
    }

    return {
      schemaVersion,
      vendor,
      ref,
      digest,
      createdAt,
    }
  })
}

function readString(record: Record<string, unknown>, key: keyof PinMetadata, pinPath: string): Effect.Effect<string, ContextaConfigError> {
  const value = record[key]
  if (typeof value !== 'string' || value.length === 0) {
    return Effect.fail(new ContextaConfigError({ message: `invalid pin metadata field ${key}: ${pinPath}` }))
  }
  return Effect.succeed(value)
}

function readNumber(record: Record<string, unknown>, key: keyof PinMetadata, pinPath: string): Effect.Effect<number, ContextaConfigError> {
  const value = record[key]
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return Effect.fail(new ContextaConfigError({ message: `invalid pin metadata field ${key}: ${pinPath}` }))
  }
  return Effect.succeed(value)
}

function isIsoDate(value: string): boolean {
  const time = Date.parse(value)
  return Number.isFinite(time) && new Date(time).toISOString() === value
}
