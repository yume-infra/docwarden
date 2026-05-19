---
status: draft
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# promote / pick 实体落点日志

## [2026-05-19] setup | 初始方向错误

创建 `09-spec-guide-wiki-templates` task。

当时错误判断：

- 从 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/` 的入口文件形状反推下一步。
- 将下一步误判为 `spec / guide / wiki` 最小模板设计。
- 把 template 设计放进 docwarden task。

该方向已被 sayori 纠正。

本段只保留为纠错记录，不作为当前任务基线。

## [2026-05-19] correction | 修正为实体落点设计

sayori 指出此前方案从已有文件形状反推设计，没有先判断理论边界。

当前修正：

- docwarden = 操作流程协议，负责 `task / review / promote / pick / cleanup / 具体实体落点`。
- contexta = 内容格式协议，负责 `template / metadata / module / assertion / semantic lint`。
- `.docwarden/user/profile.md` 是当前项目里的 user context 实体资产。
- `.contexta/templates/user-context.md` 是 user context 内容类型的模板。
- template 只负责复制后的内容骨架，不负责来源、review、pick、更新、写入、生命周期。

已将工作面从 `09-spec-guide-wiki-templates` 修正为 `09-promote-pick-entity-landing`。

此前 `template-boundary.md` 越界，已移除。

## [2026-05-19] loop-1 | 生成实体落点边界草案

创建 `entity-landing-boundary.md`。

本轮只定义 docwarden 侧的实体落点边界：

- docwarden 判断什么实体应被创建或更新。
- docwarden 不设计内容模板。
- contexta 后续承接内容格式协议。

当前等待 sayori review。

## [2026-05-19] loop-4 | cleanup 交接边界通过

sayori 确认 `cleanup-handoff.md` 没有问题。

已将 `cleanup-handoff.md` 标记为 accepted。

## [2026-05-19] close | 实体落点设计完成

本轮 `09-promote-pick-entity-landing` 已完成当前最小闭环。

已将：

- `index.md` 标记为 accepted，并通过 `workspace_status: closed` 表示本工作面已关闭。
- `plan.md` 标记为 accepted。
- `.docwarden/task/index.md` 的当前入口改为无。

本轮没有执行 cleanup，没有修改 `docs/`，没有写入长期层，也没有修改 `.contexta/templates/`。

## [2026-05-19] loop-1 | 实体落点边界通过

sayori 确认本边界成立。

已将 `entity-landing-boundary.md` 标记为 accepted。

下一步进入 Loop 2：promote 实体落点。

## [2026-05-19] follow-up | 记录 frontmatter 字段边界

sayori 指出“不需要当前改”不能等于“不需要记录”。

当前记录：

- `kind: user-context` 是 contexta 内容类型字段。
- `status / created / updated / owner` 是 docwarden 实体管理和操作状态字段。
- 不应把两类字段统称为同一种 metadata。
- 当前不改 `.docwarden/user/profile.md` 和 `.contexta/templates/user-context.md`，只记录边界和后续承接。

已创建 `frontmatter-field-boundary.md`。

## [2026-05-19] loop-2 | 生成 promote 实体落点草案

创建 `promote-entity-landing.md`。

本轮只定义 promote 后 docwarden 如何选择具体实体落点：

- 先判断已 review 主线 delta 的稳定功能。
- 再映射到 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/` 下的具体实体。
- 不设计内容模板。
- 不真实写入长期层。

当前等待 sayori review。

## [2026-05-19] loop-2 | promote 实体落点通过

sayori 确认三个稳定功能判断准确：

- agent 执行规则落到 `.docwarden/spec/`。
- user 理解路径落到 `.docwarden/guide/`。
- 可链接项目知识落到 `.docwarden/wiki/`。

已将 `promote-entity-landing.md` 标记为 accepted。

下一步进入 Loop 3：pick 实体落点。

## [2026-05-19] loop-3 | 生成 pick 实体落点草案

创建 `pick-entity-landing.md`。

本轮只定义 pick 后 docwarden 如何选择具体实体落点：

- pick 先判断资产性质，再判断具体实体。
- `.docwarden/user/profile.md` 只承接当前项目中的 user context。
- 不能默认所有 pick 都进入 wiki 或 profile。
- 如果 pick candidate 实际改变项目主线，应回到 promote。
- 如果 pick candidate 实际属于内容格式协议，应转给 contexta。

当前等待 sayori review。

## [2026-05-19] loop-3 | 修正 pick review 与落点层级

sayori 确认方向接近，并补充：

- pick 后会经过 review surface。
- review surface 通过 `lead` 给用户 review，用于确认资产性质和实体是否符合要求。
- profile 是 user context 规范在当前项目中的一个实体实现。
- 当前示例路径是 `pick -> review -> 选了 user context -> 输出到 .docwarden`。
- 其他 pick 同理，需要设计一些层级，让不同情景的 pick 可以选到不同落点。
- review 是最重要的用户口径对接，通过后不能在实体写入时实质变更。

已更新 `pick-entity-landing.md`，加入 review surface、lead、落点层级和 profile 实现关系。

## [2026-05-19] loop-3 | pick 实体落点通过

sayori 要求继续推进。

已将 `pick-entity-landing.md` 标记为 accepted。

下一步进入 Loop 4：cleanup 交接边界。

## [2026-05-19] loop-4 | 生成 cleanup 交接边界草案

创建 `cleanup-handoff.md`。

本轮只定义 cleanup 何时接手：

- cleanup 属于 docwarden 操作流程。
- cleanup 不由 contexta template 决定。
- cleanup 只能在 promote / pick 的 review、实体落点和缺口记录完成后接手。
- 本轮不设计 cleanup config，只保留 `delete | archive` 和 `default: delete` 的已确认边界。

当前等待 sayori review。
