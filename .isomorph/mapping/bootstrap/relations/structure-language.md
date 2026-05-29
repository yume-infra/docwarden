---
kind: relation
---

# structure-language

## Network

本 relation file 维护 [[mapping/bootstrap/modules/concept/structure/pipeline|pipeline]]、[[mapping/bootstrap/modules/concept/structure/workflow|workflow]]、[[mapping/bootstrap/modules/concept/structure/architecture|architecture]]、[[mapping/bootstrap/modules/concept/structure/branch|branch]]、[[mapping/bootstrap/modules/concept/structure/composition|composition]] 与 [[mapping/bootstrap/modules/concept/structure|structure]] 之间的 structure language 连接。

## `structure-language-of`

From:

- [[mapping/bootstrap/modules/concept/structure/pipeline|pipeline]]
- [[mapping/bootstrap/modules/concept/structure/workflow|workflow]]
- [[mapping/bootstrap/modules/concept/structure/architecture|architecture]]
- [[mapping/bootstrap/modules/concept/structure/branch|branch]]
- [[mapping/bootstrap/modules/concept/structure/composition|composition]]

To:

- [[mapping/bootstrap/modules/concept/structure|structure]]

Reading:

沿 `structure-language-of` 读取时，From 中的 concept 进入 [[mapping/bootstrap/modules/concept/structure|structure]] 的 structure language 位置。

本 relation file 不重复定义这些 concept；定义回到各自 concept module。

Read next:

- Definition: [[mapping/bootstrap/modules/concept/structure#Definition|structure#Definition]], [[mapping/bootstrap/modules/concept/structure/pipeline#Definition|pipeline#Definition]], [[mapping/bootstrap/modules/concept/structure/workflow#Definition|workflow#Definition]], [[mapping/bootstrap/modules/concept/structure/architecture#Definition|architecture#Definition]], [[mapping/bootstrap/modules/concept/structure/branch#Definition|branch#Definition]], [[mapping/bootstrap/modules/concept/structure/composition#Definition|composition#Definition]]
- Constraint: [[mapping/bootstrap/modules/concept/relation|relation]], [[mapping/bootstrap/modules/policy/kind-boundary|kind-boundary]]
