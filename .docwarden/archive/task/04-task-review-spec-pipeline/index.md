---
status: accepted
workspace_status: closed
created: 2026-05-13
updated: 2026-05-13
owner: sayori
---

# task / review / spec pipeline 路线图

本 task 目录原本用于起草 `docwarden` 的 agent-oriented stable 层。

在 Loop 2 讨论中，sayori 发现 `stable` 命名和单层 stable 理论本身存在问题。本工作面转向起草 `task -> review system -> spec / guide / wiki` pipeline。

## 边界

- 本目录是对话产生的 task material。
- agent 可以维护本目录中的 capture、plan、draft 和 review notes。
- agent 不能在没有 sayori 明确授权具体 `docs/` 文件编辑的情况下修改 `docs/`。
- 本任务只定义 `task -> review system -> spec / guide / wiki` 的概念边界和最小结构，不开展完整 promote 编排，不实现 CLI，不设计 custom skill creator。

## 来源基线

- `.docwarden/task/03-ai-infra-min-schema/`
- `docs/文档体系建设/理念-v1.md`
- `docs/文档体系建设/v1与扩展.md`
- `docs/文档体系建设/实践-v1/实践之前.md`
- `docs/ai基建建设/理念-v1.md`

## 当前判断

- `03-ai-infra-min-schema` 已完成 working 内闭环，但还没有被 docwarden 自己消费。
- `stable` 命名不再合适。更合理的模型是 `task -> review system -> spec / guide / wiki`。
- `task` 对应短命任务过程层。
- `review` 对应 user review system，不一定是 Markdown，HTML 是重要候选形态。
- `spec` 对应 agent-facing 指挥层 / 规范层。
- `guide` 对应 user-facing 叙事层，也服务新需求构建。
- `wiki` 对应长期知识网络，承接 llm-wiki 思路。
- custom skill creator 应该继续延后，等 pipeline 入口和边界更清楚后再恢复。
- 本工作面已完成当前轮次。Loop 5 dry run 留到后续 review system 系统设计时再展开。

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
- `stable-positioning.md`：Loop 1 stable 层定位，后续被 task/review/spec 模型修正。
- `pipeline-positioning.md`：Loop 2 task / review system / spec / guide / wiki pipeline 定位。
- `pipeline-structure.md`：Loop 3 pipeline 最小目录结构。
- `review-surface-shape.md`：Loop 4 review surface 最小形态。

## 文件索引

- `index.md`：工作面 lead file，状态：accepted；同时通过 `workspace_status: closed` 表示本工作面已关闭。
- `plan.md`：本轮 loop 计划，状态：accepted。
- `log.md`：时间线记录，状态：accepted；后续可继续追加。
- `stable-positioning.md`：Loop 1 stable 层定位，状态：accepted；后续被 task / review system / spec / guide / wiki 模型修正。
- `pipeline-positioning.md`：Loop 2 task / review system / spec / guide / wiki pipeline 定位，状态：accepted。
- `pipeline-structure.md`：Loop 3 pipeline 最小目录结构，状态：accepted。
- `review-surface-shape.md`：Loop 4 review surface 最小形态，状态：accepted。

## 下一步

本轮工作面已关闭。

后续可以基于本工作面继续推进：

- review system 系统设计。
- review artifact / HTML review surface 形态设计。
- spec / guide / wiki 的最小产物形态。
- `03-ai-infra-min-schema` 到 spec / guide / wiki 的真实分发 dry run。
