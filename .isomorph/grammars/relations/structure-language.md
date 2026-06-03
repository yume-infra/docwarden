---
kind: relation
---

# structure-language

## Network

本 relation file 维护 [[primitives/modules/concept/structure/pipeline|pipeline]]、[[primitives/modules/concept/structure/workflow|workflow]]、[[primitives/modules/concept/structure/architecture|architecture]]、[[primitives/modules/concept/structure/branch|branch]]、[[primitives/modules/concept/structure/composition|composition]] 与 [[primitives/modules/concept/structure|structure]] 之间的 structure language 连接。

## `structure-language-of`

From:

- [[primitives/modules/concept/structure/pipeline|pipeline]]
- [[primitives/modules/concept/structure/workflow|workflow]]
- [[primitives/modules/concept/structure/architecture|architecture]]
- [[primitives/modules/concept/structure/branch|branch]]
- [[primitives/modules/concept/structure/composition|composition]]

To:

- [[primitives/modules/concept/structure|structure]]

Reading:

沿 `structure-language-of` 读取时，From 中的 concept 进入 [[primitives/modules/concept/structure|structure]] 的 structure language 位置。

本 relation file 不重复定义这些 concept；定义回到各自 concept module。

Read next:

- Definition: [[primitives/modules/concept/structure#Definition|structure#Definition]], [[primitives/modules/concept/structure/pipeline#Definition|pipeline#Definition]], [[primitives/modules/concept/structure/workflow#Definition|workflow#Definition]], [[primitives/modules/concept/structure/architecture#Definition|architecture#Definition]], [[primitives/modules/concept/structure/branch#Definition|branch#Definition]], [[primitives/modules/concept/structure/composition#Definition|composition#Definition]]
- Constraint: [[primitives/modules/concept/relation|relation]], [[grammars/modules/policy/kind-boundary|kind-boundary]]
