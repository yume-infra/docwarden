---
kind: signal
---

# workflow-as-policy

## Definition

`workflow-as-policy` 表示 workflow module 的推进结构可能滑向 policy 的约束语言。

## Loss Model

该信号保护 workflow material 的 state、move、transition 结构；当 workflow 只剩约束语言时，执行路径和状态变化会不可审核。

## Trigger

- `frontmatter.kind == workflow`
- `section contains MUST / SHOULD / MUST NOT`
- `body missing state / move / transition terms or sections`

## Basis

- [[primitives/concept/structure/workflow|workflow]]
- [[primitives/concept/policy|policy]]
- [[grammars/policy/signal-boundary|signal-boundary]]
