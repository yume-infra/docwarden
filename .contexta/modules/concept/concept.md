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
| [[structure]] | structure 表达对象之间的组织关系；concept 稳定这些对象和关系形态的名称。 |
| glossary entry | glossary entry 偏词表；concept 还需要表达命名需要、区分特征和概念关系。 |

## Concept Relations

- [[policy]]：policy 通过 `Applies to` 声明其约束适用于哪些 concept。
- [[module]]：每个 concept 文件本身也是一个 module。
- [[assertion]]：concept 中的定义和消歧内容可以由 assertion 表达。
- [[template]]：concept template 提供 concept module 的复制骨架。
- [[naming]]：concept 依赖 naming 建立稳定 designation。
- [[example]]：concept 可以通过 example 提供具体场景，帮助 agent 理解 designation 的使用。
- [[structure]]：concept 可以命名 structure，structure 表达多个 concept 或语义对象之间的组织关系。

## Examples

### Scenario

用户要求 agent 区分 policy 和 concept，并把这个区分沉淀进 contexta。

### Judgment Material

- policy 是约束语言。
- concept 是命名语言。

### Positive

```md
`policy` 和 `concept` 都需要 concept module，因为它们是 contexta 中必须稳定命名和界定的语义对象。具体约束规则再由 policy module 承接。
```

这个 example 展示了 concept 的职责：先稳定名字和含义，再让相邻 policy 承接使用约束。

### Negative

```text
agent MUST NOT 直接创建 assertion 文件。
```

这是一条规则，不是一个需要被命名和界定的语义对象。它应进入 policy，而不是 concept。

### Borderline

```text
audience
```

`audience` 可以被命名和界定，但当前它主要作为表达模式选择的约束主题存在。是否升级为 primitive concept，需要后续根据它是否成为更上级命名对象来判断。
