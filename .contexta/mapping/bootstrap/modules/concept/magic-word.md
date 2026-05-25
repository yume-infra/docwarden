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

contexta 需要一个名字表示 formatted md 中可被 semantic-lint 直接消费的控制性 token 或短表达。

这个名字用于避免把 naming、kind、signal、policy modal 和 locator marker 的消费规则塞回各自 concept，导致单个 md module 承担过多职责。

## Definition

magic-word 是 formatted md 中由 contexta 稳定、能影响读取方式、判断方式或定位方式的控制性 token 或短表达。 ^a-def

concept `Canonical` 是 primary magic word。

`Aliases` 是 fallback token，置信度低于 canonical。

`Avoid` 是 negative token，不是 alias，也不是 magic word。

confirmed `kind` value、semantic-lint signal id、policy modal operator、locator marker prefix 和 transition marker 是各自机制中的 control magic words。

具体 magic-word family 由 `kind: magic-word` registry module 维护。

magic-word 不创建新的语义对象。它只定义已有命名和控制词在 semantic-lint 消费中的 token 角色。
