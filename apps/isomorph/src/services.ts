import type { IsomorphError } from './errors.js'
import type { BaselineFile } from './pinned-baseline.js'
import process from 'node:process'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { Context, Effect, Layer } from 'effect'
import { formatUnknownCause, IsomorphRuntimeError } from './errors.js'
import {

  computeBaselineDigest,
  pinnedBaselineRef,
  pinnedBaselineSchemaVersion,
  pinnedBaselineVendor,
  readPinnedBaselineFiles,
} from './pinned-baseline.js'

export interface VendorSnapshot {
  readonly schemaVersion: number
  readonly vendor: string
  readonly ref: string
  readonly digest: string
  readonly files: readonly BaselineFile[]
}

export interface CurrentWorkingDirectoryService {
  readonly current: Effect.Effect<string>
}

export interface VendorSnapshotProviderService {
  readonly current: Effect.Effect<VendorSnapshot, IsomorphError>
}

export const CurrentWorkingDirectory: Context.Service<CurrentWorkingDirectoryService, CurrentWorkingDirectoryService> = Context.Service<CurrentWorkingDirectoryService, CurrentWorkingDirectoryService>('isomorph/services/CurrentWorkingDirectory')

export const VendorSnapshotProvider: Context.Service<VendorSnapshotProviderService, VendorSnapshotProviderService> = Context.Service<VendorSnapshotProviderService, VendorSnapshotProviderService>('isomorph/services/VendorSnapshotProvider')

const CurrentWorkingDirectoryLive: Layer.Layer<CurrentWorkingDirectoryService> = Layer.succeed(
  CurrentWorkingDirectory,
  CurrentWorkingDirectory.of({
    current: Effect.sync(() => process.cwd()),
  }),
)

const VendorSnapshotProviderLive: Layer.Layer<VendorSnapshotProviderService> = Layer.succeed(
  VendorSnapshotProvider,
  VendorSnapshotProvider.of({
    current: Effect.try({
      try: () => {
        const files = readPinnedBaselineFiles()
        return {
          schemaVersion: pinnedBaselineSchemaVersion,
          vendor: pinnedBaselineVendor,
          ref: pinnedBaselineRef,
          digest: computeBaselineDigest(files),
          files,
        }
      },
      catch: error => new IsomorphRuntimeError({
        message: `failed to read pinned isomorph baseline: ${formatUnknownCause(error)}`,
      }),
    }),
  }),
)

export type IsomorphRuntimeServices
  = | NodeServices.NodeServices
    | CurrentWorkingDirectoryService
    | VendorSnapshotProviderService

export const isomorphLiveLayer: Layer.Layer<IsomorphRuntimeServices> = Layer.mergeAll(
  NodeServices.layer,
  CurrentWorkingDirectoryLive,
  VendorSnapshotProviderLive,
)
