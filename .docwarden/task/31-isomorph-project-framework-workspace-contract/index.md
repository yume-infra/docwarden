---
status: implemented
workspace_status: validating
created: 2026-06-05T00:00:00.000Z
updated: 2026-06-05T01:26:00.000Z
title: isomorph project framework workspace contract
id: 31-isomorph-project-framework-workspace-contract
---

# isomorph project framework workspace contract

## Context

- task 30 已经把 isomorph package-owned source 重构为 `language / framework / contract / loop`。
- 现在需要回到用户主目标：用户在自己的 codebase 中定义、使用、检查、修正 project semantic framework。
- 验收应直接 dogfood：在本仓库开一个 example，把 link vocabulary 作为用户项目 framework 试落地。

## Objective

- 定义并实现用户 `.isomorph` 中 project framework workspace 的最小可执行 contract。
- 让 local vocabulary terms 能进入 recognition authority。
- 让 local framework signal 能通过 semantic-lint 检查真实 target。
- 提供 repo example，证明 link vocabulary 不是 isomorph package source，而是 user-owned framework material。

## Boundary

- 不编辑 `docs/`。
- 不把 example framework material 放回 `apps/isomorph/language`。
- 不引入 contexta 分发或 Codex runtime export。
- 不把 pin 快照提交进 example；example dogfood 应通过 `isomorph init` 生成 pin，再 overlay user framework material。
- 本轮只做最小 framework workspace contract，不设计完整 import registry。

## Next Entry

- Validate any follow-up framework vocabulary examples against the same dogfood flow before promoting the contract.
