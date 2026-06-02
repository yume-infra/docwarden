---
status: closed
created: 2026-06-01
updated: 2026-06-02
title: Docwarden Spec Layer Definition
id: 27-docwarden-spec-layer-definition
---

# Log

- [20260601090448541] task created: Docwarden Spec Layer Definition (27-docwarden-spec-layer-definition)
- [2026-06-01] task26 blocked by user review; new focus is spec layer hierarchy and definition before returning to artifact quality loop.
- [2026-06-01] user corrected model: do not introduce mapping/status metadata or new target registry concepts; model spec by file structure using isomorph kind/module/assertion concepts.
- [2026-06-01] added v0 prototype under `prototype-spec-tree/` and summary in `spec-file-structure-model-v0.md`.
- [2026-06-01] landed v0 model into `.docwarden/spec/<kind>/<module>.md`, archived old task-summary spec artifacts, and updated docwarden promote semantics.
- [2026-06-01] added minimal `isomorph mapping` query command to list mapping scopes, kinds, and templates.
- [2026-06-02] user corrected ownership: `.docwarden/spec` must not contain isomorph concepts or template-layer responsibilities.
- [2026-06-02] moved `spec` concept into `.isomorph/mapping/docwarden/modules/concept/spec.md` and kept `.docwarden/spec/` focused on stable repo-state modules.
- [2026-06-02] user corrected instance-layer organization: stable spec directories must be repo objects, not isomorph content kinds; this first pass used `project/` and `docwarden/` before the Trellis adaptation correction below.
- [2026-06-02] user corrected Trellis adaptation: do not keep a generic `project/` layer or copy traditional frontend/backend structure; changed repo-wide specs to `repo/` and kept `docwarden/` as the current workflow owner.
- [2026-06-02] user simplified the model: removed the `.docwarden/template` layer for v0; `promote --to spec` now creates missing modules from a built-in minimal scaffold when `--kind` is provided.
- [2026-06-02] user corrected overall level: `.docwarden` is the harness for maintaining the whole monorepo; regenerated `.docwarden/spec` from actual workspace assets (`workspace/`, `apps/`, `packages/`, `harness/`) and moved stable hierarchy mapping to `.isomorph/mapping/docwarden`.
- [2026-06-02] user corrected init boundary: `docwarden init` must only lay down required harness assets, skip existing files, and avoid fixed repo-specific spec content.
- [2026-06-02] task closed: spec layer blocker is resolved; handoff returns to task26 artifact quality loop.
