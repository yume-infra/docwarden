---
kind: relation
---

# structure-language

## Network

本 relation file 维护 [[language/structure/concept/pipeline|pipeline]]、[[language/structure/concept/workflow|workflow]]、[[language/structure/concept/architecture|architecture]]、[[language/structure/concept/branch|branch]]、[[language/structure/concept/composition|composition]] 与 [[language/structure/concept/structure|structure]] 之间的 structure language 连接。

## `structure-language-of`

From:

- [[language/structure/concept/pipeline|pipeline]]
- [[language/structure/concept/workflow|workflow]]
- [[language/structure/concept/architecture|architecture]]
- [[language/structure/concept/branch|branch]]
- [[language/structure/concept/composition|composition]]

To:

- [[language/structure/concept/structure|structure]]

Reading:

沿 `structure-language-of` 读取时，From 中的 concept 进入 [[language/structure/concept/structure|structure]] 的 structure language 位置。

本 relation file 不重复定义这些 concept；定义回到各自 concept module。

Read next:

- Definition: [[language/structure/concept/structure#Definition|structure#Definition]], [[language/structure/concept/pipeline#Definition|pipeline#Definition]], [[language/structure/concept/workflow#Definition|workflow#Definition]], [[language/structure/concept/architecture#Definition|architecture#Definition]], [[language/structure/concept/branch#Definition|branch#Definition]], [[language/structure/concept/composition#Definition|composition#Definition]]
- Constraint: [[language/primitive/concept/relation|relation]], [[language/grammar/policy/kind-boundary|kind-boundary]]
