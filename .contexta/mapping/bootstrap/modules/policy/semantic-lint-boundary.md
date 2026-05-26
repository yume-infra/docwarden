---
kind: policy
---

# semantic-lint-boundary

## Intent

约束 semantic-lint 的职责边界。

本 policy 用于避免 semantic-lint 替代 concept、policy、example、relation 或 docwarden workflow。

## Scope

Applies to:

- [[mapping/bootstrap/modules/concept/format|format]]
- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]
- [[mapping/bootstrap/modules/concept/signal|signal]]
- [[mapping/bootstrap/modules/concept/trigger|trigger]]
- [[mapping/bootstrap/modules/concept/locator|locator]]

适用条件：

- contexta 需要定义 semantic-lint signal。
- contexta 需要判断 trigger 是否可以作为 lint 条件。
- contexta 需要让 lint signal 指向 locator marker。
- contexta 需要区分 signal 与 review judgment。

不适用条件：

- 需要设计完整 lint engine。
- 需要设计完整 assertion locator。
- 需要处理 docwarden task / review / promote / pick / cleanup。

## Rules

- semantic-lint MUST produce signal before review judgment.
- semantic-lint MUST NOT replace policy.
- semantic-lint MUST NOT redefine concept.
- semantic-lint MUST NOT replace example.
- semantic-lint MUST NOT execute docwarden workflow.
- trigger SHOULD be observable and script-friendly.
- signal MUST name semantic drift warning, not raw trigger text.
- signal definition SHOULD link to Basis concept / policy / relation.
- emitted signal MAY include locator when it points to a concrete assertion.
- trigger MUST inspect formatted md directly.
- locator MUST point to locator marker without judging correctness.
- module path and heading MAY be used as signal context, not final assertion locator.

## Rationale

semantic-lint 是检测语言，不是约束语言。

它可以发现内容疑似偏离 concept、policy、relation 或 template 的职责边界，并产生 signal；signal 进入 review 后才形成判断。

未来 CLI lint step 可以携带 candidate、instance 或 evidence 这类实现细节。

trigger 直接检查 formatted md。locator 只负责让 signal 指向 locator marker。

当前阶段先稳定 signal definition，不提前设计完整引擎。

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
locator: [[mapping/bootstrap/modules/concept/assertion#^def-1|assertion definition]]
```

这是 semantic-lint 产生的 signal，需要进入 review 后再形成判断。

### Negative

```md
error: concept module MUST NOT contain MUST
```

这把 semantic-lint 写成了硬性 policy，过早把 signal 变成 review judgment。

### Borderline

```md
CLI detail:
  signal: concept-as-policy
  locator: [[mapping/bootstrap/modules/concept/assertion#^def-1|assertion definition]]
  evidence: "agent MUST ..."
```

这是未来 CLI lint step 可能附带的实现细节。本轮只稳定 pure 链路，不设计完整字段协议。
