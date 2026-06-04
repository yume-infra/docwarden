---
kind: workflow
id: dw:review
structure: workflow
---

# review

## State

- `task-active`：任务执行在进行中，task material 可能继续变化。
- `review-needed`：任务产生需要审核价值的主线增量，触发 review 前置判定。
- `review-surface-ready`：review surface 已生成，等待用户审核。
- `reviewed`：用户已审核 lead（可附带确认、纠偏、拒绝、延后）。
- `routed`：用户评审结果已按目标分流（promote / pick / log-only / transfer / no-op）。
- `cleanup-ready`：promote、pick、log、transfer 等动作的后续处理已明确，流程可进入 cleanup handoff。

## Move

- `detect-review-need`：判断当前任务是否触发 review。
- `build-review-surface`：生成 `index.md / lead.md / backing.md`。
- `collect-user-review`：执行 user review，必要时检视 backing。
- `route-reviewed-material`：按用户决定分流到后续处理目标。
- `prepare-cleanup-handoff`：写明 cleanup 前置条件与承接位置。

## Transition

- `task-active --detect-review-need--> review-needed`
- `review-needed --build-review-surface--> review-surface-ready`
- `review-surface-ready --collect-user-review--> reviewed`
- `reviewed --route-reviewed-material--> routed`
- `routed --prepare-cleanup-handoff--> cleanup-ready`

## Runtime Boundary

- `review.mode`、`cleanup` 策略、`review_surface.files` 等属于 docwarden 使用层 runtime config，不属于这个 definition 的内容。
- `docwarden init` 与 `.docwarden` 内项目配置决定运行时可选项（如 review 模式、pending 标记、清理策略等）。
- 本文件仅定义 workflow 的语义结构（state / move / transition）。
- 本文件不是 `.docwarden` runtime state，也不是 contexta pack asset 或 Codex runtime artifact。
