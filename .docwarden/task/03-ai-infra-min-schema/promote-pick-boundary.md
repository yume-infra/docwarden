---
status: accepted
created: 2026-05-12
updated: 2026-05-12
owner: sayori
loop: 4
review: accepted
---

# promote 与 pick 边界

本文件记录 Loop 4 已通过 review 的 working 定义，用于记录 `promote` 与 `pick` 的概念边界。

本轮只定义边界，不开展工作流编排，不定义触发时机。

## promote

`promote` 是 working -> stable 的主路径。

它基于 working material，产出面向 agent 的 stable 文档。

promote 的目标是服务 agent 编码，让后续 agent 能获得稳定、压缩、经过 review 的项目基线。

这里的 stable 不等于当前 `docs/`。

当前 `docs/` 是 sayori 编写和 review 的可信理论源，但它更偏向 user 理论描述，并没有经过面向 agent 的表达优化。未来需要单独规划 agent-oriented stable 层。

## pick

`pick` 是相对 promote 的 side 产物机制。

它同样基于 working material，但产出 promote 不关注、仍然有长期价值的 side 内容。

这些内容可能包括：

- ADR
- 纠错经验
- 可学习内容
- 用户理解材料
- 其他服务于长期内容建设的材料

pick 不是 review 选择动作。

pick 也不是自动进入 `docs/` 的流程。

## pick 产物位置

pick 产物不应该放在 `.docwarden/task/` 中作为长期材料。

原因是 working 的设计是短命的，主要用于任务推进、上下文捕获和 review 过程。

pick 产物具有更长期的价值，后续需要规划专门的文件夹结构。

当前阶段不定义这套长期结构。

## 本轮不讨论

本轮不讨论：

- promote 什么时候触发
- pick 什么时候触发
- promote 和 pick 的具体编排
- promote 产物的最终目录结构
- pick 产物的最终目录结构
- 面向 user 的表达层

这些属于后续 workflow 编排和长期层级设计，不属于当前最小 schema。

## 当前结论

- promote 是主路径，目标是 agent-oriented stable。
- pick 是支路，目标是长期 side material。
- working 是短命层，不承载 pick 的长期产物。
- 当前只记录边界，不设计触发和编排。

## Review 问题

这组边界是否可以作为 Loop 4 的 working 定义？

## Review 状态

sayori 已接受这组边界作为当前 working 定义。
