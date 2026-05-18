---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
---

# review surface 设计计划

本轮目标是定义 `docwarden` review surface 的最小形态。

本任务只在 `.docwarden/task/06-review-surface-design/` 中推进，不直接修改 `docs/`，不设计 review input，不设计 decision trace，不实现完整 HTML 工具。

## Loop 1：surface role 与 lead/backing 结构

状态：accepted。

目标：确认 surface 的职责，以及 lead / backing 在 surface 中如何组织。

草案产物：

- `review-surface-role.md`

review 门槛：

- sayori 确认 surface 的职责是把 material + current agent context 处理成 lead + backing。

## Loop 2：surface generation rules

状态：accepted。

目标：定义 surface 如何从 material + current agent context 生成 lead + backing。

草案产物：

- `surface-generation-rules.md`

review 门槛：

- sayori 确认 surface generation rules 足以支撑 surface 生成 `lead + backing`。

## Loop 3：review frame

状态：accepted。

目标：定义 review frame 的最小结构。`md/html` 作为 renderer config 后续统一收拢，不在本 loop 展开。

草案产物：

- `review-frame.md`

review 门槛：

- sayori 确认 review frame 是 surface 输出结构，不是独立流程阶段。

## 后续：renderer config

状态：pending。

目标：统一收拢 surface 相关配置决策点，例如输出 `md/html`。

草案产物：

- 待定。

review 门槛：

- sayori 确认 config 设计能统一表达 renderer、格式和其他决策点。

## 本轮不做

- 修改 `docs/`。
- 设计 review input。
- 设计 decision trace。
- 实现完整 HTML review 工具。
- 创建真实 spec / guide / wiki 产物。
