---
status: accepted
created: 2026-05-12
updated: 2026-05-12
owner: sayori
loop: 3
review: accepted
---

# 文档操作规则

本文件记录 Loop 3 已通过 review 的 working 定义，用于定义当前项目中 agent 对 `.docwarden/task/` 和 `docs/` 的操作边界。

## 核心判断

`.docwarden` 是 agent 的工作区。

agent 不但可以在 `.docwarden` 中创建和修改 working material，而且本来就应该在这里完成文档维护 workflow 的工作。

当前项目里，`docs/` 是 sayori 自己编写和 review 的可信理论源。agent 默认只能读取 `docs/`，不能编辑。

本轮流程不维护任何 docs 修改建议。

涉及 `docs/` 的内容，agent 只在对话中作为回答、解释或普通建议给出。是否维护到 `docs/`，由 sayori 自己决定。

## agent 可以自动做的事

agent 可以在 `.docwarden/task/` 下自动执行这些动作：

- 创建新的工作面目录。
- 创建或修改工作面的 `index.md`。
- 创建或追加工作面的 `log.md`。
- 创建或修改该工作面内的草案文件。
- 更新 `index.md` 的文件索引。
- 根据 review 结果更新 working 文件状态。
- 在 `log.md` 中记录关键事件。

这些动作不需要额外授权，因为它们发生在 agent 的工作区内。

## agent 不能自动做的事

agent 不能自动执行这些动作：

- 修改 `docs/` 下的文件。
- 将 `.docwarden/task/` 中的内容直接移动到 `docs/`。
- 为 `docs/` 创建专门的修改建议文件或修改建议目录。
- 把 working material 伪装成 stable docs。

如果对 `docs/` 有想法，agent 应该在对话中回答或说明，而不是在 working 流程中创建 docs 修改建议。

## 需要 sayori 明确授权的事

只有 sayori 明确要求修改某个具体 `docs/` 文件时，agent 才可以编辑该文件。

授权应该足够具体，至少包括：

- 要修改的 `docs/` 文件路径。
- 修改目标或允许的修改范围。

如果授权不明确，agent 应该先问清楚，而不是自行解释为可以编辑 `docs/`。

## 当前不做

本轮不建立：

- docs 修改建议流
- docs 修改建议目录
- 自动进入 stable 的流程
- 面向 user 的 stable 表达层

这些可能属于后续 `docwarden` 的 user 层级设计，不属于当前最小 schema。

## Review 问题

这组操作规则是否可以作为 Loop 3 的 working 定义？

## Review 状态

sayori 已接受这组操作规则作为当前 working 定义。
