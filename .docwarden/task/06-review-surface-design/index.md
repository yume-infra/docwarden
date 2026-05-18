---
status: accepted
workspace_status: closed
created: 2026-05-13
updated: 2026-05-18
owner: sayori
---

# review surface 设计

本 task 目录用于起草 `docwarden` review surface 的最小形态。

## 边界

- 本目录是对话产生的 task material。
- 本任务已关闭。
- 本任务只设计 review surface，不设计 review input，不设计 decision trace，不实现完整 HTML 工具。

## 来源基线

- `.docwarden/task/04-task-review-spec-pipeline/`
- `.docwarden/task/05-review-input-design/`

## 当前判断

- review surface 是给 user 审查用的界面材料。
- review surface 本体短命。
- HTML 是重要候选形态，但是否先从 Markdown 或 data schema 起步，需要在本任务中讨论。
- Loop 1 已接受：surface 的职责是把 `material + current agent context` 处理成 `lead + backing`。
- Loop 2 已接受：surface generation rules 先于 HTML 形态，surface 输出 `lead + backing`。
- Loop 3 已接受：`review input` 是输入命名，`review frame` 是 surface 输出结构，`renderer` 是呈现实现；它们不应被写成同一条主流程里的独立业务阶段。
- lead 是最小 user 可审核单元。
- backing 是被 lead 统摄、用于支撑 / 展开 / 校验 lead 的材料层。
- HTML / Markdown 应作为 renderer config 后续统一设计，不改变 surface 职责。

## 内容

- `plan.md`：本轮的小循环列表。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `review-surface-role.md`：从 05 迁移出的 surface 职责定义。
- `surface-generation-rules.md`：Loop 2 surface generation rules。
- `review-frame.md`：Loop 3 review frame 定义。

## 文件索引

- `index.md`：工作面 lead file，状态：accepted；同时通过 `workspace_status: closed` 表示本工作面已关闭。
- `plan.md`：本轮 loop 计划，状态：draft。
- `log.md`：时间线记录，状态：draft；后续可继续追加。
- `review-surface-role.md`：surface 职责定义，状态：accepted。
- `surface-generation-rules.md`：Loop 2 surface generation rules，状态：accepted。
- `review-frame.md`：Loop 3 review frame 定义，状态：accepted。

## 下一步

review surface 的最小结构已经闭合。后续转入 `07-review-trace-design/`。
