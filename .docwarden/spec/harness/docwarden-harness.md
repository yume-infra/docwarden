---
kind: composition
---

# docwarden-harness

## Whole

`.docwarden` is the harness asset that maintains this whole monorepo repository.

## Parts

- `.docwarden/task/`：task working material.
- `.docwarden/review/`：review surface material.
- `.docwarden/spec/`：stable execution context for the current repository.
- `.docwarden/guide/`：guide outputs.
- `.docwarden/wiki/`：wiki and pick outputs.
- `.docwarden/archive/`：archived tasks and obsolete generated artifacts.
- `.docwarden/config.yaml`：runtime harness configuration.

## Assertions

- `.docwarden` MUST NOT be modeled as only the `apps/docwarden` product's local data.
- `.docwarden/spec` MUST be generated from and maintained for the current monorepo's real assets.
- Stable structure mapping for `.docwarden` belongs in `.isomorph/mapping/docwarden`.
