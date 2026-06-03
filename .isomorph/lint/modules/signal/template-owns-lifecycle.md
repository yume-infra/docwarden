---
kind: signal
---

# template-owns-lifecycle

## Definition

`template-owns-lifecycle` 表示 template module 可能承担来源、review、pick、更新、写入或 lifecycle 等操作职责。

## Trigger

- `path matches */templates/*.md`
- `section contains source / review / pick / update / write / lifecycle terms`
- `section contains MUST / SHOULD / MUST NOT with concrete subject`

## Basis

- [[primitives/modules/concept/template|template]]
- [[grammars/modules/policy/template-boundary|template-boundary]]
- [[grammars/modules/policy/signal-boundary|signal-boundary]]
