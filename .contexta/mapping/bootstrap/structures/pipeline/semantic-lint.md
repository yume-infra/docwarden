---
kind: pipeline
---

# semantic-lint

## Input

- formatted md，由 [[mapping/bootstrap/modules/concept/format|format]] 在持续编辑中保持可消费形态。
- signal modules：
  - [[mapping/bootstrap/modules/signal/concept-as-policy|concept-as-policy]]
  - [[mapping/bootstrap/modules/signal/workflow-as-policy|workflow-as-policy]]
  - [[mapping/bootstrap/modules/signal/architecture-as-responsibility-card|architecture-as-responsibility-card]]
  - [[mapping/bootstrap/modules/signal/template-owns-lifecycle|template-owns-lifecycle]]
  - [[mapping/bootstrap/modules/signal/example-as-kind|example-as-kind]]
  - [[mapping/bootstrap/modules/signal/composition-as-list|composition-as-list]]
- token roles：[[mapping/bootstrap/modules/concept/magic-word|magic-word]]。
- locator target：带有 `^a-*` marker 的 [[mapping/bootstrap/modules/concept/assertion|assertion]]。

## Transform

1. [[mapping/bootstrap/modules/concept/trigger|trigger]] 直接检查 formatted md 中稳定存在的 path、frontmatter、heading、section、OFM link、marker 和 magic word。
2. [[mapping/bootstrap/modules/concept/signal|signal]] definition 命名语义偏移 warning，并生成 signal candidate。
3. [[mapping/bootstrap/modules/concept/confidence|confidence]] 根据命中来源标记 candidate 的置信度。
4. [[mapping/bootstrap/modules/concept/locator|locator]] 在 candidate 可以指向 `^a-*` assertion marker 时，把 candidate 升级为 signal instance。
5. 没有 assertion marker 的命中保留为 candidate，不直接升级为 instance。

## Output

- signal candidate：有 trigger evidence，但缺少 assertion locator。
- signal instance：有 signal、trigger evidence、confidence 和 assertion locator。

## Boundary

本文件是 semantic-lint 的 pipeline structure，不重新定义 [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]。

semantic-lint 相关 concept 仍由 `modules/concept` 维护；本 pipeline 只编排这些 concept 如何共同形成检测链路。

当前只作为 contexta 的 structure reference，不是 CLI engine spec。
