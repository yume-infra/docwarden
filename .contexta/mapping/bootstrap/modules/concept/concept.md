---
kind: concept
---

# concept

## Designation

Canonical: `concept`

Aliases:

- semantic concept

## Naming Need

contexta 需要一个名字表示被稳定命名和界定的语义对象。

这个名字用于承接自然语言中的术语、别名和相邻概念差异，减少 agent 在同一词语上的理解偏移。

## Definition

命名与定义单元，用于稳定一个语义对象在 contexta 中的名称、命名理由和正面定义。

concept 的 `Canonical` 是 semantic-lint 可直接消费的 primary magic word。

concept 的 `Aliases` 只是 fallback token，不能替代 canonical 的判断强度。

primary magic word 和 fallback token 的消费角色由 [[mapping/bootstrap/modules/concept/magic-word|magic-word]] 维护。
