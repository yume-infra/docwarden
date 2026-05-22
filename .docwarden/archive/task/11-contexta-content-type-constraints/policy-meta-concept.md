---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 4
---

# policy meta concept

本文件记录 `policy` 元概念的本轮结论。

## 核心判断

`policy` 是约束类元概念。

它用于表达稳定规则、适用边界、禁止事项、默认行为和规则存在的原因。

policy 的中心是可执行约束，而不是结构关系、术语定义、例子本体或操作流程。

## 当前基线

本轮不展开新的 policy 设计。

原因：

- `.contexta/modules/policy/` 已经存在可用基线。
- `policy-workflow-boundary.md` 已确认 policy 与 workflow / architecture 的边界。
- sayori 已确认 `policy` 可以直接通过。

## 边界

policy 可以包含概念说明和例子，但它们服务于约束表达。

policy 不承接：

- `structure`：组成、关系、流转和承接。
- `module`：语义组合边界本身。
- `assertion`：最小可审查语义单元本身。
- `concept`：术语或概念定义本体。
- `example`：样本语言本体。

## Review

sayori 已确认：policy 直接通过。
