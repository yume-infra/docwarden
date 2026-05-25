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

它直接消费 formatted md，通过 signal definition 描述可审查的语义偏移风险，并产生 warning signal。

semantic-lint 当前阶段先整理 warning signal，不设计完整 lint engine。

semantic-lint 作为 concept 不承载完整执行结构。

当前执行链路由 [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]] 表达。

当前第一批 signal definitions 放在 `.contexta/mapping/bootstrap/modules/signal/`。

这些 signal definitions 是 `kind: signal` 的长期 module。

未来 CLI lint step 可以把 warning signal 细分为 signal candidate 或 signal instance。

semantic-lint 不等待额外 reading layer 或 facts layer。format 保持 md 形态，semantic-lint 直接检查这个 md。
