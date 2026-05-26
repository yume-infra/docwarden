---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# semantic lint signal chain log

## [2026-05-26] task-started | 稳定 semantic-lint pure chain

sayori 确认方向：先稳定链路，再探讨 signal 的其他设计。

当前 pure chain：

```text
formatted md -> semantic-lint -> signal -> review
```

当前判断：

- candidate 是疑似 signal。
- instance 是一次已定位 signal 命中。
- evidence 是支持 signal 的检测材料。
- 这些都属于未来 CLI lint step 的实现层细节，不抢 signal 的理论位置。

已落地：

- 修订 `.contexta/mapping/bootstrap/modules/concept/semantic-lint.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/signal.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/confidence.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/trigger.md`。
- 修订 `.contexta/mapping/bootstrap/structures/pipeline/semantic-lint.md`。
- 修订 `.contexta/mapping/bootstrap/relations/semantic-lint-chain.md`。
- 修订 `.contexta/mapping/bootstrap/modules/policy/semantic-lint-boundary.md`。
- 修订 `.contexta/mapping/bootstrap/modules/policy/signal-boundary.md`。
- 修订当前 `.contexta/mapping/bootstrap/modules/signal/*.md` 中的 candidate 口径。

## [2026-05-26] loop-2-started | 组织 signal definition surface 审查

进入 signal 其他设计的第一轮。

当前判断：

- signal definition 应服务 `formatted md -> semantic-lint -> signal -> review`。
- signal definition 不应写成 policy、review item、CLI output schema 或 remediation guide。
- 当前 `Why / Inspection` 容易分别滑向解释性段落和修复动作。

当前候选：

- `Trigger`
- `Risk`
- `Source`
- `Review`

已生成：

- `signal-definition-surface-review.md`

## [2026-05-26] loop-2-accepted | 收窄 signal definition surface

sayori 确认：signal definition 应更纯粹，只作为被 semantic-lint 使用的 warning name 定义。

最终 surface：

- `Definition`
- `Trigger`
- `Basis`

已确认：

- 不保留 `Risk / Source / Review` 四段草案。
- 不把 signal definition 写成 review surface。
- 不在 signal definition 中表达修复动作。
- 不在 signal definition 中设计 CLI output schema。

已落地：

- 修订 `.contexta/mapping/bootstrap/modules/concept/signal.md`。
- 修订 `.contexta/mapping/bootstrap/modules/policy/signal-boundary.md`。
- 修订 `.contexta/mapping/bootstrap/modules/policy/semantic-lint-boundary.md`。
- 修订当前 `.contexta/mapping/bootstrap/modules/signal/*.md`。
- 更新 `signal-definition-surface-review.md`。

## [2026-05-26] stage-closed | 当前阶段收口

当前阶段已稳定：

- `formatted md -> semantic-lint -> signal -> review`。
- semantic-lint 产生 signal，不产生 final judgment。
- signal definition 是 warning name definition。
- signal definition surface 是 `Definition / Trigger / Basis`。

下一步应转向 signal 进入 review 的交接边界，而不是继续扩 signal definition。
