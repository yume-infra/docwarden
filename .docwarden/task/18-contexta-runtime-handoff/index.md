---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# contexta runtime handoff

本 task 承接 contexta runtime 第一版实现前的 handoff 材料。

## 目标

为后续 Codex goal 提供足够清晰的执行材料，使实现 agent 可以直接进入真实 CLI runtime 落地，而不是重新讨论 contexta 的基础意图。

## 边界

- 本任务不实现 CLI。
- 本任务不设计外部文档治理 workflow。
- 本任务不修改 `docs/`。
- 本任务不预设 primitive 的最终字段 schema。
- 本任务只整理 runtime、recognition、lint、init / upgrade 和 primitive-creator 的实现前边界。

## 内容

- `lead.md`：本轮最小审核命题。
- `sup-01-runtime-boundary.md`：contexta runtime 的边界与 source 模型。
- `sup-02-recognition-pipeline.md`：任意 md target 进入 contexta 的 recognition pipeline。
- `sup-03-primitive-creator.md`：primitive-creator 与 skill primitive 的地位。
- `sup-04-init-upgrade-model.md`：init / vendor snapshot / upgrade 的模型。
- `sup-05-next-goal-handoff.md`：给后续 CLI runtime goal 的执行 handoff。
- `sup-06-v0-executable-contract.md`：v0 CLI 可执行合同。
- `log.md`：任务时间线记录。

## 当前状态

本任务已形成第一版 handoff 草案，等待 sayori review。
