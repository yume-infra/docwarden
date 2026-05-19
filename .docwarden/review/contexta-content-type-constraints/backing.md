---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
source_task: 11-contexta-content-type-constraints
---

# contexta content type constraints backing

本文件是 `lead.md` 的 backing。

## source context

本轮来自 `10-promote-output-content-format` 的收口纠偏。

sayori 指出：

```text
workflow 应该是单独的架构，而不是 policy 的结构。
```

## supporting material

- `.docwarden/task/10-promote-output-content-format/contexta-format-handoff.md`
- `.docwarden/task/10-promote-output-content-format/spec-module-format-instance.md`
- `.contexta/modules/policy/semantic-granularity.md`
- `.contexta/modules/policy/audience-policy.md`
- `.contexta/modules/policy/language-policy.md`

## why this matters

如果 contexta 只有 policy-like 结构，agent 容易把所有 agent-facing 内容都写成：

```text
Intent / Scope / Rules / Failure Handling
```

但 workflow / architecture 需要表达组成、阶段、关系、边界和流转。

它不是规则列表。

## not in this lead

本轮不定义完整 workflow / architecture 骨架。

本轮只确认：

- 应设计内容类型约束。
- policy 和 workflow / architecture 必须区分。
- semantic lint 应识别类型误用。

完整骨架放到后续 loop。
