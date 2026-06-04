---
kind: signal
---

# concept-as-policy

## Definition

`concept-as-policy` 表示 concept module 的命名语言可能滑向 policy 的约束语言。

## Loss Model

该信号保护 concept material 的命名职责；当概念定义直接承载 MUST / SHOULD 约束时，concept 与 policy 的语义边界会被混淆。

## Trigger

- `frontmatter.kind == concept`
- `heading in [Definition, Naming Need]`
- `section contains MUST / SHOULD / MUST NOT`

## Basis

- [[language/primitive/concept/concept|concept]]
- [[language/primitive/concept/policy|policy]]
- [[language/grammar/policy/signal-boundary|signal-boundary]]
