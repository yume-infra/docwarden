# Promote to spec

Task: Docwarden V0 Dogfood Workflow (25-docwarden-v0-dogfood-workflow)
Generated at: 2026-06-01T07:13:45.854Z
Layer: spec

## Trace
- /Users/sayori/Desktop/docwarden/.docwarden/task/25-docwarden-v0-dogfood-workflow/index.md
- /Users/sayori/Desktop/docwarden/.docwarden/task/25-docwarden-v0-dogfood-workflow/plan.md
- /Users/sayori/Desktop/docwarden/.docwarden/task/25-docwarden-v0-dogfood-workflow/log.md

## Key Points
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
- 但这些内容大多仍是占位或历史 dry run，实际 CLI 只跑通了：
- - `docwarden init`
- - `docwarden review --target <path>`

## Planned Actions
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
- ```text
- .docwarden/
- config.yaml
- task/
- index.md
