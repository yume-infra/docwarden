---
kind: signal
---

# composition-as-list

## Definition

`composition-as-list` 表示 composition module 可能退化为普通列表，而没有表达 whole / part 的稳定语义边界。

## Trigger

- `frontmatter.kind == composition`
- `body contains list items`
- `body missing whole / part / stable semantic boundary terms or sections`

## Basis

- [[primitives/modules/concept/structure/composition|composition]]
- [[primitives/modules/concept/structure|structure]]
- [[grammars/modules/policy/signal-boundary|signal-boundary]]
