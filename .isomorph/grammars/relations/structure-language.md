---
kind: relation
---

# structure-language

## Network

本 relation file 维护 [[primitives/concept/structure/pipeline|pipeline]]、[[primitives/concept/structure/workflow|workflow]]、[[primitives/concept/structure/architecture|architecture]]、[[primitives/concept/structure/branch|branch]]、[[primitives/concept/structure/composition|composition]] 与 [[primitives/concept/structure|structure]] 之间的 structure language 连接。

## `structure-language-of`

From:

- [[primitives/concept/structure/pipeline|pipeline]]
- [[primitives/concept/structure/workflow|workflow]]
- [[primitives/concept/structure/architecture|architecture]]
- [[primitives/concept/structure/branch|branch]]
- [[primitives/concept/structure/composition|composition]]

To:

- [[primitives/concept/structure|structure]]

Reading:

沿 `structure-language-of` 读取时，From 中的 concept 进入 [[primitives/concept/structure|structure]] 的 structure language 位置。

本 relation file 不重复定义这些 concept；定义回到各自 concept module。

Read next:

- Definition: [[primitives/concept/structure#Definition|structure#Definition]], [[primitives/concept/structure/pipeline#Definition|pipeline#Definition]], [[primitives/concept/structure/workflow#Definition|workflow#Definition]], [[primitives/concept/structure/architecture#Definition|architecture#Definition]], [[primitives/concept/structure/branch#Definition|branch#Definition]], [[primitives/concept/structure/composition#Definition|composition#Definition]]
- Constraint: [[primitives/concept/relation|relation]], [[grammars/policy/kind-boundary|kind-boundary]]
