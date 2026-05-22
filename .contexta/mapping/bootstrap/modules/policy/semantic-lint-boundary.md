---
kind: policy
---

# semantic-lint-boundary

## Intent

约束 semantic-lint 的职责边界。

本 policy 用于避免 semantic-lint 替代 concept、policy、example、relation 或 docwarden workflow。

## Scope

Applies to:

- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]
- [[mapping/bootstrap/modules/concept/signal|signal]]
- [[mapping/bootstrap/modules/concept/trigger|trigger]]
- [[mapping/bootstrap/modules/concept/locator|locator]]

适用条件：

- contexta 需要定义 semantic-lint signal。
- contexta 需要判断 trigger 是否可以作为 lint 条件。
- contexta 需要把 lint 命中指向 module、heading 或 assertion。
- contexta 需要区分 warning signal 与 policy violation。

不适用条件：

- 需要设计完整 lint engine。
- 需要设计完整 assertion locator。
- 需要处理 docwarden task / review / promote / pick / cleanup。

## Rules

- semantic-lint MUST produce warning signals before final judgment.
- semantic-lint MUST NOT replace policy.
- semantic-lint MUST NOT redefine concept.
- semantic-lint MUST NOT replace example.
- semantic-lint MUST NOT execute docwarden workflow.
- trigger SHOULD be observable and script-friendly.
- signal MUST name semantic drift risk, not raw trigger text.
- signal definition SHOULD link to Source concept / policy / relation.
- signal instance SHOULD include locator and evidence when CLI lint step exists.
- locator MUST point to content location without judging correctness.

## Rationale

semantic-lint 是检测语言，不是约束语言。

它可以发现内容疑似偏离 concept、policy、relation 或 template 的职责边界，但最终仍需要 agent 或用户检查。

未来 CLI lint step 需要 signal、trigger、locator 和 evidence 协同工作。当前阶段先稳定 signal definition，不提前设计完整引擎。

## Examples

### Scenario

semantic-lint 检测到 concept module 的 Definition 中出现 MUST。

### Judgment Material

```text
frontmatter.kind == concept
heading == Definition
section contains MUST
```

### Positive

```md
signal: concept-as-policy
inspection: 检查该内容是在命名 concept，还是在写约束规则。
```

这是 warning signal，需要检查后再决定是否迁移内容。

### Negative

```md
error: concept module MUST NOT contain MUST
```

这把 semantic-lint 写成了硬性 policy，过早把 warning 变成最终判罚。

### Borderline

```md
signal instance:
  signal: concept-as-policy
  locator: [[mapping/bootstrap/modules/concept/example#Definition|example#Definition]]
  evidence: "agent MUST ..."
```

这是未来 CLI lint step 的输出形态。本轮只稳定其方向，不设计完整字段协议。
