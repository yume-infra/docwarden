---
kind: concept
---

# locator

## Designation

Canonical: `locator`

Aliases:

- semantic locator

## Naming Need

isomorph 需要一个名字表示让 assertion 可以被稳定定位的机制。

这个名字用于让 semantic-lint、review、trace 和未来 CLI 能把判断指回具体可审查的 assertion，而不是只指向整篇 module 或某个 heading。

## Definition

locator 是让 stable assertion 可以被长期回指的定位机制。 ^def-1

locator 通过 locator marker 让需要被审核、引用、迁移或 lint 命中的 assertion 可以被稳定找到。

locator marker 是 address token，不是 semantic classifier。

locator marker 使用 `^<prefix>-<number>` 形式。

prefix 来自具体 locator instance，例如 `def` 或 `rule`。

prefix 只命名定位前缀，不判断 assertion 的语义类型、规则强度或正确性。

具体 locator instance 放在 `.isomorph/grammars/modules/locator/`，并使用 `kind: locator`。

number 是同一 module 的同一 prefix 内的 stable id，用于区分 locator target。

number 不表示重要性、置信度、正确性或当前正文排序。

stable 后的 locator marker 不因正文插入、删除或重排自动 renumber。

已删除 locator target 的 number 不复用。

module path、heading 和 relation block heading 可以提供定位上下文，但不是 locator 的核心定义。

locator 只负责让 assertion 可定位，不判断 assertion 是否正确。
