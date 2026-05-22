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

- [[mapping/bootstrap/modules/concept/pipeline|pipeline]]：input、transform、output 共同成立的转换结构。
- [[mapping/bootstrap/modules/concept/workflow|workflow]]：state、move、transition 共同成立的推进结构。
- [[mapping/bootstrap/modules/concept/architecture|architecture]]：layer、relation、boundary 共同成立的层级结构。
- [[mapping/bootstrap/modules/concept/branch|branch]]：condition、route、target 共同成立的分流结构。
- [[mapping/bootstrap/modules/concept/composition|composition]]：whole、part、stable semantic boundary 共同成立的组合结构。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/policy|policy]] | policy 表达约束强度；structure 表达组织方式。 |
| [[mapping/bootstrap/modules/concept/module|module]] | module 是 md file scope；structure 表达 module 内部或多个 module 之间的组织方式。 |
| list | list 是语言形式；structure 是语义单元共同成立的组织方式。 |

## Examples

### Scenario

用户要求 agent 区分 workflow、pipeline、architecture、branch、composition，并判断它们是否都属于 structure。

### Judgment Material

- pipeline: input、transform、output 共同成立。
- workflow: state、move、transition 共同成立。
- architecture: layer、relation、boundary 共同成立。
- branch: condition、route、target 共同成立。
- composition: whole、part、stable semantic boundary 共同成立。

### Positive

```md
这些都是 structure subtype。它们不是同一种结构，但都在表达多个语义位置如何在同一目的下共同成立。
```

这个 example 让 agent 看到 structure 的上位职责，而不是把 structure 缩成某一个 subtype。

### Negative

```text
example MUST 使用具体样本。
```

这是一条 policy assertion。它规定 example 的质量约束，不表达多个语义位置共同成立。

### Borderline

```text
docwarden / contexta
```

这只列出两个名字，还不是完整 structure。只有补足 relation 和 boundary，才构成 architecture；architecture 是 structure 的一种 subtype。
