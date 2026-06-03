---
kind: pipeline
---

# semantic-lint

## Input

- formatted md，由 [[primitives/modules/concept/format|format]] 在持续编辑中保持可消费形态。
- signal modules：
  - [[lint/modules/signal/concept-as-policy|concept-as-policy]]
  - [[lint/modules/signal/workflow-as-policy|workflow-as-policy]]
  - [[lint/modules/signal/architecture-as-responsibility-card|architecture-as-responsibility-card]]
  - [[lint/modules/signal/template-owns-lifecycle|template-owns-lifecycle]]
  - [[lint/modules/signal/example-as-kind|example-as-kind]]
  - [[lint/modules/signal/composition-as-list|composition-as-list]]
- token roles：[[primitives/modules/concept/magic-word|magic-word]]。
- locator target：带有 `^<prefix>-<number>` marker 的 [[primitives/modules/concept/assertion|assertion]]。

## Transform

1. [[primitives/modules/concept/trigger|trigger]] 直接检查 formatted md 中稳定存在的 path、frontmatter、heading、section、OFM link、marker 和 magic word。
2. [[primitives/modules/concept/signal|signal]] definition 命名语义偏移风险，并产生 signal。
3. [[primitives/modules/concept/confidence|confidence]] 可以根据命中来源标记 signal 的识别强度。
4. [[primitives/modules/concept/locator|locator]] 可以在 signal 指向具体 assertion 时提供 locator marker。
5. semantic-lint 尽可能把 signal 命中组织成 review-ready lint result。
6. signal 进入 review 后才形成判断。

## Output

- review-ready lint result：semantic-lint 的输出，尽可能贴近 review surface 的 `lead + backing`。

review-ready lint result 至少围绕 signal 命中组织：

- lead：一次 signal 命中的最小审核问题。
- backing：signal name、locator 或 context、trigger hit、confidence，以及可通过 signal definition 回读的 Basis。

如果 review-ready lint result 已经足够清晰，docwarden review surface 可以走短路径。

如果它不足以支撑 user review，docwarden review surface 仍然负责重新组织 `lead + backing`。

Implementation detail:

- candidate：疑似 signal，通常缺少稳定 assertion locator。
- instance：一次已定位 signal 命中，通常带有 assertion locator。
- evidence：支持 signal 的检测材料。

## Boundary

本文件是 semantic-lint 的 pipeline structure，不重新定义 [[primitives/modules/concept/semantic-lint|semantic-lint]]。

semantic-lint 相关 concept 仍由 `modules/concept` 维护；本 pipeline 只编排这些 concept 如何共同形成检测链路。

candidate、instance 和 evidence 是未来 CLI lint step 的实现细节，不是 isomorph 核心对象。

review-ready lint result 不是完整 CLI schema；它只说明 semantic-lint 的结果应尽量成为好的 review material。
