---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 1
---

# promote output format boundary

本文件定义 promote 后内容格式实例的任务边界。

## 核心判断

本任务处理 promote 后内容生产。

它不处理 pick 后内容。

当前实例来源是 `08-promote-pick-dry-run/promote-candidates.md`。

输入是已通过 review 的 promote delta，不是 task raw material。

## 输入

输入来自：

```text
.docwarden/review/docwarden-review-workflow/lead.md
  -> .docwarden/task/08-promote-pick-dry-run/promote-candidates.md
```

其中 promote delta 是：

```text
docwarden review workflow =
task
  -> surface for promote
  -> user review
  -> promote mainline delta
  -> pick user-level compoundable assets
  -> delete/archive working
```

## 输出

输出是 promote 后内容实体的格式候选。

本任务不真实写入：

```text
.docwarden/spec/
.docwarden/guide/
.docwarden/wiki/
```

本任务只生成格式实例，用于判断这些 promote output 是否具备稳定内容骨架。

## 三种内容表达

spec / guide / wiki 不是同一模板换目录。

三者服务不同表达目标：

- `spec module`：agent 执行规则。
- `guide page`：user 理解路径。
- `wiki node`：可链接项目知识。

同一个已 review 的 promote delta 可以产生三种表达。

但每种表达都必须服务自己的内容目标，不能互相污染。

## docwarden 与 contexta 边界

docwarden 提供：

- 来源 review。
- 已确认 promote delta。
- 实体落点。
- 写入流程。

contexta 后续承接：

- template。
- 内容字段。
- module / assertion 结构。
- semantic lint。

因此本任务可以生成格式实例和 handoff 判断，但不直接修改 `.contexta/templates/`。

## 本轮不处理

- pick 后 user context。
- review surface 结构。
- promote / pick 实体落点。
- cleanup config。
- 真实写入。
- contexta template 落盘。

## 审核点

- 本任务是否应以 promote 后内容生产为对象。
- 输入是否应是已通过 review 的 promote delta，而不是 task raw material。
- 输出是否应是 spec / guide / wiki 的格式实例，而不是真实写入。
- spec / guide / wiki 是否是三种不同内容表达。
- contexta 是否后续承接 template / module / assertion / semantic lint，而不是本 task 直接落盘。

## Review

sayori 确认理论边界成立，并要求继续输出候选内容。
