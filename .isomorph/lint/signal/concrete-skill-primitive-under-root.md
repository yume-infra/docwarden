---
kind: signal
---

# concrete-skill-primitive-under-root

## Definition

`concrete-skill-primitive-under-root` 表示具体 skill contract material 被放回 root `.isomorph/primitives/skill-primitive/**`。

## Loss Model

这个 signal 防止 root `.isomorph` 从 bootstrap language 退化成具体 skill source 目录。

具体 skill primitive material 应属于 owning semantic framework 或 contexta pack。root `.isomorph` 只定义 `skill-primitive` 的 concept、boundary、template 和 lint signal。

## Trigger

- `frontmatter.kind == skill-primitive`
- `path contains primitives/skill-primitive/`

## Basis

- [[primitives/concept/skill-primitive|skill-primitive]]
- [[grammars/policy/skill-primitive-boundary|skill-primitive-boundary]]
- [[grammars/policy/semantic-framework-boundary|semantic-framework-boundary]]
- [[grammars/policy/signal-boundary|signal-boundary]]
