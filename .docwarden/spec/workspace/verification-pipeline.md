---
kind: pipeline
---

# verification-pipeline

## Input

- changed workspace source
- changed `.docwarden` harness assets
- changed `.isomorph` mapping assets

## Transform

- `pnpm test` runs package tests through turbo.
- `pnpm typecheck` runs package `tsgo` checks through turbo.
- `pnpm smoke:bin` verifies built CLI entrypoints through turbo.
- `git diff --check` verifies whitespace safety before staging or commit.

## Output

- workspace changes are considered locally verified only after test, typecheck, smoke, and diff checks pass.

## Assertions

- `test` and `smoke:bin` MUST depend on package build output.
- Effect implementation work MUST use package-local `typecheck` or root `typecheck` as the primary TypeScript feedback loop.
