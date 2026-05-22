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

contexta 需要一个名字表示 md module 的稳定可读形状。

这个名字用于说明 agent、Obsidian、review 和未来 CLI 可以稳定读取哪些文本表面，避免把文本表面、语义结构、复制骨架和定位机制混在一起。

## Definition

format 是 contexta module 的稳定可读形状。 ^a-def

format 说明 md module 中哪些表面可以被稳定读取，例如 frontmatter、H1、heading、section body、OFM wikilink 和 relation block heading。

format 不判断内容语义是否正确。

format 不给 assertion 发 ID。

## Delimitation

- [[mapping/bootstrap/modules/concept/template|template]]：template 提供复制后的正文骨架；format 说明 md module 可被稳定读取的文本表面。
- [[mapping/bootstrap/modules/concept/structure|structure]]：structure 说明语义组织方式；format 说明文本表面如何被读取。
- [[mapping/bootstrap/modules/concept/locator|locator]]：locator 服务 assertion 定位；format 提供 locator 可以依附的稳定表面。
- [[mapping/bootstrap/modules/policy/link-resolution|link-resolution]]：link-resolution 约束 OFM link 写法；format 只承认 OFM wikilink 是可读表面。

## Examples

### Scenario

agent 需要判断 heading 是否可以作为 semantic lint 的定位上下文。

### Judgment Material

```md
## Definition

locator 是服务 assertion 审核的定位机制。 ^a-def
```

### Positive

```md
`## Definition` 是 format surface。

`^a-def` 是 assertion marker。
```

这个 example 让 agent 看到 heading 提供可读表面，marker 才定位具体 assertion。

### Negative

```md
只要某句话在 `## Definition` 下，就已经拥有 assertion locator。
```

这把 section context 当成 assertion locator。heading 只能提供上下文，不能替代 assertion marker。

### Borderline

```md
[[mapping/bootstrap/modules/concept/locator#Definition|locator#Definition]]
```

这是 section link，能指向 format surface。它可以作为上下文地址，但还不能精确定位某条 assertion。
