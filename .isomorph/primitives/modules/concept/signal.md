---
kind: concept
---

# signal

## Designation

Canonical: `signal`

Aliases:

- lint signal
- semantic signal

## Naming Need

isomorph 需要一个名字表示 semantic-lint 中被命名的语义偏移 warning。

这个名字用于避免把 trigger、policy violation、docwarden review item 或 assertion 混成同一个对象。

## Definition

signal 是 semantic-lint 产生的语义偏移提示。

signal definition 是被 semantic-lint 使用的 warning name 定义。

signal definition 只说明这个 warning name 表示什么语义偏移、什么 formatted md 形态会触发它，以及它依赖哪些判断依据。

signal 进入 review 后才会被判断为有效、无效、需要迁移或违反 policy。

具体 signal definition 以 `kind: signal` 的 module 存在于 `.isomorph/lint/modules/signal/`。

`kind: signal` 表示 signal definition language，不表示 signal instance。

当前 signal definition 的最小 surface 是 `Definition / Trigger / Basis`。

一次 lint 命中可以在实现层携带 confidence 或 locator，但这些不是 signal definition 的理论定义。
