---
kind: relation
---

# structure-language

## Network

本 relation file 维护 [[pipeline]]、[[workflow]]、[[architecture]]、[[branch]]、[[composition]] 与 [[structure]] 之间的 structure language 连接。

## `structure-language-of`

From:

- [[pipeline]]
- [[workflow]]
- [[architecture]]
- [[branch]]
- [[composition]]

To:

- [[structure]]

Reading:

沿 `structure-language-of` 读取时，From 中的 concept 进入 [[structure]] 的 structure language 位置。

本 relation file 不重复定义这些 concept；定义回到各自 concept module。

Read next:

- Definition: [[structure#Definition]], [[pipeline#Definition]], [[workflow#Definition]], [[architecture#Definition]], [[branch#Definition]], [[composition#Definition]]
- Constraint: [[relation]], [[kind-boundary]]
- Boundary: [[pipeline#Delimitation]], [[workflow#Delimitation]], [[architecture#Delimitation]], [[branch#Delimitation]], [[composition#Delimitation]]
