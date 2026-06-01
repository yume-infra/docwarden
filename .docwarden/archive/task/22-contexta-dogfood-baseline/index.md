---
status: accepted
workspace_status: archived
created: 2026-05-29
updated: 2026-05-29
owner: sayori
---

# contexta dogfood baseline

本 task 是层级重构后的状态留档。

它不展开新的 contexta 设计，只记录旧 task 的状态、剩余风险和下一目标边界。

## Current Baseline

当前 monorepo 分层：

```text
docwarden = 文档维护 workflow
contexta = context / prompt / capability infrastructure
isomorph = semantic primitive engine
```

当前实现基线：

- `apps/isomorph` 承接原 semantic runtime。
- `.isomorph` 承接原 semantic material。
- `apps/contexta` 只保留最小 context infra CLI/API 骨架。
- `.contexta` 当前不落占位配置。
- `docs/文档体系建设/理念-v4.md` 是当前最新理论口径。

## Archived Task State

### 17-real-content-dry-run-target

状态：未完成，归档。

原目标是为 semantic-lint dry run 找真实 locator-ready target。

当前处理：

- 该目标转入 isomorph backlog。
- 不作为下一轮主线。
- 不应在 contexta dogfood 前继续扩 semantic-lint。

### 18-contexta-runtime-handoff

状态：被重命名和层级拆分取代，归档。

原 handoff 中的 runtime 内容现在属于 isomorph。

当前处理：

- 可作为 isomorph 历史参考。
- 不再作为 contexta 实现入口。

### 19-contexta-v0-migration-audit

状态：大部分已被后续 runtime 迁移和 layer split 消化，归档。

当前处理：

- strict runtime / doctor / recognition authority 相关内容归入 isomorph 历史参考。
- 不再指导 contexta 主线。

### 20-contexta-next-goal-prep

状态：已执行并被 layer split 改写，归档。

当前处理：

- strict runtime contract 已进入 isomorph。
- 剩余 P2/P3 风险不应抢占下一轮 contexta dogfood。

### 21-contexta-isomorph-layer-split

状态：已完成，归档。

完成项：

- `apps/contexta` semantic runtime -> `apps/isomorph`。
- `.contexta/mapping` -> `.isomorph/mapping`。
- `apps/contexta` 重置为最小 context infra 骨架。
- docs 同步到 v4 口径。

修正项：

- `.contexta` 不保留占位配置。

## High Risks

1. `apps/contexta` 仍只是入口骨架，没有真实 catalog schema。
2. `contexta install / activation` 还没有真实写入和消费路径。
3. docwarden 还没有第一批可分发 capability：skills、prompts、agents、context files。
4. 新 agent 还不能通过 contexta 稳定进入 docwarden workflow。
5. isomorph 仍有未完成 semantic-lint / locator / signal backlog，但下一轮不应优先处理。
6. 历史 task 和 archive 中仍有旧 `contexta` 语义用法；这些保留为 provenance，不作为当前口径。

## Next Target

下一轮主线应是 contexta dogfood 最小纵切：

```text
contexta capability source
  -> catalog
  -> install / activation
  -> agent 获得 docwarden workflow 入口
  -> 用 docwarden 跑下一轮 task
```

具体设计等待 sayori 后续指令。

