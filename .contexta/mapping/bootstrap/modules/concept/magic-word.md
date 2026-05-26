---
kind: concept
---

# magic-word

## Designation

Canonical: `magic-word`

Aliases:

- control token

Avoid:

- glossary
- keyword

## Naming Need

contexta 需要一个名字表示 formatted md 中可被 semantic-lint 直接消费的 token role。

这个名字用于避免把 naming、kind、signal、policy modal 和 address token 的消费规则塞回各自 concept，导致单个 md module 承担过多职责。

## Definition

magic-word 是 formatted md 中由 contexta 稳定、能影响 semantic-lint 读取、判断或 confidence 的 token role。 ^def-1

concept `Canonical` 是 primary magic word。

`Aliases` 是 fallback token，置信度低于 canonical。

`Avoid` 是 negative token，不是 alias，也不是 magic word。

section heading、frontmatter field、confirmed `kind` value、semantic-lint signal id、constraint strength marker 和 transition marker 是各自机制中的 magic-word token role。

locator marker 是 address token。它可以作为 semantic-lint 可消费 token role 被记录，但它的地址语义由 locator 定义，不由 magic-word 判断。

具体 magic-word token role 由 `kind: magic-word` registry module 维护。

magic-word 不创建新的语义对象。它只定义已有命名和控制词在 semantic-lint 消费中的 token 角色。
