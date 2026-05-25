---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# semantic lint signal chain 计划

## Loop 1：pure chain cleanup

状态：accepted。

目标：稳定 semantic-lint 的最简链路，并把 candidate / instance / evidence 压回实现层。

当前结果：

- 已确认 `formatted md -> semantic-lint -> signal -> review`。
- 已确认 semantic-lint 的产物是 signal。
- 已确认 signal 不是 final judgment，也不是 policy violation。
- 已确认 candidate / instance / evidence 是未来 CLI lint step 的实现层细节。
- 已修订 semantic-lint / signal / confidence / trigger concept。
- 已修订 semantic-lint pipeline。
- 已修订 semantic-lint-chain relation。
- 已修订 semantic-lint-boundary / signal-boundary policy。
- 已修订当前 signal modules 中的 candidate 口径。

## 当前不做

- 不扩展 signal definition schema。
- 不设计完整 CLI schema。
- 不新增 semantic-output registry。
- 不修改 `docs/`。

## Loop 2：signal definition surface

状态：accepted。

目标：确定 signal definition 的最小长期 module surface。

当前结果：

- `Definition`：说明 signal name 表示什么语义偏移。
- `Trigger`：说明 formatted md 中什么可观察形态会触发这个 signal。
- `Basis`：链接判断依据，不在 signal module 内重新定义依据。

已确认：

- signal definition 是 warning name definition。
- signal definition 不包含 review focus。
- signal definition 不包含修复动作。
- signal definition 不包含 CLI output schema。

当前产物：

- `signal-definition-surface-review.md`
- `.contexta/mapping/bootstrap/modules/signal/*.md`
