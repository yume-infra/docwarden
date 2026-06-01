---
status: accepted
workspace_status: archived
created: 2026-05-29
updated: 2026-05-29
owner: sayori
---

# contexta isomorph layer split log

## 2026-05-29

- 确认 `contexta` 原本应服务 prompt/context/capability 基础设施。
- 确认 semantic primitive engine 命名为 `isomorph`。
- 执行代码与本地材料迁移：
  - `apps/contexta` semantic runtime -> `apps/isomorph`
  - `.contexta/mapping` -> `.isomorph/mapping`
  - `.contexta` 不保留占位配置
- 验证：
  - `pnpm --filter isomorph typecheck`
  - `pnpm --filter contexta typecheck`
  - `pnpm vitest run --config packages/vitest-config/workspace.config.ts apps/isomorph/tests apps/contexta/tests`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`
