---
kind: concept
---

# concept

## Designation

Canonical: `concept`

Aliases:

- semantic concept

## Naming Need

contexta 需要一个名字表示被稳定命名和界定的语义对象。

这个名字用于承接自然语言中的术语、别名和相邻概念差异，减少 agent 在同一词语上的理解偏移。

## Definition

命名与界定单元，用于稳定一个语义对象在 contexta 中的名称、含义、区分特征和概念关系。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[policy]] | policy 表达约束；concept 表达命名和界定。 |
| [[module]] | module 是语义组合单位；concept module 是承载某个 concept 的 module。 |
| [[template]] | template 是复制骨架；concept 是被骨架承载的语义对象。 |
| glossary entry | glossary entry 偏词表；concept 还需要表达命名需要、区分特征和概念关系。 |

## Concept Relations

- [[policy]]：policy 通过 `Applies to` 声明其约束适用于哪些 concept。
- [[module]]：每个 concept 文件本身也是一个 module。
- [[assertion]]：concept 中的定义和消歧内容可以由 assertion 表达。
- [[template]]：concept template 提供 concept module 的复制骨架。
- [[naming]]：concept 依赖 naming 建立稳定 designation。

## Examples

### Positive

```text
module
assertion
policy
template
naming
```

这些名称都指向 contexta 中需要稳定界定的语义对象。

### Negative

```text
do-not-create-assertion-files
```

这个名称更像规则，而不是 concept。

### Borderline

`audience` 可以成为 concept，但当前它不是 primitive 元概念。primitive 与非 primitive 的差异属于 contexta 当前建设阶段的分类问题，不改变 concept 的命名语言职责。
