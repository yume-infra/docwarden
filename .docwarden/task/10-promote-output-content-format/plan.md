---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# promote output content format 计划

本轮目标是用 `08` 已通过的 promote candidates，设计 promote 后内容实体的最小格式实例。

本任务只在 `.docwarden/task/10-promote-output-content-format/` 中推进，不直接修改 `docs/`，不真实写入长期层，不修改 `.contexta/templates/`。

## Loop 1：promote output format 边界

状态：accepted。

目标：确认本任务处理 promote 后内容格式实例，而不是 pick 后 user context，也不是 docwarden 实体落点。

草案产物：

- `promote-output-format-boundary.md`

review 门槛：

- sayori 确认输入是已通过 review 的 promote delta，不是 task raw material。
- sayori 确认输出是 promote 后内容实体的格式候选，不是真实写入。
- sayori 确认 spec / guide / wiki 是三种不同内容表达，不是同一模板换目录。

## Loop 2：spec module 格式实例

状态：accepted。

目标：基于 `08` 的 spec candidate，定义 agent 执行规则内容的最小格式实例。

草案产物：

- `spec-module-format-instance.md`

review 门槛：

- sayori 确认 spec module 服务 agent 执行规则。
- sayori 确认该格式不混入 guide 叙事或 wiki 链接节点职责。

## Loop 3：guide page 格式实例

状态：accepted。

目标：基于 `08` 的 guide candidate，定义 user 理解路径内容的最小格式实例。

草案产物：

- `guide-page-format-instance.md`

review 门槛：

- sayori 确认 guide page 服务 user 恢复理解和线性阅读。
- sayori 确认该格式不写成 agent 执行规则或 wiki 节点。

## Loop 4：wiki node 格式实例

状态：accepted。

目标：基于 `08` 的 wiki candidate，定义可链接项目知识节点的最小格式实例。

草案产物：

- `wiki-node-format-instance.md`

review 门槛：

- sayori 确认 wiki node 服务可链接、可组合、可查询的项目知识。
- sayori 确认该格式不承担 guide 的线性叙事或 spec 的执行约束职责。

## Loop 5：contexta 承接判断

状态：accepted。

目标：判断哪些 promote output 格式结论应后续沉淀到 contexta 的 template / module / assertion / semantic lint。

草案产物：

- `contexta-format-handoff.md`

review 门槛：

- sayori 确认哪些内容属于 contexta 内容格式协议。
- sayori 确认哪些内容仍只是 docwarden 当前实例，不应抽成 template。

## 本轮不做

- 修改 `docs/`。
- 真实写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 修改 `.contexta/templates/`。
- 重新设计 review surface。
- 重新设计 promote / pick 实体落点。
- 处理 pick 后 user context。
- 实现 CLI。
