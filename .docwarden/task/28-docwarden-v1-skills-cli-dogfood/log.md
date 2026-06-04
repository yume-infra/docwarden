---
status: active
created: 2026-06-04
updated: 2026-06-04
title: Docwarden V1 Skills CLI Dogfood
id: 28-docwarden-v1-skills-cli-dogfood
---

# Log

- [2026-06-04] task created: user corrected next path from review decision state machine to fast v1 skills + CLI dogfood form, grounded in docs theory and practice docs.
- [2026-06-04] read docs theory/practice: current path is to make docwarden v1 dogfood skills usable first; review decision trace and promote/pick orchestration come later.
- [2026-06-04] implemented repo-local runtime skill baseline: expanded `review`, added `promote`, and updated `pick` to use `rtk pnpm exec docwarden`.
- [2026-06-04] user corrected naming: repo-local workflow skills should not use namespace prefixes or umbrella entrypoints; current skills are `review`, `promote`, and `pick`.
- [2026-06-04] boundary note: `.contexta/packs/docwarden` source/export sync is not handled in this lane; coordinate with contexta runtime line after repo-local runtime skills are accepted.
- [2026-06-04] validation passed: quick_validate for `review`, `promote`, and `pick`; `apps/docwarden` typecheck, build, test, and smoke.
- [2026-06-04T03:53:46.363Z] review generated from task: /Users/sayori/.codex/worktrees/a18c/docwarden/.docwarden/review/20260604035346362-task-28-docwarden-v1-skills-cli-dogfood
- [2026-06-04T07:08:50.920Z] review generated from task: /Users/sayori/.codex/worktrees/a18c/docwarden/.docwarden/review/20260604070850919-task-28-docwarden-v1-skills-cli-dogfood
- [2026-06-04T07:08:57.155Z] promote to spec harness/docwarden-workflow-skills: /Users/sayori/.codex/worktrees/a18c/docwarden/.docwarden/spec/harness/docwarden-workflow-skills.md
- [2026-06-04] user review: the promote result is wrong; leave the promoted artifact uncorrected for now and treat this as an error record rather than an accepted stable result.
