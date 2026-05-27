---
status: draft
created: 2026-05-27
updated: 2026-05-27
owner: sayori
---

# contexta v0 migration audit

本 task 承接 2026-05-27 对 `apps/contexta` 当前 v0 实现的 subagent 审核结论。

目标不是继续评价 v0 是否能跑，而是把已确认的问题转成后续迁移可执行材料。

## 目标

指导下一轮 contexta runtime 迁移：

- 保留当前可执行 CLI 外壳中已经成立的部分。
- 修正 recognition、Effect、architecture、pin / upgrade、primitive-creator 和测试合同中的偏差。
- 避免后续实现 agent 重新发现同一批问题。

## 边界

- 本任务不修改 `docs/`。
- 本任务不直接迁移代码。
- 本任务不重新设计完整 contexta 理论。
- 本任务不预设 primitive 的最终字段 schema。
- 本任务只记录当前 v0 的迁移错误、迁移方向和验收门槛。

## 来源

- `.docwarden/task/18-contexta-runtime-handoff/`
- 2026-05-27 v0 subagent audit：
  - 理论切合度
  - Effect v4 使用规范
  - 整体架构设计
  - Node.js / TypeScript 项目参照
  - 实现风险与可测试性
- 当前实现：
  - `apps/contexta/src/runtime.ts`
  - `apps/contexta/src/cli.ts`
  - `apps/contexta/src/markdown.ts`
  - `apps/contexta/src/seed.ts`
  - `apps/contexta/tests/runtime.test.ts`

## 内容

- `lead.md`：本轮迁移审核的最小结论。
- `sup-01-theory-fit-errors.md`：理论切合度错误。
- `sup-02-effect-migration.md`：Effect v4 迁移要求。
- `sup-03-architecture-errors.md`：架构边界错误。
- `sup-04-executable-contract-tests.md`：可执行合同和测试缺口。
- `sup-05-migration-sequence.md`：建议迁移顺序和合并门槛。
- `log.md`：任务时间线记录。

## 当前状态

本任务已记录 v0 审核结论，等待 sayori review。

