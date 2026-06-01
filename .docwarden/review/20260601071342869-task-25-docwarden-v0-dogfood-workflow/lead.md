# Review Lead

Task: 25-docwarden-v0-dogfood-workflow

## 本轮需要判断
- 是否有清晰的业务目标与边界？
- 是否有足够的上下文支持下一层产出？
- 本轮是否适合直接 promote / pick？

## Index 片段
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

## Plan 片段
