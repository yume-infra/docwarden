---
status: superseded
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 3
---

# structure content type

本文件定义 contexta 中 `structure` 作为上位内容类型的共同约束。

> 当前状态：本草案已被 `meta-concept-baseline.md` 修正。
>
> 主要修正：不再把 `structure_type` 作为当前 frontmatter 基线；workflow / pipeline / architecture / branch 先作为 structure 下的子概念或子模块处理。

## 核心判断

`structure` 是上位内容类型。

它用于表达一个系统、过程或知识对象的组成、关系、流转、边界和承接。

`workflow`、`pipeline`、`architecture` 都可以是 `structure` 的 subtype。

`branch` 更适合作为 structure 内部机制，而不是默认独立成顶层内容类型。

## frontmatter 候选

结构类内容可以使用：

```yaml
kind: structure
structure_type: workflow | pipeline | architecture | branch-map
```

其中：

- `kind: structure` 表示这是结构类内容。
- `structure_type` 表示具体结构形态。

## structure 统一要表达什么

所有 structure 内容都应至少表达：

- `purpose`：这个结构为什么存在，解决什么损失。
- `parts`：有哪些组成部分、阶段、节点或角色。
- `relations`：这些部分之间如何连接。
- `flow`：信息、内容、操作或控制如何流动。
- `boundaries`：每个部分负责什么，不负责什么。
- `handoff`：一个部分如何把结果交给另一个部分。
- `branch / rollback`：何时分叉、回退、延后或转交。
- `outputs`：这个结构最终产生什么，交给哪里。

这些是 structure 的共同语义，不等于固定标题模板。

## workflow subtype

`workflow` 是 structure 的一种 subtype。

它强调操作阶段、用户确认点、决策门、交接、回退和完成条件。

适合表达：

```text
task -> review surface -> user review -> promote -> pick -> cleanup
```

workflow 的核心问题是：

- 事情按哪些阶段推进。
- 每个阶段接收什么。
- 每个阶段决定什么。
- 每个阶段产出什么。
- 什么条件触发下一阶段。
- 什么条件要求回退或分支。
- 何时算完成。

## pipeline subtype

`pipeline` 是 structure 的一种 subtype。

它强调输入经过处理后变成输出。

适合表达：

```text
material + current agent context -> lead + backing
```

或：

```text
reviewed promote delta -> spec / guide / wiki candidates
```

pipeline 的核心问题是：

- 输入是什么。
- 中间处理步骤是什么。
- 输出是什么。
- 每一步如何改变输入。
- 处理失败时如何停止、回退或转交。

pipeline 通常比 workflow 更单向，更关注转换。

workflow 可以包含 pipeline。

## architecture subtype

`architecture` 是 structure 的一种 subtype。

它强调系统组成、层级、职责分配和长期边界。

适合表达：

```text
docwarden = task / review / promote / pick / cleanup / entity landing
contexta = template / metadata / module / assertion / semantic lint
```

architecture 的核心问题是：

- 系统由哪些层或模块组成。
- 每层负责什么。
- 每层不负责什么。
- 层与层之间如何依赖。
- 哪些边界不能跨越。

architecture 不一定描述时间顺序。

## branch-map subtype

`branch-map` 是 structure 的一种 subtype 候选。

它强调按条件分流到不同承接路径。

适合表达：

```text
if 主线 delta -> promote
if 用户层资产 -> pick
if 内容格式问题 -> contexta
if 未确认 -> review
```

但 branch 也可以只是 workflow 或 pipeline 内部的局部机制。

是否需要独立 `structure_type: branch-map`，应看它是否有独立复用价值。

## 与 policy 的边界

structure 不是 policy。

structure 可以包含约束，但约束不是它的中心。

当一个内容的核心是阶段、关系、流转和承接时，应优先判断为 structure。

当一个内容的核心是稳定规则和约束强度时，才应判断为 policy。

## semantic lint 候选

contexta 后续 semantic lint 应能识别：

- `kind: structure` 缺少 parts / relations / flow / boundaries。
- `structure_type: workflow` 缺少阶段、交接或完成条件。
- `structure_type: pipeline` 缺少 input / transformation / output。
- `structure_type: architecture` 只写时间流程，缺少层级和职责边界。
- structure 被写成只有 Rules 的 policy。
- policy 被写成只有阶段说明的 structure。

## 当前例子判断

完整主线：

```text
task -> review surface -> user review -> promote -> pick -> cleanup
```

应判断为：

```yaml
kind: structure
structure_type: workflow
```

surface 生成：

```text
material + current agent context -> lead + backing
```

应判断为：

```yaml
kind: structure
structure_type: pipeline
```

promote 分流：

```text
reviewed delta -> spec / guide / wiki candidates
```

可以判断为 pipeline，也可以在更大 workflow 中作为分支与输出阶段。

## 本轮不判断

- structure 的最终模板标题。
- `.contexta/templates/` 落盘。
- workflow subtype 的完整骨架。
- pipeline subtype 的完整骨架。
- architecture subtype 的完整骨架。

## 审核点

- `structure` 是否应作为上位内容类型。
- `workflow / pipeline / architecture` 是否应作为 structure subtype。
- branch 是否更适合作为 structure 内部机制，必要时再形成 `branch-map` subtype。
- structure 统一语义是否应围绕 parts / relations / flow / boundaries / handoff / branch / output。
- 当前完整主线是否应判断为 `kind: structure` + `structure_type: workflow`。
