---
kind: policy
---

# effect-source-reference

## Intent

Keep Effect v4 usage aligned with the pinned local upstream reference.

## Scope

Applies to:

- `apps/*`
- `packages/*`
- `repos/effect/`
- `repos/effect-source.json`
- `scripts/verify-effect-source.mjs`

## Rules

- Application and package code MUST import Effect APIs from installed dependencies.
- Application and package code MUST NOT import from `repos/effect/`.
- `repos/effect/` MUST remain a read-only source reference unless the upstream pin is explicitly updated.
- `pnpm effect:source:verify` MUST verify the subtree source reference, pinned package versions, and import boundary.
