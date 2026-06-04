---
kind: signal
---

# composition-as-list

## Definition

`composition-as-list` 表示 composition module 可能退化为普通列表，而没有表达 whole / part 的稳定语义边界。

## Loss Model

该信号保护 composition material 不被普通条目清单替代；如果 whole、part 和稳定边界缺失，组合关系会失去可审核语义。

## Trigger

- `frontmatter.kind == composition`
- `body contains list items`
- `body missing whole / part / stable semantic boundary terms or sections`

## Basis

- [[language/structure/concept/composition|composition]]
- [[language/structure/concept/structure|structure]]
- [[language/grammar/policy/signal-boundary|signal-boundary]]
