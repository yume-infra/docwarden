---
kind: policy
---

# signal-boundary

## Context

约束 signal 的职责边界。

本 policy 用于避免 signal 被写成 policy、trigger、locator、pipeline 或 docwarden review item。

## Applies To

- [[mapping/bootstrap/modules/concept/signal|signal]]
- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]
- [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]]

## Policy

- signal MUST name a semantic-lint warning type.
- signal MUST NOT express final judgment.
- signal MUST NOT replace policy.
- signal MUST NOT replace trigger.
- signal MUST NOT define locator.
- signal MUST NOT define pipeline structure.
- signal MUST NOT execute docwarden workflow.
- signal instance MUST use locator when it points to a concrete assertion.

## Examples

### Scenario

semantic-lint 检查到 concept module 的 Definition 中出现 `MUST`。

### Judgment Material

```md
## Definition

agent MUST use OFM path alias. ^a-def
```

### Positive

```md
signal: concept-as-policy
locator: [[mapping/bootstrap/modules/concept/example#^a-def|example definition]]
```

这是 signal instance：signal 命名 warning，locator 指向 assertion。

### Negative

```md
signal: concept modules MUST NOT contain policy language
```

这把 signal 写成了 policy。

### Borderline

```md
signal: concept-as-policy
context: mapping/bootstrap/modules/concept/example.md#Definition
```

这是 signal candidate。它有上下文，但还没有 assertion locator。
