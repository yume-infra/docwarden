---
kind: concept
---

# vocabulary

## Designation

Canonical: `vocabulary`

Aliases:

- 词表
- domain vocabulary

## Naming Need

semantic framework 需要一个名字表示领域术语的稳定命名表面。

这个名字用于让 agent 把领域术语当成 magic word、trigger phrase 或判断线索，而不是普通自然语言片段。

## Definition

vocabulary 是 semantic framework 的 naming surface。

它记录某个领域中需要稳定识别的 term、alias、intent、quality signal 和 failure mode。

vocabulary-heavy framework 可以主要通过术语运作；workflow/entity-heavy framework 也可以拥有 vocabulary，但它不只由词表构成。

vocabulary 不等于 primitive catalog。领域术语应属于对应 semantic framework，而不是默认进入 package `language/primitive`。
