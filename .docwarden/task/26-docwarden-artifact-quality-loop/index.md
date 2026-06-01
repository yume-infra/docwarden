---
status: active
workspace_status: working
created: 2026-06-01
updated: 2026-06-01
title: Docwarden Artifact Quality Loop
id: 26-docwarden-artifact-quality-loop
---

# Docwarden Artifact Quality Loop

## Context

task25 已经让 docwarden v0 的主链路可执行：

```text
task create -> review --task -> promote / pick
```

但第一轮 dogfood 产物仍然明显机械：review lead 是泛化问题，spec/wiki 只是 task 片段搬运，还没有形成真正可维护文档体系。

本 task 承接下一步：不继续扩命令面，先修 `review -> promote/pick` 的产物质量和真实语义。

## Objective

让 docwarden v0 的产物从“能生成”推进到“能被用户审、能进入稳定层、能支撑下一轮维护”。

## Boundary

- 本 task 聚焦 review lead、backing、promote artifact、pick artifact 的质量链路。
- 可以修改 `apps/docwarden` 的 CLI 与测试。
- 可以修改 `.docwarden/task/26-docwarden-artifact-quality-loop/` 工作材料。
- 默认不修改 `docs/`。
- 不新增主链路命令，不引入 candidates layer，不把 contexta/isomorph 混入 docwarden workflow。

## Next Entry
- `quality-observations.md`
- `plan.md`
