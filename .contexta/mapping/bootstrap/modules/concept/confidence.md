---
kind: concept
---

# confidence

## Designation

Canonical: `confidence`

Aliases:

- lint confidence

Avoid:

- certainty
- truth

## Naming Need

contexta 需要一个名字表示 semantic-lint 对 signal 的识别强度。

这个名字用于区分“检测命中有多可靠”和“这个判断是否最终正确”。

## Definition

confidence 是 semantic-lint 对 signal 的识别强度标记。

confidence 来自 trigger evidence、magic word 来源和 locator 是否成立。

canonical magic word 命中通常提供较高 confidence。

alias 命中只能作为 fallback，confidence 低于 canonical。

avoid 命中提供 negative pressure，不等于同义命中。

带有 assertion locator 的 signal 比只有 module path / heading 上下文的 signal 更稳定。

confidence 不判断 assertion 是否正确，也不替代用户 review。
