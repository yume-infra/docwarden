---
kind: concept
---

# signal

## Designation

Canonical: `signal`

Aliases:

- lint signal
- semantic signal

## Naming Need

contexta 需要一个名字表示 semantic-lint 中被命名的语义偏移 warning。

这个名字用于避免把 trigger、policy violation、docwarden review item 或 assertion 混成同一个对象。

## Definition

signal 是 semantic-lint 中被命名的语义偏移 warning。

signal 由 trigger 触发，并通过 Source 指向判断依据。

signal 是 warning，不是最终判罚。

未来 CLI lint step 输出的是 signal instance，而不是抽象 signal definition。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]] | semantic-lint 是检测语言；signal 是其中被命名的 warning。 |
| [[mapping/bootstrap/modules/concept/trigger|trigger]] | trigger 是可观察条件；signal 是对该条件的语义风险命名。 |
| [[mapping/bootstrap/modules/concept/assertion|assertion]] | assertion 是被审查的语义判断；signal 是指向其可能偏移的 warning。 |
| [[mapping/bootstrap/modules/concept/policy|policy]] | policy 表达约束；signal 只提示可能违反语义边界。 |
| docwarden review item | docwarden review item 属于操作流程；signal 只是 contexta lint 输出。 |

## Examples

### Scenario

lint 检查到 concept module 的 Definition 中出现 MUST。

### Judgment Material

```text
trigger: section contains MUST
```

### Positive

```md
signal: concept-as-policy
```

这个 signal 命名的是“concept 可能被写成 policy”的语义偏移风险。

### Negative

```md
signal: section contains MUST
```

这只是 trigger 现象，不是 signal 名称。

### Borderline

```md
signal: concept-as-policy
locator: mapping/bootstrap/modules/concept/example.md#Definition
```

这是 signal instance。它包含一次具体命中的位置，不是 signal definition 本身。
