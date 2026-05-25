---
kind: relation
---

# semantic-lint-chain

## Network

本 relation file 维护 [[mapping/bootstrap/modules/concept/signal|signal]]、[[mapping/bootstrap/modules/concept/trigger|trigger]]、[[mapping/bootstrap/modules/concept/confidence|confidence]]、[[mapping/bootstrap/modules/concept/locator|locator]]、[[mapping/bootstrap/modules/concept/assertion|assertion]] 与 [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]、[[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]] 之间的 semantic-lint chain 连接。

## `warning-language-of`

From:

- [[mapping/bootstrap/modules/concept/signal|signal]]
- [[mapping/bootstrap/modules/concept/trigger|trigger]]
- [[mapping/bootstrap/modules/concept/confidence|confidence]]

To:

- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]

Reading:

沿 `warning-language-of` 读取时，signal 命名 warning type，trigger 提供可观察条件，confidence 标记识别强度；三者共同服务 semantic-lint 的检测语言。

本 relation file 不重复定义这些 concept；定义回到各自 concept module。

Read next:

- Definition: [[mapping/bootstrap/modules/concept/semantic-lint#Definition|semantic-lint#Definition]], [[mapping/bootstrap/modules/concept/signal#Definition|signal#Definition]], [[mapping/bootstrap/modules/concept/trigger#Definition|trigger#Definition]], [[mapping/bootstrap/modules/concept/confidence#Definition|confidence#Definition]]
- Constraint: [[mapping/bootstrap/modules/policy/semantic-lint-boundary|semantic-lint-boundary]], [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]

## `pipeline-realizes`

From:

- [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]]

To:

- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]

Reading:

沿 `pipeline-realizes` 读取时，semantic-lint pipeline 表达 semantic-lint 如何从 formatted md 转换出 signal candidate / signal instance。

pipeline 不重新定义 semantic-lint，也不拥有 signal definitions。

Read next:

- Pipeline: [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]]
- Concept: [[mapping/bootstrap/modules/concept/structure/pipeline#Definition|pipeline#Definition]], [[mapping/bootstrap/modules/concept/semantic-lint#Definition|semantic-lint#Definition]]
- Relation: [[mapping/bootstrap/relations/template-format-semantic-lint|template-format-semantic-lint]]
- Signal modules: [[mapping/bootstrap/modules/signal/concept-as-policy|concept-as-policy]], [[mapping/bootstrap/modules/signal/workflow-as-policy|workflow-as-policy]], [[mapping/bootstrap/modules/signal/architecture-as-responsibility-card|architecture-as-responsibility-card]], [[mapping/bootstrap/modules/signal/template-owns-lifecycle|template-owns-lifecycle]], [[mapping/bootstrap/modules/signal/example-as-kind|example-as-kind]], [[mapping/bootstrap/modules/signal/composition-as-list|composition-as-list]]

## `instance-target`

From:

- [[mapping/bootstrap/modules/concept/locator|locator]]

To:

- [[mapping/bootstrap/modules/concept/assertion|assertion]]

Reading:

沿 `instance-target` 读取时，signal instance 通过 locator 指向 assertion marker。

locator 提供定位，不判断 assertion 是否正确。

Read next:

- Definition: [[mapping/bootstrap/modules/concept/locator#Definition|locator#Definition]], [[mapping/bootstrap/modules/concept/assertion#Definition|assertion#Definition]]
- Pipeline: [[mapping/bootstrap/structures/pipeline/semantic-lint#Output|semantic-lint pipeline#Output]]
