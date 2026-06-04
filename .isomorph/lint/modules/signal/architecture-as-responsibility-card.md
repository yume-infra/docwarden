---
kind: signal
---

# architecture-as-responsibility-card

## Definition

`architecture-as-responsibility-card` 表示 architecture module 可能只在描述职责，而没有表达组成与边界。

## Loss Model

该信号保护 architecture material 不退化成 ownership card；缺少 layer、relation、boundary 时，后续 review 会失去判断责任分布是否成立的依据。

## Trigger

- `frontmatter.kind == architecture`
- `body contains responsibility / owner / function descriptions`
- `body missing layer / relation / boundary terms or sections`

## Basis

- [[primitives/modules/concept/structure/architecture|architecture]]
- [[primitives/modules/concept/structure|structure]]
- [[grammars/modules/policy/signal-boundary|signal-boundary]]
