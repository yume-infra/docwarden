---
status: draft
created: 2026-05-18
updated: 2026-05-18
owner: sayori
---

# review surface 设计计划

本轮目标是定义 `docwarden` review surface 的最小形态。

本任务只在 `.docwarden/task/06-review-surface-design/` 中推进，不直接修改 `docs/`，不设计 review input，不设计 decision trace，不实现完整 HTML 工具。

## Loop 1：surface role 与 lead/backing 结构

状态：active。

目标：确认 surface 的职责，以及 lead / backing 在 surface 中如何组织。

草案产物：

- `review-surface-role.md`

review 门槛：

- sayori 确认 surface 的职责是把 material + current agent context 处理成 lead + backing。

## Loop 2：surface 最小内容块

状态：pending。

目标：定义一个 review surface 至少应该展示哪些块，才能支撑 user 审核 lead。

草案产物：

- `surface-minimum-blocks.md`

review 门槛：

- sayori 确认最小内容块足以承载 lead、backing、agent context 和 user action。

## Loop 3：HTML 引入方式

状态：pending。

目标：定义 HTML 在 surface 层的最小使用方式，不实现完整工具。

草案产物：

- `html-surface-entry.md`

review 门槛：

- sayori 确认 HTML 的引入位置和短命属性足够清楚。

## 本轮不做

- 修改 `docs/`。
- 设计 review input。
- 设计 decision trace。
- 实现完整 HTML review 工具。
- 创建真实 spec / guide / wiki 产物。
