---
status: draft
created: 2026-05-18
updated: 2026-05-19
owner: sayori
source_task: 08-promote-pick-dry-run
---

# docwarden review workflow

本目录是 `08-promote-pick-dry-run` 的 review artifact。

## 目的

本轮 review 用于审查 docwarden review workflow 的主线基线表达。

## review 单元

本轮只有一个 lead：

```text
lead.md
```

user 应 review `lead.md` 的内容是否成立。

如果需要校验来源、边界或上下文，再查看：

```text
backing.md
```

## 文件索引

- `index.md`：review artifact 入口，状态：draft。
- `lead.md`：本轮最小 user review 单元，状态：draft。
- `backing.md`：lead 的承载层，状态：draft。

## 来源 task

本 review artifact 来自：

```text
.docwarden/task/08-promote-pick-dry-run/
```

## 当前边界

本轮 review 不审查：

- md/html renderer config。
- spec / guide / wiki 的最终文件模板。
- pick 的最终承接层。
- 真实 CLI 行为。
- cleanup 的具体命令实现。

这些内容应在后续 review 中处理。
