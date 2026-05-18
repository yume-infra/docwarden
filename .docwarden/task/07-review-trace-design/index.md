---
status: accepted
workspace_status: closed
created: 2026-05-13
updated: 2026-05-18
owner: sayori
---

# review 后分流设计

本 task 目录用于起草 `docwarden` user review 之后的 promote / pick 分流规则。

## 边界

- 本目录是对话产生的 task material。
- 本任务已关闭。
- 本任务只设计 user review 之后如何分流到 promote / pick，不设计独立 review result，不设计独立 decision ledger，不设计 review input，不设计 review surface，不设计 renderer config。

## 来源基线

- `.docwarden/task/04-task-review-spec-pipeline/`
- `.docwarden/task/05-review-input-design/`
- `.docwarden/task/06-review-surface-design/`

## 当前判断

- review surface 本体短命。
- user review 的对象是 lead；backing 只在需要时展开检查。
- user review 后不额外引入独立 `review result` 层。
- 不把 `decision trace` 建模为新的持久化账本层。
- review 后真正需要判断的是：哪些内容进入 promote，哪些内容进入 pick，哪些只留在 task log。
- promote 服务主产物稳定化。
- pick 服务 side 内容长期化，例如 adr、纠错经验、用户偏好、可学习内容或其他长期侧向材料。
- promote 的核心是主线基线 delta。
- 主流程 review surface 建设发生在 promote 之前，属于 review system 为 promote 准备的审查面。
- 主流程中的 lead 应聚焦“这轮 review 后，主线基线应该发生什么 delta”。
- pick 是 promote 之后的信息损失控制。
- pick 用于从 promote 隐去的内容中捞出可复利的用户层级资产。
- pick 的内容一定是 user-level asset；当前可初步归向 wiki，但最终承接层尚未确定。
- promote + pick 完成后，task working materials 默认 delete。
- 可以通过 config 提供 archive 选项，服务不希望丢弃 working 材料的 workflow。

## 内容

- `plan.md`：本轮的小循环列表。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `promote-pick-log-boundary.md`：Loop 1 promote / pick / log 边界定义。
- `promote-rules.md`：Loop 2 promote 规则。
- `pick-rules.md`：Loop 3 pick 规则。

## 文件索引

- `index.md`：工作面 lead file，状态：accepted；同时通过 `workspace_status: closed` 表示本工作面已关闭。
- `plan.md`：本轮 loop 计划，状态：accepted。
- `log.md`：时间线记录，状态：draft；后续可继续追加。
- `promote-pick-log-boundary.md`：Loop 1 promote / pick / log 边界定义，状态：accepted。
- `promote-rules.md`：Loop 2 promote 规则，状态：accepted。
- `pick-rules.md`：Loop 3 pick 规则，状态：accepted。

## 下一步

本轮 review 后分流设计已完成当前最小闭环。后续进入 `08-promote-pick-dry-run/`。
