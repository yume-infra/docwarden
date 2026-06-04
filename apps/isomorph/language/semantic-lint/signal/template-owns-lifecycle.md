---
kind: signal
---

# template-owns-lifecycle

## Definition

`template-owns-lifecycle` 表示 template module 可能承担来源、review、pick、更新、写入或 lifecycle 等操作职责。

## Loss Model

该信号保护 template material 只描述格式表面；当模板承担 lifecycle authority 时，workflow/review 的职责边界会被移入格式层。

## Trigger

- `path matches */templates/*.md`
- `section contains source / review / pick / update / write / lifecycle terms`
- `section contains MUST / SHOULD / MUST NOT with concrete subject`

## Basis

- [[language/primitive/concept/template|template]]
- [[grammars/policy/template-boundary|template-boundary]]
- [[grammars/policy/signal-boundary|signal-boundary]]
