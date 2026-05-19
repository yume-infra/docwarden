---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 3
candidate_target: .docwarden/guide/review-workflow.md
source_review: .docwarden/review/docwarden-review-workflow/lead.md
---

# guide page format instance

本文件是 promote 后 `guide page` 的候选内容实例，不是真实写入。

## 候选目标

```text
.docwarden/guide/review-workflow.md
```

## 候选内容

```md
# review workflow

docwarden 的 review workflow 用来把短命 task 材料变成可长期依赖的项目基线，同时避免丢失对用户有复利价值的信息。

## 为什么需要这条 workflow

task 中会保存推进过程、临时判断、草案、纠偏和上下文。

这些材料不能直接进入长期层。原因是它们混合了主线判断、过程噪音、用户纠偏和未确认内容。

review workflow 的作用，是让 user 先确认最小 review 单元，再让 agent 把确认后的内容分流到正确位置。

## 主流程

```text
task
  -> surface for promote
  -> user review
  -> promote mainline delta
  -> pick user-level compoundable assets
  -> cleanup
```

## 每一步做什么

`task` 保存过程材料。它是短命层，不是长期知识入口。

`surface for promote` 把 task material 和 current agent context 组织成 `lead + backing`。

`user review` 主要审查 lead。backing 用于展开、校验和追溯。

`promote` 只处理已确认的项目主线基线变化，不搬运 raw material 或完整 review surface。

`pick` 在 promote 之后进行。它捞出 promote 隐去但对用户有长期价值的信息。

`cleanup` 在 promote 和 pick 完成后接手，默认删除 task working materials，也可以按配置归档。

## 读这条 workflow 时要注意什么

review 是用户口径对接点。

promote 和 pick 都不能绕过 review。

如果写入实体时需要改变 review 已确认的内容，应回到 review，而不是继续写入。
```

## 格式判断

这个候选适合作为 `guide page`，因为它按 user 理解路径组织：为什么需要、流程是什么、每一步做什么、阅读时应形成什么判断。

它不写成 agent 执行规则，也不拆成 wiki 节点网络。

## Review

sayori 确认主要内容方向已跑通。

具体内容类型约束转入后续 contexta 约束设计。
