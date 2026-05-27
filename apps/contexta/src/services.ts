import type { SeedFile } from './seed.js'
import process from 'node:process'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { Context, Effect, Layer } from 'effect'
import {
  computeSeedDigest,
  seedFiles,
  seedRef,
  seedSchemaVersion,
  seedVendor,
} from './seed.js'

export interface VendorSnapshot {
  readonly schemaVersion: number
  readonly vendor: string
  readonly ref: string
  readonly digest: string
  readonly files: readonly SeedFile[]
}

export interface CurrentWorkingDirectoryService {
  readonly current: Effect.Effect<string>
}

export interface VendorSnapshotProviderService {
  readonly current: Effect.Effect<VendorSnapshot>
}

export const CurrentWorkingDirectory: Context.Service<CurrentWorkingDirectoryService, CurrentWorkingDirectoryService> = Context.Service<CurrentWorkingDirectoryService, CurrentWorkingDirectoryService>('contexta/services/CurrentWorkingDirectory')

export const VendorSnapshotProvider: Context.Service<VendorSnapshotProviderService, VendorSnapshotProviderService> = Context.Service<VendorSnapshotProviderService, VendorSnapshotProviderService>('contexta/services/VendorSnapshotProvider')

export const CurrentWorkingDirectoryLive: Layer.Layer<CurrentWorkingDirectoryService> = Layer.succeed(
  CurrentWorkingDirectory,
  CurrentWorkingDirectory.of({
    current: Effect.sync(() => process.cwd()),
  }),
)

export const VendorSnapshotProviderLive: Layer.Layer<VendorSnapshotProviderService> = Layer.succeed(
  VendorSnapshotProvider,
  VendorSnapshotProvider.of({
    current: Effect.succeed({
      schemaVersion: seedSchemaVersion,
      vendor: seedVendor,
      ref: seedRef,
      digest: computeSeedDigest(),
      files: seedFiles,
    }),
  }),
)

export type ContextaRuntimeServices
  = | NodeServices.NodeServices
    | CurrentWorkingDirectoryService
    | VendorSnapshotProviderService

export const contextaLiveLayer: Layer.Layer<ContextaRuntimeServices> = Layer.mergeAll(
  NodeServices.layer,
  CurrentWorkingDirectoryLive,
  VendorSnapshotProviderLive,
)
