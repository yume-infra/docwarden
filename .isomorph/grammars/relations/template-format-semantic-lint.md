---
kind: relation
---

# template-format-semantic-lint

## Network

本 relation file 维护 [[primitives/concept/template|template]]、[[primitives/concept/format|format]]、[[primitives/concept/semantic-lint|semantic-lint]]、[[primitives/concept/module|module]] 与 [[primitives/concept/signal|signal]] 之间的生成、保持和检测连接。

## `initializes`

From:

- [[primitives/concept/template|template]]

To:

- [[primitives/concept/module|module]]

Reading:

沿 `initializes` 读取时，template 只负责 0->1 的初始 module 骨架。

`0->1` 在这里按 [[grammars/magic-word/transition|transition]] registry 读取，不作为独立 phase concept。

## `preserves`

From:

- [[primitives/concept/format|format]]

To:

- [[primitives/concept/module|module]]

Reading:

沿 `preserves` 读取时，format 只负责 1->2 时保持 md 可消费形态。

`1->2` 在这里按 [[grammars/magic-word/transition|transition]] registry 读取，不作为独立 phase concept。

## `consumes`

From:

- [[primitives/concept/semantic-lint|semantic-lint]]

To:

- [[primitives/concept/format|format]]

Reading:

沿 `consumes` 读取时，semantic-lint 直接消费 formatted md。

## `emits`

From:

- [[primitives/concept/semantic-lint|semantic-lint]]

To:

- [[primitives/concept/signal|signal]]

Reading:

沿 `emits` 读取时，semantic-lint 的结果包含 signal，并应尽可能把 signal 命中组织成 review-ready lint result。

review-ready lint result 不是 review judgment。它只是尽量贴近 review surface 的 `lead + backing`，让 docwarden review surface 可以在足够清晰时走短路径。

Read next:

- Definition: [[primitives/concept/template#Definition|template#Definition]], [[primitives/concept/format#Definition|format#Definition]], [[primitives/concept/semantic-lint#Definition|semantic-lint#Definition]], [[primitives/concept/module#Definition|module#Definition]], [[primitives/concept/signal#Definition|signal#Definition]], [[primitives/concept/magic-word#Definition|magic-word#Definition]]
- Magic words: [[grammars/magic-word/transition|transition]]
- Pipeline: [[grammars/structures/pipeline/semantic-lint|semantic-lint pipeline]]
- Constraint: [[grammars/policy/template-boundary|template-boundary]], [[grammars/policy/semantic-lint-boundary|semantic-lint-boundary]]
