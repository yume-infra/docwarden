---
kind: signal
---

# concept-as-policy

## Trigger

- `frontmatter.kind == concept`
- `heading in [Definition, Naming Need]`
- `section contains MUST / SHOULD / MUST NOT`

## Why

concept 是命名语言，policy 是约束语言。

concept 写成 policy 会让命名和约束职责混在一起。

## Source

- [[mapping/bootstrap/modules/concept/concept|concept]]
- [[mapping/bootstrap/modules/concept/policy|policy]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]

## Inspection

- 检查 Definition 是否仍在命名和界定。
- 如果内容是约束，迁移到 policy。
- 如果命中没有 assertion locator，保留为 signal candidate。
