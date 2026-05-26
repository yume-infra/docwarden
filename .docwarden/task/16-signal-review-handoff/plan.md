---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# signal review handoff 计划

## Loop 1：handoff boundary

状态：accepted。

目标：确认 semantic-lint result 如何进入 docwarden review surface。

已确认：

- signal 不直接成为 lead。
- signal definition 不生成 lead。
- semantic-lint result 应尽可能组织成 review-ready `lead + backing`。
- Basis 通过 signal definition 回读，不在 lint result 中重复。
- trigger hit / confidence 是 backing material，不上升为必填 schema。

当前产物：

- `handoff-boundary-review.md`

## Loop 2：mechanism completion

状态：accepted。

目标：在职责拆分后，复用已有 review surface，简化 signal lint result 的进入方式。

当前修正方向：

- 不新增 handoff relation。
- 不新增 review material reading rule。
- 不新增 judgment return boundary。
- semantic-lint 的结果应尽可能接近 `lead + backing`。
- lint result 如果已经足够好，docwarden review surface 走短路径。
- signal definition 仍保持 `Definition / Trigger / Basis`，不承担 review frame 生成。

已落地：

- 修订 `.contexta/mapping/bootstrap/structures/pipeline/semantic-lint.md`。
- 修订 `.contexta/mapping/bootstrap/relations/semantic-lint-chain.md`。
- 修订 `.contexta/mapping/bootstrap/relations/template-format-semantic-lint.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/semantic-lint.md`。

## 当前不做

- 不扩展 signal definition surface。
- 不建立完整 CLI output schema。
- 不定义 review artifact 最终 schema。
- 不伪造 lint dry run target。
- 不修改 `docs/`。

## Loop 3：target availability

状态：accepted。

目标：确认没有真实 target 时不做 dry run，并复用既有 target 设计。

当前结果：

- 可用 target 不是任意文件或 heading。
- target scope 说明哪些 md 可以被 semantic-lint 扫描。
- locator target 说明 signal 命中最终应指向哪条 assertion。
- 真正可进入 review-ready lint result 的 target，应有 assertion marker。
- 没有 assertion marker 时，只能保留为 candidate / context。

当前产物：

- `target-availability-review.md`

## Loop 4：assertion commitment

状态：accepted。

目标：稳定 assertion 本身，再继续推 locator / magic-word / semantic-lint。

已确认：

- semantic-lint 的第一步不是定义 anchor，而是确认 md 中什么内容可以成为 assertion。
- assertion 不是语法单位，而是 module 内最小可审查 semantic commitment。
- assertion 不表示内容已经正确；错误、越界、重复或模糊的承诺仍然可以成为 assertion。
- assertion qualification 由 Object、Commitment、Reviewability、Module Ownership 四项组成。
- assertion 可以由 section、paragraph、list item、table row、frontmatter field 等 md surface 承载。
- 保留 `assertion` 作为 canonical magic word，不改名为 `promise`。
- `promise` 过于偏行为义务和履约关系，不适合作为定义性 md 内容的核心术语。
- assertion 本身不保存 correctness marker。
- review 通过后，不把 assertion 改写为 correct assertion；promote / accepted scope 表示它成为当前稳定口径。

已落地：

- 修订 `.contexta/mapping/bootstrap/modules/concept/assertion.md`。
- 同步 `.contexta/mapping/bootstrap/modules/concept/module.md`。
- 同步 `.contexta/mapping/bootstrap/modules/concept/structure/composition.md`。
- 新增 `.contexta/mapping/bootstrap/structures/composition/module-assertion.md`。
- 同步 `.contexta/mapping/bootstrap/relations/module-assertion-composition.md`。
