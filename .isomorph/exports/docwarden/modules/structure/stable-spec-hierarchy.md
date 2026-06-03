---
kind: structure
id: dw:stable-spec-hierarchy
mapping: docwarden
status: draft
---

# stable-spec-hierarchy

## Definition

`stable-spec-hierarchy` maps the current monorepo's real assets into `.docwarden/spec` modules.

## Structure

```text
.docwarden/spec/
  workspace/
    package-topology.md
    verification-pipeline.md
    docs-authority.md
    effect-source-reference.md
  apps/
    docwarden.md
    contexta.md
    isomorph.md
  packages/
    tsconfig.md
    tsdown-config.md
    vitest-config.md
  harness/
    docwarden-harness.md
    spec-entry-boundary.md
    review-workflow.md
    review-surface.md
    promote-to-spec.md
```

## Mapping Rule

- `workspace/` maps root workspace configuration, root verification, source authority, and vendor source constraints.
- `apps/` maps first-party CLI app packages under `apps/*`.
- `packages/` maps shared workspace config packages under `packages/*`.
- `harness/` maps `.docwarden` harness assets that maintain the whole repository.

## Boundary

This structure belongs to isomorph mapping because it defines how stable repository assets become docwarden spec modules.

`.docwarden/spec` contains the materialized stable modules, not the structure rule itself.
