---
status: accepted
created: 2026-05-13
updated: 2026-05-13
owner: sayori
---

# task / review / spec pipeline 计划

本轮原计划产出 `docwarden` 的 agent-oriented stable 层工作定义。

Loop 2 讨论中，stable 命名和单层 stable 理论被重新质疑。本轮改为起草 `task -> review system -> spec / guide / wiki` pipeline。产物先作为 task material 存在，不直接修改 `docs/`。当前已建立 `task/review/spec/guide/wiki` 的最小入口目录。

## Loop 1：stable 层定位

状态：accepted。

目标：定义 stable 层服务谁、解决什么问题，以及它和当前 `docs/` 的差异。

要问的问题：

- stable 层是否明确服务 agent 编码？
- stable 层是否不等价于当前 `docs/`？
- stable 层是否由 promote 从 working material 中产生？

草案产物：

- `stable-positioning.md`

review 门槛：

- sayori 确认 stable 层定位足够清楚，不再和 `docs/`、working 混淆。

## Loop 2：最小目录结构

状态：accepted。

目标：重新定义 `task -> review system -> spec / guide / wiki` pipeline 的概念定位，替代原先的 stable 层目录讨论。

要问的问题：

- `task`、`review system`、`spec`、`guide`、`wiki` 分别承担什么责任？
- `review` 是否应被定义为 review surface，而不限定为 Markdown？
- HTML 是否应作为 review surface 的优先候选形态？

草案产物：

- `pipeline-positioning.md`

review 门槛：

- sayori 确认新 pipeline 能替代原 stable 单层模型继续推进。

## Loop 3：pipeline 最小目录结构

状态：accepted。

目标：定义 `.docwarden/` 下 `task`、`review`、`spec`、`guide`、`wiki` 是否需要分层目录，以及每层最小入口。

要问的问题：

- 是否将现有 `.docwarden/task` 视为未来 `task` 层？
- `review` artifact 目录应该如何规划？
- `spec`、`guide`、`wiki` 的入口应该如何规划？

草案产物：

- `pipeline-structure.md`

review 门槛：

- sayori 确认目录结构可以支撑后续 promote。

## Loop 4：review surface 最小形态

状态：accepted。

目标：定义 review 层的最小 review artifact，尤其讨论 HTML review surface。

要问的问题：

- review artifact 最小包含什么？
- HTML review surface 需要哪些区域？
- review 结果如何反馈给后续 spec？

草案产物：

- `review-surface-shape.md`

review 门槛：

- sayori 确认 review 层可以降低 user review 成本。

## Loop 5：pipeline dry run

状态：deferred。后续 review system 系统设计时再展开。

目标：用 `03-ai-infra-min-schema` 的结论判断哪些内容属于 task，哪些应进入 review，哪些可能成为 spec / guide / wiki。

要问的问题：

- 最小 dry run 是否只做分类，不实际创建最终目录？
- dry run 应该捕获哪些混淆？

草案产物：

- `pipeline-dry-run.md`

review 门槛：

- sayori 确认 pipeline 可以作为 `03` 的消费点。

当前处理：

- 本轮不做 dry run。
- dry run 涉及 review system 的系统设计，后续另开工作面处理。

## 本轮不做

- 修改 `docs/`。
- 继续扩展 review/spec/guide/wiki 目录结构。
- 执行真实 promote。
- 设计 pick 长期目录结构。
- 实现 CLI。
- 恢复 custom skill creator。
