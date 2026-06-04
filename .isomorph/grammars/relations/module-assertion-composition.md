---
kind: relation
---

# module-assertion-composition

## Network

本 relation file 维护 [[primitives/concept/module|module]]、[[primitives/concept/assertion|assertion]]、[[primitives/concept/structure/composition|composition]] 与 [[grammars/structures/composition/module-assertion|module-assertion composition]] 之间的 part-whole structure 连接。

## `part-of`

From:

- [[primitives/concept/assertion|assertion]]

To:

- [[primitives/concept/module|module]]
- [[grammars/structures/composition/module-assertion|module-assertion composition]]

Reading:

沿 `part-of` 读取时，assertion 是 module 内部的 part。

assertion 的 semantic commitment 归属于所在 module scope。

assertion 的可审查性不要求 assertion 独立成文件。

## `whole-of`

From:

- [[primitives/concept/module|module]]

To:

- [[primitives/concept/assertion|assertion]]
- [[grammars/structures/composition/module-assertion|module-assertion composition]]

Reading:

沿 `whole-of` 读取时，module 是 assertion 的 whole，提供 assertion 的上下文和归属范围。

module 对内部 assertion 承担 ownership，但不保证 assertion 已经正确。

module 进入 accepted 或 promoted scope 后，内部 assertion 成为当前稳定口径；这不是 assertion 自身的 correctness marker。

module 的成立来自 md file scope，不来自 composition。

## `realized-as`

From:

- [[grammars/structures/composition/module-assertion|module-assertion composition]]

To:

- [[primitives/concept/structure/composition|composition]]

Reading:

沿 `realized-as` 读取时，module-assertion 是 composition structure 的当前实例。

这不把 module 或 assertion concept 改写为 `kind: composition`。

Read next:

- Definition: [[primitives/concept/module#Definition|module#Definition]], [[primitives/concept/assertion#Definition|assertion#Definition]], [[primitives/concept/assertion#Qualification|assertion#Qualification]], [[primitives/concept/structure/composition#Definition|composition#Definition]]
- Instance: [[grammars/structures/composition/module-assertion|module-assertion composition]]
- Constraint: [[grammars/policy/semantic-granularity|semantic-granularity]]
- Signal: [[lint/signal/composition-as-list|composition-as-list]]
