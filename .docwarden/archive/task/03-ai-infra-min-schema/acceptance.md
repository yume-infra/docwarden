---
status: accepted
created: 2026-05-12
updated: 2026-05-13
owner: sayori
loop: 5
review: accepted
---

# 验收与 dry run

本文件记录 Loop 5 已通过 review 的 working 定义，用于定义当前最小 schema 如何证明自己有用。

由于 promote / pick 的触发和编排当前不开展，本轮 dry run 不模拟完整 promote / pick。

本轮只验证：当前 schema 是否能支撑 `.docwarden/task/` 内的 working 任务推进，并且能暴露明显结构问题。

## 验收分层

验收分两层：

1. 脚本结构检查。
2. 人工 / agent 语义检查。

脚本只检查可以机械判断的规则。

语义检查由 agent 根据当前 working 文件阅读判断，并交给 sayori review。

## 脚本结构检查

脚本位置：

```text
.docwarden/task/03-ai-infra-min-schema/scripts/check-working-schema.mjs
```

当前检查项：

- 工作面存在 `index.md`。
- 工作面存在 `log.md`。
- 顶层 `.md` 文件都有 frontmatter。
- 顶层 `.md` 文件都有 `status`。
- 文件状态只允许 `draft`、`reviewing`、`accepted`。
- `index.md` 有 `workspace_status`。
- `workspace_status` 只允许 `active`、`paused`、`closed`。
- 只有 `index.md` 可以有 `workspace_status`。
- `index.md` 文件索引提到所有顶层 `.md` 文件。

运行方式：

```bash
rtk node .docwarden/task/03-ai-infra-min-schema/scripts/check-working-schema.mjs .docwarden/task/03-ai-infra-min-schema
```

## 语义检查

语义检查不脚本化。

当前检查项：

- agent 进入工作面时可以从 `index.md` 理解边界、来源基线、文件散发关系和下一步。
- `log.md` 只记录时间线，不承担主线解释。
- `.docwarden` 被视为 agent 工作区。
- `docs/` 在当前项目里保持只读。
- 当前流程没有建立 docs 修改建议流。
- `working` 被视为短命层。
- `promote` 被视为 working -> agent-oriented stable 的主路径。
- `pick` 被视为 working -> long-lived side material 的支路。
- 当前不定义 promote / pick 的触发和编排。

## 本次 dry run 结果

样本工作面：

```text
.docwarden/task/03-ai-infra-min-schema
```

脚本结构检查结果：

- pass。

运行输出：

```text
note: checked 9 markdown files in /Users/sayori/Desktop/docwarden/.docwarden/task/03-ai-infra-min-schema
pass: working schema structure check passed
```

语义检查结果：

- `index.md` 已能作为 lead file 指向边界、来源基线、文件索引和下一步。
- Loop 1 词表仍只是可容忍工作定义，不是稳定理论定义。
- Loop 2 已定义命名、lead file、文件索引和两层状态。
- Loop 3 已明确 `.docwarden` 是 agent 工作区，`docs/` 当前只读，不维护 docs 修改建议流。
- Loop 4 已修正 `pick` 语义，并明确本轮不开展 promote / pick 编排。

当前结论：

- `pass-with-notes`

原因：

- 结构层已经可以被最小脚本检查。
- 流程层可以支撑当前 working 任务推进。
- 但词表仍在对齐中，不能标记为完全稳定。

## 失败模式

本轮 dry run 主要捕获这些失败模式：

- agent 不读 `index.md` 就创建文件。
- `index.md` 文件索引漏掉工作面文件。
- 文件缺少 frontmatter 或 `status`。
- 工作面状态和文件状态混用。
- agent 把 `docs/` 当成默认可编辑区。
- agent 在当前阶段创建 docs 修改建议流。
- agent 把 working 当长期 stable。
- agent 把 pick 理解成 review 选择动作。
- agent 在未开展编排时试图定义 promote / pick 触发流程。

## Review 问题

这套两层 dry run 是否可以作为 Loop 5 的 working 定义？

## Review 状态

sayori 已接受这套两层 dry run 作为当前 working 定义。
