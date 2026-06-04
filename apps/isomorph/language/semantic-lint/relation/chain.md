---
kind: relation
---

# semantic-lint-chain

## Network

本 relation file 维护 [[language/semantic-lint/concept/signal|signal]]、[[language/semantic-lint/concept/trigger|trigger]]、[[language/recognition/concept/confidence|confidence]]、[[language/recognition/concept/locator|locator]]、[[language/primitive/concept/assertion|assertion]] 与 [[language/semantic-lint/concept/semantic-lint|semantic-lint]]、[[language/semantic-lint/pipeline/semantic-lint|semantic-lint pipeline]] 之间的 semantic-lint chain 连接。

## `warning-language-of`

From:

- [[language/semantic-lint/concept/signal|signal]]
- [[language/semantic-lint/concept/trigger|trigger]]
- [[language/recognition/concept/confidence|confidence]]

To:

- [[language/semantic-lint/concept/semantic-lint|semantic-lint]]

Reading:

沿 `warning-language-of` 读取时，signal 命名语义偏移提示，trigger 提供可观察条件，confidence 标记识别强度；三者共同服务 semantic-lint 的检测语言。

本 relation file 不重复定义这些 concept；定义回到各自 concept module。

Read next:

- Definition: [[language/semantic-lint/concept/semantic-lint#Definition|semantic-lint#Definition]], [[language/semantic-lint/concept/signal#Definition|signal#Definition]], [[language/semantic-lint/concept/trigger#Definition|trigger#Definition]], [[language/recognition/concept/confidence#Definition|confidence#Definition]]
- Constraint: [[language/grammar/policy/semantic-lint-boundary|semantic-lint-boundary]], [[language/grammar/policy/signal-boundary|signal-boundary]]

## `pipeline-realizes`

From:

- [[language/semantic-lint/pipeline/semantic-lint|semantic-lint pipeline]]

To:

- [[language/semantic-lint/concept/semantic-lint|semantic-lint]]

Reading:

沿 `pipeline-realizes` 读取时，semantic-lint pipeline 表达 semantic-lint 如何从 formatted md 产生 signal，并尽可能把 signal 命中组织成 review-ready lint result。

pipeline 不重新定义 semantic-lint，也不拥有 signal definitions。

review-ready lint result 复用 [[loop/lead-review/concept|lead-review]] 的 `lead + backing` 口径；如果它已经足够清晰，docwarden review surface 可以作为 dogfood projection 走短路径。

Read next:

- Pipeline: [[language/semantic-lint/pipeline/semantic-lint|semantic-lint pipeline]]
- Concept: [[language/structure/concept/pipeline#Definition|pipeline#Definition]], [[language/semantic-lint/concept/semantic-lint#Definition|semantic-lint#Definition]], [[loop/lead-review/concept#Definition|lead-review#Definition]]
- Relation: [[language/semantic-lint/relation/template-format|template-format-semantic-lint]]
- Signal modules: [[lint/signal/concept-as-policy|concept-as-policy]], [[lint/signal/workflow-as-policy|workflow-as-policy]], [[lint/signal/architecture-as-responsibility-card|architecture-as-responsibility-card]], [[lint/signal/template-owns-lifecycle|template-owns-lifecycle]], [[lint/signal/example-as-kind|example-as-kind]], [[lint/signal/composition-as-list|composition-as-list]]

## `locator-target`

From:

- [[language/recognition/concept/locator|locator]]

To:

- [[language/primitive/concept/assertion|assertion]]

Reading:

沿 `locator-target` 读取时，locator 让 signal 可以指向 locator marker。

locator 提供定位，不判断 assertion 是否正确。

Read next:

- Definition: [[language/recognition/concept/locator#Definition|locator#Definition]], [[language/primitive/concept/assertion#Definition|assertion#Definition]]
- Pipeline: [[language/semantic-lint/pipeline/semantic-lint#Output|semantic-lint pipeline#Output]]
