---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 6.4
---

# contexta architecture baseline

本文件记录当前已落地到 `.contexta` 的架构基线。

## 核心架构

contexta 是内容格式协议。

它用多种内容语言稳定 agent 对 md 内容的理解、拆分、审查和生成。

当前核心关系：

```text
designation -> concept -> module -> assertion

policy --applies to--> concept

template -> copied skeleton
example -> teaching sample
semantic lint -> consumes concept / policy / template / example
```

## concept

concept 是命名语言。

它负责：

- designation 如何指向 concept。
- 为什么需要这个命名。
- concept 如何定义。
- concept 与相邻 concept 如何区分。
- concept 在概念网络里如何连接。
- 哪些例子帮助理解这个命名。

concept 不承接：

- 约束强度。
- 落地规则。
- lint 规则。
- docwarden 生命周期。

已落地：

- `.contexta/templates/concept.md`
- `.contexta/modules/concept/concept.md`
- `.contexta/modules/concept/policy.md`
- `.contexta/modules/concept/module.md`
- `.contexta/modules/concept/assertion.md`
- `.contexta/modules/concept/template.md`
- `.contexta/modules/concept/naming.md`
- `.contexta/modules/concept/example.md`

## policy

policy 是约束语言。

它负责：

- 说明约束 intent。
- 通过 `Applies to` 指向 concept。
- 说明适用 / 不适用范围。
- 用 RFC2119 表达规则强度。
- 解释约束原因。
- 提供帮助识别约束边界的例子。

policy 不重新定义 concept。

已落地：

- `.contexta/templates/policy.md`
- `.contexta/modules/policy/language.md`
- `.contexta/modules/policy/audience.md`
- `.contexta/modules/policy/semantic-granularity.md`
- `.contexta/modules/policy/template-boundary.md`
- `.contexta/modules/policy/naming.md`

## template

template 是复制骨架。

它负责：

- 给某类 module 提供初始章节结构。
- 给 assertion、definition 或 rule 提供书写槽位。

template 不负责：

- 规则本体。
- concept 定义本体。
- 来源。
- review。
- pick。
- 更新。
- 写入。
- 生命周期。

template 的概念定义在：

- `.contexta/modules/concept/template.md`

template 的约束定义在：

- `.contexta/modules/policy/template-boundary.md`

## example

example 是样本语言。

它负责：

- 用具体样本教 agent 理解某个语义对象。
- 用具体样本教 agent 如何书写或判断某类内容。
- 提供可模仿、可对照、可迁移的内容实例。

example 不负责：

- 定义 concept。
- 规定 policy。
- 提供 template 骨架。
- 替代 review 或 semantic lint。

边界识别、review 对照或 semantic lint 参考是样本产生的派生用途，不是 example 的本体定义。

example 的概念定义在：

- `.contexta/modules/concept/example.md`

example 的复制骨架在：

- `.contexta/templates/example.md`

## naming

naming 是语义定位机制。

它负责让名称稳定指向内容对象、内容类型、概念关系或规则主题。

naming 的概念定义在：

- `.contexta/modules/concept/naming.md`

naming 的约束定义在：

- `.contexta/modules/policy/naming.md`

## module

module 是语义组合单元。

它不是 `kind: module`。

一个 md 文件可以是 module，同时通过 `kind` 表达内容语言：

```yaml
kind: concept
```

或：

```yaml
kind: policy
```

## assertion

assertion 是最小可审查语义单元。

第一版不将 assertion 默认独立成文件。

assertion 的概念定义在 concept 中；assertion 的拆分、组合和落地约束由 policy 处理。

## 当前落地原则

- 同一个 concept 只在 concept module 中定义一次。
- policy 只通过 `Applies to` 指向 concept，并约束其使用。
- template 只提供骨架和槽位，不承接内容本体。
- example 只提供样本和示范，不承接 concept 定义本体或 policy 规则本体。
- docwarden 仍负责 task / review / promote / pick / cleanup。
- contexta 不承接 docwarden 操作流程生命周期。
