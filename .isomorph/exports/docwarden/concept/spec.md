---
kind: concept
id: dw:spec
---

# spec

## Designation

Canonical: `spec`

Aliases:

- stable spec
- 执行规格层

## Naming Need

docwarden harness 需要一个名字表示当前 monorepo 可被后续 agent 依赖的稳定现状描述层。

这个名字用于避免把 task material、review surface、human-maintained docs 和 agent-facing stable modules 混成同一种文档。

## Definition

spec 是 `.docwarden` 中描述当前 monorepo 稳定现状的 md module 集合。

spec 承接经过 review 后可以作为后续执行依据的 assertion。

spec 不承接短期任务过程，不替代 review surface，也不直接等同于 `docs/`。

spec 的 materialized hierarchy 可由 `.isomorph/exports/docwarden/structure/stable-spec-hierarchy.md` 提供语义形状参考。

## Export Boundary

本文件定义 docwarden 可消费的 `spec` 语义对象。

它不是 `.docwarden/spec/` 的 stable spec module，不是 docwarden runtime state，也不是 Codex runtime artifact。

`.docwarden/spec/**` 的具体文件和更新状态属于 docwarden；本文件只保留 `spec` 在 isomorph 语言体系中的语义边界。
