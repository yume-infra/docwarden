---
status: accepted
workspace_status: archived
created: 2026-05-29
updated: 2026-05-29
owner: sayori
---

# contexta isomorph layer split

当前 task 已归档。三层拆分已落地，下一轮等待 contexta dogfood 目标。

本 task 承接 2026-05-29 的层级纠偏。

## Decision

monorepo 同时组织三层：

- `docwarden`：文档维护 workflow。
- `contexta`：context / prompt / capability infrastructure。
- `isomorph`：semantic primitive engine。

## Implementation Scope

- 原 `apps/contexta` semantic runtime 迁移为 `apps/isomorph`。
- 原 `.contexta/mapping` semantic material 迁移为 `.isomorph/mapping`。
- `apps/contexta` 重置为最小 context infra CLI/API 骨架。
- `.contexta` 不保留占位配置；只有被真实 contexta runtime 消费时才落地。
