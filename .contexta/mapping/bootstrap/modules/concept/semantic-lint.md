---
kind: concept
---

# semantic-lint

## Designation

Canonical: `semantic-lint`

Aliases:

- semantic lint

## Naming Need

contexta 需要一个名字表示检查语义偏移的检测语言。

这个名字用于区分 policy 的约束语言、relation 的连接语言、example 的样本语言和未来 CLI 中的 lint step。

## Definition

semantic-lint 是语义偏移检测语言。

它通过 signal definition 描述可审查的语义偏移风险，并在未来 CLI lint step 中产生 signal instance。

semantic-lint 当前阶段先整理 warning signal，不设计完整 lint engine。

semantic-lint 的长期形态是独立 lint layer。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/policy|policy]] | policy 表达约束；semantic-lint 检测内容是否疑似偏离已定义语义。 |
| [[mapping/bootstrap/modules/concept/signal|signal]] | signal 是被命名的 warning；semantic-lint 是组织这些 warning 的检测语言。 |
| [[mapping/bootstrap/modules/concept/trigger|trigger]] | trigger 是可观察触发条件；semantic-lint 组织 trigger 如何生成 signal。 |
| [[mapping/bootstrap/modules/concept/locator|locator]] | locator 指向位置；semantic-lint 使用 locator 指出需要检查的位置。 |
| docwarden workflow | docwarden workflow 处理 task / review / promote / pick / cleanup；semantic-lint 只产生语义偏移信号。 |

## Examples

### Scenario

agent 发现一个 concept module 的 Definition 中出现 MUST / SHOULD 约束。

### Judgment Material

```md
## Definition

agent MUST use OFM path alias.
```

### Positive

```md
semantic-lint 可以产生 `concept-as-policy` signal，提示该位置可能把 concept 写成 policy。
```

这个 example 让 agent 看到 semantic-lint 产生 warning signal，而不是直接判定内容必须迁移。

### Negative

```md
semantic-lint MUST forbid concept modules from using MUST.
```

这是一条 policy assertion。semantic-lint 本身不表达约束强度。

### Borderline

```md
signal: concept-as-policy
locator: mapping/bootstrap/modules/concept/example.md#Definition
```

这是未来 CLI lint step 可能产生的 signal instance，不是当前 concept definition。
