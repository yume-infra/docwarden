# Review Backing

Task: Docwarden V1 Skills CLI Dogfood (28-docwarden-v1-skills-cli-dogfood)

Source files:
- /Users/sayori/.codex/worktrees/a18c/docwarden/.docwarden/task/28-docwarden-v1-skills-cli-dogfood/index.md
- /Users/sayori/.codex/worktrees/a18c/docwarden/.docwarden/task/28-docwarden-v1-skills-cli-dogfood/plan.md
- /Users/sayori/.codex/worktrees/a18c/docwarden/.docwarden/task/28-docwarden-v1-skills-cli-dogfood/log.md

## Extracted Material

### Context
- 当前 docwarden v0 已经具备最小 CLI workflow：
- init -> task create -> review --task -> promote / pick
- 但 docs 理论与实践文档指出，docwarden 难以继续 dogfood 的关键缺口不是更细的 review state machine，而是 docwarden 第一批可运行 skills / prompts / agent context 尚未以 Codex 可用形态稳定出现。
- 本 task 不接管 contexta 的完整 catalog / install / activation，也不展开 isomorph 语义引擎。当前目标是尽快让 docwarden v1 具备 repo-local Codex skills + CLI 的可运行形态，使后续任务能用这套流程 dogfood。

### Objective
- Docwarden v1 repo-local workflow skills are the user-facing actions `review`, `promote`, and `pick`; contexta owns later namespace/plugin naming, and the `docwarden` CLI remains the hard-constraint writer.

### Boundary
- 可以修改 `apps/docwarden` CLI 与测试。
- 可以修改 `.agents/skills/` 下的 repo-local Codex workflow skills。
- 可以修改 `.docwarden/task/28-docwarden-v1-skills-cli-dogfood/` 工作材料。
- 默认不修改 `docs/`。
- 不实现 contexta 完整 catalog / install / activation。
- 不接管 isomorph / contexta 外层架构。
- 不把 prompt / workflow / profile 伪装成 Codex 不支持的裸 runtime surface。

### Plan Steps
- Step 1: 对齐 docs 理论与现状
- Step 2: 梳理现有 repo-local skills
- Step 3: 实现最小 skills + CLI 形态
- Step 4: 验证

### Recent Log
- [2026-06-04] implemented repo-local runtime skill baseline: expanded `review`, added `promote`, and updated `pick` to use `rtk pnpm exec docwarden`.
- [2026-06-04] user corrected naming: repo-local workflow skills should not use namespace prefixes or umbrella entrypoints; current skills are `review`, `promote`, and `pick`.
- [2026-06-04] boundary note: `.contexta/packs/docwarden` source/export sync is not handled in this lane; coordinate with contexta runtime line after repo-local runtime skills are accepted.
- [2026-06-04] validation passed: quick_validate for `review`, `promote`, and `pick`; `apps/docwarden` typecheck, build, test, and smoke.
- [2026-06-04T03:53:46.363Z] review generated from task: /Users/sayori/.codex/worktrees/a18c/docwarden/.docwarden/review/20260604035346362-task-28-docwarden-v1-skills-cli-dogfood
