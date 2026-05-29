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

isomorph 需要一个名字表示 concept network 中概念之间的稳定连接语言。

这个名字用于避免把概念关系散落到每个 concept module 的 `Concept Relations` 章节中，也避免把上位关系写成 frontmatter subtype metadata。

## Definition

relation 是 concept network 的稳定连接语言。

它表达 concept 之间会影响读取路径、落点判断或语义推理的稳定关系。

relation 不属于每个 concept module 的默认章节。

relation 应由独立 concept / policy 维护，避免每个 concept module 都枚举自己的概念网络。
