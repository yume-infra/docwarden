---
kind: signal
---

# workflow-as-policy

## Definition

`workflow-as-policy` 表示 workflow module 的推进结构可能滑向 policy 的约束语言。

## Trigger

- `frontmatter.kind == workflow`
- `section contains MUST / SHOULD / MUST NOT`
- `body missing state / move / transition terms or sections`

## Basis

- [[mapping/bootstrap/modules/concept/structure/workflow|workflow]]
- [[mapping/bootstrap/modules/concept/policy|policy]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]
