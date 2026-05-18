---
status: accepted
created: 2026-05-13
updated: 2026-05-18
owner: sayori
loop: 1
---

# review input 边界

本文件记录 Loop 1 草案，用于定义 review system 的 input 边界。

## 核心公式

review input 的初步公式是：

```text
review input = material + current agent context
```

这里不能把 input 直接建模成 `lead + backing`。

`lead + backing` 是 review surface 对 input 进行处理后的组织结果，不是 input 本身。

## material

`material` 是进入 review system 的材料。

在当前项目中，material 主要来自 task 工作面，包括：

- task 内的草案文件。
- task 的 `index.md`。
- task 的 `plan.md`。
- task 的 `log.md` 或相关片段。
- 前置 loop 已经接受的文件。
- 上游 task 中与本轮判断直接相关的材料。

material 不等于整个 task 目录。

原因：

- task 目录中可能包含历史材料。
- task 目录中可能包含已经过期但仍保留作 trace 的内容。
- task 目录中可能包含当前 review 不关注的旁支材料。
- 整个 task 作为 input 会提高 user review 成本。

因此，material 应该是从 task material 中选出的、足以让 surface 生成最小 user-review 单元的材料集合。

## current agent context

`current agent context` 是当前 agent 对任务、对话和即时判断的运行时理解。

它也是 review input 的一部分。

这点需要显式写出。否则 review system 会错误地假设 input 只来自文件，而忽略当前对话中已经形成、但尚未固化到文件里的上下文。

current agent context 不强制持久化为独立 input artifact。

原因：

- 当前 agent 上下文是运行时条件，不是文件系统里的稳定材料。
- 强行持久化容易把短命会话状态变成新的 task 垃圾。
- 真正需要长期保留的是 review 后被确认的 decision / trace，而不是 agent 当时完整的运行时理解。

如果 agent 使用了未落盘上下文影响 review，后续 surface 必须把它表达成 user 可审查的判断、问题或假设。

这些内容是否进入长期 trace，留到 review trace 设计中讨论。

## input 与 surface 的边界

input 阶段不负责把材料拆成 `lead + backing`。

surface 阶段负责从：

```text
material + current agent context
```

中组织出：

```text
lead + backing
```

其中：

- `lead` 是最小 user 可审核单元。
- `backing` 是被 lead 统摄、用于支撑 / 展开 / 校验 lead 的材料层。

## 短路径

如果原始 material 已经清楚表达了 `lead + backing` 的关系，review system 可以走短路径。

短路径的意思是：

- 不需要 surface 再额外提炼 lead。
- surface 可以直接采用原始 material 中已经表达出来的 lead / backing 关系。
- user 仍然 review lead。

user 如果能直接提供 lead + backing，大概率说明 user 已经做过一部分 review。

因此，短路径不是主路径。

主路径仍然是：

```text
material + current agent context -> surface -> lead + backing
```

## input 与文件状态

review input 不要求只能来自 `accepted` 文件。

review 本身的目的之一，就是让尚未 review 的文件从未确认状态进入 review 流程。

当前文件状态先只保留：

- `draft`
- `accepted`

`reviewing` 不作为文件状态继续推进。

原因是 `reviewing` 更像 review system 的过程状态，而不是 task 文件自身的稳定状态。它应该在后续 review 状态设计中单独讨论。

## input 选择权

review input 的 material 可以由 user 指定。

如果 user 指定了 task 文件或材料范围，agent 应该以 user 指定为准。

如果 user 没有指定，agent 可以从当前 task material 中挑选 material。

agent 挑选 material 后，应当在后续 review surface 中公开：

- 本轮使用了哪些 material。
- 哪些 current agent context 影响了 surface 的提炼。
- surface 最终提炼出的 lead / backing 是什么。

## 当前不定义

本轮不定义：

- review surface 具体形态。
- HTML review 页面结构。
- decision trace 写在哪里。
- input data schema。
- input 自动选择算法。
- review session / review artifact 的状态模型。

这些属于后续 task 或后续 loop。

## 当前结论

review input 是：

```text
material + current agent context
```

input 不直接等同于 `lead + backing`。

`lead + backing` 是 review surface 对 input 的组织结果。

文件状态当前只保留 `draft` / `accepted`。review 过程状态后续单独设计。

## Review 问题

这组 input 边界是否可以作为 Loop 1 的 working 定义？

## Review 状态

sayori 已通过纠偏确认本轮 input 边界：

- review input = material + current agent context。
- `lead + backing` 是 surface 的组织结果，不是 input 本体。
- 文件状态当前只保留 `draft` / `accepted`。
