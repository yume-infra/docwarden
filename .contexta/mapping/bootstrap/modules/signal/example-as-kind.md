---
kind: signal
---

# example-as-kind

## Trigger

- `frontmatter.kind == example`
- `path contains /templates/example.md`
- `directory name == example`
- `text states example proves kind or content type`

## Why

example 是样本语言，kind 是内容语言入口。

example 不能反向证明一个 content kind 成立。

## Source

- [[mapping/bootstrap/modules/concept/example|example]]
- [[mapping/bootstrap/modules/concept/kind|kind]]
- [[mapping/bootstrap/modules/policy/kind-boundary|kind-boundary]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]

## Inspection

- 检查 example 是否在提供具体样本。
- 不要让 example 反向制造 kind。
- 如果命中没有 assertion locator，保留为 signal candidate。
