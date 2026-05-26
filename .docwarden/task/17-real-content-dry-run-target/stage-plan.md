---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# real content dry run target stage plan

## Accepted Goal

下一阶段先推进一个真实 contexta 内容靶子，用它检验 assertion / locator / signal / review-ready lint result 链路。

本阶段暂不先做 CLI lint engine，也暂不先整理 `docs/`。

## Planning Mode

本计划通过一问一答收窄。

能由仓库回答的问题先从 `.contexta`、`.docwarden` 和 archive 中判断；只有需要 sayori 选择的分叉才提问。

## Current Branch

当前要先决定真实内容靶子的类型。

候选方向包括：

- 补一块 contexta theory / practice reference 缺口。
- 将已有 task 判断收敛成 `.contexta` 长期 module。
- 准备一个能自然产生 assertion marker 的真实 module。

## Open Decision

下一处分叉：

```text
真实内容靶子应优先选择哪一类？
```

推荐答案：优先选择“补一块 contexta theory / practice reference 缺口”，因为它能同时服务真实建设和后续 semantic-lint dry run，不会为了测试制造 fixture。

## Accepted Decision

真实内容靶子优先选择 contexta 的 theory / practice reference 缺口。

它首先应服务 contexta 建设，其次才作为 semantic-lint dry run target。

## Candidate Branches

当前从 archive 和 `.contexta` 看到的候选方向：

### Locator-ready content

选择一块已成立或正在补强的 `.contexta` 内容，让其中的关键 assertion 具备 locator marker。

价值：

- 直接补上 semantic-lint dry run 当前最缺的 locator target。
- 不扩 signal 数量。
- 不提前写 CLI parser。
- 可以用真实 module 验证 assertion 是否足够原子、可审查、可定位。

风险：

- 第一轮可能主要验证 locator / assertion，而不是产生 accepted signal instance。

### Example-quality followup

围绕 `example-quality` 当前承认的临时性，补真实使用反馈或重新判断它是否仍属于 policy。

价值：

- 真实理论缺口明确。
- 可改善 contexta 的 practice reference 质量。

风险：

- 不一定直接服务 semantic-lint locator chain。

### Magic-word delayed registries

继续判断 `kind-value`、`signal-id`、`relation-verb` 是否现在应进入 registry。

价值：

- 承接 task 14 已延后的词表缺口。

风险：

- 容易变成过早冻结词表。
- 不一定自然产生 review-ready lint target。

### New signal definition

例如此前延后的 `naming-surface-drift`。

价值：

- 直接扩充 semantic-lint coverage。

风险：

- 与此前“不扩 signal 数量，先校准现有 signal”的阶段判断冲突。
- 容易为 dry run 制造 signal。

## Current Recommendation

第一块真实内容靶子优先走 `Locator-ready content`。

推荐原因：当前真正阻塞 dry run 的不是 signal definition 数量，而是缺少带 assertion marker 的真实 assertion target。

## Accepted Target Class

第一块真实内容靶子选择 `Locator-ready content`。

当前不优先：

- 扩 signal definition。
- 扩 magic-word 延后 registry。
- 重构 `example-quality`。
- 实现 CLI parser。

本阶段先让一块真实 `.contexta` 内容具备可审查、可定位的 assertion。

## Candidate Target Modules

### Recommended: `modules/concept/assertion.md`

推荐第一靶子：

```text
.contexta/mapping/bootstrap/modules/concept/assertion.md
```

理由：

- 它直接定义当前要验证的对象：assertion。
- 它已有真实理论价值，不是为了 lint 测试制造内容。
- 它包含 Definition / Qualification / Carrier 三类自然 assertion surface。
- 它当前没有 assertion marker，能真实暴露 marker 选择问题。
- 它适合检验“哪些句子或列表项够原子、够可审查、值得成为 locator target”。

风险：

- 它可能不会立即产生 accepted signal instance。
- 第一轮更偏向验证 assertion / locator，而不是验证 signal coverage。

### Alternative: `structures/pipeline/semantic-lint.md`

优点：

- 它直接描述 semantic-lint pipeline 和 review-ready lint result。
- 它与后续 dry run 关系最近。

风险：

- 它更接近执行结构，容易把本轮带向 CLI output schema。

### Alternative: `modules/policy/semantic-lint-boundary.md`

优点：

- policy rules 天然容易拆成 assertion。
- 它已经约束 semantic-lint 与 locator。

风险：

- 给 policy rule 加 marker 太容易机械化，不能充分检验 assertion 的语义边界。

### Not Enough: `modules/concept/locator.md`

`locator.md` 已有 locator marker，但内容太短，不足以作为第一块真实内容靶子。

## Current Recommendation

第一块具体 target module 选择：

```text
.contexta/mapping/bootstrap/modules/concept/assertion.md
```

## Accepted Target Module

第一块具体 target module 选择：

```text
.contexta/mapping/bootstrap/modules/concept/assertion.md
```

本 target 的当前目的不是制造 signal，而是让 `assertion` concept 自身成为第一块 locator-ready content。

## Accepted Proposal Shape

本轮先在 task 内起草 locator proposal，不直接修改 `.contexta`。

当前 proposal 文件：

```text
.docwarden/task/17-real-content-dry-run-target/assertion-locator-proposal.md
```

## Locator Readability Constraint

locator marker 会在文档进入 stable 后持续保留。

因此 marker 设计必须低干扰：

- 不用长解释性 slug。
- 不为了覆盖率密集标注。
- 不让 marker 名称替代正文语义。
- marker 一旦进入 stable，应尽量保持稳定，不随意重命名或重排。

## Locator Target Principle

assertion 可以很多；locator target 只标少数需要长期外部引用的 assertion。

`a-` prefix 不进入当前方案。

当前接受统一编号形式：

```text
^def-1
^def-2
^qual-1
^car-1
```

编号只在同一个 locator family 内区分 target，不表示重要性、置信度、正确性或当前正文排序。

stable 后不重排编号。

## Accepted First-round Surface

第一轮只给 `.contexta/mapping/bootstrap/modules/concept/assertion.md` 的 `Definition` surface 加 locator marker。

`Qualification` 和 `Carrier` 留到后续判断。
