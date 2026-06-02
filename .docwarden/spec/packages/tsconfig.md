---
kind: policy
---

# tsconfig

## Scope

Applies to `packages/tsconfig`.

## Role

`@docwarden/tsconfig` provides shared TypeScript config assets.

## Stable Surface

- `./base.json`
- `./build.json`
- `./runtime.json`

## Assertions

- Workspace apps SHOULD consume these config exports instead of duplicating compiler baselines.
- Build-time and runtime TypeScript config changes SHOULD be verified through root `typecheck`.
