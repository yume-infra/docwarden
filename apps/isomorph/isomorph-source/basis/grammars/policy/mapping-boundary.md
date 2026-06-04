---
kind: policy
---

# mapping-boundary

## Intent

约束 `mapping` 只能作为语义对应关系和消费边界，不能回流成 source directory、实例注册表或 runtime materialization 规则。

本 policy 用于保护当前分层：

```text
isomorph bootstraps semantic framework construction.
user/project semantic framework owns domain semantics.
contexta manages agent context assets.
projection exports assets to runtime artifacts.
docwarden consumes isomorph ability while owning its framework.
```

## Scope

Applies to:

- [[basis/primitives/concept/mapping|mapping]]
- [[basis/primitives/concept/recognition-primitive|recognition-primitive]]
- [[basis/primitives/concept/semantic-lint|semantic-lint]]
- [[basis/primitives/concept/semantic-framework|semantic-framework]]
- [[basis/primitives/concept/template|template]]
- `apps/isomorph/isomorph-source/basis/**`
- `apps/isomorph/isomorph-source/bootstrap/**`

适用条件：

- isomorph 需要说明一个 primitive、grammar、signal、template 或 export shape 如何被下游消费。
- isomorph 需要判断某个内容是否应留在 package source，还是应进入 `.contexta`、`.docwarden`、user `.isomorph` 或 runtime export。
- isomorph material 出现 `mapping:` frontmatter、`mapping/` source directory 假设，或把 downstream consumption 当成 source ownership。

不适用条件：

- 需要设计 contexta pack、asset catalog 或 Codex exporter。
- 需要设计 docwarden task / review / promote / pick / cleanup lifecycle。
- 需要决定 Codex runtime artifact 的具体输出路径。

## Rules

- isomorph package source layers MUST remain `basis / bootstrap / init`.
- `apps/isomorph/isomorph-source/basis/**` MUST hold portable theory primitives, grammars, lint signals and templates.
- `apps/isomorph/isomorph-source/bootstrap/**` MUST hold isomorph self-bootstrap vocabulary, boundary material and dogfood semantic shapes.
- `apps/isomorph/isomorph-source/init/**` MUST hold only project seed material copied by init.
- user `.isomorph/**` MUST hold only init output plus user/project semantic material.
- isomorph MUST NOT restore `mapping/` as a canonical source directory.
- mapping MUST 表达为 semantic relation、basis 或 export-shape explanation，而不是 top-level directory ownership。
- mapping MUST NOT be used as frontmatter dispatch for content ownership.
- mapping MUST NOT replace `kind` as the md module reading entry.
- mapping MUST NOT 拥有 contexta pack assets、contexta catalog 或 contexta export target configuration。
- mapping MUST NOT 拥有 docwarden task、review、promote、pick、cleanup 或 stable spec state。
- mapping MUST NOT make isomorph package source own docwarden semantic framework。
- mapping MUST NOT own Codex runtime materialization paths.
- `apps/isomorph/isomorph-source/bootstrap/**` MAY define semantic export shapes, templates or downstream consumption boundaries.
- `apps/isomorph/isomorph-source/bootstrap/**` MUST NOT materialize `.contexta` source assets, `.docwarden` runtime state, or Codex runtime artifacts.
- recognition MAY 使用 mapping 作为 semantic basis，但 recognition MUST NOT 退化成 mapping lookup。

## Rationale

`mapping` isomorph 体系里仍然有必要存在，因为 DSL 需要说明某个语义对象如何被读取、引用或保留。

如果 mapping 被扩张成目录组织和实例归属，会把这些职责混在一起：

- isomorph semantic authority；
- project semantic framework；
- contexta source asset system；
- docwarden / Codex runtime materialization。

稳定分层要求 package source 只回答语义如何成立。它可以定义下游消费需要保留的语义形状，但不能替下游管理资产或 runtime 文件。

## Examples

### Positive

```md
apps/isomorph/isomorph-source/bootstrap/templates/skill-primitive.md
```

该文件描述 skill-primitive 的语义 export shape：未来下游生成 skill artifact 时必须保留哪些语义。

### Negative

```yaml
kind: structure
mapping: docwarden
status: draft
```

这把 downstream ownership 和 docwarden workflow metadata 放进 isomorph frontmatter。应改为普通 semantic module，并在正文说明它是 docwarden 可消费的 export shape。

### Borderline

```md
apps/isomorph/isomorph-source/bootstrap/docwarden/structures/workflow/review.md
```

可以保留为 docwarden 可消费的 workflow semantic shape；但它不能声明自己是 docwarden runtime config，也不能定义 `.docwarden` 当前状态。
