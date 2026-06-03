# Practice

本目录组织当前可执行推进事项。

`docs/concept/` 记录概念口径；`docs/practice/` 记录围绕这些概念口径要做什么、先做什么、哪些内容不属于当前分支。

## Active Work

- [[docs/practice/main-architecture-refactor|main-architecture-refactor]]
- [[docs/practice/target-layer-shape|target-layer-shape]]
- [[docs/practice/contexta-pack-model|contexta-pack-model]]
- [[docs/practice/codex-export-boundary|codex-export-boundary]]

## Acceptance Checklist

- 先确认概念文档与实践口径一致：`docs/concept/user.md`、`docs/concept/layers.md`。
- 再按 `[[docs/practice/target-layer-shape|target-layer-shape]]` 的清单核对迁移完成度。
- 最后执行 `[[docs/practice/main-architecture-refactor|main-architecture-refactor]]` 的最终验收项。

## Boundary

当前 `refactor/layers` worktree 负责主架构改造。

职责边界不是文件禁区。本分支可以触碰架构迁移需要的路径，但后续 merge 时必须区分冲突性质。

主工作区 `/Users/sayori/Desktop/docwarden` 正在推进 docwarden v1、isomorph primitive、skill-primitive 实现和相关 runtime 改动。

若冲突属于目录职责、层级边界或旧架构清理，优先保留本分支的干净架构。若冲突属于 docwarden v1、primitive runtime 内部实现或具体 skill-primitive 内容，优先尊重主工作区实现，再适配到新架构。
