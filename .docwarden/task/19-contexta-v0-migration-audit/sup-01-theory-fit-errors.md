---
status: draft
created: 2026-05-27
updated: 2026-05-27
owner: sayori
---

# theory fit errors

本文件记录当前 v0 与 task18 理论边界的偏差。

## 1. Recognition 没有成为 local primitive

task18 的核心判断：

```text
arbitrary md target
  -> parse md surface
  -> apply recognition primitive from local contexta
  -> recognition result
  -> applicable lint signals
```

当前实现：

- `apps/contexta/src/runtime.ts:416` 的 `recognizeSurface` 直接枚举内置候选。
- `apps/contexta/src/runtime.ts:532` 使用 `frontmatter.kind` 产出 role candidate。
- `apps/contexta/src/runtime.ts:549` 使用 mapping path 推断 role。
- `apps/contexta/src/runtime.ts:596` 用章节形状识别 signal。
- `apps/contexta/src/runtime.ts:611` 用章节 / path / frontmatter 识别 skill primitive。

问题：

local `.contexta` 提供了 `localKinds` 和 signal definitions，但没有提供可解析的 recognition primitive material。

结果是新增 primitive 的识别能力必须改 TypeScript 代码，而不是改 local `.contexta`。

## 2. `frontmatter.kind` 权限过高

当前 `frontmatterRoleCandidate` 即使遇到 local `.contexta` 未定义的 kind，也会返回该 kind 作为 `recognizedRole`，只是降低 confidence。

这接近把 recognition 交给 target 自己声明。

task18 的边界是：

- target 可以暴露 observable features。
- `kind` 可以是 feature。
- feature 不能单独成为 recognition authority。

迁移要求：

`frontmatter.kind` 应进入 basis / evidence，而不是直接决定 role。

## 3. Mapping 被当成代码内启发式

task18 认为 mapping 是 recognition 的重要输入，不是 transform engine，也不是唯一 lookup。

当前 `mappingPathRoleCandidate` 用固定 path pattern 和目录段落推断 role。

这比单纯 lookup 好，但仍然是 CLI 内部启发式。

迁移要求：

mapping path 可以继续作为 observable feature。

role 推断规则必须能被 local recognition material 表达，至少要有一个 v0 可解析 surface。

## 4. Signal loss model 偏隐式

当前 signal definition 被压缩成：

- `definition`
- `triggerLines`
- `basis`

lint output 包含：

- `signal`
- `target`
- `context` / `locator`
- `evidence`
- `basis`
- `confidence`

这满足 v0 executable contract 的最小输出，但没有明确表达：

```text
这个 signal 保护什么理论损失？
```

迁移要求：

v0 可以不新增最终字段 schema，但至少要让 signal 的 loss model 有可追踪位置：

- 作为 signal definition 的显式 section。
- 或从 Basis 指向的 policy / relation 推导。

二者需择一，不应继续只靠 signal name 和 free text。

## 5. Primitive-creator 退化为 skill validator

task18 认为 primitive-creator 是 contexta 扩展自身语言体系的核心能力。

当前 `runPrimitiveSkill` 主要检查：

- `frontmatter.kind`
- required sections
- `Export Position` 是否非空

缺口：

- 没有输出明确 skill primitive model。
- 没有验证 `Semantic Basis` 中的 OFM links。
- 没有表达 primitive-creator -> skill primitive -> export artifact 的承接链。

迁移要求：

`contexta primitive skill` 至少输出：

- capability
- trigger
- semantic basis links
- export position
- diagnostics
- future skill export requirements

不要求生成 `SKILL.md`。

## 6. 当前已有 `.contexta` 与 v0 pin 模型断层

task18 允许把当前仓库理解为已经有 local contexta instance。

当前实现中：

- `init` 遇到已有 `.contexta` 会拒绝覆盖，这是正确的。
- `upgrade` 只读 `.contexta/.contexta-pin.json`。
- 当前仓库 `.contexta` 没有 `.contexta-pin.json`。

结果：

当前已有 instance 只能落到 missing pin config error，不能被表达为 pre-v0 local instance。

迁移要求：

upgrade / status 应区分：

- pinned v0 local instance
- pre-v0 local instance without pin
- invalid pin metadata
- missing `.contexta`

