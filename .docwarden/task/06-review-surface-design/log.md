---
status: draft
created: 2026-05-13
updated: 2026-05-18
owner: sayori
---

# review surface 设计日志

## [2026-05-13] setup | 创建 paused task

创建 `06-review-surface-design` task。

本任务等待 `05-review-input-design` 完成后再推进。

## [2026-05-18] capture | 从 05 迁移 surface 职责

05 讨论中明确：

- review input = material + current agent context。
- surface 的目的，是把 input 处理成 lead + backing。
- lead 是最小 user 可审核单元。
- backing 是被 lead 统摄、用于支撑 / 展开 / 校验 lead 的材料层。
- HTML 应该引入在 review surface 层，而不是 input 或 trace。

已创建 `review-surface-role.md` 记录这些判断。
