import type { FileSystem, Path } from 'effect'
import type { BaselineStatus, ResolveOptions, UpgradeStatusResult } from './domain.js'
import type { ContextaError } from './errors.js'
import type { CurrentWorkingDirectoryService, VendorSnapshotProviderService } from './services.js'
import { Effect } from 'effect'
import { ContextaConfigError } from './errors.js'
import { readPinEffect } from './pin.js'
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
    const pin = yield* readPinEffect(root.contextaRoot)
    if (
      pin.schemaVersion !== snapshot.schemaVersion
      || pin.vendor !== snapshot.vendor
      || pin.ref !== snapshot.ref
      || pin.digest !== snapshot.digest
    ) {
      return yield* Effect.fail(new ContextaConfigError({
        message: `unknown pinned baseline: vendor=${pin.vendor} ref=${pin.ref} digest=${pin.digest}`,
      }))
    }

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
