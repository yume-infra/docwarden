# Review Backing

Task: 25-docwarden-v0-dogfood-workflow

Source files:
- /Users/sayori/Desktop/docwarden/.docwarden/task/25-docwarden-v0-dogfood-workflow/index.md
- /Users/sayori/Desktop/docwarden/.docwarden/task/25-docwarden-v0-dogfood-workflow/plan.md
- /Users/sayori/Desktop/docwarden/.docwarden/task/25-docwarden-v0-dogfood-workflow/log.md

Task Index 片段：
- ---
- status: active
- workspace_status: working
- created: 2026-06-01
- updated: 2026-06-01
- owner: sayori
- ---
- # Docwarden V0 Dogfood Workflow
- ## Context
- 本 task 承接当前纠偏后的实现方向：在本仓库 dogfood docwarden 自己，而不是继续把 `review surface` 当成主 workflow。
- 当前仓库已经有 `.docwarden/`，并且手工存在 `task / review / spec / guide / wiki` 等目录入口。

Task Plan 片段：
- ---
- status: active
- created: 2026-06-01
- updated: 2026-06-01
- owner: sayori
- ---
- # Plan
- ## Step 1: 修正 init skeleton
- 目标：`docwarden init` 生成原始理论要求的最小 `.docwarden` 结构。
- 应生成：

Task Log 片段：
- ---
- status: active
- created: 2026-06-01
- updated: 2026-06-01
- owner: sayori
- ---
- # Log
- ## 2026-06-01
- - sayori 纠正：当前目标是建构可维护文档体系，不是只实现 review surface。
- - 回到 `docs/` 原始理论后确认主链路为 `task -> review system -> spec / guide / wiki`。
- - 确认当前仓库已经有 `.docwarden/`，但许多内容仍是占位或历史 dry run，尚未实际运作成 workflow。
- - 新建本 task，作为后续在当前仓库 dogfood docwarden v0 workflow 的入口。
