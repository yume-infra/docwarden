---
status: accepted
created: 2026-05-13
updated: 2026-05-13
owner: sayori
loop: 1
review: accepted
---

# stable 层定位

本文件记录 Loop 1 已通过 review 的 working 定义，用于起草 `docwarden` 的 stable 层定位。

当前结论仍然是 working definition，不是稳定理论定义。

## 已确认边界

当前 `docs/` 不等于 stable。

`docs/` 是 sayori 自己编写和 review 的可信理论源，更偏向 user-facing 的理论描述。

stable 是未来从 working material 经过 review，并通过 promote 产生的 agent-facing baseline。

当前阶段，stable 不能由 agent 直接自由写入。它必须基于 working material，并经过 review。

## 核心分歧点

stable 层定位存在一个重大分歧点：

stable 是给 agent 的指挥层，但这不意味着 user 不需要 review。

按照当前理论，需要存在一个最小的 user-review 单元。这个单元用于让 user 能够有效审查 agent-facing stable 的内容，而不是让 agent 指挥层完全绕开 user。

因此，不能简单地说：

- stable 只服务 agent，所以不考虑 user。
- 或者 stable 只要 user-readable，就足够服务 agent。

这两种说法都过早。

## 可能的拆分方向

一个可能方向是将 stable 拆成两个表达层：

- `stable/agent`：agent-facing 指挥层，服务 agent 编码和项目执行。
- `stable/user`：user-review 层，服务 user 审查、理解和确认。

但这个拆分目前不能定论。

原因：

- 如果拆得太早，会提前固化目录结构。
- 如果不拆，agent-facing stable 可能变得难以 review。
- 如果只保留 user-facing 表达，又可能失去对 agent 的指挥力。

## 当前工作定义

在本轮中，暂时采用更保守的定义：

stable 是经过 review 的稳定基线层。

它的首要目标是服务 agent 编码和项目执行。

但 stable 必须保留 user 可 review 的最小单元。

是否需要拆成 `stable/agent` 与 `stable/user`，留到后续目录结构和产物形态讨论中继续确认。

## 与 working 的关系

working 是短命层，用于任务推进、上下文捕获、草案和 review 过程。

stable 不是 working 的延续目录。

stable 必须通过 promote 从 working material 中产生。

当前阶段只确认这一方向，不定义 promote 的触发时机和完整编排。

## 与 docs 的关系

stable 不等于当前 `docs/`。

当前 `docs/` 可以作为 stable 的可信理论源或 source baseline，但不能被视为已经完成 agent-facing 表达优化的 stable 层。

stable 和 `docs/` 的具体引用关系留到 Loop 3 讨论。

## 待确认问题

- 是否需要明确拆分 `stable/agent` 和 `stable/user`？
- 最小 user-review 单元应该是 stable 文档本身、stable 文档的摘要，还是独立 review artifact？
- agent-facing 指挥层应该如何避免变成 user 难以审查的黑盒？

## Review 问题

这个定位是否可以作为 Loop 1 的 working 草案继续推进？

## Review 状态

sayori 已接受这个定位作为当前 working 定义。
