---
kind: concept
---

# assertion

## Designation

Canonical: `assertion`

Aliases:

- semantic commitment
- semantic assertion

Avoid:

- promise

## Naming Need

contexta 需要一个名字表示 module 内部可以被单独审查的最小语义承诺。

这个名字用于避免审查只能停留在整篇 md、整段解释或整个 module 上，也避免把 assertion 误写成文件、独立资产、已验证事实、行为 promise 或完整 locator 机制。

## Definition

assertion 是 module 内部的最小可审查 semantic commitment。 ^def-1

assertion 表示 module 对某个对象作出一条可以被 review 和 semantic-lint 判断的语义承诺。

assertion 不表示内容已经正确。错误、越界、重复或模糊的承诺仍然可以成为 assertion，因为它们正是 review 和 semantic-lint 要处理的对象。 ^def-2

assertion 本身不保存 correctness marker。

review 通过后，系统不把 assertion 改写为 correct assertion；而是通过 promote 或 accepted scope 表示该 assertion 已成为当前稳定口径。

accepted 表示当前系统可依赖、可引用、可作为 semantic-lint 依据；不表示绝对正确。

assertion 的核心不是句子长度、列表形态或标题层级，而是语义是否能被单独审查。

assertion 应尽量原子：一个 assertion 只承担一个可以被单独接受、拒绝、修改、引用、检查或迁移的语义承诺。

没有 locator marker 的内容仍可能是 assertion。locator marker 和 locator 只提高 assertion 被稳定定位、引用、迁移或进入 review-ready lint result 的能力。 ^def-3

## Qualification

一段 md 内容可以成为 assertion，当它同时满足：

- Object：指向某个被说明对象。
- Commitment：让当前 module 承担一个语义承诺。
- Reviewability：该承诺可以被单独 review。
- Module Ownership：该承诺归属于当前 module scope。

## Carrier

assertion 可以由 section、paragraph、list item、table row、frontmatter field 等 md surface 承载。

heading、transition text、link 或 format 通常不是 assertion 本身，但可以提供读取上下文、承载位置或辅助定位。
