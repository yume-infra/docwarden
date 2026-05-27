---
status: draft
created: 2026-05-27
updated: 2026-05-27
owner: sayori
---

# migration sequence

本文件给下一轮迁移 goal 使用。

## Principle

不要在当前 runnable spike 上继续横向加功能。

先迁移结构和合同，再扩展能力。

## Phase 1: Stabilize Contracts

目标：

- 保留现有 CLI command surface。
- 收窄 public API。
- 拆出 domain result / error contracts。
- 修正 pin decode 和 malformed JSON error class。
- 加 CLI contract tests。

验收：

- 当前 happy path 仍可运行。
- malformed pin 是 config / parse error，不是 runtime error。
- CLI exit code 0 / 1 / 2 有测试保护。

## Phase 2: Effect-first Runtime

目标：

- 新增 Effect-first runtime entrypoints。
- runtime 不再以 Promise 作为核心抽象。
- filesystem / clock / seed snapshot provider 进入 service / layer。
- CLI handler 直接 `yield*` runtime Effect。

验收：

- package-local `tsgo` 通过。
- runtime tests 可以注入 fake services。
- CLI 外层不再用 `tryPromise` 包整个业务流程。

## Phase 3: Local Recognition Primitive

目标：

- 在 local `.contexta` 中增加 recognition primitive material。
- runtime 解释该 material。
- frontmatter / path / heading / section 只作为 observable features。
- 当前 hardcoded candidates 降级为 default interpreter。

验收：

- 修改 local recognition material 会改变 recognition result。
- unknown kind 不会仅因 frontmatter 自声明成为 authoritative role。
- candidateSignalScope 仍可服务 lint。

## Phase 4: Signal And Loss Model

目标：

- trigger interpreter 明确支持的 grammar 可观察。
- unparsed trigger 产生 diagnostic 或 non-applicable reason。
- signal 的 loss model 有可追踪位置。

验收：

- 每个 seed signal 有 positive / negative fixture。
- lint output 仍是 signal，不是 final judgment。
- evidence / basis / confidence 可审查。

## Phase 5: Primitive Skill Model

目标：

- `contexta primitive skill` 输出 skill primitive model / plan。
- 验证 Semantic Basis OFM links。
- 保留 future `SKILL.md` export position。

验收：

- 不生成最终 `SKILL.md`。
- 不退化为普通 scaffold generator。
- missing semantic basis / export position 有明确 diagnostic。

## Phase 6: Upgrade Status Model

目标：

- upgrade status 区分 pinned v0 instance 和 pre-v0 local instance。
- 输出 pinned baseline / local instance / new baseline availability。
- 保证 upgrade skeleton read-only。

验收：

- 当前仓库 `.contexta` 无 pin 时能被识别为 pre-v0 local instance。
- invalid pin 仍是 config / parse error。
- local customization 不被覆盖。

## Merge Gate

下一轮迁移不应合并，除非至少满足：

- `pnpm --filter contexta typecheck`
- `pnpm --filter contexta build`
- `pnpm test`
- `pnpm lint apps/contexta/src apps/contexta/tests`
- CLI subprocess contract tests
- pin failure tests
- local customization tests

## Do Not Do

- 不直接改 `docs/`。
- 不把 recognition 继续做成固定类型表。
- 不把 primitive-creator 做成 scaffold generator。
- 不为了架构洁癖一次性引入大型 plugin / command framework。
- 不照搬 pnpm / Vite / Vitest 的大型工程结构。

