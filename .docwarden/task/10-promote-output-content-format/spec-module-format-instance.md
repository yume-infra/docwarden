---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 2
candidate_target: .docwarden/spec/review-workflow.md
source_review: .docwarden/review/docwarden-review-workflow/lead.md
---

# spec module format instance

本文件是 promote 后 `spec module` 的候选内容实例，不是真实写入。

## 候选目标

```text
.docwarden/spec/review-workflow.md
```

## 候选内容

```md
# review workflow

## Intent

定义 agent 在 docwarden 中把 task material 转为长期项目基线时必须遵守的操作规则。

## Scope

适用范围：

- agent 处理 `.docwarden/task/` 中可能进入长期层的任务材料。
- agent 基于已通过 review 的 lead 执行 promote。
- agent 在 promote 后判断是否需要 pick 和 cleanup。

不适用范围：

- contexta 内容格式协议。
- pick 后用户层资产的内容格式。
- review surface 的 renderer 实现。
- cleanup config 的字段设计。

## Rules

- agent MUST treat `task` as a short-lived process layer.
- agent MUST NOT treat raw task material as a long-term knowledge entity.
- agent MUST generate review surface before promote.
- review surface MUST expose one `lead` and its `backing`.
- agent MUST NOT run one user review over multiple independent leads.
- agent MUST promote only reviewed mainline baseline delta.
- agent MUST NOT promote raw material or the full review surface.
- agent MUST run pick after promote.
- pick MUST handle user-level compoundable assets hidden by promote.
- agent MUST NOT let pick change project mainline baseline.
- cleanup SHOULD run after promote and pick are complete.
- cleanup SHOULD delete task working materials by default.
- cleanup MAY archive task working materials when configured.

## Failure Handling

- If no reviewable lead can be generated, agent MUST NOT promote.
- If a candidate changes project mainline but has not passed review, agent MUST return to review.
- If a pick candidate changes project mainline, agent MUST route it back to promote.
- If cleanup would discard unresolved promote or pick material, agent MUST delay cleanup.
```

## 格式判断

这个候选适合作为 `spec module`，因为它以执行场景、适用范围和规则约束为核心。

它不承担 user 叙事路径，也不组织 wiki 链接网络。

## Review

sayori 确认主要内容方向已跑通，但指出：

- `workflow` 应是单独的 architecture 内容类型。
- `workflow` 不应套用 policy 的 `Intent / Scope / Rules / Failure Handling` 结构。

本候选作为 promote output 内容方向保留。

具体内容类型约束转入后续 contexta 约束设计。
