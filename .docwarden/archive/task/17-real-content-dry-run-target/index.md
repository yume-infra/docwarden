---
status: accepted
workspace_status: archived
created: 2026-05-26
updated: 2026-05-29
owner: sayori
---

# real content dry run target

当前 task 已归档。剩余 locator-ready dry run 目标转入 isomorph backlog，不作为下一轮 contexta dogfood 主线。

本 task 处理为 semantic-lint dry run 准备一个真实内容靶子。

## 边界

- 本目录是对话产生的 task material。
- 本任务先设计并推进一块本身有价值的真实内容。
- 本任务不为测试伪造 fixture。
- 本任务不直接运行 semantic-lint dry run。
- 本任务不实现 CLI lint engine。
- 本任务不修改 `docs/`。

## 来源基线

- `.docwarden/archive/task/16-signal-review-handoff/`
- `.contexta/mapping/bootstrap/modules/concept/assertion.md`
- `.contexta/mapping/bootstrap/modules/concept/locator.md`
- `.contexta/mapping/bootstrap/modules/concept/magic-word.md`
- `.contexta/mapping/bootstrap/structures/pipeline/semantic-lint.md`

## 当前判断

- 当前没有真实内容适合 dry run。
- 下一块内容应先按自身目的成立，再作为 semantic-lint 的真实 target。
- 真实 target 至少应包含可审查 assertion，并尽量带有 locator marker。
- dry run 的目标不是验证伪样例，而是观察真实编辑中出现的 candidate、locator 和 review-ready lint result。

## 内容

- `plan.md`：本任务 loop 计划。
- `stage-plan.md`：后续阶段规划草案。
- `assertion-locator-proposal.md`：`assertion.md` 的 locator-ready assertion 候选方案。
- `locator-family-boundary.md`：已被后续 locator prefix / address token 纠偏收口的历史设计草案。
- `log.md`：任务时间线记录。

## 下一步

选择并设计一块真实 contexta 内容，使其后续可以成为 semantic-lint dry run target。
