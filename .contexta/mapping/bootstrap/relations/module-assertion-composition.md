---
kind: relation
---

# module-assertion-composition

## Network

本 relation file 维护 [[mapping/bootstrap/modules/concept/module|module]]、[[mapping/bootstrap/modules/concept/assertion|assertion]] 与 [[mapping/bootstrap/modules/concept/structure/composition|composition]] 之间的 part-whole structure 连接。

## `part-of`

From:

- [[mapping/bootstrap/modules/concept/assertion|assertion]]

To:

- [[mapping/bootstrap/modules/concept/module|module]]

Reading:

沿 `part-of` 读取时，assertion 是 module 内部的 part。

assertion 的可审查性不要求 assertion 独立成文件。

## `whole-of`

From:

- [[mapping/bootstrap/modules/concept/module|module]]

To:

- [[mapping/bootstrap/modules/concept/assertion|assertion]]

Reading:

沿 `whole-of` 读取时，module 是 assertion 的 whole，提供 assertion 的上下文和归属范围。

module 的成立来自 md file scope，不来自 composition。

## `realized-as`

From:

- [[mapping/bootstrap/modules/concept/module|module]]
- [[mapping/bootstrap/modules/concept/assertion|assertion]]

To:

- [[mapping/bootstrap/modules/concept/structure/composition|composition]]

Reading:

沿 `realized-as` 读取时，module / assertion 的关系是 composition structure 的当前实现。

这不把 module 或 assertion 改写为 `kind: composition`。

Read next:

- Definition: [[mapping/bootstrap/modules/concept/module#Definition|module#Definition]], [[mapping/bootstrap/modules/concept/assertion#Definition|assertion#Definition]], [[mapping/bootstrap/modules/concept/structure/composition#Definition|composition#Definition]]
- Constraint: [[mapping/bootstrap/modules/policy/semantic-granularity|semantic-granularity]]
- Signal: [[mapping/bootstrap/modules/signal/composition-as-list|composition-as-list]]
