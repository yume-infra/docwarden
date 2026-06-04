---
kind: concept
---

# structure

## Designation

Canonical: `structure`

## Naming Need

isomorph 需要一个名字表示多个语义单元在同一个目的下如何共同成立。

这个名字用于避免把转换、推进、层级关系或条件分流问题误写成单个 concept 定义、policy 约束、template 骨架或 example 样本。

## Definition

组织语言，用于表达多个语义位置如何在同一目的下共同成立。

structure 的核心不是列出多个对象，而是说明这些位置之间的成立关系。

当前已验证的 structure subtype 是：

- [[primitives/concept/structure/pipeline|pipeline]]：input、transform、output 共同成立的转换结构。
- [[primitives/concept/structure/workflow|workflow]]：state、move、transition 共同成立的推进结构。
- [[primitives/concept/structure/architecture|architecture]]：layer、relation、boundary 共同成立的层级结构。
- [[primitives/concept/structure/branch|branch]]：condition、route、target 共同成立的分流结构。
- [[primitives/concept/structure/composition|composition]]：whole、part、stable semantic boundary 共同成立的组合结构。

具体 structure instance 放在 `basis/grammars/structures/` 下，并按 subtype 分层。

structure instance 负责表达组织关系，不负责替代被引用 concept 的定义。
