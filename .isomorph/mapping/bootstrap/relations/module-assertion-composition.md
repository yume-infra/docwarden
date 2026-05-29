---
kind: relation
---

# module-assertion-composition

## Network

本 relation file 维护 [[mapping/bootstrap/modules/concept/module|module]]、[[mapping/bootstrap/modules/concept/assertion|assertion]]、[[mapping/bootstrap/modules/concept/structure/composition|composition]] 与 [[mapping/bootstrap/structures/composition/module-assertion|module-assertion composition]] 之间的 part-whole structure 连接。

## `part-of`

From:

- [[mapping/bootstrap/modules/concept/assertion|assertion]]

To:

- [[mapping/bootstrap/modules/concept/module|module]]
- [[mapping/bootstrap/structures/composition/module-assertion|module-assertion composition]]

Reading:

沿 `part-of` 读取时，assertion 是 module 内部的 part。

assertion 的 semantic commitment 归属于所在 module scope。

assertion 的可审查性不要求 assertion 独立成文件。

## `whole-of`

From:

- [[mapping/bootstrap/modules/concept/module|module]]

To:

- [[mapping/bootstrap/modules/concept/assertion|assertion]]
- [[mapping/bootstrap/structures/composition/module-assertion|module-assertion composition]]

Reading:

沿 `whole-of` 读取时，module 是 assertion 的 whole，提供 assertion 的上下文和归属范围。

module 对内部 assertion 承担 ownership，但不保证 assertion 已经正确。

module 进入 accepted 或 promoted scope 后，内部 assertion 成为当前稳定口径；这不是 assertion 自身的 correctness marker。

module 的成立来自 md file scope，不来自 composition。

## `realized-as`

From:

- [[mapping/bootstrap/structures/composition/module-assertion|module-assertion composition]]

To:

- [[mapping/bootstrap/modules/concept/structure/composition|composition]]

Reading:

沿 `realized-as` 读取时，module-assertion 是 composition structure 的当前实例。

这不把 module 或 assertion concept 改写为 `kind: composition`。

Read next:

- Definition: [[mapping/bootstrap/modules/concept/module#Definition|module#Definition]], [[mapping/bootstrap/modules/concept/assertion#Definition|assertion#Definition]], [[mapping/bootstrap/modules/concept/assertion#Qualification|assertion#Qualification]], [[mapping/bootstrap/modules/concept/structure/composition#Definition|composition#Definition]]
- Instance: [[mapping/bootstrap/structures/composition/module-assertion|module-assertion composition]]
- Constraint: [[mapping/bootstrap/modules/policy/semantic-granularity|semantic-granularity]]
- Signal: [[mapping/bootstrap/modules/signal/composition-as-list|composition-as-list]]
