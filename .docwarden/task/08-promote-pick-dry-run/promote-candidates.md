---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 2
---

# promote candidates

本文件是 dry run 的 promote 候选，不直接写入长期层。

来源 review artifact：

```text
.docwarden/review/docwarden-review-workflow/lead.md
```

## promote delta

本轮候选主线基线 delta：

```text
docwarden review workflow =
task
  -> surface for promote
  -> user review
  -> promote mainline delta
  -> pick user-level compoundable assets
  -> delete/archive working
```

## spec candidate

候选目标：

```text
.docwarden/spec/review-workflow.md
```

候选内容：

```md
# review workflow

## Rules

- agent MUST treat `task` as a short-lived process layer, not a long-term knowledge entry.
- agent MUST build `surface for promote` before promote.
- `surface for promote` MUST expose one `lead` and its `backing`.
- agent MUST NOT run one user review over multiple independent leads.
- agent MUST promote only the reviewed mainline baseline delta.
- agent MUST NOT promote raw material or the full review surface.
- agent MUST run pick after promote.
- pick MUST extract user-level compoundable assets from information hidden by promote.
- cleanup SHOULD delete task working materials after promote and pick.
- cleanup MAY archive task working materials when configured.
```

## guide candidate

候选目标：

```text
.docwarden/guide/review-workflow.md
```

候选内容：

```md
# review workflow

docwarden 的 review workflow 用来把短命 task 材料变成可长期依赖的项目基线，同时避免丢失对用户有复利价值的信息。

流程是：

task -> surface for promote -> user review -> promote -> pick -> cleanup

`task` 保存推进过程。`surface for promote` 把 task 中的材料整理成用户能审核的 lead 和 backing。`user review` 确认或纠偏这个 lead。`promote` 把确认后的主线变化沉淀到长期层。`pick` 在 promote 之后，捞出被主线表达隐去、但对用户有长期价值的信息。最后 task 材料默认删除，也可以按配置归档。
```

## wiki candidate

候选目标：

```text
.docwarden/wiki/review-workflow.md
```

候选内容：

```md
# review workflow

docwarden 的 review workflow 是从短命 task 到长期层的主流程。

Links:

- [[task]]
- [[review surface]]
- [[lead]]
- [[backing]]
- [[promote]]
- [[pick]]
- [[cleanup]]

Core claims:

- task 是短命任务过程层。
- review surface 在 promote 前生成 lead + backing。
- user review 一次只审一个 lead。
- promote 处理项目主线基线 delta。
- pick 在 promote 后捞用户层级资产。
- cleanup 默认 delete，可配置 archive。
```

## promote 暴露的缺口

当前 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/` 只有入口文件，还没有定义最小产物模板。

因此本轮只能生成候选投影，不能判断最终写入形态是否稳定。

后续需要单独设计：

- spec module 最小模板。
- guide page 最小模板。
- wiki page / concept node 最小模板。
