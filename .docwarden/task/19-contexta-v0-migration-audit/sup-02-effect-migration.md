---
status: draft
created: 2026-05-27
updated: 2026-05-27
owner: sayori
---

# Effect migration

本文件记录当前 v0 的 Effect 使用错误和迁移要求。

## Current Error

当前 `apps/contexta` 的业务 runtime 不是 Effect 程序。

现状：

- `apps/contexta/src/runtime.ts:176` `runInit` 返回 `Promise<InitResult>`。
- `apps/contexta/src/runtime.ts:286` `runRecognition` 返回 `Promise<RecognitionRunResult>`。
- `apps/contexta/src/runtime.ts:303` `runLint` 返回 `Promise<LintResult>`。
- `apps/contexta/src/cli.ts:145` `runCli` 接收 `() => Promise<A>`。
- `apps/contexta/src/cli.ts:146` 通过 `Effect.tryPromise` 包装 Promise。

这只能让 CLI 外壳进入 Effect。

它不能让 tsgo / Effect 检查 runtime 的 typed error、service requirement、resource scope 和 dependency graph。

## Required Shape

下一轮迁移应把核心 runtime 改成 Effect-first。

最低要求：

```text
runInitEffect
runRecognitionEffect
runLintEffect
runPrimitiveSkillEffect
runUpgradeStatusEffect
```

这些函数应返回 `Effect.Effect<Success, ContextaError, Requirements>`，而不是 `Promise<Success>`。

CLI handler 应直接 `yield*` runtime Effect。

Promise bridge 只能出现在真正的外部 integration edge。

## Error Model

当前 `ContextaRuntimeError` 是普通 `Error`。

迁移后至少需要区分：

- `ContextaConfigError`
- `ContextaParseError`
- `ContextaRuntimeError`

建议使用 Effect v4 的 tagged error style。

pin metadata decode、invalid JSON、missing `.contexta`、target outside root 都应进入 typed config / parse error，而不是统一压成 string message。

## Schema Decode

`readPin` 当前直接：

```text
JSON.parse(raw) as Partial<PinMetadata>
```

迁移要求：

- 使用 Effect Schema 或等价结构化 decoder。
- 校验字段类型。
- 校验 `schemaVersion`。
- 校验 `digest` 形态。
- 校验 `createdAt` 形态。
- JSON parse failure 应归类为 config / parse error。

## Services And Layers

当前 runtime 直接 import：

- `node:fs`
- `node:path`
- `node:process`

CLI 又提供 `NodeServices.layer`，但 runtime 没有消费 platform services。

迁移要求：

- 文件系统、clock、seed snapshot provider、root resolver 应成为 service / layer 可替换依赖。
- CLI presentation 才接触 stdout / stderr / exit code。
- 测试应能注入 fake filesystem / clock / seed。

## What Not To Force

当前 v0 不需要为了“完整 Effect”强行引入：

- `Stream`
- 长生命周期 `Scope` resource
- 复杂 Config provider

但 filesystem、clock、error、schema 和 CLI handler 必须进入 Effect 形态。

## Validation

迁移后必须运行：

```text
pnpm --filter contexta typecheck
pnpm --filter contexta build
pnpm test
pnpm lint apps/contexta/src apps/contexta/tests
```

Effect 实现有效性以 package-local `tsgo -p ... --noEmit` 为主。

