---
status: accepted
workspace_status: closed
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# promote output content format

本 task 目录用于设计 promote 后内容实体的最小格式实例。

## 边界

- 本目录是对话产生的 task material。
- 本任务处理 promote 后内容生产，不处理 pick 后 user context。
- 本任务使用已通过 review 的 promote delta 作为输入。
- 本任务只生成格式实例和格式边界，不真实写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 本任务不重新设计 review surface。
- 本任务不重新判断实体落点。
- 本任务不修改 `docs/`。
- 本任务不修改 `.contexta/templates/`。

## 来源基线

- `.docwarden/task/08-promote-pick-dry-run/promote-candidates.md`
- `.docwarden/review/docwarden-review-workflow/lead.md`
- `.docwarden/task/09-promote-pick-entity-landing/promote-entity-landing.md`

## 当前判断

- `09` 已确认 promote 后实体落点：agent 执行规则进入 spec，user 理解路径进入 guide，可链接项目知识进入 wiki。
- 当前缺口是 promote 后内容实体的格式实例，而不是实体落点。
- spec / guide / wiki 是三种不同内容表达，不是同一模板换目录。
- contexta 后续承接格式模板、字段、module / assertion 和 semantic lint。
- docwarden 提供来源、review 状态、实体落点和写入流程，不定义内容格式本体。

## 内容

- `plan.md`：本轮的小循环列表。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `promote-output-format-boundary.md`：Loop 1 promote output format 边界草案。
- `spec-module-format-instance.md`：Loop 2 spec module 格式实例候选。
- `guide-page-format-instance.md`：Loop 3 guide page 格式实例候选。
- `wiki-node-format-instance.md`：Loop 4 wiki node 格式实例候选。
- `contexta-format-handoff.md`：Loop 5 contexta 约束设计承接记录。
- `.docwarden/review/promote-output-content-format/`：Loop 1 review artifact。

## 文件索引

- `index.md`：工作面 lead file，状态：accepted；同时通过 `workspace_status: closed` 表示本工作面已关闭。
- `plan.md`：本轮 loop 计划，状态：accepted。
- `log.md`：时间线记录，状态：draft。
- `promote-output-format-boundary.md`：Loop 1 promote output format 边界定义，状态：accepted。
- `spec-module-format-instance.md`：Loop 2 spec module 格式实例候选，状态：accepted。
- `guide-page-format-instance.md`：Loop 3 guide page 格式实例候选，状态：accepted。
- `wiki-node-format-instance.md`：Loop 4 wiki node 格式实例候选，状态：accepted。
- `contexta-format-handoff.md`：Loop 5 contexta 约束设计承接记录，状态：accepted。

关联 review artifact：

- `.docwarden/review/promote-output-content-format/index.md`：review artifact 入口，状态：accepted。
- `.docwarden/review/promote-output-content-format/lead.md`：本轮最小 user review 单元，状态：accepted。
- `.docwarden/review/promote-output-content-format/backing.md`：lead 的承载层，状态：accepted。

## 下一步

本轮 promote output 内容格式实例已完成当前最小闭环。后续转入 contexta 约束设计。
