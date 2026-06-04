---
kind: magic-word
---

# locator-marker

## Consumer

- [[language/recognition/concept/locator|locator]]
- [[language/primitive/concept/assertion|assertion]]
- [[language/semantic-lint/concept/semantic-lint|semantic-lint]]
- [[language/semantic-lint/pipeline/semantic-lint|semantic-lint pipeline]]

## Source

- [[language/recognition/concept/locator|locator]]
- [[language/grammar/policy/link-resolution|link-resolution]]
- [[language/grammar/policy/semantic-lint-boundary|semantic-lint-boundary]]

## Token Role

locator marker 是 address token，不是 semantic classifier。

本 registry 只记录 locator marker 作为 semantic-lint 可消费 token role。

locator marker 的地址语义由 [[language/recognition/concept/locator|locator]] 定义。

## `^<prefix>-<number>`

locator marker form，用于让 locator 指向具体 assertion。

`prefix` 由 locator instance 提供，例如 `def` 或 `rule`。

`number` 是同一 module 的同一 prefix 内的 stable id，用于区分 locator target。

RFC2119 magic word 可以识别 rule assertion 和规则强度；locator marker 只提供稳定地址。
