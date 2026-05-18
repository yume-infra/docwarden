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

## [2026-05-18] activate | 启动 06

05 已关闭。

当前启动 `06-review-surface-design`。

本任务先围绕 surface role 与 lead / backing 结构推进。

## [2026-05-18] capture | 从 05 迁移 surface 职责

05 讨论中明确：

- review input = material + current agent context。
- surface 的目的，是把 input 处理成 lead + backing。
- lead 是最小 user 可审核单元。
- backing 是被 lead 统摄、用于支撑 / 展开 / 校验 lead 的材料层。
- HTML 应该引入在 review surface 层，而不是 input 或 trace。

已创建 `review-surface-role.md` 记录这些判断。

## [2026-05-18] loop-1 | surface role review 通过

sayori 已确认 surface 链路：

```text
material + current agent context
  -> review surface
  -> lead + backing
  -> user review
```

已将 `review-surface-role.md` 标记为 accepted。

下一步进入 Loop 2：surface generation rules。

## [2026-05-18] loop-2 | 重起草 surface generation rules

sayori 指出，之前将 surface 拆成 UI 内容块的草案不对。

纠偏：

- surface 的核心不是页面最少有哪些块。
- surface 的核心是如何从 `material + current agent context` 生成 `lead + backing`。
- HTML 不能倒推 surface 结构。
- user action / trace 不应提前塞进 surface 最小结构。

已删除错误的 `surface-minimum-blocks.md`，并创建 `surface-generation-rules.md`。

## [2026-05-18] loop-2 | surface generation rules review 通过

sayori 确认：

- surface 职责层已经基本闭合。
- `md/html` 应通过 config 选择。
- 后续设计 config 时，需要一并收拢所有决策点。
- 现在应该进入 review frame 设计。

已将 `surface-generation-rules.md` 标记为 accepted。

下一步进入 Loop 3：review frame。

## [2026-05-18] loop-3 | 修正 review frame 设计

sayori 指出此前的 review frame 草案不符合前面已经确认的内容。

当前修正：

- review frame 不应该额外发明 `generation_notes` 作为必备块。
- review frame 是 surface 输出给 renderer 的结构化结果。
- review frame 的核心结构就是 `lead + backing`。
- 如果生成说明对 user 审核 lead 有必要，应进入 backing。
- 如果生成说明只用于过程追溯，应留到 decision trace / provenance 设计中处理。

## [2026-05-18] loop-3 | review frame review 通过

sayori 确认此前纠偏后的流程判断是正确的。

当前确认：

- `review input` 是输入集合的命名，不是额外阶段。
- `review frame` 是 surface 输出结构，不是额外阶段。
- `renderer` 是 `md/html` 呈现实现，不进入 review 理论主流程。
- surface 的核心仍是从 `material + current agent context` 生成 `lead + backing`。

已将 `review-frame.md` 标记为 accepted。
