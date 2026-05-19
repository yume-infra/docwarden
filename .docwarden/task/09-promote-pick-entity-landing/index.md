---
status: accepted
workspace_status: closed
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# promote / pick 实体落点

本 task 目录用于设计 docwarden 在 promote / pick 之后如何判断具体实体落点。

## 边界

- 本目录是对话产生的 task material。
- 本任务只设计 docwarden 操作流程协议中的具体实体落点规则。
- 本任务不直接修改 `docs/`。
- 本任务不直接写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/` 或 `.docwarden/user/profile.md`。
- 本任务不设计 template、metadata、module、assertion 或 semantic lint。
- 本任务不修改 `.contexta/templates/`。
- 本任务不固化 review artifact schema，不实现真实 CLI。

## 来源基线

- `.docwarden/task/08-promote-pick-dry-run/`
- `.docwarden/task/08-promote-pick-dry-run/promote-candidates.md`
- `.docwarden/task/08-promote-pick-dry-run/dry-run-conclusion.md`
- `.docwarden/user/profile.md`
- `.contexta/templates/user-context.md`

## 当前判断

- docwarden 是操作流程协议，负责 `task / review / promote / pick / cleanup / 具体实体落点`。
- contexta 是内容格式协议，负责 `template / metadata / module / assertion / semantic lint`。
- `.docwarden/user/profile.md` 是当前项目里的 user context 实体资产。
- `.contexta/templates/user-context.md` 是 user context 内容类型的模板。
- template 只负责复制后的内容骨架，不负责来源、review、pick、更新、写入、生命周期。
- 因此本任务应判断 promote / pick 之后哪些具体实体应被创建或更新，而不是设计这些实体的内容模板。
- frontmatter 字段边界已记录：`kind` 属于 contexta 内容类型字段；`status / created / updated / owner` 属于 docwarden 实体管理和操作状态字段。

## 内容

- `plan.md`：本轮的小循环列表。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `entity-landing-boundary.md`：Loop 1 实体落点边界定义。
- `frontmatter-field-boundary.md`：frontmatter 字段边界缺口记录。
- `promote-entity-landing.md`：Loop 2 promote 实体落点定义。
- `pick-entity-landing.md`：Loop 3 pick 实体落点定义。
- `cleanup-handoff.md`：Loop 4 cleanup 交接边界定义。

## 文件索引

- `index.md`：工作面 lead file，状态：accepted；同时通过 `workspace_status: closed` 表示本工作面已关闭。
- `plan.md`：本轮 loop 计划，状态：accepted。
- `log.md`：时间线记录，状态：draft。
- `entity-landing-boundary.md`：Loop 1 实体落点边界定义，状态：accepted。
- `frontmatter-field-boundary.md`：frontmatter 字段边界缺口记录，状态：draft。
- `promote-entity-landing.md`：Loop 2 promote 实体落点定义，状态：accepted。
- `pick-entity-landing.md`：Loop 3 pick 实体落点定义，状态：accepted。
- `cleanup-handoff.md`：Loop 4 cleanup 交接边界定义，状态：accepted。

## 下一步

本轮 promote / pick 实体落点设计已完成当前最小闭环。
