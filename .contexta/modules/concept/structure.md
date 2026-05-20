---
kind: concept
---

# structure

## Designation

Canonical: `structure`

## Current Status

本 module 是 `structure` concept 的占位定义。

当前只保留 `structure = 组织语言` 的方向，用于维持 contexta 元概念的同构关系。

后续将先设计 structure subtype，再反推修正 structure 的 definition、delimitation 和 examples。

## Naming Need

contexta 需要一个名字表示多个语义单元在同一个目的下如何共同成立。

这个名字用于避免把转换、推进、组成边界或条件分流问题误写成单个 concept 定义、policy 约束、template 骨架或 example 样本。

## Definition

组织语言，用于表达多个语义单元如何在同一目的下形成转换、推进、组成边界或条件分流。

structure 的核心是共同成立的组织方式：一个整体由哪些位置组成、每个位置承担什么作用、这些位置如何互相支撑或区分。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[concept]] | concept 稳定名字和含义；structure 表达多个已命名或可识别语义单元如何共同成立。 |
| [[policy]] | policy 表达约束强度；structure 表达组织方式。 |
| [[template]] | template 提供复制骨架；structure 是骨架中可能承载的组织语义。 |
| [[example]] | example 提供样本；structure 不在当前版本承接 sample set 或 contrast set。 |
| [[module]] | module 是语义组合单位；structure 表达 module 内部或多个 module 之间的组织方式。 |
| list | list 是语言形式；structure 是语义单元共同成立的组织方式。 |
| workflow | workflow 可以被 structure 表达，但 workflow 的操作生命周期不由 contexta 承接。 |
| pipeline | pipeline 可以被 structure 表达，但当前不作为 metadata 分类树固化。 |
| architecture | architecture 可以被 structure 表达，用于层级关系与边界。 |
| branch | branch 可以被 structure 表达，用于条件分流。 |

## Concept Relations

- [[concept]]：structure 本身由 concept module 定义和命名。
- [[policy]]：structure 的使用边界可以由 policy 约束。
- [[template]]：template 可以提供 structure module 的复制骨架。
- [[example]]：example 与 structure 的关系后续重新讨论，当前不把 sample set 或 contrast set 纳入 structure。
- [[module]]：structure module 可以承载具体结构内容。
- [[assertion]]：structure 的位置、作用和边界说明可以由 assertion 表达。
- [[naming]]：structure 的名称应表达它组织的语义整体或组织方式。

## Examples

### Positive

```text
一个 policy module 中，Intent 说明规则目的，Scope 界定适用域，Rules 承载规范性 assertion，Rationale 解释规则原因。
```

这个判断关注多个语义位置如何在同一个 policy module 中共同成立，因此属于 structure 问题。

### Negative

```text
example MUST 包含具体 sample。
```

这是一条 policy assertion。它规定 example 的质量约束，不是 structure 本体。

### Borderline

workflow、pipeline、architecture 和 branch 可以被 structure 表达，但它们不是当前 definition 的终点。下一步继续从这些 subtype 反推 structure 的稳定定义。
