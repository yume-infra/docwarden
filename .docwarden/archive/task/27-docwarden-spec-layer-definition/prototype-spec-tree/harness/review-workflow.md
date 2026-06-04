---
kind: workflow
---

# review

## State

- `task-active`：任务执行在进行中，task material 可能继续变化。
- `review-needed`：任务产生需要审核价值的主线增量。
- `review-surface-ready`：review surface 已生成，等待用户审核。
- `reviewed`：用户已审核 lead，并可能给出确认、纠偏、拒绝或延后。
- `routed`：用户评审结果已按目标分流。
- `cleanup-ready`：后续处理已明确，流程可进入 cleanup handoff。

## Move

- `detect-review-need`：判断当前任务是否触发 review。
- `build-review-surface`：生成 review surface。
- `collect-user-review`：执行 user review。
- `route-reviewed-material`：按用户决定分流到 promote / pick / log-only / transfer / no-op。
- `prepare-cleanup-handoff`：写明 cleanup 前置条件与承接位置。

## Transition

- `task-active --detect-review-need--> review-needed`
- `review-needed --build-review-surface--> review-surface-ready`
- `review-surface-ready --collect-user-review--> reviewed`
- `reviewed --route-reviewed-material--> routed`
- `routed --prepare-cleanup-handoff--> cleanup-ready`
