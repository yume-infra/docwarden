---
kind: concept
---

# assertion

## Designation

Canonical: `assertion`

Aliases:

- semantic assertion
- semantic unit

## Naming Need

contexta 需要一个名字表示文档迭代中可以被单独审查的最小语义单位。

这个名字用于避免审查只能停留在整篇文档、整段解释或整个 module 上。

## Definition

最小可审查语义单元，表达一条可以被接受、拒绝、修改、引用、检查或迁移的语义判断。

assertion 的核心不是句子长度，而是语义是否能被单独审查。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[module]] | module 是语义组合单位；assertion 是 module 内部的最小可审查语义单位。 |
| [[structure]] | structure 表达多个对象之间的组织关系；assertion 表达可单独审查的语义判断。 |
| sentence | sentence 是语言形式；assertion 是可审查语义判断。 |
| rule | rule 是规范性 assertion 的一种；assertion 也可以是定义性判断或边界判断。 |
| [[template]] | template 可以提供 assertion 的书写槽位；template slot 不是 assertion 本身。 |

## Concept Relations

- [[module]]：assertion 通常在 module 内获得上下文。
- [[policy]]：policy 中的规则是规范性 assertion。
- [[concept]]：concept 中的定义和消歧内容可以包含定义性 assertion。
- [[structure]]：structure 中的节点、关系和边界说明可以由 assertion 表达。

## Examples

### Positive

```text
module 是 contexta 的语义组合单元。
assertion 是 contexta 的最小可审查语义单元。
contexta MUST 将 md module 视为默认组合单位。
```

这些内容都表达了可以被单独审查的语义判断。

### Negative

```text
module
semantic-granularity
```

这些只是名称，不是语义判断。

### Borderline

一个列表项可能承载多个语义判断。此时它不是单一 assertion，而是多个 assertion 被写在同一个语言形式里。
