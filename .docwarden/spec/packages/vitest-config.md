---
kind: policy
---

# vitest-config

## Scope

Applies to `packages/vitest-config`.

## Role

`@docwarden/vitest-config` provides the workspace Vitest config.

## Stable Surface

- `./workspace.config.ts`

## Assertions

- Package tests SHOULD run through the shared workspace Vitest config.
- Root `pnpm test` MUST remain the package-wide test entrypoint.
