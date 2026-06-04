---
kind: signal
---

# concrete-skill-contract-under-language

## Definition

`concrete-skill-contract-under-language` 表示具体 skill contract material 被放进 `language` 或 `language/primitive` 之下。

## Loss Model

这个 signal 防止 isomorph 的 upper semantic language 退化成具体 skill source 目录。

具体 skill primitive material 应属于 owning semantic framework 或 contexta pack。isomorph package source 只定义 `skill-primitive` 的 contract shape、boundary、template 和 lint signal。

## Trigger

- `frontmatter.kind == skill-primitive`
- `path contains language/primitive/skill-primitive/`

## Basis

- [[contract/skill-primitive/concept|skill-primitive]]
- [[contract/skill-primitive/policy/boundary|skill-primitive-boundary]]
- [[framework/policy/boundary|semantic-framework-boundary]]
- [[language/grammar/policy/signal-boundary|signal-boundary]]
