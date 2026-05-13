---
status: accepted
created: 2026-05-12
updated: 2026-05-12
owner: sayori
loop: 1
review: accepted
---

# Schema 范围

## 决定

在本任务中，最小 schema 指 `docwarden` 的操作流程协议。

它定义 agent 如何围绕项目文档工作：

- working material 在哪里创建
- working material 如何与 stable docs 保持分离
- review、promote 和 pick 如何发生
- agent 什么时候必须停下来请求明确授权

它不定义项目知识、断言、template 或语义单元的完整内容格式。这些属于 `contexta`。

换言之，`docwarden` 的最小 schema 只回答“agent 怎么维护文档流程”，不回答“文档内容应该怎么写”。

## 产品边界

`docwarden` 负责文档维护 workflow。

`contexta` 负责内容理解和内容格式层。

实际拆分：

- `docwarden`：操作流程协议、目录状态、review/promote/pick 过程、docs 保护
- `contexta`：断言语义、metadata schema、template grammar、semantic lint、自然语言到 agent 理解的规则

## 本轮最小词表

现在需要稳定 working 含义的词：

- `working`：agent 维护的材料，用于捕获上下文、计划、草案和 review notes；在进入 stable 前都属于 working。当前 `docwarden` workflow 的 working material 只放在 `.docwarden/working/` 下。
- `review`：working material 影响后续产物之前的人类显式审查。
- `promote`：基于 working material 产生稳定的 stable 文档，用于服务 agent 编码。
- `pick`：基于 working material 产生 promote 不关注的 side 内容，例如 ADR、纠错经验、可学习内容、用户理解材料等，用于服务其他内容建设。
- `stable`：面向 agent 的稳定基线。它不完全等价于当前 `docs/`。当前 `docs/` 是 sayori 自己编写和 review 的可信理论源，因此可以作为判断依据；但它更偏向对 user 的理论描述，并没有经过面向 agent 的表达优化。
- `roadmap`：本地导航文件，告诉 agent 某个 working 目录在做什么、应该从哪里开始。
- `log`：按时间追加记录 workflow 事件的文件。

一个有用的工作区分：

- 等待 review、promote 或 pick 的材料仍然只是 `working` material，不是 `working` 和 `stable` 之外的新层级。
- 当前项目里不维护单独的 docs 修改建议流。涉及 `docs/` 的内容只作为对 sayori 的回答或普通建议，由 sayori 自己决定是否维护。

`assertion` 暂时作为桥接词处理。`docwarden` 可以让类似断言的材料进入 review，再按 promote 或 pick 的方向处理，但断言的内容 schema 属于 `contexta`。

## 对当前计划的影响

Loop 4 不应该定义完整 assertion schema，也不应该把 pick 理解成普通 review 选择动作。

Loop 4 需要重新定义 `promote` 与 `pick` 的边界：

- `promote`：working -> stable 的主路径。
- `pick`：working -> side material 的支路，用于保留 promote 不关注但仍有价值的材料。

working material 内部的语义字段仍属于未来 `contexta` 工作。

Loop 2 讨论目录和状态语义时，应从 `.docwarden/working/` 作为当前唯一工作区开始，不扩展到其他区域。

## Review 问题

这个拆分是否可以作为 Loop 1 范围？

## Review 状态

sayori 指出：当前词表理解仍有问题，但这一轮可以暂时容忍，用作后续推进的工作定义。

因此，本文件不是稳定理论定义。后续需要在慢推进过程中继续对齐词表。

已修正一处关键误解：`pick` 不是 review 选择动作，而是相对 `promote` 的 side 产物机制。
