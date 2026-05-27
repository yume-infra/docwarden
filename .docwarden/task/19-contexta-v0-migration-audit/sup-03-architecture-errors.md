---
status: draft
created: 2026-05-27
updated: 2026-05-27
owner: sayori
---

# architecture errors

本文件记录当前 v0 的架构问题和迁移边界。

## 1. `runtime.ts` 是 runnable spike，不是 runtime core

当前 `apps/contexta/src/runtime.ts` 同时承担：

- domain type definitions
- root resolution
- init materialization
- pin read
- model loading
- recognition
- signal trigger interpretation
- lint signal construction
- primitive skill analysis
- upgrade status
- filesystem access

这让后续迁移无法局部替换 recognition、pin、snapshot 或 CLI presentation。

迁移方向：

```text
domain/
  model contracts
  result contracts
  typed errors

application/
  init
  recognize
  lint
  primitive skill
  upgrade status

infrastructure/
  filesystem repository
  seed snapshot provider
  pin reader / writer
  markdown parser adapter

cli/
  command definitions
  formatting
  stdout / stderr / exit code
```

不要求一次完成最终目录结构，但依赖方向必须按这个形状收束。

## 2. Recognition / signal engines 不可替换

当前 recognition 和 trigger DSL 都是 TypeScript hardcode。

典型位置：

- `apps/contexta/src/runtime.ts:416` `recognizeSurface`
- `apps/contexta/src/runtime.ts:633` `evaluateSignal`
- `apps/contexta/src/runtime.ts:663` `evaluateTriggerLine`
- `apps/contexta/src/runtime.ts:805` unknown trigger fallback

迁移方向：

- 抽出 `RecognitionEngine`。
- 抽出 `SignalEngine`。
- 当前 hardcoded behavior 可以成为 default interpreter。
- default interpreter 必须消费 local `.contexta` 中的 recognition / signal material。

## 3. Public package export 过宽

当前 `apps/contexta/src/index.ts` 直接：

```text
export * from './markdown.js'
export * from './runtime.js'
```

这会把 v0 内部结构变成跨包 API。

迁移方向：

- public API 只导出稳定 programmatic entrypoints 和必要 result types。
- parser helper、internal engines、infrastructure adapter 不应从 package root export。
- CLI bin 与 node API 要区分。

## 4. Seed snapshot 长期不应是 TS 巨型常量

当前 `apps/contexta/src/seed.ts` 把 materialized seed 作为 TS array 内嵌。

v0 可以接受。

但 upgrade 需要同时处理：

```text
pinned vendor baseline
new vendor baseline
local effective .contexta
```

长期 seed 更适合成为 package data snapshot + manifest。

迁移方向：

- 短期可以保留 TS seed。
- 但需要抽象 `VendorSnapshotProvider`。
- digest 应覆盖真实 snapshot material。
- upgrade status 应返回 baseline identity，而不是只返回 pin object。

## 5. Upgrade 缺少 pre-v0 instance 模型

当前 `runUpgradeStatus` 只读 pin 并返回：

```text
mergeEngine: not-implemented-v0
```

缺口：

- 当前 local `.contexta` 没有 pin 时无法表达 status。
- 没有 pinned snapshot / local instance / new baseline 的模型位置。
- invalid pin 与 pre-v0 missing pin 没有分层。

迁移方向：

upgrade status 至少输出：

- local instance root
- pin status
- pinned baseline status
- local customization untouched
- merge engine status

## 6. Primitive Skill 需要 application service

当前 `runPrimitiveSkill` 混在 runtime 文件里。

迁移方向：

抽出：

```text
analyzeSkillPrimitive(surface, localModel)
```

它应是纯 application/domain logic，不直接依赖 filesystem 或 CLI formatting。

