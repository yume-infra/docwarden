---
kind: composition
---

# package-topology

## Whole

当前仓库是一个 pnpm + turbo monorepo。

## Parts

- `apps/docwarden`：document maintenance workflow CLI。
- `apps/contexta`：context / capability infrastructure CLI。
- `apps/isomorph`：semantic primitive engine CLI。
- `packages/tsconfig`：workspace TypeScript config package。
- `packages/tsdown-config`：workspace CLI build config package。
- `packages/vitest-config`：workspace test config package。

## Assertions

- Root `package.json` MUST expose `docwarden`、`contexta`、`isomorph` bin paths through the built app dist files.
- `pnpm-workspace.yaml` MUST include `apps/*` and `packages/*`.
- `turbo.json` MUST keep package tasks as the shared build / typecheck / test / smoke coordination surface.
