---
status: accepted
workspace_status: active
created: 2026-05-13
updated: 2026-05-18
owner: sayori
---

# review input 设计

本 task 目录用于起草 `docwarden` review system 的输入边界。

## 边界

- 本目录是对话产生的 task material。
- agent 可以维护本目录中的 capture、plan、draft 和 review notes。
- agent 不能在没有 sayori 明确授权具体 `docs/` 文件编辑的情况下修改 `docs/`。
- 本任务只设计 review system 的输入边界，不设计 review surface，不设计 decision trace，不实现 CLI，不完整实现 HTML 工具，不直接执行 spec / guide / wiki 分发。

## 来源基线

- `.docwarden/task/03-ai-infra-min-schema/`
- `.docwarden/task/04-task-review-spec-pipeline/`
- `docs/文档体系建设/理念-v2.md`
- `docs/ai基建建设/实践-v1/`

## 当前判断

- `04-task-review-spec-pipeline` 已确认：review 是一个系统，不只是目录或 Markdown 文件。
- review system 的职责是从 task 中提炼 user 可审查的 review surface。
- review surface 本体短命，但 review decision / trace 需要可追溯。
- 一轮 review 后，模型应把内容分发到 spec / guide / wiki。
- 当前最需要定义的是 review system 最小应该接收什么，以及输入如何被 agent 选择、解释和约束。
- Loop 1 已接受：review input = material + current agent context。
- `lead + backing` 不是 input 本体，而是 review surface 对 input 的组织结果。
- Loop 2 已接受：user 指定 input 是短路径；user 未指定 input 时，agent selection 是主路径。

## 推进规则

本任务继续使用慢推进循环：

1. agent 先问少量具体问题。
2. sayori 回答。
3. agent 在本 task 目录生成 draft。
4. sayori review，选择接受、拒绝或要求修改。
5. 当前环节被接受或明确暂停后，agent 才能进入下一环节。

agent 每轮最多问三个问题，能问一个问题时优先只问一个。

## 内容

- `plan.md`：本轮的小循环列表。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `review-input-boundary.md`：Loop 1 review input 边界。
- `review-input-selection.md`：Loop 2 review input selection。

## 文件索引

- `index.md`：工作面 lead file，状态：accepted；同时通过 `workspace_status: active` 表示本工作面正在推进。
- `plan.md`：本轮 loop 计划，状态：accepted。
- `log.md`：时间线记录，状态：draft；后续可继续追加。
- `review-input-boundary.md`：Loop 1 review input 边界，状态：accepted。
- `review-input-selection.md`：Loop 2 review input selection，状态：accepted。

## 下一步

进入 Loop 3：input readiness。
