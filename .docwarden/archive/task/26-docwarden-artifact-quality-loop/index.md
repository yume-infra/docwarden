---
status: closed
workspace_status: closed
created: 2026-06-01
updated: 2026-06-04
title: Docwarden Artifact Quality Loop
id: 26-docwarden-artifact-quality-loop
---

# Docwarden Artifact Quality Loop

## Closed

本 task 已收口。

已完成：

- `review --task` 的 lead/backing/state 生成从泛化摘要推进到最小审核面。
- `promote` / `pick` 写入稳定层前必须存在同 task 的 review gate。
- `promote --to spec` 必须指向具体 `<asset-group>/<module>` target。
- CLI contract tests 覆盖基础 artifact 质量和 review gate 行为。

本轮 dogfood 结论：task26 的最新 review surface 已生成；用户确认不为了满足旧验收而机械写入 spec/wiki。当前没有新的精确 stable spec assertion 或 wiki pick，因此收口为 log-only / no-op。

## Context

task25 已经让 docwarden v0 的主链路可执行：

```text
task create -> review --task -> promote / pick
```

但第一轮 dogfood 产物仍然明显机械：review lead 是泛化问题，spec/wiki 只是 task 片段搬运，还没有形成真正可维护文档体系。

本 task 承接下一步：不继续扩命令面，先修 `review -> promote/pick` 的产物质量和真实语义。

## Resumed

2026-06-01 用户审核指出：当前生成内容“全错”。

阻塞点不是模板质量的局部问题，而是 `spec` 层级划分和定义尚未展开清楚。继续推进本 task 会继续在错误的稳定层模型上修补产物。

该 blocker 已由 `.docwarden/task/27-docwarden-spec-layer-definition/` 收口。

当前恢复执行：基于新的 spec target 口径修 review / promote / pick 的真实产物质量。

## Objective

让 docwarden v0 的产物从“能生成”推进到“能被用户审、能进入稳定层、能支撑下一轮维护”。

## Boundary

- 本 task 聚焦 review lead、backing、promote artifact、pick artifact 的质量链路。
- 可以修改 `apps/docwarden` 的 CLI 与测试。
- 可以修改 `.docwarden/task/26-docwarden-artifact-quality-loop/` 工作材料。
- 默认不修改 `docs/`。
- 不新增主链路命令，不引入 candidates layer，不把 contexta/isomorph 混入 docwarden workflow。

## Next Entry
- `plan.md`
