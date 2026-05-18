---
status: accepted
workspace_status: active
created: 2026-05-13
updated: 2026-05-18
owner: sayori
---

# review surface 设计

本 task 目录用于起草 `docwarden` review surface 的最小形态。

## 边界

- 本目录是对话产生的 task material。
- 本任务当前 active。
- 本任务只设计 review surface，不设计 review input，不设计 decision trace，不实现完整 HTML 工具。

## 来源基线

- `.docwarden/task/04-task-review-spec-pipeline/`
- `.docwarden/task/05-review-input-design/`

## 当前判断

- review surface 是给 user 审查用的界面材料。
- review surface 本体短命。
- HTML 是重要候选形态，但是否先从 Markdown 或 data schema 起步，需要在本任务中讨论。
- 从 05 讨论迁移出的关键判断：surface 的职责是把 `material + current agent context` 处理成 `lead + backing`。
- lead 是最小 user 可审核单元。
- backing 是被 lead 统摄、用于支撑 / 展开 / 校验 lead 的材料层。
- HTML 应该引入在 review surface 层，而不是 input 或 trace。

## 内容

- `plan.md`：本轮的小循环列表。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `review-surface-role.md`：从 05 迁移出的 surface 职责定义。

## 文件索引

- `index.md`：工作面 lead file，状态：accepted；同时通过 `workspace_status: active` 表示本工作面正在推进。
- `plan.md`：本轮 loop 计划，状态：draft。
- `log.md`：时间线记录，状态：draft；后续可继续追加。
- `review-surface-role.md`：surface 职责定义，状态：draft。

## 下一步

进入 Loop 1：surface role 与 lead/backing 结构。
