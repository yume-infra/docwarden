---
kind: concept
---

# relation

## Designation

Canonical: `relation`

Aliases:

- concept relation
- concept network relation

## Naming Need

contexta 需要一个名字表示 concept network 中概念之间的稳定连接语言。

这个名字用于避免把概念关系散落到每个 concept module 的 `Concept Relations` 章节中，也避免把上位关系写成 frontmatter subtype metadata。

## Definition

relation 是 concept network 的稳定连接语言。

它表达 concept 之间会影响读取路径、落点判断或语义推理的稳定关系。

relation 不属于每个 concept module 的默认章节。

relation 应由独立 concept / policy 维护，避免每个 concept module 都枚举自己的概念网络。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/concept|concept]] | concept 稳定命名和定义；relation 稳定 concept 之间的连接语言。 |
| Delimitation | Delimitation 处理局部边界压力；relation 处理 concept network 中的稳定连接。 |
| [[mapping/bootstrap/modules/concept/kind|kind]] | kind 是内容语言入口；relation 表达内容语言或 concept 之间的理论关系。 |
| subtype metadata | subtype metadata 把关系塞进 frontmatter；relation 不通过 `sub_type` 或 `structure_type` 表达。 |
| link | 普通链接只是引用；relation 必须表达稳定、可命名、可复用的语义连接。 |

## Examples

### Scenario

agent 需要表达 workflow 与 structure 的关系。

### Judgment Material

```yaml
kind: workflow
```

### Positive

```md
`kind: workflow` 只说明当前 module 使用 workflow 内容语言。

workflow 与 structure 的关系应由 relation 体系表达，例如 workflow 属于 structure language。
```

这个 example 让 agent 看到 relation 承接 concept network，而不是让 `kind` 承接 subtype。

### Negative

```yaml
kind: structure
sub_type: workflow
```

这把 concept network 关系写进了 frontmatter subtype metadata，不符合当前口径。

### Borderline

```md
## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/pipeline|pipeline]] | workflow 表达推进；pipeline 表达转换。 |
```

这是 Delimitation，不是 relation。它用于消歧相邻概念，不负责维护 workflow 在 concept network 中的全局位置。
