import type { FileSystem, Path } from 'effect'
import type { BaselineStatus, ResolveOptions, UpgradeStatusResult } from './domain.js'
import type { ContextaError } from './errors.js'
import type { CurrentWorkingDirectoryService, VendorSnapshotProviderService } from './services.js'
import { Effect } from 'effect'
import { hasPinMetadata, pinMetadataPath, readPinEffect } from './pin.js'
import { resolveContextaRootEffect } from './root.js'
import { VendorSnapshotProvider } from './services.js'

export function runUpgradeStatusEffect(options: ResolveOptions = {}): Effect.Effect<UpgradeStatusResult, ContextaError, CurrentWorkingDirectoryService | VendorSnapshotProviderService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const root = yield* resolveContextaRootEffect(options)
    const snapshotProvider = yield* VendorSnapshotProvider
    const snapshot = yield* snapshotProvider.current
    const newBaseline: BaselineStatus = {
      schemaVersion: snapshot.schemaVersion,
      vendor: snapshot.vendor,
      ref: snapshot.ref,
      digest: snapshot.digest,
    }
    const pinPath = yield* pinMetadataPath(root.contextaRoot)
    const hasPin = yield* hasPinMetadata(root.contextaRoot)

    if (!hasPin) {
      return {
        root,
        localInstance: {
          status: 'pre-v0-without-pin',
          root: root.contextaRoot,
        },
        pinStatus: {
          status: 'pre-v0-without-pin',
          pinPath,
        },
        pinnedBaseline: undefined,
        newBaseline,
        localCustomization: 'untouched',
        mergeEngine: 'not-implemented-v0',
      }
    }

    const pin = yield* readPinEffect(root.contextaRoot)
    return {
      root,
      localInstance: {
        status: 'pinned-v0',
        root: root.contextaRoot,
      },
      pinStatus: {
        status: 'pinned-v0',
        pin,
      },
      pinnedBaseline: {
        schemaVersion: pin.schemaVersion,
        vendor: pin.vendor,
        ref: pin.ref,
        digest: pin.digest,
      },
      newBaseline,
      localCustomization: 'untouched',
      mergeEngine: 'not-implemented-v0',
    }
  })
}
