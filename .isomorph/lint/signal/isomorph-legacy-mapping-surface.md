---
kind: signal
---

# isomorph-legacy-mapping-surface

## Definition

`isomorph-legacy-mapping-surface` 表示 isomorph material 仍然使用旧的 `mapping:` frontmatter，把 mapping 当成组织层或实例 authority。

## Loss Model

这个 signal 保护当前 layer model：isomorph 只定义 semantic primitives、grammars、lint 和 export shape；contexta assets、docwarden state 与 Codex runtime materialization 不进入 isomorph。

## Trigger

- `frontmatter.mapping exists`

## Basis

- [[primitives/concept/mapping|mapping]]
- [[grammars/policy/mapping-boundary|mapping-boundary]]
- [[grammars/policy/signal-boundary|signal-boundary]]
