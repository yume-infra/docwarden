---
kind: policy
---

# relation

## Intent

约束 relation 作为 concept network 的稳定连接语言使用。

本 policy 用于避免 relation 散落到每个 concept module 中，也避免 Delimitation 被迫承担 concept network 的全局维护职责。

## Scope

Applies to:

- [[mapping/bootstrap/modules/concept/relation|relation]]
- [[mapping/bootstrap/modules/concept/concept|concept]]
- [[mapping/bootstrap/modules/concept/kind|kind]]

适用条件：

- contexta 需要表达 concept 之间的稳定连接。
- contexta 需要判断某个关系应由 relation、Delimitation 还是 frontmatter 字段承接。
- contexta 需要表达 `workflow -> structure` 这类内容语言关系。

不适用条件：

- 需要解释相邻概念的关键差异。
- 需要创建完整 graph database。
- 需要设计 docwarden workflow 生命周期。
- 需要设计 assertion locator。

## Rules

- relation MUST 表达稳定的 concept network 连接。
- relation MUST NOT 替代 Delimitation。
- Delimitation MUST 处理容易混淆的相邻概念之间的局部边界压力。
- concept module SHOULD NOT 默认包含 `Concept Relations` 章节。
- relation MUST NOT 被编码为 `sub_type`、`structure_type` 或等价 frontmatter subtype metadata。
- relation SHOULD 先通过专门的 concept / policy 稳定，再被跨 module 复用。
- relation entry SHOULD 限定在会影响读取路径、落点判断或语义推理的连接上。
- relation MUST NOT 变成所有相关概念的堆放区。

## Rationale

Delimitation 和 relation 都处理概念之间的关系，但层级不同。

Delimitation 是局部边界审查：它只关心容易混淆的相邻概念，以及混淆会造成什么错误。

relation 是 concept network 连接语言：它关心概念在网络中的稳定位置，以及 agent 后续如何沿着关系读取和推理。

如果每个 concept module 都维护 `Concept Relations`，relation 会变成重复、分散且难以审查的章节。当前应先由独立 relation concept / policy 稳定关系语言。

## Examples

### Scenario

agent 想在 workflow concept module 里加入一整节 `Concept Relations`。

### Judgment Material

```md
## Concept Relations

- [[mapping/bootstrap/modules/concept/structure|structure]]：workflow 是 structure 的一种。
- [[mapping/bootstrap/modules/concept/pipeline|pipeline]]：workflow 与 pipeline 相邻。
- [[mapping/bootstrap/modules/concept/template|template]]：workflow 有 template。
```

### Positive

```md
不要在每个 concept module 中维护默认 `Concept Relations`。

workflow 与 pipeline 的关键混淆应进入 Delimitation。
workflow 与 structure 的稳定网络关系应由 relation 体系集中承接。
```

这个 example 让 agent 区分局部消歧和全局关系网络。

### Negative

```md
## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/structure|structure]] | workflow 属于 structure。 |
```

这不是有效 Delimitation。它没有处理关键边界压力，只是把 relation 伪装成消歧。

### Borderline

```md
| [[mapping/bootstrap/modules/concept/pipeline|pipeline]] | workflow 表达推进；pipeline 表达转换。 |
```

这可以留在 Delimitation，因为 workflow 与 pipeline 容易混淆，且差异会影响正文写法。
