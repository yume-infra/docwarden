---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# signal review handoff log

## [2026-05-26] task-started | 设计 signal 进入 review 的交接边界

sayori 接受下一步方向：讨论 signal 进入 review 的交接边界。

当前前置结论：

- `formatted md -> semantic-lint -> signal -> review`。
- semantic-lint 的产物是 signal。
- signal definition surface 是 `Definition / Trigger / Basis`。
- review input 是 `material + current agent context`。
- review surface 生成 `lead + backing`。

当前判断：

- signal 不应直接成为 lead。
- signal 应作为 review input material。
- review surface 再生成 lead + backing。

已生成：

- `handoff-boundary-review.md`

## [2026-05-26] loop-1-accepted | 接受 signal handoff boundary

sayori 接受 4 个判断：

- signal 进入 review 时只是 material，不直接成为 lead。
- lint result 最小围绕 signal name + locator/context 组织 review material。
- Basis 通过 signal definition 回读，不在 lint result 中重复。
- trigger hit / confidence 先作为可选材料，不上升为必填 schema。

当前关键认识：

- 如果 signal 直接成为 lead，contexta 就越界替 docwarden 生成 review surface。
- signal handoff 应保持为交接边界，不应提前变成完整 CLI schema。

## [2026-05-26] loop-2-correction | 复用 review surface 而不是新增机制

sayori 纠偏：

- lint result 应尽可能贴近 review surface 处理后的 `lead + backing`。
- lint result 最好就是好 review material。
- 不应遇到问题就新建 handoff relation、review material reading rule 或 judgment return boundary。
- 应最大限度利用已有 review surface 设计。

当前修正：

- signal definition 不生成 lead。
- semantic-lint 的具体结果可以组织成 review-ready `lead + backing`。
- docwarden review surface 对足够好的 lint result 走短路径。
- 当前继续避免设计完整 CLI output schema。

## [2026-05-26] loop-2-accepted | 落地 review-ready lint result 口径

sayori 确认当前方向已经想清楚。

已落地到现有 contexta 文件：

- semantic-lint pipeline 的 Output 改为 review-ready lint result。
- semantic-lint-chain relation 说明 pipeline 产出可走 review surface 短路径。
- template-format-semantic-lint relation 说明 emits 的结果不是 review judgment。
- semantic-lint concept 补充 review-ready lint result 口径。

当前仍不新增 handoff relation，不定义完整 CLI output schema。
