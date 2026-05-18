---
status: accepted
created: 2026-05-13
updated: 2026-05-18
owner: sayori
---

# review input 设计计划

本轮目标是定义 `docwarden` review system 的输入边界。

本任务只在 `.docwarden/task/05-review-input-design/` 中推进，不直接修改 `docs/`，不实现 CLI，不设计 review surface，不设计 decision trace。

## Loop 1：review input 最小单位

状态：accepted。

目标：定义 review system 最小接收什么。

要问的问题：

- review input 是整个 task，还是 task 内的一组文件？
- review input 是否只能来自 `accepted` 文件？
- agent 是否可以先做候选选择，再把候选交给 user review？

草案产物：

- `review-input-boundary.md`

review 门槛：

- sayori 确认 review input 的最小单位和选择权边界足够清楚。

## Loop 2：input selection 规则

状态：accepted。

目标：定义 agent 如何从 task material 中选择 review input 的 material。

当前重点：user 指定 input 是短路径；user 未指定 input 时，agent 如何选择 material 才是主路径。`lead + backing` 是 surface 的组织结果，不是 input selection 本身。

草案产物：

- `review-input-selection.md`

review 门槛：

- sayori 确认 agent 选择 input 不会跳过 user 需要判断的关键点。

## Loop 3：input readiness

状态：active。

目标：定义什么样的 task material 可以进入 review system。

草案产物：

- `review-input-readiness.md`

review 门槛：

- sayori 确认 review input 的进入条件足够明确。

## 本轮不做

- 修改 `docs/`。
- 实现 CLI。
- 设计 review surface。
- 设计 decision trace。
- 创建真实 spec / guide / wiki 产物。
- 恢复 custom skill creator。
