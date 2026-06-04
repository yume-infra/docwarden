---
kind: policy
---

# source-ownership

## Intent

约束 isomorph package source 的能力归属，避免把下游项目、agent asset system 或 runtime materialization 回流成 isomorph 自身层级。

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

- [[framework/concept/mapping|mapping]]
- [[language/recognition/concept/recognition-primitive|recognition-primitive]]
- [[language/semantic-lint/concept/semantic-lint|semantic-lint]]
- [[framework/concept/semantic-framework|semantic-framework]]
- [[language/primitive/concept/template|template]]
- `apps/isomorph/language/**`
- `apps/isomorph/contract/** or downstream owner material`

适用条件：

- isomorph 需要判断某个 primitive、grammar、signal、template、contract 或 framework seed 是否属于 package source。
- isomorph 需要判断某个内容是否应留在 `language / framework / contract / loop`，还是进入 `.contexta`、`.docwarden`、user `.isomorph` 或 runtime export。
- isomorph material 出现把 downstream consumption 当成 source ownership 的迹象。

不适用条件：

- 需要设计 contexta pack、asset catalog 或 Codex exporter。
- 需要设计 docwarden task / review / promote / pick / cleanup lifecycle。
- 需要决定 Codex runtime artifact 的具体输出路径。

## Rules

- isomorph package source MUST use `language / framework / contract / loop` as its top-level ability ownership model.
- `apps/isomorph/language/**` MUST own the upper semantic language used to construct, recognize and check semantic frameworks.
- `apps/isomorph/framework/**` MUST own framework-facing definitions, templates and ownership policies; it MUST NOT own a concrete project framework instance.
- `apps/isomorph/contract/**` MUST own agent-use contract shapes such as `skill-primitive`.
- `apps/isomorph/loop/**` MUST own correction, candidate assertion, lead-review and accepted-update feedback mechanics.
- generated user `.isomorph/**` MUST hold only init output plus user/project semantic material.
- isomorph MUST NOT restore `mapping/` as a canonical source directory.
- mapping MUST 表达为 semantic relation、basis 或 export-shape explanation，而不是 top-level directory ownership。
- mapping MUST NOT be used as frontmatter dispatch for content ownership.
- mapping MUST NOT replace `kind` as the md module reading entry.
- mapping MUST NOT 拥有 contexta pack assets、contexta catalog 或 contexta export target configuration。
- mapping MUST NOT 拥有 docwarden task、review、promote、pick、cleanup 或 stable spec state。
- mapping MUST NOT make isomorph package source own docwarden semantic framework。
- mapping MUST NOT own Codex runtime materialization paths.
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

`apps/isomorph/contract/skill-primitive/template.md` 属于 `contract`，因为它定义的是 agent-use contract shape。

`apps/isomorph/framework/template/semantic-framework.md` 属于 `framework`，因为它定义的是用户可复制并填充的 framework seed shape，不是一个具体项目 framework。

### Negative

```yaml
kind: structure
mapping: docwarden
status: draft
```

这把 downstream ownership 和 docwarden workflow metadata 放进 isomorph frontmatter。应改为普通 semantic module，并在正文说明它是 docwarden 可消费的 export shape。

### Borderline

如果 docwarden 需要 review workflow material，它应进入 docwarden-owned 层；isomorph 可以提供 language、framework、contract 或 loop 能力供其消费，但不能替 docwarden 拥有该 workflow。
