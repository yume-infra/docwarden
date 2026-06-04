---
status: active
workspace_status: working
created: 2026-06-04T07:45:15.669Z
updated: 2026-06-04T07:45:15.669Z
title: isomorph layer theory correction
id: 29-isomorph-layer-theory-correction
---

# isomorph layer theory correction

## Context
- 2026-06-04 主线整合后发现，当前 isomorph 针对 `skill-primitive` 的设计层级仍然不稳：root `.isomorph` 同时承载 bootstrap language、concrete skill dogfood、`exports` shape、contexta/docwarden-shaped material。
- isomorph primitives 线程已记录一个关键纠偏：`exports` 不应继续被当作 root isomorph 的稳定层；`Animation Vocabulary` 这类外部信息应作为 external semantic framework / vocabulary target 被建模，而不是被 root `.isomorph/exports` 吸收。
- 用户确认当前需要放慢推进节奏，按 docwarden task loop 先规划、review、再实现，避免继续快速堆版本导致理论层错位扩大。
- 编号协调：main 已有 `.docwarden/task/28-docwarden-v1-skills-cli-dogfood/`，isomorph 线程未提交的 `28-isomorph-layer-theory-correction` 只作为问题记录来源；mainline canonical task 使用 `29-isomorph-layer-theory-correction`。

## Objective
- 慢速纠正 isomorph 层级理论与机制边界，先形成可 review 的 framework model，再决定实现路径。
- 明确 `skill-primitive`、external vocabulary / semantic framework、agent-use contract、contexta projection/materialization 之间的层级关系。
- 产出一个足够小、可验证、可分派到长期线的机制基线，而不是扩张 `.isomorph/exports/**`。

## Boundary
- 本 task 当前阶段不直接修改 `docs/`。
- 本 task 当前实现只迁移 concrete skill-primitive material 的 canonical source；不迁移 `.isomorph/exports/**` 或 plugin runtime material。
- 本 task 不把 contexta 当作 isomorph 的普通 downstream export folder。
- 本 task 不把 concrete skill material 继续当作 root isomorph primitive 的最终形态。
- 本轮实现基于已确认 lead：`lead-review` 是统一审核理论，`skill-creator` canonical 属于 contexta，root `.isomorph` 只保留 bootstrap concept/policy/lint。
- main lead 负责编号、主线协调、merge 风险判断；本轮只做可回滚机制基线，后续更大范围 framework/export 重构仍应拆回长期线。

## Next Entry
- plan.md
