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
- 不修改 `docs/`。
