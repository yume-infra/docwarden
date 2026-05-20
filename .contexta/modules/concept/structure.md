---
kind: concept
---

# structure

## Designation

Canonical: `structure`

## Naming Need

contexta 需要一个名字表示多个语义单元在同一个目的下如何共同成立。

这个名字用于避免把转换、推进、层级关系或条件分流问题误写成单个 concept 定义、policy 约束、template 骨架或 example 样本。

## Definition

组织语言，用于表达多个语义位置如何在同一目的下共同成立。

structure 的核心不是列出多个对象，而是说明这些位置之间的成立关系。

当前已验证的 structure subtype 是：

- [[pipeline]]：input、transform、output 共同成立的转换结构。
- [[workflow]]：state、move、transition 共同成立的推进结构。
- [[architecture]]：layer、relation、boundary 共同成立的层级结构。
- [[branch]]：condition、route、target 共同成立的分流结构。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[concept]] | concept 稳定名字和含义；structure 表达多个已命名或可识别语义单元如何共同成立。 |
| [[policy]] | policy 表达约束强度；structure 表达组织方式。 |
| [[template]] | template 提供复制骨架；structure 是骨架中可能承载的组织语义。 |
| [[example]] | example 提供样本；structure 不在当前版本承接 sample set 或 contrast set。 |
| [[module]] | module 是语义组合单位；structure 表达 module 内部或多个 module 之间的组织方式。 |
| list | list 是语言形式；structure 是语义单元共同成立的组织方式。 |
| [[pipeline]] | pipeline 是转换结构；structure 是 pipeline、workflow、architecture、branch 的上位组织语言。 |
| [[workflow]] | workflow 是推进结构；structure 不承接 docwarden 操作生命周期。 |
| [[architecture]] | architecture 是层级结构；structure 不等于 architecture。 |
| [[branch]] | branch 是分流结构；structure 不等于分支表或 routing table。 |

## Concept Relations

- [[concept]]：structure 本身由 concept module 定义和命名。
- [[policy]]：policy 可以约束 structure 的使用方式，但不定义 structure 本体。
- [[template]]：template 可以提供 structure module 的复制骨架。
- [[example]]：example 与 structure 的关系后续重新讨论，当前不把 sample set 或 contrast set 纳入 structure。
- [[module]]：structure module 可以承载具体结构内容。
- [[assertion]]：structure 的位置、作用和边界说明可以由 assertion 表达。
- [[naming]]：structure 的名称应表达它组织的语义整体或组织方式。
- [[pipeline]]：pipeline 是当前已验证的 structure subtype。
- [[workflow]]：workflow 是当前已验证的 structure subtype。
- [[architecture]]：architecture 是当前已验证的 structure subtype。
- [[branch]]：branch 是当前已验证的 structure subtype。

## Examples

### Positive

```text
input: material + current agent context
transform: review surface generation
output: lead + backing
```

这个表达说明了 input、transform、output 三个位置如何共同成立，因此是 structure，具体 subtype 是 pipeline。

### Negative

```text
example MUST 包含具体 sample。
```

这是一条 policy assertion。它规定 example 的质量约束，不是 structure 本体。

### Borderline

```text
docwarden / contexta
```

这个表达只列出两个名字，还不是完整 structure。只有补足它们之间的 relation 和 boundary，才构成 architecture；architecture 是 structure 的一种 subtype。
