---
kind: policy
---

# relation

## Intent

约束 relation 作为 concept network 的稳定连接语言使用。

本 policy 用于避免 relation 散落到每个 concept module 中，也避免概念连接被写进 signal、policy、Definition 或 example。

## Scope

Applies to:

- [[language/primitive/concept/relation|relation]]
- [[language/primitive/concept/concept|concept]]
- [[language/grammar/concept/metadata/kind|kind]]

适用条件：

- isomorph 需要表达 concept 之间的稳定连接。
- isomorph 需要判断某个关系应由 relation、signal、policy、Definition、example 还是 frontmatter 字段承接。
- isomorph 需要表达 `workflow -> structure` 这类内容语言关系。

不适用条件：

- 需要定义 semantic object 自身的含义。
- 需要表达误用检测。
- 需要写约束规则。
- 需要提供教学样本。
- 需要创建完整 graph database。
- 需要设计 docwarden workflow 生命周期。
- 需要设计 assertion locator。

## Rules

- relation MUST 表达稳定的 concept network 连接。
- relation MUST NOT 替代 signal。
- relation MUST NOT 替代 policy。
- relation MUST NOT 替代 Definition。
- relation MUST NOT 替代 example。
- concept module SHOULD NOT 默认包含 `Concept Relations` 章节。
- relation MUST NOT 被编码为 `sub_type`、`structure_type` 或等价 frontmatter subtype metadata。
- relation SHOULD 先通过专门的 concept / policy 稳定，再被跨 module 复用。
- relation entry SHOULD 限定在会影响读取路径、落点判断或语义推理的连接上。
- relation MUST NOT 变成所有相关概念的堆放区。

## Rationale

relation 是 concept network 连接语言：它关心概念在网络中的稳定位置，以及 agent 后续如何沿着关系读取和推理。

如果每个 concept module 都维护 `Concept Relations`，relation 会变成重复、分散且难以审查的章节。当前应先由独立 relation concept / policy 稳定关系语言。

误用检测由 signal 承接；约束由 policy 承接；样本教学由 example 承接；概念自身含义由 Definition 承接。

## Examples

### Scenario

agent 想在 workflow concept module 里加入一整节 `Concept Relations`。

### Judgment Material

```md
## Concept Relations

- [[language/structure/concept/structure|structure]]：workflow 是 structure 的一种。
- [[language/structure/concept/pipeline|pipeline]]：workflow 与 pipeline 相邻。
- [[language/primitive/concept/template|template]]：workflow 有 template。
```

### Positive

```md
不要在每个 concept module 中维护默认 `Concept Relations`。

workflow 与 pipeline 的可复用误用检测应进入 signal。
workflow 与 structure 的稳定网络关系应由 relation 体系集中承接。
```

这个 example 让 agent 区分正文定义和全局关系网络。

### Negative

```md
| [[language/structure/concept/structure|structure]] | workflow 属于 structure。 |
```

这不是 concept Definition。它只是把 relation 伪装成正文说明。

### Borderline

```md
| [[language/structure/concept/pipeline|pipeline]] | workflow 表达推进；pipeline 表达转换。 |
```

这可以作为后续 signal 或 example 的判断材料，但不应作为 concept 标准章节保留。
