---
status: draft
created: 2026-05-18
updated: 2026-05-19
owner: sayori
source_task: 08-promote-pick-dry-run
---

# docwarden review workflow backing

本文件是 `lead.md` 的 backing。

它只承担承载职责：支撑、展开和校验 `lead.md`。

## 来源覆盖

| lead 审核点 | backing material | 支撑关系 |
| --- | --- | --- |
| 1. task 是短命任务过程层 | `.docwarden/task/04-task-review-spec-pipeline/pipeline-positioning.md`、`.docwarden/task/04-task-review-spec-pipeline/pipeline-structure.md` | 04 已确认 `task` 替代 working，承载过程材料，且不是长期知识层。 |
| 2. review surface 发生在 promote 之前 | `.docwarden/task/06-review-surface-design/review-surface-role.md`、`.docwarden/task/06-review-surface-design/surface-generation-rules.md`、`.docwarden/task/07-review-trace-design/promote-rules.md` | 06 确认 surface 生成 `lead + backing`；07 确认主流程 surface 是为 promote 准备的审查面。 |
| 3. user review 审查一个 lead | `.docwarden/task/05-review-input-design/lead-rules.md`、`.docwarden/task/06-review-surface-design/review-frame.md` | 05/06 确认 lead 是最小 user 可审核单元，多 lead 应上收或拆分。 |
| 4. promote 处理项目主线基线 delta | `.docwarden/task/07-review-trace-design/promote-rules.md` | 07 确认 promote 的核心不是搬运内容，而是主线基线 delta。 |
| 5. pick 发生在 promote 之后 | `.docwarden/task/07-review-trace-design/pick-rules.md` | 07 确认 pick 是 promote 后的信息损失控制，且其去向一定是用户层级资产。 |
| 6. cleanup 默认 delete，可配置 archive | `.docwarden/task/07-review-trace-design/promote-pick-log-boundary.md` | 07 确认完成 promote + pick 后默认 delete，并通过 config 支持 archive。 |

## 本轮 current agent context

本轮 surface 使用了以下当前对话上下文：

- 本次是 dry run，不直接写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- review artifact 应放在 `.docwarden/review/`，不是 task 目录。
- 本轮 review artifact 使用 `.docwarden/review/docwarden-review-workflow/`。
- review artifact 的 `index.md` 只做入口和交接，不承载 lead 正文。
- `lead.md` 是本轮唯一 user review 单元，内部以人类可读的审核点暴露关键断言。
- `backing.md` 是被 `lead.md` 统摄的承载层。

这些判断影响本 review artifact 的结构，因此显式放入 backing。

## 不纳入本轮 lead 的内容

以下内容存在于相关讨论或后续计划中，但不进入本轮 lead：

- md/html renderer config。
- spec / guide / wiki 的最终模板。
- pick 的最终承接层。
- 真实 CLI 行为。
- cleanup 的具体命令实现。

原因是它们不能被当前 lead 统摄。

如果强行纳入，会把本轮从“review workflow baseline”扩大成多个独立 lead。

## 拆分判断

本轮没有拆成多个 review，是因为当前 lead 只处理一个主线问题：

```text
docwarden 的 review workflow 主线基线是什么？
```

renderer config、长期层模板、pick 最终承接层、CLI 行为、cleanup 命令实现都应作为后续 review。
