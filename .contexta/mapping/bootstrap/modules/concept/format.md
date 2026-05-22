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

## Delimitation

- [[mapping/bootstrap/modules/concept/template|template]]：template 负责 0->1 的初始骨架；format 负责后续编辑时保持 md 形态不被改坏。
- [[mapping/bootstrap/modules/concept/policy|policy]]：policy 表达约束语言；format 表达持续编辑中的文档形态保持契约。policy 可以保护 format，但不替代 format 的形态职责。
- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]：semantic-lint 检查语义偏移；format 让 md 保持可被 semantic-lint 直接消费的形态。
- [[mapping/bootstrap/modules/concept/locator|locator]]：locator 服务 assertion 定位；format 保证 assertion marker 在 md 中保持可见、可引用、可消费。
- [[mapping/bootstrap/modules/concept/structure|structure]]：structure 说明语义组织方式；format 保持这些组织方式落到 md 后的文本形态。

## Examples

### Scenario

agent 继续修改一个已经由 template 生成的 concept module。

### Judgment Material

```md
## Definition

locator 是服务 assertion 审核的定位机制。 ^a-def
```

### Positive

```md
保留 `## Definition`。

保留 `^a-def`。

继续使用 OFM path alias link。
```

这个 example 让 agent 看到 format 的重点不是生成初稿，而是在后续编辑中保持可消费形态。

### Negative

```md
把 `## Definition` 改成随意标题，并删除 `^a-def`。
```

这会破坏 semantic-lint 和 locator 依赖的 md 形态。

### Borderline

```md
[[mapping/bootstrap/modules/concept/locator#Definition|locator#Definition]]
```

这是 section link，可以作为上下文地址。它不破坏 format，但也不能替代 assertion marker。
