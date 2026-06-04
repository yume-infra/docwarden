import type { IsomorphInstance, IsomorphRoot, SourceMetadata, SourceReference } from './domain.js'
import type { IsomorphError } from './errors.js'
import { Effect, FileSystem, Path } from 'effect'
import { formatUnknownCause, isIsomorphError, IsomorphConfigError, IsomorphParseError, IsomorphRuntimeError } from './errors.js'
import { readPinEffect } from './pin.js'
import { pathExists } from './root.js'

const supportedSourceSchemaVersion = 1

export function sourceMetadataPath(isomorphRoot: string): Effect.Effect<string, never, Path.Path> {
  return Path.Path.pipe(
    Effect.map(path => path.join(isomorphRoot, '.isomorph-origin.json')),
  )
}

export function readSourceMetadataEffect(isomorphRoot: string): Effect.Effect<SourceMetadata, IsomorphError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const sourcePath = yield* sourceMetadataPath(isomorphRoot)
    const exists = yield* pathExists(sourcePath)
    if (!exists) {
      return yield* Effect.fail(new IsomorphConfigError({ message: `missing source metadata: ${sourcePath}` }))
    }
    const raw = yield* fs.readFileString(sourcePath, 'utf8').pipe(
      Effect.mapError(error => new IsomorphRuntimeError({
        message: `failed to read source metadata: ${sourcePath}: ${formatUnknownCause(error)}`,
      })),
    )
    return yield* decodeSourceMetadata(raw, sourcePath)
  })
}

export function detectIsomorphInstanceEffect(root: IsomorphRoot): Effect.Effect<IsomorphInstance, IsomorphError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const sourcePath = yield* sourceMetadataPath(root.isomorphRoot)
    if (yield* pathExists(sourcePath)) {
      const source = yield* readSourceMetadataEffect(root.isomorphRoot)
      return {
        status: 'origin',
        root: root.isomorphRoot,
        source,
      }
    }

    const pin = yield* readPinEffect(root.isomorphRoot).pipe(
      Effect.match({
        onFailure: error => error,
        onSuccess: pin => pin,
      }),
    )
    if (isIsomorphError(pin)) {
      if (pin._tag === 'IsomorphConfigError' && pin.message.startsWith('missing pin metadata')) {
        return {
          status: 'unclassified',
          root: root.isomorphRoot,
          reason: 'missing-pin-metadata',
        }
      }
      return yield* Effect.fail(pin)
    }

    return {
      status: 'derived-v0',
      root: root.isomorphRoot,
      pin,
    }
  })
}

function decodeSourceMetadata(raw: string, sourcePath: string): Effect.Effect<SourceMetadata, IsomorphConfigError | IsomorphParseError> {
  return Effect.gen(function* () {
    const parsed = yield* Effect.try({
      try: () => JSON.parse(raw) as unknown,
      catch: error => new IsomorphParseError({
        message: `malformed source metadata JSON: ${sourcePath}: ${formatUnknownCause(error)}`,
      }),
    })
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return yield* Effect.fail(new IsomorphConfigError({ message: `invalid source metadata object: ${sourcePath}` }))
    }
    const record = parsed as Record<string, unknown>
    const schemaVersion = yield* readNumber(record, 'schemaVersion', sourcePath)
    const role = yield* readString(record, 'role', sourcePath)
    const source = yield* readSourceReference(record.source, sourcePath)
    const createdAt = yield* readString(record, 'createdAt', sourcePath)

    if (schemaVersion !== supportedSourceSchemaVersion) {
      return yield* Effect.fail(new IsomorphConfigError({
        message: `unsupported source schemaVersion ${schemaVersion}: ${sourcePath}`,
      }))
    }
    if (role !== 'origin') {
      return yield* Effect.fail(new IsomorphConfigError({ message: `invalid source role: ${sourcePath}` }))
    }
    if (!isIsoDate(createdAt)) {
      return yield* Effect.fail(new IsomorphConfigError({ message: `invalid source createdAt: ${sourcePath}` }))
    }

    return {
      schemaVersion,
      role,
      source,
      createdAt,
    }
  })
}

function readSourceReference(value: unknown, sourcePath: string): Effect.Effect<SourceReference, IsomorphConfigError> {
  return Effect.gen(function* () {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return yield* Effect.fail(new IsomorphConfigError({ message: `invalid source reference: ${sourcePath}` }))
    }
    const record = value as Record<string, unknown>
    const type = yield* readString(record, 'type', sourcePath)
    const url = yield* readString(record, 'url', sourcePath)
    const sourceReferencePath = yield* readString(record, 'path', sourcePath)

    if (type !== 'git') {
      return yield* Effect.fail(new IsomorphConfigError({ message: `invalid source reference type: ${sourcePath}` }))
    }

    return {
      type,
      url,
      path: sourceReferencePath,
    }
  })
}

function readString(record: Record<string, unknown>, key: string, sourcePath: string): Effect.Effect<string, IsomorphConfigError> {
  const value = record[key]
  if (typeof value !== 'string' || value.length === 0) {
    return Effect.fail(new IsomorphConfigError({ message: `invalid source metadata field ${key}: ${sourcePath}` }))
  }
  return Effect.succeed(value)
}

function readNumber(record: Record<string, unknown>, key: string, sourcePath: string): Effect.Effect<number, IsomorphConfigError> {
  const value = record[key]
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return Effect.fail(new IsomorphConfigError({ message: `invalid source metadata field ${key}: ${sourcePath}` }))
  }
  return Effect.succeed(value)
}

function isIsoDate(value: string): boolean {
  const time = Date.parse(value)
  return Number.isFinite(time) && new Date(time).toISOString() === value
}
