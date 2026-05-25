---
kind: concept
---

# locator

## Designation

Canonical: `locator`

Aliases:

- semantic locator

## Naming Need

contexta 需要一个名字表示让 assertion 可以被稳定定位的机制。

这个名字用于让 semantic-lint、review、trace 和未来 CLI 能把判断指回具体可审查的 assertion，而不是只指向整篇 module 或某个 heading。

## Definition

locator 是服务 assertion 审核的定位机制。 ^a-def

locator 通过 assertion marker 让需要被审核、引用、迁移或 lint 命中的 assertion 可以被稳定找到。

module path、heading 和 relation block heading 可以提供定位上下文，但不是 locator 的核心定义。

locator 只负责让 assertion 可定位，不判断 assertion 是否正确。
