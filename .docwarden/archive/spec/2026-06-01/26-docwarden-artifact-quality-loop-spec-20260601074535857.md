# Spec: Docwarden Artifact Quality Loop

Task: 26-docwarden-artifact-quality-loop
Generated at: 2026-06-01T07:45:35.857Z
Layer: spec

## Trace
- /Users/sayori/Desktop/docwarden/.docwarden/task/26-docwarden-artifact-quality-loop/index.md
- /Users/sayori/Desktop/docwarden/.docwarden/task/26-docwarden-artifact-quality-loop/plan.md
- /Users/sayori/Desktop/docwarden/.docwarden/task/26-docwarden-artifact-quality-loop/log.md

## Stable Contract
- 让 docwarden v0 的产物从“能生成”推进到“能被用户审、能进入稳定层、能支撑下一轮维护”。

## Execution Rules
- Step 1: 固化质量观察
- Step 2: 重写 review lead 生成语义
- Step 3: 重写 promote / pick 产物形态
- Step 4: 增加质量 contract 测试
- Step 5: 再次 dogfood

## Boundary
- 本 task 聚焦 review lead、backing、promote artifact、pick artifact 的质量链路。
- 可以修改 `apps/docwarden` 的 CLI 与测试。
- 可以修改 `.docwarden/task/26-docwarden-artifact-quality-loop/` 工作材料。
- 默认不修改 `docs/`。
- 不新增主链路命令，不引入 candidates layer，不把 contexta/isomorph 混入 docwarden workflow。

## Review Notes
- 没有发现阻塞性缺口。
