---
kind: concept
---

# trigger

## Designation

Canonical: `trigger`

Aliases:

- lint trigger

## Naming Need

contexta 需要一个名字表示 semantic-lint 中可观察、可脚本化的触发条件。

这个名字用于避免把人工语义判断写成未来 CLI 无法实现的检测规则。

## Definition

trigger 是 semantic-lint 中可观察的触发条件。

trigger 直接检查 formatted md 中的文本、结构、frontmatter、path、heading、link 或 marker 等现象。

trigger 不等于 signal，不等于 assertion，也不等于最终判断。

trigger 不依赖 locator 才能观察。locator 用于 signal 指回 assertion marker。
