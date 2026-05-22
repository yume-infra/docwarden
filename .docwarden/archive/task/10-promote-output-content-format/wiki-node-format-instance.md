---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 4
candidate_target: .docwarden/wiki/review-workflow.md
source_review: .docwarden/review/docwarden-review-workflow/lead.md
---

# wiki node format instance

本文件是 promote 后 `wiki node` 的候选内容实例，不是真实写入。

## 候选目标

```text
.docwarden/wiki/review-workflow.md
```

## 候选内容

```md
# review workflow

docwarden 的 review workflow 是从短命 task 到长期层的主流程。

## Core claims

- task 是短命任务过程层。
- review surface 在 promote 前生成。
- review surface 的核心输出是 lead + backing。
- user review 一次只审一个 lead。
- promote 只处理项目主线基线 delta。
- promote 不搬运 raw material 或完整 review surface。
- pick 在 promote 之后发生。
- pick 处理 promote 隐去但可复利的用户层资产。
- cleanup 在 promote 和 pick 完成后接手。
- cleanup 默认 delete task working materials，可配置 archive。

## Links

- [[task]]
- [[review surface]]
- [[lead]]
- [[backing]]
- [[user review]]
- [[promote]]
- [[pick]]
- [[cleanup]]
- [[spec]]
- [[guide]]

## Relations

- review workflow consumes task material through review surface.
- review workflow produces promote candidates for spec / guide / wiki.
- review workflow routes side assets through pick.
- review workflow ends with cleanup.

## Boundary

review workflow 不等于 review surface。

review workflow 不等于 renderer。

review workflow 不定义 contexta 内容格式。
```

## 格式判断

这个候选适合作为 `wiki node`，因为它以核心 claims、links 和 relations 组织可复用知识。

它不承担 guide 的线性解释，也不承担 spec 的完整执行规则。

## Review

sayori 确认主要内容方向已跑通。

具体内容类型约束转入后续 contexta 约束设计。
