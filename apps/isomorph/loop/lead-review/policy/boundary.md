---
kind: policy
---

# lead-review-boundary

## Intent

保护 lead-review 作为统一审核理论，避免它塌缩成 docwarden CLI gate、raw task log、semantic-lint judgment 或普通 prose review。

## Scope

Applies to:

- [[loop/lead-review/concept|lead-review]]
- [[language/primitive/concept/assertion|assertion]]
- [[language/semantic-lint/concept/signal|signal]]
- [[language/semantic-lint/concept/semantic-lint|semantic-lint]]
- [[language/semantic-lint/pipeline/semantic-lint|semantic-lint pipeline]]

适用条件：

- correction、signal 或 candidate update 需要进入用户审核。
- agent 准备把语义更新写入 framework vocabulary、usage contract、skill primitive 或 downstream materialization。
- review material 开始膨胀成长解释、任务日志或未分层的候选报告。

不适用条件：

- 用户只要求运行 deterministic validation。
- 已有 CLI schema 正在执行硬约束和文件写入。
- material 只是未形成候选承诺的 transient task note。

## Rules

- lead-review MUST organize candidate assertion, signal, correction or candidate update into `lead + backing` before durable semantic writes.
- lead MUST be the smallest user-reviewable commitment.
- backing MUST support, expand or verify the lead without replacing it.
- backing SHOULD include source, target, boundary, evidence or expected future behavior when those are available.
- lead-review MUST route user outcome as accepted, rejected, revise or route.
- lead-review MUST NOT execute docwarden workflow state changes.
- lead-review MUST NOT turn semantic-lint signal directly into judgment without review.
- docwarden review MAY dogfood lead-review as a workflow projection.
- contexta MAY materialize lead-review as an agent-facing Codex skill.

## Rationale

用户审核成本主要取决于 lead 是否足够小、足够清楚。

如果 review material 把 lead、source、证据、解释、路由和实现细节混在一起，用户只能审核整包文本，后续 promote、pick、semantic-lint 和 skill materialization 都会失去稳定判断单位。

lead-review 把候选语义更新先压成一个可审核承诺，再把证据和展开材料放入 backing。这样既保留追溯能力，也让用户可以快速接受、拒绝、修正或改路由。

## Examples

### Positive

```text
lead: skill-creator canonical skill material belongs to contexta, not isomorph language.
backing: source correction, semantic-framework-boundary, old primitive path, affected runtime export path, expected validation command.
```

### Negative

```text
Here is a long report containing the history, all possible designs, current file paths, speculative schema, and a proposed final answer.
```

这不是 lead-review，因为用户无法只审核最小承诺。
