---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 1
---

# entity landing boundary

本文件定义 docwarden 的实体落点边界。

## 基本边界

docwarden 是操作流程协议。

它负责：

- task
- review
- promote
- pick
- cleanup
- 具体实体落点

contexta 是内容格式协议。

它负责：

- template
- metadata
- module
- assertion
- semantic lint

## user context 边界

`.docwarden/user/profile.md` 是当前项目里的 user context 实体资产。

`.contexta/templates/user-context.md` 是 user context 内容类型的模板。

两者关系是：

- docwarden 决定何时创建或更新 `.docwarden/user/profile.md`。
- contexta 定义 user context 被复制出来后应长什么样。
- template 不决定这个实体何时被 review、pick、更新、写入或清理。

## 实体落点规则要解决什么

实体落点规则只解决操作问题：

- review 通过后，promote 是否需要创建或更新某个项目主线实体。
- pick 通过后，是否需要创建或更新某个用户层资产或 side asset。
- 同一条已审核内容应落到哪个具体实体。
- 如果没有合适实体，应创建新实体、延后，还是回到 review。
- 实体操作完成后，cleanup 何时接手。

## 实体落点规则不解决什么

实体落点规则不解决内容格式问题：

- 不定义文件模板。
- 不定义 metadata schema。
- 不定义 module / assertion 结构。
- 不定义 semantic lint。
- 不把来源、review、pick、生命周期写进 template。

这些属于 contexta 后续承接。

## 对当前任务的修正

此前把下一步写成 `spec / guide / wiki 最小模板` 是越界的。

正确拆法是：

- docwarden 侧继续做 promote / pick 后的具体实体落点。
- contexta 侧另行承接内容类型模板与语义结构。

因此本 task 不再产出 `spec module template`、`guide page template` 或 `wiki node template`。

## 审核点

- docwarden 是否只处理操作流程和具体实体落点。
- contexta 是否承接 template / metadata / module / assertion / semantic lint。
- `.docwarden/user/profile.md` 是否作为当前项目里的 user context 实体资产。
- `.contexta/templates/user-context.md` 是否作为 user context 内容类型模板。
- template 是否不负责来源、review、pick、更新、写入、生命周期。

## Review

sayori 确认本边界成立。
