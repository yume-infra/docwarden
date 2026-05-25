---
kind: concept
---

# assertion

## Designation

Canonical: `assertion`

Aliases:

- semantic assertion
- semantic unit

## Naming Need

contexta 需要一个名字表示 module 内部可以被单独审查的最小语义单位。

这个名字用于避免审查只能停留在整篇 md、整段解释或整个 module 上，也避免把 assertion 误写成文件、独立资产或完整 locator 机制。

## Definition

assertion 是 module 内部的最小可审查语义单元。

它表达一条可以被接受、拒绝、修改、引用、检查或迁移的语义判断。

assertion 的核心不是句子长度、列表形态或标题层级，而是语义是否能被单独审查。

assertion 需要保留后续成为 locator target 的能力，但当前不等于 locator mechanism。
