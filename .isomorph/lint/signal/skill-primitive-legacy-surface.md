---
kind: signal
---

# skill-primitive-legacy-surface

## Definition

`skill-primitive-legacy-surface` 表示 skill primitive material 仍然使用旧的 drift/intervention/activation surface，而不是当前稳定 primitive surface。

## Loss Model

这个 signal 防止 skill primitive grammar 回退到 pre-exportDraft wording，避免 capability、trigger、soft boundary、hard boundary 和 workflow 的角色再次被隐藏。

## Trigger

- `recognized role == skill-primitive`
- `heading in [Drift Pressure, Intervention, Activation, Judgment Surface, Deterministic Boundary, Review Gate]`

## Basis

- [[primitives/concept/skill-primitive|skill-primitive]]
- [[grammars/policy/skill-primitive-boundary|skill-primitive-boundary]]
- [[grammars/policy/signal-boundary|signal-boundary]]
