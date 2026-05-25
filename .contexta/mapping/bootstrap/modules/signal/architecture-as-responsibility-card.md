---
kind: signal
---

# architecture-as-responsibility-card

## Trigger

- `frontmatter.kind == architecture`
- `body contains responsibility / owner / function descriptions`
- `body missing layer / relation / boundary terms or sections`

## Why

architecture 是层级结构。

只写职责卡片不能构成 architecture。

## Source

- [[mapping/bootstrap/modules/concept/architecture|architecture]]
- [[mapping/bootstrap/modules/concept/structure|structure]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]

## Inspection

- 检查是否存在 layer、relation、boundary。
- 如果只是职责说明，不能标为 architecture。
- 如果命中没有 assertion locator，保留为 signal candidate。
