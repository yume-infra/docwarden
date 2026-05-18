---
status: draft
created: 2026-05-13
updated: 2026-05-18
owner: sayori
---

# review trace 设计日志

## [2026-05-13] setup | 创建 paused task

创建 `07-review-trace-design` task。

本任务等待 `05-review-input-design` 与 `06-review-surface-design` 完成后再推进。

## [2026-05-18] activate | 启动 07

05 与 06 已闭合。

当前启动 `07-review-trace-design`。

本任务先围绕 user review 之后的 `review result` 与 `decision trace` 边界推进。

当前纠偏：

- `decision trace` 不应被写成 spec / guide / wiki 之前的独立生成阶段。
- `review input` 是输入命名。
- `review frame` 是 surface 输出结构。
- `renderer` 是呈现实现。
- 本任务只处理 user review 之后需要留下什么，以及这些记录如何服务后续分发。

## [2026-05-18] loop-1 | 纠偏为 promote / pick 分流

sayori 提醒此前已经有 promote / pick 语义。

当前纠偏：

- 不应引入独立 `review result`。
- 不应把 `decision trace` 建成新的持久化账本层。
- review 后真正要处理的是分流：promote / pick / log。
- promote 面向主产物稳定化。
- pick 面向 promote 不关注、但值得长期化的 side 内容。
- 剩余过程性内容只留在 task log。

## [2026-05-18] loop-1 | promote / pick / log 边界通过

sayori 确认：

- promote 用于主线稳定内容。
- pick 用于 promote 不处理、但值得长期保存的 side 内容。
- 剩余内容默认只留在 task log。
- 走完 promote + pick 后，更符合 workflow 逻辑的是 delete task working materials。
- 但应通过 config 提供 archive 选项，服务不希望丢弃 working 材料的用户。

已创建 `promote-pick-log-boundary.md` 记录本轮结论。

下一步进入 Loop 2：promote 规则。

## [2026-05-18] loop-2 | promote 规则通过

sayori 确认 promote 规则的三个思考方向：

- promote 应定义为主线基线 delta。
- promote 应按 `spec / guide / wiki` 的职责投影长期表达，而不是生成独立中间账本。
- pick 应发生在 promote 之后，因为只有先知道 promote 隐去了什么，才能判断哪些 side 内容值得长期化。

同时确认：

- 主流程 review surface 建设发生在 promote 之前。
- review surface 属于 review system 为 promote 准备的审查面。
- 主流程中的 lead 应聚焦“这轮 review 后，主线基线应该发生什么 delta”。

已创建 `promote-rules.md` 记录本轮结论。

下一步进入 Loop 3：pick 规则。

## [2026-05-18] loop-3 | pick 规则通过

sayori 确认当前 pick 理解正确。

当前确认：

- pick 不是和 promote 对称的第二条主流程。
- pick 是 promote 之后的信息损失控制。
- pick 解决 working 删除前的信息损失问题。
- pick 的对象是 promote 抽象、压缩、规范化后隐去但仍有长期价值的内容。
- pick 的去向一定是用户层的资产。
- pick 捞取的是可复利的用户层级资产。
- 当前初步归给 wiki 是正确方向，但不锁定最终承接层，因为用户层资产建设尚未确定。

已创建 `pick-rules.md` 记录本轮结论。
