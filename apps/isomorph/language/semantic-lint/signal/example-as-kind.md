---
kind: signal
---

# example-as-kind

## Definition

`example-as-kind` 表示 example 可能被误用为证明或制造 kind 的依据，而不是提供具体样本。

## Loss Model

该信号保护 example material 的样本角色；如果 example 被当作 kind 的证明来源，类型判断会失去独立 semantic basis。

## Trigger

- `frontmatter.kind == example`
- `path contains /templates/example.md`
- `directory name == example`
- `text states example proves kind or content type`

## Basis

- [[language/primitive/concept/example|example]]
- [[language/grammar/concept/metadata/kind|kind]]
- [[language/grammar/policy/kind-boundary|kind-boundary]]
- [[language/grammar/policy/signal-boundary|signal-boundary]]
