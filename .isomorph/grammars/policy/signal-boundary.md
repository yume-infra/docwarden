---
kind: policy
---

# signal-boundary

## Context

约束 signal 与 signal definition 的职责边界。

本 policy 用于避免 signal 被写成 policy、trigger、locator、pipeline 或 docwarden review item。

## Applies To

- [[primitives/concept/signal|signal]]
- [[primitives/concept/semantic-lint|semantic-lint]]
- [[grammars/structures/pipeline/semantic-lint|semantic-lint pipeline]]

## Policy

- signal definition MUST name a semantic-lint warning.
- signal definition MUST use `Definition / Trigger / Basis` as its minimal surface.
- signal definition MUST NOT express review judgment.
- signal definition MUST NOT replace policy.
- signal definition MUST NOT define locator.
- signal definition MUST NOT define pipeline structure.
- signal definition MUST NOT execute docwarden workflow.
- emitted signal SHOULD use locator when it points to a concrete assertion.

## Examples

### Scenario

semantic-lint 检查到 concept module 的 Definition 中出现 `MUST`。

### Judgment Material

```md
## Definition

agent MUST use OFM path alias. ^def-1
```

### Positive

```md
signal: concept-as-policy
locator: [[primitives/concept/assertion#^def-1|assertion definition]]
```

这是带有 locator 的 signal：signal 命名语义偏移 warning，locator 指向 assertion。

### Negative

```md
signal: concept modules MUST NOT contain policy language
```

这把 signal 写成了 policy。

### Borderline

```md
signal: concept-as-policy
context: primitives/concept/example.md#Definition
```

这是带有 context 的 signal。它有上下文，但还没有 assertion locator。
