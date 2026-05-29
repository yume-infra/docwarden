---
status: active
created: 2026-05-29
updated: 2026-05-29
owner: sayori
---

# contexta isomorph layer split

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
- `.contexta` 保留为 contexta workspace activation/config 位置。

