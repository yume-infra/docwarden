---
kind: concept
id: dw:spec
mapping: docwarden
status: draft
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

spec 的 materialized hierarchy 由 `.isomorph/mapping/docwarden/modules/structure/stable-spec-hierarchy.md` 映射。

## Mapping Boundary

本文件定义 docwarden harness 对 `spec` 这个语义对象的 isomorph mapping。

它不是 `.docwarden/spec/` 的 stable spec module，也不是用户仓库的 template。
