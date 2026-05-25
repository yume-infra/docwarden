---
kind: relation
---

# template-format-semantic-lint

## Network

本 relation file 维护 [[mapping/bootstrap/modules/concept/template|template]]、[[mapping/bootstrap/modules/concept/format|format]]、[[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]、[[mapping/bootstrap/modules/concept/module|module]] 与 [[mapping/bootstrap/modules/concept/signal|signal]] 之间的生成、保持和检测连接。

## `initializes`

From:

- [[mapping/bootstrap/modules/concept/template|template]]

To:

- [[mapping/bootstrap/modules/concept/module|module]]

Reading:

沿 `initializes` 读取时，template 只负责 0->1 的初始 module 骨架。

`0->1` 在这里按 [[mapping/bootstrap/modules/magic-word/transition|transition]] registry 读取，不作为独立 phase concept。

## `preserves`

From:

- [[mapping/bootstrap/modules/concept/format|format]]

To:

- [[mapping/bootstrap/modules/concept/module|module]]

Reading:

沿 `preserves` 读取时，format 只负责 1->2 时保持 md 可消费形态。

`1->2` 在这里按 [[mapping/bootstrap/modules/magic-word/transition|transition]] registry 读取，不作为独立 phase concept。

## `consumes`

From:

- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]

To:

- [[mapping/bootstrap/modules/concept/format|format]]

Reading:

沿 `consumes` 读取时，semantic-lint 直接消费 formatted md。

## `emits`

From:

- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]

To:

- [[mapping/bootstrap/modules/concept/signal|signal]]

Reading:

沿 `emits` 读取时，semantic-lint 的结果是 signal，不是 review judgment。

Read next:

- Definition: [[mapping/bootstrap/modules/concept/template#Definition|template#Definition]], [[mapping/bootstrap/modules/concept/format#Definition|format#Definition]], [[mapping/bootstrap/modules/concept/semantic-lint#Definition|semantic-lint#Definition]], [[mapping/bootstrap/modules/concept/module#Definition|module#Definition]], [[mapping/bootstrap/modules/concept/signal#Definition|signal#Definition]], [[mapping/bootstrap/modules/concept/magic-word#Definition|magic-word#Definition]]
- Magic words: [[mapping/bootstrap/modules/magic-word/transition|transition]]
- Pipeline: [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]]
- Constraint: [[mapping/bootstrap/modules/policy/template-boundary|template-boundary]], [[mapping/bootstrap/modules/policy/semantic-lint-boundary|semantic-lint-boundary]]
