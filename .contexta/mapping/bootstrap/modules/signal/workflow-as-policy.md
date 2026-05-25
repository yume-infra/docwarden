---
kind: signal
---

# workflow-as-policy

## Trigger

- `frontmatter.kind == workflow`
- `section contains MUST / SHOULD / MUST NOT`
- `body missing state / move / transition terms or sections`

## Why

workflow 是推进结构，policy 是约束语言。

workflow 写成 policy 会丢失推进关系。

## Source

- [[mapping/bootstrap/modules/concept/structure/workflow|workflow]]
- [[mapping/bootstrap/modules/concept/policy|policy]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]

## Inspection

- 检查内容是否表达 state、move、transition。
- 如果只是在保护边界，迁移到 policy。
- 如果命中没有 assertion locator，保留为 signal candidate。
