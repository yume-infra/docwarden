---
kind: signal
---

# example-as-kind

## Definition

`example-as-kind` 表示 example 可能被误用为证明或制造 kind 的依据，而不是提供具体样本。

## Trigger

- `frontmatter.kind == example`
- `path contains /templates/example.md`
- `directory name == example`
- `text states example proves kind or content type`

## Basis

- [[mapping/bootstrap/modules/concept/example|example]]
- [[mapping/bootstrap/modules/concept/metadata/kind|kind]]
- [[mapping/bootstrap/modules/policy/kind-boundary|kind-boundary]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]
