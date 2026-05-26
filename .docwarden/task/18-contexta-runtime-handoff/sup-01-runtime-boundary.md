---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# runtime boundary

本文件说明 contexta runtime 第一版的边界。

## Core Position

contexta runtime 的 source 是项目内的 local `.contexta`。

runtime 不在普通执行时读取 vendor source。vendor source 只作为远端概念层、pinned baseline 和 upgrade diff 来源。

## Local Effective Instance

`.contexta` 是项目的 effective contexta instance。

runtime 从 `.contexta` 读取：

- semantic model
- mapping
- recognition primitive
- lint signal definition
- primitive-creator material
- skill primitive material

用户可以修改 `.contexta` 中暴露出的 local 内容。

## Vendor Baseline

vendor contexta 是上游概念 baseline。

vendor baseline 用于：

- `init` materialization
- version pin
- upgrade comparison
- migration diff

vendor baseline 不作为 runtime 的隐藏依赖。

## No Root Link File

第一版不创建根部 `contexta.md`。

如果未来需要根部文件，它只能承担用户配置或 load link 职责，不能只是说明书、协议解释或 agent instruction。

## External Discoverability

contexta runtime 自包含，但不自广告。

`init` 不负责写外部指示牌。

外部发现由 host integration、`AGENTS.md`、全局 agent instruction、用户显式调用 CLI 或其他外部兼容层承接。

一旦 runtime 被调用，它只读取 local `.contexta` 作为 effective contexta instance。

## Tool Maintained State

用户可以修改 local `.contexta` 的 semantic content。

pin / upgrade state 是可见的工具维护 metadata。

用户可以手动修改这些 metadata，但这会影响 upgrade baseline 追踪；runtime 应在 metadata 缺失或不一致时产生配置错误，而不是静默覆盖。

## Non Goals

- 不接管外部稳定资产 workflow。
- 不把 mapping 设计成转换引擎。
- 不在理论阶段预设 primitive 字段 schema。
- 不要求用户通过外部文件理解 contexta。
- 不把 vendor 和 local 设计成运行时叠加读取层。
