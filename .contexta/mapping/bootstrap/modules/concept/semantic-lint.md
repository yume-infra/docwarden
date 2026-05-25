---
kind: concept
---

# semantic-lint

## Designation

Canonical: `semantic-lint`

Aliases:

- semantic lint

## Naming Need

contexta 需要一个名字表示检查语义偏移的检测语言。

这个名字用于区分 policy 的约束语言、relation 的连接语言、example 的样本语言和未来 CLI 中的 lint step。

## Definition

semantic-lint 是语义偏移检测语言。

它直接消费 formatted md，通过 signal definition 描述可审查的语义偏移风险，并产生 signal。

semantic-lint 的结果应尽可能组织成 review-ready lint result，让 signal 命中接近 docwarden review surface 的 `lead + backing`。

semantic-lint 的最小链路是 `formatted md -> semantic-lint -> signal -> review`。

这里的 `review` 由 docwarden review surface 承接；semantic-lint 不直接产生 review judgment。

semantic-lint 作为 concept 不承载完整执行结构。

当前执行链路由 [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]] 表达。

当前第一批 signal definitions 放在 `.contexta/mapping/bootstrap/modules/signal/`。

这些 signal definitions 是 `kind: signal` 的长期 module。

candidate、instance 和 evidence 是未来 CLI lint step 的实现层细节，不是 semantic-lint 的核心概念。

semantic-lint 不等待额外 reading layer 或 facts layer。format 保持 md 形态，semantic-lint 直接检查这个 md。
