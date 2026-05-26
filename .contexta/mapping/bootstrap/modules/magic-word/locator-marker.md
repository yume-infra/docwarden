---
kind: magic-word
---

# locator-marker

## Consumer

- [[mapping/bootstrap/modules/concept/locator|locator]]
- [[mapping/bootstrap/modules/concept/assertion|assertion]]
- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]
- [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]]

## Source

- [[mapping/bootstrap/modules/concept/locator|locator]]
- [[mapping/bootstrap/modules/policy/link-resolution|link-resolution]]
- [[mapping/bootstrap/modules/policy/semantic-lint-boundary|semantic-lint-boundary]]

## Token Role

locator marker 是 address token，不是 semantic classifier。

本 registry 只记录 locator marker 作为 semantic-lint 可消费 token role。

locator marker 的地址语义由 [[mapping/bootstrap/modules/concept/locator|locator]] 定义。

## `^<prefix>-<number>`

locator marker form，用于让 locator 指向具体 assertion。

`prefix` 由 locator instance 提供，例如 `def` 或 `rule`。

`number` 是同一 module 的同一 prefix 内的 stable id，用于区分 locator target。

RFC2119 magic word 可以识别 rule assertion 和规则强度；locator marker 只提供稳定地址。
