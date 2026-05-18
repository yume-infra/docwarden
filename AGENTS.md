# Agent Instructions

@/Users/sayori/.codex/RTK.md

## User Context

Agents MUST load and apply the project user context when working in this repository:

@/Users/sayori/Desktop/docwarden/.docwarden/user/profile.md

The user context is not a project policy or workflow rule. Current user instructions and project rules take priority over it.

## Document Authority

- Agents MUST NOT directly edit files under `docs/`.
- `docs/` is the human-maintained source layer for project documents. Current maintainer: sayoriqwq.
- When a conversation produces information that may belong in `docs/`, agents MUST first capture it as working material, review notes, or a proposed patch outside `docs/`.
- Agents MAY edit `docs/` only when the user explicitly asks for a concrete `docs/` file edit after this rule is known.
