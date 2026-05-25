---
kind: signal
---

# architecture-as-responsibility-card

## Definition

`architecture-as-responsibility-card` 表示 architecture module 可能只在描述职责，而没有表达组成与边界。

## Trigger

- `frontmatter.kind == architecture`
- `body contains responsibility / owner / function descriptions`
- `body missing layer / relation / boundary terms or sections`

## Basis

- [[mapping/bootstrap/modules/concept/structure/architecture|architecture]]
- [[mapping/bootstrap/modules/concept/structure|structure]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]
