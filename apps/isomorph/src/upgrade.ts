import type { FileSystem, Path } from 'effect'
import type { BaselineStatus, ResolveOptions, UpgradeStatusResult } from './domain.js'
import type { IsomorphError } from './errors.js'
import type { CurrentWorkingDirectoryService, VendorSnapshotProviderService } from './services.js'
import { Effect } from 'effect'
import { IsomorphConfigError } from './errors.js'
import { pinMetadataPath } from './pin.js'
import { resolveIsomorphRootEffect } from './root.js'
import { VendorSnapshotProvider } from './services.js'
import { detectIsomorphInstanceEffect } from './source.js'

export function runUpgradeStatusEffect(options: ResolveOptions = {}): Effect.Effect<UpgradeStatusResult, IsomorphError, CurrentWorkingDirectoryService | VendorSnapshotProviderService | FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function* () {
    const root = yield* resolveIsomorphRootEffect(options)
    const instance = yield* detectIsomorphInstanceEffect(root)

    if (instance.status === 'origin') {
      return {
        status: 'origin',
        root,
        localInstance: {
          status: 'origin',
          root: root.isomorphRoot,
          source: instance.source,
        },
        sourceStatus: {
          status: 'origin',
          source: instance.source,
        },
        localCustomization: 'source-authoring',
        mergeEngine: 'not-implemented-v0',
      }
    }

    if (instance.status === 'unclassified') {
      const pinPath = yield* pinMetadataPath(root.isomorphRoot)
      return yield* Effect.fail(new IsomorphConfigError({
        message: `missing pin metadata: ${pinPath}`,
      }))
    }

    const snapshotProvider = yield* VendorSnapshotProvider
    const snapshot = yield* snapshotProvider.current
    const newBaseline: BaselineStatus = {
      schemaVersion: snapshot.schemaVersion,
      vendor: snapshot.vendor,
      ref: snapshot.ref,
      digest: snapshot.digest,
    }
    const pin = instance.pin
    if (
      pin.schemaVersion !== snapshot.schemaVersion
      || pin.vendor !== snapshot.vendor
      || pin.ref !== snapshot.ref
      || pin.digest !== snapshot.digest
    ) {
      return yield* Effect.fail(new IsomorphConfigError({
        message: `unknown pinned baseline: vendor=${pin.vendor} ref=${pin.ref} digest=${pin.digest}`,
      }))
    }

    return {
      status: 'derived-v0',
      root,
      localInstance: {
        status: 'derived-v0',
        root: root.isomorphRoot,
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
