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

## [2026-05-26] loop-3-accepted | 确认 dry run target 前置条件

sayori 确认：当前没有真实靶子时，不做 dry run。

同时纠偏：可用靶子之前已经设计过，不应重新发明。

当前复用既有口径：

- target scope：哪些 md 可以被 semantic-lint 扫描。
- locator target：带 assertion marker 的 assertion。
- module path / heading 只能作为 candidate context。
- 没有 assertion marker 时，不能直接升级成 review-ready lint result。

已生成：

- `target-availability-review.md`

## [2026-05-26] loop-4-accepted | 稳定 assertion 为语义承诺

sayori 确认：当前应先稳定 assertion 本身，再继续推 locator / magic-word / semantic-lint。

当前结论：

- semantic-lint 的第一步，是确认 md 中什么内容可以成为 assertion。
- assertion 是 module 内最小可审查 semantic commitment。
- assertion 不表示内容已经正确；它表示 module 对某个对象作出可被 review 和 semantic-lint 判断的语义承诺。
- 错误、越界、重复或模糊的承诺仍然可以成为 assertion。
- assertion qualification 由 Object、Commitment、Reviewability、Module Ownership 四项组成。
- assertion 可以由 section、paragraph、list item、table row、frontmatter field 等 md surface 承载。
- heading、transition text、link 或 format 通常不是 assertion 本身，但可以提供读取上下文、承载位置或辅助定位。
- 保留 `assertion` 命名，不改成 `promise`。
- `promise` 太偏主体行为义务和履约关系，不适合定义性 md 的语义审查对象。
- assertion 本身不保存 correctness marker。
- review 判断 assertion，promote / accepted scope 改变 assertion 的系统地位。
- accepted 表示当前稳定口径，不表示绝对正确。

已落地：

- `.contexta/mapping/bootstrap/modules/concept/assertion.md`
- `.contexta/mapping/bootstrap/modules/concept/module.md`
- `.contexta/mapping/bootstrap/modules/concept/structure/composition.md`
- `.contexta/mapping/bootstrap/structures/composition/module-assertion.md`
- `.contexta/mapping/bootstrap/relations/module-assertion-composition.md`

修正：

- module / assertion 是具体 composition instance，不应混入 composition concept 理论定义。
- 已按 structure file 规则移到 `structures/composition/`。
- `Stable Semantic Boundary` 是 composition 内部位置；`Module Scope` 是当前 md 文件的职责边界，避免继续使用两个 `Boundary` 标题造成混淆。

收口：

- 本轮 assertion commitment 建模已收口。
- 后续不继续为 assertion 增加 correctness 字段；等真实 target 或 CLI 实现参照物出现后，再推进 lint dry run。
