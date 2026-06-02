---
status: closed
workspace_status: closed
created: 2026-06-01
updated: 2026-06-02
title: Docwarden Spec Layer Definition
id: 27-docwarden-spec-layer-definition
---

# Docwarden Spec Layer Definition

## Closed

本 task 已收口。

已完成：

- `.docwarden/spec` 按当前 monorepo 真实资产分组。
- `.isomorph/mapping/docwarden` 承接 stable spec hierarchy mapping。
- `promote --to spec` 必须使用 `--target <asset-group>/<module>`。
- `docwarden init` 回到只铺 `.docwarden` harness 必要资产，不推断仓库实例内容。

后续回到 `.docwarden/task/26-docwarden-artifact-quality-loop/` 修产物质量。

## Context

task26 试图直接提升 `review / promote / pick` 的产物质量，但真实 dogfood 产物被用户判定为全错。

当前判断：错误不只是模板粗糙，而是 `spec` 层内部缺少明确层级划分和定义。没有这个定义，`promote --to spec` 不知道应该沉淀哪类内容、用什么粒度、服务谁、和 guide/wiki 的边界在哪里。

本 task 暂时 block task26，先展开 `spec` 这一层。

## Objective

定义 docwarden 中 `spec` 层的定位、内部层级、产物类型、进入条件和与 `task / review / guide / wiki` 的边界。

## Boundary

- 本 task 是设计工作面，不直接改 `docs/`。
- 本 task 不继续实现 task26 的模板修复。
- 本 task 不扩大 docwarden 主链路。
- 本 task 不把 contexta/isomorph 混入 docwarden 的文档维护 workflow。
- 设计结果要能服务后续 `promote --to spec` 的实现修正。

## Next Entry
- `.docwarden/task/26-docwarden-artifact-quality-loop/plan.md`
