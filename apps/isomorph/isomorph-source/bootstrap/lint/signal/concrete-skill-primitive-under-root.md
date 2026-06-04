---
kind: signal
---

# concrete-skill-primitive-under-root

## Definition

`concrete-skill-primitive-under-root` 表示具体 skill contract material 被放进 root isomorph primitive catalog。

## Loss Model

这个 signal 防止 root `.isomorph` 从 bootstrap language 退化成具体 skill source 目录。

具体 skill primitive material 应属于 owning semantic framework 或 contexta pack。root `.isomorph` 只定义 `skill-primitive` 的 concept、boundary、template 和 lint signal。

## Trigger

- `frontmatter.kind == skill-primitive`
- `path contains basis/primitives/skill-primitive/`

## Basis

- [[bootstrap/primitives/concept/skill-primitive|skill-primitive]]
- [[bootstrap/grammars/policy/skill-primitive-boundary|skill-primitive-boundary]]
- [[basis/grammars/policy/semantic-framework-boundary|semantic-framework-boundary]]
- [[basis/grammars/policy/signal-boundary|signal-boundary]]
