---
status: draft
created: 2026-05-27
updated: 2026-05-27
owner: sayori
---

# contexta v0 migration lead

当前 v0 不是失败的 demo。

它已经形成真实 CLI 外壳：

- `contexta init`
- `contexta recognize`
- `contexta lint`
- `contexta primitive skill`
- `contexta upgrade`

但当前 v0 还不能作为 contexta runtime 的稳定第一版。

核心问题：

1. recognition 还没有成为 local `.contexta` primitive。
2. Effect 只包在 CLI 外层，核心 runtime 仍是 Promise / Node fs。
3. `runtime.ts` 聚合了 domain、application、infrastructure 和 presentation。
4. pin / upgrade 只有 happy path skeleton，不能承接当前已有 `.contexta`。
5. primitive-creator 被压成 skill surface validator。
6. 测试证明“能跑”，但还没有证明 CLI 合同和 local model 可替换性。

## Migration Position

下一轮迁移应保留命令面和已通过的 v0 行为，但不要在当前结构上继续堆功能。

优先目标不是增加更多 signal，也不是扩大 CLI 命令数量。

优先目标是把 runtime 从 runnable spike 迁成：

```text
local .contexta material
  -> Effect runtime services
  -> recognition primitive interpretation
  -> lint signal emission
  -> typed CLI contract
```

## Blocking Findings

### P1 Recognition Primitive

`recognizeSurface` 当前由 TypeScript 内置候选决定 role：

- `frontmatterRoleCandidate`
- `mappingPathRoleCandidate`
- `signalSurfaceCandidate`
- `skillPrimitiveCandidate`

这些函数可以作为默认 interpreter 的实现细节，但不能继续作为唯一 source of recognition authority。

### P1 Effect Runtime

核心 runtime 函数返回 `Promise`。

CLI 通过 `Effect.tryPromise` 包装它们。

这不是本仓库要求的 Effect v4 implementation shape。

### P1 Config / Pin Error

`.contexta/.contexta-pin.json` 读取没有结构化 decode。

malformed JSON 当前会被归类为 runtime error，而不是 config error。

当前仓库已有 `.contexta` 也没有 pin metadata，upgrade 只能报 missing pin，不能表达 pre-v0 local instance 状态。

## Non Blocking But Required

- 拆分 `runtime.ts`。
- 收窄 public package export。
- 给 primitive skill 输出明确 model / plan。
- 增加 CLI subprocess tests。
- 增加 local `.contexta` customization tests。

## Review Question

下一轮迁移是否接受先做“结构迁移 + recognition primitive 最小 local surface”，再补更完整的 primitive-creator 和 upgrade diff？

