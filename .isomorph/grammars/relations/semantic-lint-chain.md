---
kind: relation
---

# semantic-lint-chain

## Network

本 relation file 维护 [[primitives/modules/concept/signal|signal]]、[[primitives/modules/concept/trigger|trigger]]、[[primitives/modules/concept/confidence|confidence]]、[[primitives/modules/concept/locator|locator]]、[[primitives/modules/concept/assertion|assertion]] 与 [[primitives/modules/concept/semantic-lint|semantic-lint]]、[[grammars/structures/pipeline/semantic-lint|semantic-lint pipeline]] 之间的 semantic-lint chain 连接。

## `warning-language-of`

From:

- [[primitives/modules/concept/signal|signal]]
- [[primitives/modules/concept/trigger|trigger]]
- [[primitives/modules/concept/confidence|confidence]]

To:

- [[primitives/modules/concept/semantic-lint|semantic-lint]]

Reading:

沿 `warning-language-of` 读取时，signal 命名语义偏移提示，trigger 提供可观察条件，confidence 标记识别强度；三者共同服务 semantic-lint 的检测语言。

本 relation file 不重复定义这些 concept；定义回到各自 concept module。

Read next:

- Definition: [[primitives/modules/concept/semantic-lint#Definition|semantic-lint#Definition]], [[primitives/modules/concept/signal#Definition|signal#Definition]], [[primitives/modules/concept/trigger#Definition|trigger#Definition]], [[primitives/modules/concept/confidence#Definition|confidence#Definition]]
- Constraint: [[grammars/modules/policy/semantic-lint-boundary|semantic-lint-boundary]], [[grammars/modules/policy/signal-boundary|signal-boundary]]

## `pipeline-realizes`

From:

- [[grammars/structures/pipeline/semantic-lint|semantic-lint pipeline]]

To:

- [[primitives/modules/concept/semantic-lint|semantic-lint]]

Reading:

沿 `pipeline-realizes` 读取时，semantic-lint pipeline 表达 semantic-lint 如何从 formatted md 产生 signal，并尽可能把 signal 命中组织成 review-ready lint result。

pipeline 不重新定义 semantic-lint，也不拥有 signal definitions。

review-ready lint result 复用 docwarden review surface 的 `lead + backing` 口径；如果它已经足够清晰，review surface 可以走短路径。

Read next:

- Pipeline: [[grammars/structures/pipeline/semantic-lint|semantic-lint pipeline]]
- Concept: [[primitives/modules/concept/structure/pipeline#Definition|pipeline#Definition]], [[primitives/modules/concept/semantic-lint#Definition|semantic-lint#Definition]]
- Relation: [[grammars/relations/template-format-semantic-lint|template-format-semantic-lint]]
- Signal modules: [[lint/modules/signal/concept-as-policy|concept-as-policy]], [[lint/modules/signal/workflow-as-policy|workflow-as-policy]], [[lint/modules/signal/architecture-as-responsibility-card|architecture-as-responsibility-card]], [[lint/modules/signal/template-owns-lifecycle|template-owns-lifecycle]], [[lint/modules/signal/example-as-kind|example-as-kind]], [[lint/modules/signal/composition-as-list|composition-as-list]]

## `locator-target`

From:

- [[primitives/modules/concept/locator|locator]]

To:

- [[primitives/modules/concept/assertion|assertion]]

Reading:

沿 `locator-target` 读取时，locator 让 signal 可以指向 locator marker。

locator 提供定位，不判断 assertion 是否正确。

Read next:

- Definition: [[primitives/modules/concept/locator#Definition|locator#Definition]], [[primitives/modules/concept/assertion#Definition|assertion#Definition]]
- Pipeline: [[grammars/structures/pipeline/semantic-lint#Output|semantic-lint pipeline#Output]]
