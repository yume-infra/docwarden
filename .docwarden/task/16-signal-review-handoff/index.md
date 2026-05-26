---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# signal review handoff

本 task 处理 semantic-lint result 如何复用 docwarden review surface。

## 边界

- 本目录是对话产生的 task material。
- 本任务只设计 semantic-lint result 如何尽量成为 review-ready material。
- 本任务不扩展 signal definition surface。
- 本任务不设计完整 CLI output schema。
- 本任务不直接修改 `docs/`。

## 来源基线

- `.contexta/mapping/bootstrap/modules/concept/signal.md`
- `.contexta/mapping/bootstrap/modules/concept/semantic-lint.md`
- `.contexta/mapping/bootstrap/structures/pipeline/semantic-lint.md`
- `.contexta/mapping/bootstrap/relations/semantic-lint-chain.md`
- `.docwarden/archive/task/05-review-input-design/review-input-boundary.md`
- `.docwarden/archive/task/05-review-input-design/lead-rules.md`
- `.docwarden/archive/task/06-review-surface-design/surface-generation-rules.md`

## 当前判断

- signal definition 不直接生成 lead。
- semantic-lint 的具体结果应尽可能组织成 review-ready lint result。
- review-ready lint result 应贴近 `lead + backing`。
- 如果 lint result 已经足够好，docwarden review surface 走短路径。
- 如果 lint result 不足以支撑 user review，docwarden review surface 仍负责重新组织 `lead + backing`。
- 没有真实 target 时，不做 lint dry run，不伪造 fixture。
- 可用 target 复用既有 locator / assertion 设计：真正可 review 的 target 是带 assertion marker 的 assertion。
- semantic-lint 的前置推导是：md 中必须存在可被单独审查的 assertion。
- assertion 保留原命名，但定义为 module 内最小可审查 semantic commitment；它不表示内容已经正确。
- assertion 不保存 correctness marker；review/promote 只改变 assertion 是否进入 accepted scope。

## 内容

- `plan.md`：本任务 loop 计划。
- `log.md`：任务时间线记录。
- `handoff-boundary-review.md`：Loop 1 最小交接边界审查材料。
- `mechanism-completion-notes.md`：Loop 2 review-ready lint result 机制记录。
- `target-availability-review.md`：Loop 3 可用 target 与 dry run 前置条件。

## 下一步

当前阶段已收口。后续等真实 target 或 CLI 实现参照物出现，再推进 lint dry run。
