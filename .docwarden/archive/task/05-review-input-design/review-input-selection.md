---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
loop: 2
---

# review input selection

本文件记录 Loop 2 草案，用于定义 user 未指定 input 时，agent 如何选择 review input 的 material。

## 核心判断

user 如果能直接提供清晰的 material 范围，甚至能提供 `lead + backing` 的关系，大概率说明 user 已经对材料结构有较清楚的理解，甚至已经完成了相当一部分 review。

因此，user 指定 input 是短路径，不是主路径。

review system 更重要的路径是：

```text
user 未指定 input -> agent 选择 material -> surface 提炼 lead + backing -> user review
```

## 短路径：user 指定 input

当 user 明确指定 material 时，agent 应该以 user 指定为准。

如果 user 同时指定了 `lead + backing` 关系，agent 应该把它视为短路径输入。

agent 可以做的事：

- 检查文件是否存在。
- 检查指定材料是否属于当前 task 或允许引用的上游 task。
- 在 review surface 中复述 user 指定的 material。
- 如果 user 已经给出 lead / backing，surface 可以直接采用该关系。
- 如果指定关系明显冲突，向 user 提醒。

agent 不应该做的事：

- 擅自替换 user 指定的 material。
- 在没有说明的情况下追加大量 material。
- 把 user 已经表达清楚的 lead / backing 关系重新打散。

如果 agent 认为必须补充材料，应当显式说明补充理由。

## 主路径：agent 选择 material

当 user 未指定 input 时，agent 需要从当前 task material 中选择 material。

选择 material 的目标不是直接完成 review。

选择 material 的目标是：给 surface 足够材料，让 surface 能提炼出最小 user-review 单元。

## 选择步骤

agent selection 的步骤是：

1. 识别本轮 review 目标。
2. 选择足以支撑 surface 提炼 lead 的 material。
3. 带入 current agent context。
4. 在 review surface 中公开 material 选择和 surface 提炼结果。

## 1. 识别本轮 review 目标

agent 首先应该根据当前对话和 task 状态判断：本轮到底要 user 审查什么。

常见目标包括：

- 当前 loop 的 draft 文件。
- user 刚刚要求 review 的文件。
- 某个已经 accepted 但被新理论挑战的文件。
- 一组共同构成当前判断的文件。

如果本轮目标无法判断，agent 应该先问 user，而不是自动吞掉整个 task。

## 2. 选择 material

agent 应该选择尽可能少、但足够让 surface 提炼 lead / backing 的 material。

常见 material 包括：

- 当前 loop 的 draft 文件。
- user 在对话中直接指向的文件。
- 当前 task 中承载本轮核心判断的文件。
- 当前 task 的 `index.md` 中与本轮相关的部分。
- `plan.md` 中与本轮 loop 相关的部分。
- `log.md` 中与本轮判断相关的时间线片段。
- 前置 loop 已接受的文件。
- 上游 task 中已经接受、且直接约束本轮判断的文件。

material 不应自动扩张为完整历史。

如果 agent 发现需要大量并列材料才能形成判断，说明 surface 可能难以提炼单一 lead。此时应当考虑缩小 review 范围或拆分 review。

## 3. 带入 current agent context

current agent context 不强制持久化为独立 input artifact。

但 agent 如果使用了未落盘上下文影响 material selection，需要在 review surface 中表达出来。

表达方式可以是：

- 本轮 agent 判断。
- 本轮 user 刚确认的前提。
- 待 user 核查的隐含假设。

这些内容是否进入长期 trace，留到 review trace 设计中讨论。

## 4. 公开 selection 与 surface 结果

agent 选择 material 后，必须在 review surface 中公开：

- 本轮使用了哪些 material。
- 当前 agent context 中影响 review 的关键判断。
- surface 如何从 material + context 提炼出 lead。
- backing 如何承载 lead 的来源、依据、覆盖范围和可校验细节。

公开的目的不是让 user 重新做材料分类，而是让 user 能够快速校正：

- material 是否选错。
- material 是否缺失。
- agent 是否带入了错误上下文。
- lead 是否真的构成最小 user-review 单元。
- backing 是否足以支撑、展开和校验 lead。

## 无法提炼 lead 的情况

如果 surface 无法从选定 material 中提炼 lead，说明当前 input 不适合进入一次 review。

可能原因：

- material 范围过大。
- material 之间只是并列领域，没有共同审查问题。
- current agent context 不足。
- 本轮 review 目标不清楚。

此时 agent 不应该把并列 materials 原样交给 user。

agent 应该：

- 缩小 material 范围。
- 拆分 review。
- 或回到 user 处确认本轮 review 目标。

## 当前不定义

本轮不定义：

- review surface 具体展示格式。
- input selection 自动算法。
- review trace 落点。
- user 校正 input 后的完整状态机。

## 当前结论

user 指定 input 是短路径。

user 未指定 input 时，agent selection 是主路径。

agent selection 的核心要求是：

```text
先识别 review 目标
  -> 选择足以让 surface 提炼 lead / backing 的 material
  -> 显式暴露 current agent context 中影响判断的部分
  -> 由 surface 生成 lead + backing
  -> 在 surface 中公开 material 选择与提炼结果，等待 user 校正或进入 review
```

## Review 问题

这组 agent input selection 规则是否可以作为 Loop 2 的 working 定义？

## Review 状态

sayori 已通过纠偏确认本轮 selection 边界：

- user 指定 input 是短路径。
- user 未指定 input 时，agent selection 是主路径。
- agent selection 选择 material，不直接选择 lead / backing。
- surface 负责从 material + context 中提炼 lead + backing。
