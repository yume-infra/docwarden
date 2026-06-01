# Review Backing

Task: Docwarden Artifact Quality Loop (26-docwarden-artifact-quality-loop)

Source files:
- /Users/sayori/Desktop/docwarden/.docwarden/task/26-docwarden-artifact-quality-loop/index.md
- /Users/sayori/Desktop/docwarden/.docwarden/task/26-docwarden-artifact-quality-loop/plan.md
- /Users/sayori/Desktop/docwarden/.docwarden/task/26-docwarden-artifact-quality-loop/log.md

## Extracted Material

### Context
- task25 已经让 docwarden v0 的主链路可执行：
- task create -> review --task -> promote / pick
- 但第一轮 dogfood 产物仍然明显机械：review lead 是泛化问题，spec/wiki 只是 task 片段搬运，还没有形成真正可维护文档体系。
- 本 task 承接下一步：不继续扩命令面，先修 `review -> promote/pick` 的产物质量和真实语义。

### Objective
- 让 docwarden v0 的产物从“能生成”推进到“能被用户审、能进入稳定层、能支撑下一轮维护”。

### Boundary
- 本 task 聚焦 review lead、backing、promote artifact、pick artifact 的质量链路。
- 可以修改 `apps/docwarden` 的 CLI 与测试。
- 可以修改 `.docwarden/task/26-docwarden-artifact-quality-loop/` 工作材料。
- 默认不修改 `docs/`。
- 不新增主链路命令，不引入 candidates layer，不把 contexta/isomorph 混入 docwarden workflow。

### Plan Steps
- Step 1: 固化质量观察
- Step 2: 重写 review lead 生成语义
- Step 3: 重写 promote / pick 产物形态
- Step 4: 增加质量 contract 测试
- Step 5: 再次 dogfood

### Recent Log
- [20260601073236872] task created: Docwarden Artifact Quality Loop (26-docwarden-artifact-quality-loop)
- [2026-06-01] task entry filled from task25 dogfood review; next focus is artifact quality rather than expanding command surface.
