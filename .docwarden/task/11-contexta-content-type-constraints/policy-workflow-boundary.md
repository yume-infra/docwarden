---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 2
---

# policy / workflow boundary

本文件定义 contexta 中 `policy` 与 `workflow / architecture` 的内容类型边界。

## 核心判断

`policy` 和 `workflow / architecture` 都可以服务 agent。

但它们不是同一种内容类型。

它们的区别不在于读者，而在于内容要表达的对象不同。

## policy 表达什么

policy 表达稳定约束。

它回答：

- 适用范围是什么。
- 不适用范围是什么。
- agent 必须、禁止、默认应该或可以做什么。
- 为什么这些约束存在。
- 哪些例子能帮助识别边界。

policy 的典型结构可以是：

```text
Intent
Scope
Rules
Rationale
Examples
```

policy 的核心是 `Rules`。

如果一个内容主要由规范性规则组成，并且需要通过 RFC2119 强度约束 agent 行为，它更接近 policy。

## workflow / architecture 表达什么

workflow / architecture 表达组成、阶段、关系和流转。

它回答：

- 这个系统由哪些部分组成。
- 这些部分之间是什么关系。
- 信息或操作如何从一个阶段流向另一个阶段。
- 每个阶段负责什么，不负责什么。
- 哪些边界防止阶段职责混淆。
- 失败、回退或分支发生在哪里。

workflow / architecture 的核心不是 `Rules`。

它的核心是结构关系。

如果一个内容主要说明系统如何组织和流转，即使它会影响 agent 行为，也不应该直接写成 policy。

## 误用信号

workflow 被写成 policy 的信号：

- 用 `Intent / Scope / Rules` 替代组成和阶段关系。
- 把流程阶段全部改写成 `agent MUST ...`。
- 只剩规则列表，看不出系统结构。
- 缺少阶段之间的输入、输出、承接和边界。
- failure handling 只写成禁止项，而没有说明回退到哪个阶段。

policy 被写成 workflow 的信号：

- 明明是稳定约束，却只画流程或叙述步骤。
- 没有明确 MUST / MUST NOT / SHOULD / MAY。
- agent 无法从内容中判断具体约束强度。
- 适用范围和不适用范围不清。

## semantic lint 候选

contexta 后续 semantic lint 应能识别：

- `kind: workflow` 或 architecture 内容中出现 policy-only 骨架。
- workflow / architecture 内容中 `Rules` 成为唯一核心段落。
- workflow / architecture 内容缺少组成、阶段、关系或流转。
- policy 内容中缺少规范性规则强度。
- policy 内容中只有过程描述，没有可执行约束。

## 当前例子

`10-promote-output-content-format/spec-module-format-instance.md` 的主要内容方向成立。

但它把 `review workflow` 写成：

```text
Intent / Scope / Rules / Failure Handling
```

这个结构更像 policy。

如果目标内容类型是 workflow / architecture，应改为表达：

- stages
- stage responsibilities
- transitions
- boundaries
- failure / rollback points
- handoff to promote / pick / cleanup

## 本轮不判断

- workflow / architecture 的最终模板。
- frontmatter 字段。
- 具体 `.contexta/templates/` 落盘。
- docwarden review workflow 的真实写入。

## 审核点

- policy 是否应表达稳定约束，并以 Rules 为核心。
- workflow / architecture 是否应表达组成、阶段、关系和流转。
- workflow / architecture 是否不应直接套 policy 骨架。
- semantic lint 是否应识别 workflow 被写成 policy、policy 被写成 workflow 的错误。

## Review

sayori 确认本边界方向成立，并进一步要求先设计 `structure` 上位内容类型。
