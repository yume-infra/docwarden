---
kind: signal
---

# template-owns-lifecycle

## Trigger

- `path matches mapping/*/templates/*.md`
- `section contains source / review / pick / update / write / lifecycle terms`
- `section contains MUST / SHOULD / MUST NOT with concrete subject`

## Why

template 只负责复制后的内容骨架。

docwarden workflow 负责操作生命周期，policy 负责规则本体。

## Source

- [[mapping/bootstrap/modules/concept/template|template]]
- [[mapping/bootstrap/modules/policy/template-boundary|template-boundary]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]

## Inspection

- 生命周期内容回到 docwarden workflow。
- 规则本体回到 policy。
- template 只保留复制骨架和占位。
- 如果命中没有 assertion locator，保留为 signal candidate。
