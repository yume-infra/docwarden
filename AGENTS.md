# Agent Instructions

@/Users/sayori/.codex/RTK.md

## User Context

Agents MUST load and apply the project user context when working in this repository:

@/Users/sayori/Desktop/docwarden/.docwarden/user/profile.md

The user context is not a project policy or workflow rule. Current user instructions and project rules take priority over it.

## Effect Reference

- Effect work in this repository uses the v4 beta toolchain, following the same baseline shape as `symphony-ts`.
- Active package baseline: `effect@4.0.0-beta.70`, `@effect/platform-node@4.0.0-beta.70`, `@effect/tsgo@0.11.0`, and `@typescript/native-preview@7.0.0-dev.20260526.1`.
- Upstream source reference: `repos/effect/`, a read-only squashed git subtree from `https://github.com/Effect-TS/effect-smol.git`.
- The subtree is pinned to commit `440505f845a7c207b8e98e3260f0bdf1690ac1c7`, the commit behind the `effect@4.0.0-beta.70` tag. The manifest lives at `repos/effect-source.json`, and `pnpm effect:source:verify` checks the subtree split, package versions, and import boundary.
- Application and tests MUST import Effect APIs from installed dependencies only. Never import from `repos/effect/`.
- Use `repos/effect/` for source, tests, examples, API design reference, and agent context discovery. Do not edit subtree files unless explicitly updating the upstream pin.
- Use `tsgo` diagnostics as the primary Effect feedback loop. `tsc` is only the conservative fallback check.

## Document Authority

- Agents MUST NOT directly edit files under `docs/`.
- `docs/` is the human-maintained source layer for project documents. Current maintainer: sayoriqwq.
- When a conversation produces information that may belong in `docs/`, agents MUST first capture it as working material, review notes, or a proposed patch outside `docs/`.
- Agents MAY edit `docs/` only when the user explicitly asks for a concrete `docs/` file edit after this rule is known.
