---
kind: concept
---

# format

## Designation

Canonical: `format`

Aliases:

- content format
- module format

## Naming Need

contexta 需要一个名字表示 md module 在持续编辑中的形态保持机制。

这个名字用于避免把 template 的初始骨架、policy 的约束语言、semantic-lint 的检测语言和 locator 的定位机制混在一起。

template 可以生成 0->1 的初始 md，但 md module 后续还会被 agent 继续修改。format 负责让 1->2、2->3 的持续编辑不破坏文档可消费形态。

## Definition

format 是 md module 在持续编辑中的形态保持契约。 ^a-def

format 关心文档从 template 生成之后，继续修改、扩写和维护时，如何保持 semantic-lint 可以直接消费的 md 形态。

format 保护的表面包括 frontmatter、H1、heading、section body、OFM wikilink、relation block heading 和 assertion marker。

format 不生成初始骨架。

format 不判断内容语义是否正确。

format 不执行检查。

format 不给 assertion 发全局 ID。
