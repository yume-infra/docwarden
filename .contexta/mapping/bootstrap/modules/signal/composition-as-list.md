---
kind: signal
---

# composition-as-list

## Trigger

- `frontmatter.kind == composition`
- `body contains list items`
- `body missing whole / part / stable semantic boundary terms or sections`

## Why

composition 是组合结构，list 只是语言形式。

没有稳定语义边界的列表不构成 composition。

## Source

- [[mapping/bootstrap/modules/concept/composition|composition]]
- [[mapping/bootstrap/modules/concept/structure|structure]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]

## Inspection

- 检查是否说明 part 为什么属于同一个 whole。
- 如果只是并列信息，不能标为 composition。
- 如果命中没有 assertion locator，保留为 signal candidate。
