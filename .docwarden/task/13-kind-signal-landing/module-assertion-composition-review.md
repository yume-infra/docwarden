---
status: accepted
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# module assertion composition review

## Review Lead

当前不应把 `module / assertion / composition` 的关系补回 concept 的 `Delimitation`。

这组三角关系应该由一个 relation 承接：`assertion` 是 `module` 的 part，`module` 是 `assertion` 的 whole，`composition` 命名这个 part-whole 结构。

## Current Baseline

- [[mapping/bootstrap/modules/concept/module|module]] 是 md file scope。
- [[mapping/bootstrap/modules/concept/assertion|assertion]] 是 module 内部的最小可审查语义单元。
- [[mapping/bootstrap/modules/concept/structure/composition|composition]] 是由 whole、part、stable semantic boundary 共同成立的组合结构。
- [[mapping/bootstrap/modules/policy/semantic-granularity|semantic-granularity]] 已经约束 assertion 与 module 的粒度关系。
- [[mapping/bootstrap/modules/signal/composition-as-list|composition-as-list]] 已经命名一种误用检测：把 composition 退化成普通列表。

## Gap

clean surface 后，concept definition 保持干净，但 `module / assertion / composition` 的稳定连接还没有独立落点。

如果不建 relation，后续 agent 会把这组关系重新塞回以下位置：

- `module` 的 Definition。
- `assertion` 的 Definition。
- `composition` 的 Definition。
- `semantic-granularity` policy。
- 新的局部 `Delimitation` 替代品。

这些落点都不够好：Definition 会膨胀，policy 会混入结构说明，signal 会变成正面建模，抽象 example 会在缺少真实案例时制造噪音。

## Candidate Decision

新增一个 relation file：

```text
.contexta/mapping/bootstrap/relations/module-assertion-composition.md
```

它只负责表达稳定连接，不重新定义三个 concept。

候选 relation：

```text
assertion part-of module
module whole-of assertion
module/assertion relation realized-as composition
```

其中：

- `part-of` 说明 assertion 如何归入 module。
- `whole-of` 说明 module 如何提供 assertion 的上下文和归属范围。
- `realized-as` 说明这组三角关系是 composition structure 的一个当前实现，不把 module 或 assertion 改写成 `kind: composition`。

## Layer Split

### Definition

只说明 concept 是什么：

- `module` 是 md file scope。
- `assertion` 是最小可审查语义单元。
- `composition` 是 whole / part / stable semantic boundary 共同成立的结构。

### Relation

说明稳定连接：

- `assertion -> module`
- `module -> assertion`
- `module/assertion relation -> composition`

### Policy

说明约束：

- 单条 assertion 不应仅因重要就升级为 module。
- 一个 module 应围绕 stable semantic boundary 组织 assertion。
- module 不应混合不同 stable semantic boundary 的 assertion。

这些已经主要由 `semantic-granularity` 承接。

### Signal

只承接可复用误用检测：

- 把 composition 写成普通列表。
- 把 assertion 过早升级成 module。
- 把 module 当成 `kind`。

当前只保留 `composition-as-list`，不急着扩 signal。

## Proposed Next Change

本轮通过后，落地最小改动：

1. 新增 `module-assertion-composition` relation file。
2. 在 `semantic-granularity` policy 的 Rationale 或 Read surface 中指向该 relation。
3. 在 task 13 记录本轮决策。

本轮不做：

- 不恢复 `Delimitation`。
- 不新增 concept section。
- 不扩 signal 数量。
- 不新增抽象 example。
- 不修改 `docs/`。
