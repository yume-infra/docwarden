---
status: accepted
workspace_status: archived
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# semantic lint signal chain

本 task 处理 semantic-lint 与 signal 的 pure chain 建模。

当前 task 已归档。后续真实内容 dry run 靶子准备进入 `.docwarden/task/17-real-content-dry-run-target/`。

## 边界

- 本目录是对话产生的 task material。
- 本任务稳定 `formatted md -> semantic-lint -> signal -> review` 链路。
- 本任务可以在用户确认后修改 `.contexta/`。
- 本任务只收窄 signal definition surface，不扩展完整 schema。
- 本任务不设计完整 CLI schema。
- 本任务不修改 `docs/`。

## 来源基线

- `.contexta/mapping/bootstrap/modules/concept/semantic-lint.md`
- `.contexta/mapping/bootstrap/modules/concept/signal.md`
- `.contexta/mapping/bootstrap/modules/concept/trigger.md`
- `.contexta/mapping/bootstrap/modules/concept/confidence.md`
- `.contexta/mapping/bootstrap/modules/concept/locator.md`
- `.contexta/mapping/bootstrap/structures/pipeline/semantic-lint.md`
- `.contexta/mapping/bootstrap/modules/policy/semantic-lint-boundary.md`
- `.contexta/mapping/bootstrap/modules/policy/signal-boundary.md`

## 归档判断

- semantic-lint 的 pure chain 是 `formatted md -> semantic-lint -> signal -> review`。
- semantic-lint 的产物是 signal。
- signal 进入 review 后才形成判断。
- candidate、instance 和 evidence 是未来 CLI lint step 的实现层细节。
- final judgment / policy violation 不属于 semantic-lint 的直接产物。

## 内容

- `plan.md`：本任务 loop 计划。
- `log.md`：任务时间线记录。
- `pure-chain-review.md`：Loop 1 pure chain 审查材料。
- `signal-definition-surface-review.md`：Loop 2 signal definition surface 审查材料。

## 下一步

本 task 已完成当前阶段并归档。
