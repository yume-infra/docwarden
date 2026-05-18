---
status: draft
workspace_status: paused
created: 2026-05-13
updated: 2026-05-13
owner: sayori
---

# review trace 设计

本 task 目录用于起草 `docwarden` review decision / trace 的最小形态。

## 边界

- 本目录是对话产生的 task material。
- 本任务当前暂停，等待 `05-review-input-design` 和 `06-review-surface-design` 先完成。
- 本任务只设计 review 结束后必须留下什么 trace，不设计 review input，不设计 review surface。

## 来源基线

- `.docwarden/task/04-task-review-spec-pipeline/`
- `.docwarden/task/05-review-input-design/`
- `.docwarden/task/06-review-surface-design/`

## 当前判断

- review surface 本体短命。
- review decision / trace 需要可追溯。
- trace 的落点可能是 task log、独立 result 文件、目标产物 provenance 或 wiki decision 页面。

## 内容

- `log.md`：任务建立和后续循环进展的时间线记录。

## 文件索引

- `index.md`：工作面 lead file，状态：draft；同时通过 `workspace_status: paused` 表示本工作面等待后续推进。
- `log.md`：时间线记录，状态：draft；后续可继续追加。

## 下一步

等待 `05-review-input-design` 与 `06-review-surface-design` 完成后再启动。
