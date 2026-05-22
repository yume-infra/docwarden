---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# promote / pick 实体落点计划

本轮目标是定义 docwarden 在 promote / pick 之后如何判断具体实体落点。

本任务只在 `.docwarden/task/09-promote-pick-entity-landing/` 中推进，不直接修改 `docs/`，不直接写入长期层，不设计 contexta 模板。

## Loop 1：实体落点边界

状态：accepted。

目标：确认 docwarden 与 contexta 的边界，并定义“实体落点规则”要解决什么问题。

草案产物：

- `entity-landing-boundary.md`

review 门槛：

- sayori 确认 docwarden 只处理操作流程和具体实体落点。
- sayori 确认 contexta 承接 template / metadata / module / assertion / semantic lint。
- sayori 确认 template 不负责来源、review、pick、更新、写入、生命周期。

## Loop 2：promote 实体落点

状态：accepted。

目标：定义 promote 通过后如何判断项目主线内容落到哪个具体实体。

草案产物：

- `promote-entity-landing.md`

review 门槛：

- sayori 确认 promote 只处理项目主线基线变化。
- sayori 确认 docwarden 只判断实体落点和操作，不定义内容模板。

## Loop 3：pick 实体落点

状态：accepted。

目标：定义 pick 通过后如何判断用户层资产或其他 side asset 落到哪个具体实体。

草案产物：

- `pick-entity-landing.md`

review 门槛：

- sayori 确认 `.docwarden/user/profile.md` 是当前项目里的 user context 实体资产。
- sayori 确认不能假设所有 pick 都进入 wiki 或 profile。

## Loop 4：cleanup 交接边界

状态：accepted。

目标：定义 promote / pick 的实体操作完成后，cleanup 何时接手。

草案产物：

- `cleanup-handoff.md`

review 门槛：

- sayori 确认 cleanup 属于 docwarden 操作流程。
- sayori 确认 cleanup 不能由 contexta template 决定。

## 本轮不做

- 修改 `docs/`。
- 直接写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 直接写入 `.docwarden/user/profile.md`。
- 设计 `.contexta/templates/`。
- 设计 metadata / module / assertion / semantic lint。
- 固化 review artifact schema。
- 实现真实 CLI。
- 执行 task cleanup。
