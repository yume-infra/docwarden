---
kind: signal
---

# skill-primitive-legacy-surface

## Definition

`skill-primitive-legacy-surface` means skill primitive material still uses the old drift/intervention/activation surface instead of the stable primitive surface.

## Loss Model

This signal protects skill primitive grammar from drifting back into pre-exportDraft wording that hides capability, trigger, soft boundary, hard boundary, and workflow roles.

## Trigger

- `recognized role == skill-primitive`
- `heading in [Drift Pressure, Intervention, Activation, Judgment Surface, Deterministic Boundary, Review Gate]`

## Basis

- [[primitives/modules/concept/skill-primitive|skill-primitive]]
- [[grammars/modules/policy/skill-primitive-boundary|skill-primitive-boundary]]
- [[grammars/modules/policy/signal-boundary|signal-boundary]]
