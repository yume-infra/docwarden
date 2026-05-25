---
kind: relation
---

# metadata-language

## Network

本 relation file 维护 [[mapping/bootstrap/modules/concept/metadata/kind|kind]] 与 [[mapping/bootstrap/modules/concept/metadata|metadata]] 之间的 metadata language 连接。

## `metadata-field-of`

From:

- [[mapping/bootstrap/modules/concept/metadata/kind|kind]]

To:

- [[mapping/bootstrap/modules/concept/metadata|metadata]]

Reading:

沿 `metadata-field-of` 读取时，kind 进入 metadata 的 content language field 位置。

kind 是 metadata field，但不是 metadata subtype tree。

本 relation file 不重复定义 kind；定义回到 kind concept module。

Read next:

- Definition: [[mapping/bootstrap/modules/concept/metadata#Definition|metadata#Definition]], [[mapping/bootstrap/modules/concept/metadata/kind#Definition|kind#Definition]]
- Constraint: [[mapping/bootstrap/modules/policy/kind-boundary|kind-boundary]]
- Boundary: [[mapping/bootstrap/modules/concept/metadata/kind#Delimitation|kind#Delimitation]]
