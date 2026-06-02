---
status: closed
workspace_status: closed
created: 2026-06-01
updated: 2026-06-02
owner: sayori
---

# Docwarden V0 Dogfood Workflow

## Closed

本 task 已收口。

已形成 docwarden v0 可运行主链路：

```text
docwarden init
  -> docwarden task create
  -> docwarden review --task
  -> docwarden promote / pick
```

后续不再在本 task 中继续扩展命令面。第一轮 dogfood 暴露的产物质量问题已转入 `.docwarden/task/26-docwarden-artifact-quality-loop/`。

## Context

本 task 承接当前纠偏后的实现方向：在本仓库 dogfood docwarden 自己，而不是继续把 `review surface` 当成主 workflow。

当前仓库已经有 `.docwarden/`，并且手工存在 `task / review / spec / guide / wiki` 等目录入口。

但这些内容大多仍是占位或历史 dry run，实际 CLI 只跑通了：

- `docwarden init`
- `docwarden review --target <path>`

这还没有形成原始理论要求的文档维护链路。

## Theory Baseline

本 task 以 `docs/文档体系建设/理念-v2.md` 和 `docs/文档体系建设/理念-v4.md` 的当前口径为基线：

```text
task -> review system -> spec
                    -> guide
                    -> wiki
```

其中：

- `task` 承接短期上下文和过程材料。
- `review system` 从 task 中提炼最小 user review surface。
- `promote` 将 review 后的主线稳定内容进入 `spec / guide / wiki`。
- `pick` 从 task 中提取非主线但有长期价值的 side 内容。

## Objective

让 docwarden v0 在当前仓库中具备最小可 dogfood workflow：

```text
docwarden init
  -> docwarden task create
  -> docwarden review --task
  -> docwarden promote / pick
```

第一阶段只追求可运行主链路，不追求完整智能提炼。

## Current State

已经存在：

- `.docwarden/task/`：短命任务过程层，但旧 task 风格不统一。
- `.docwarden/review/`：已有历史 review artifacts，但缺少可复用 workflow。
- `.docwarden/spec/index.md`：稳定层入口占位。
- `.docwarden/guide/index.md`：稳定层入口占位。
- `.docwarden/wiki/index.md`：稳定层入口占位。
- `apps/docwarden`：已有 `init` 和低层 `review --target`。

主要缺口：

- `docwarden init` 没有生成完整理论最小结构。
- 没有 `task create`，workflow 没有标准过程材料入口。
- `review` 仍然面向任意 target，而不是面向 task material。
- 没有 `promote / pick` 的最小执行入口。
- `spec / guide / wiki` 没有被 workflow 实际写入或维护。

## Boundary

- 本 task 可以修改 `.docwarden/task/25-docwarden-v0-dogfood-workflow/` 和相关实现代码。
- 默认不修改 `docs/`；`docs/` 只作为理论来源。
- 不把 `contexta` 重新变成 docwarden workflow。
- 不把 `isomorph` 变成 task / review / promote / pick 编排层。
- 不引入新的 registry / diagnose / run 主链路来替代原始理论。
- `review --target` 可以保留为低层能力，但不能作为 docwarden 主入口。

## Next Entry

- `.docwarden/task/26-docwarden-artifact-quality-loop/`

## Task Surface

- `index.md`：当前工作面入口、目标、边界、状态。
- `plan.md`：实现阶段与验收标准。
- `log.md`：时间线，只记录事件，不承载主线解释。

后续如果需要草案，放入本 task 目录内的明确命名文件；不要把未 review 的内容写入 `spec / guide / wiki`。

## Next Entry

从 `plan.md` 开始执行。
