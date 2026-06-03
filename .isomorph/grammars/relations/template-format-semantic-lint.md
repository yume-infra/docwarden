---
kind: relation
---

# template-format-semantic-lint

## Network

本 relation file 维护 [[primitives/modules/concept/template|template]]、[[primitives/modules/concept/format|format]]、[[primitives/modules/concept/semantic-lint|semantic-lint]]、[[primitives/modules/concept/module|module]] 与 [[primitives/modules/concept/signal|signal]] 之间的生成、保持和检测连接。

## `initializes`

From:

- [[primitives/modules/concept/template|template]]

To:

- [[primitives/modules/concept/module|module]]

Reading:

沿 `initializes` 读取时，template 只负责 0->1 的初始 module 骨架。

`0->1` 在这里按 [[grammars/modules/magic-word/transition|transition]] registry 读取，不作为独立 phase concept。

## `preserves`

From:

- [[primitives/modules/concept/format|format]]

To:

- [[primitives/modules/concept/module|module]]

Reading:

沿 `preserves` 读取时，format 只负责 1->2 时保持 md 可消费形态。

`1->2` 在这里按 [[grammars/modules/magic-word/transition|transition]] registry 读取，不作为独立 phase concept。

## `consumes`

From:

- [[primitives/modules/concept/semantic-lint|semantic-lint]]

To:

- [[primitives/modules/concept/format|format]]

Reading:

沿 `consumes` 读取时，semantic-lint 直接消费 formatted md。

## `emits`

From:

- [[primitives/modules/concept/semantic-lint|semantic-lint]]

To:

- [[primitives/modules/concept/signal|signal]]

Reading:

沿 `emits` 读取时，semantic-lint 的结果包含 signal，并应尽可能把 signal 命中组织成 review-ready lint result。

review-ready lint result 不是 review judgment。它只是尽量贴近 review surface 的 `lead + backing`，让 docwarden review surface 可以在足够清晰时走短路径。

Read next:

- Definition: [[primitives/modules/concept/template#Definition|template#Definition]], [[primitives/modules/concept/format#Definition|format#Definition]], [[primitives/modules/concept/semantic-lint#Definition|semantic-lint#Definition]], [[primitives/modules/concept/module#Definition|module#Definition]], [[primitives/modules/concept/signal#Definition|signal#Definition]], [[primitives/modules/concept/magic-word#Definition|magic-word#Definition]]
- Magic words: [[grammars/modules/magic-word/transition|transition]]
- Pipeline: [[grammars/structures/pipeline/semantic-lint|semantic-lint pipeline]]
- Constraint: [[grammars/modules/policy/template-boundary|template-boundary]], [[grammars/modules/policy/semantic-lint-boundary|semantic-lint-boundary]]
