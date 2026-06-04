---
kind: relation
---

# template-format-semantic-lint

## Network

本 relation file 维护 [[language/primitive/concept/template|template]]、[[language/primitive/concept/format|format]]、[[language/semantic-lint/concept/semantic-lint|semantic-lint]]、[[language/primitive/concept/module|module]] 与 [[language/semantic-lint/concept/signal|signal]] 之间的生成、保持和检测连接。

## `initializes`

From:

- [[language/primitive/concept/template|template]]

To:

- [[language/primitive/concept/module|module]]

Reading:

沿 `initializes` 读取时，template 只负责 0->1 的初始 module 骨架。

`0->1` 在这里按 [[language/recognition/magic-word/transition|transition]] registry 读取，不作为独立 phase concept。

## `preserves`

From:

- [[language/primitive/concept/format|format]]

To:

- [[language/primitive/concept/module|module]]

Reading:

沿 `preserves` 读取时，format 只负责 1->2 时保持 md 可消费形态。

`1->2` 在这里按 [[language/recognition/magic-word/transition|transition]] registry 读取，不作为独立 phase concept。

## `consumes`

From:

- [[language/semantic-lint/concept/semantic-lint|semantic-lint]]

To:

- [[language/primitive/concept/format|format]]

Reading:

沿 `consumes` 读取时，semantic-lint 直接消费 formatted md。

## `emits`

From:

- [[language/semantic-lint/concept/semantic-lint|semantic-lint]]

To:

- [[language/semantic-lint/concept/signal|signal]]

Reading:

沿 `emits` 读取时，semantic-lint 的结果包含 signal，并应尽可能把 signal 命中组织成 review-ready lint result。

review-ready lint result 不是 review judgment。它只是尽量贴近 [[loop/lead-review/concept|lead-review]] 的 `lead + backing`，让 docwarden review surface 可以在足够清晰时走短路径。

Read next:

- Definition: [[language/primitive/concept/template#Definition|template#Definition]], [[language/primitive/concept/format#Definition|format#Definition]], [[language/semantic-lint/concept/semantic-lint#Definition|semantic-lint#Definition]], [[language/primitive/concept/module#Definition|module#Definition]], [[language/semantic-lint/concept/signal#Definition|signal#Definition]], [[language/recognition/concept/magic-word#Definition|magic-word#Definition]], [[loop/lead-review/concept#Definition|lead-review#Definition]]
- Magic words: [[language/recognition/magic-word/transition|transition]]
- Pipeline: [[language/semantic-lint/pipeline/semantic-lint|semantic-lint pipeline]]
- Constraint: [[language/grammar/policy/template-boundary|template-boundary]], [[language/grammar/policy/semantic-lint-boundary|semantic-lint-boundary]], [[loop/lead-review/policy/boundary|lead-review-boundary]]
