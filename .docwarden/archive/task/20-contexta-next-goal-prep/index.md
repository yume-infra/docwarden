---
status: accepted
workspace_status: archived
created: 2026-05-27
updated: 2026-05-29
owner: sayori
---

# contexta next goal prep

当前 task 已归档。strict runtime contract 已进入 isomorph，下一轮主线转向 contexta dogfood。

本 task 承接 2026-05-27 对 `apps/contexta` 重构后实现的第二轮 subagent 审核。

目标不是再次证明 v0 是否能跑，而是把下一轮 goal 开始前必须确认的推进顺序收束成可执行 lead。

## 目标

- 区分已经修正的旧问题和重构后暴露的新问题。
- 确认下一轮 goal 的优先级。
- 给实现 agent 提供 pre-goal lead，避免直接进入横向补功能。

## 边界

- 本任务不修改 `docs/`。
- 本任务不直接修改 `apps/contexta` 代码。
- 本任务不重新整理完整 subagent 报告。
- 本任务只沉淀下一轮推进的 lead 和组织顺序。

## 来源

- `.docwarden/task/18-contexta-runtime-handoff/`
- `.docwarden/task/19-contexta-v0-migration-audit/`
- 2026-05-27 重构后 subagent 审核：
  - recognition authority
  - Effect runtime shape
  - CLI executable contract
  - pin / upgrade model
  - primitive-creator and semantic-lint
  - architecture boundaries
- Architecture design reference:
  - `/Users/sayori/Desktop/software-design-philosophy-skill/SKILL.md`
- 当前实现：
  - `apps/contexta/src/**`
  - `apps/contexta/tests/**`

## 内容

- `lead.md`：下一轮 goal 前的最小 lead。
- `sup-01-doctor-issue-repair.md`：doctor issue / repair 设计。
- `log.md`：任务时间线记录。

## 当前状态

本 task 的 pre-goal lead 已按 sayori review 通过口径更新，并已作为后续 goal 的执行口径落地。

执行提交：

- `ae2fd7e feat(contexta): enforce strict runtime contracts`

执行结果：

- recognition authority 不再 fail open。
- lint 已消费 recognition result。
- CLI executable contract 已统一进入 runtime error model。
- upgrade pin 已要求解析到真实 packaged baseline。
- `contexta doctor` 已承接 pre-v0 / broken local instance 的 inspect / repair。
- diagnostics、primitive link validation、runtime/public boundary 已收口。

最终验证：

- `pnpm build`
- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm knip`
- `pnpm effect:source:verify`
