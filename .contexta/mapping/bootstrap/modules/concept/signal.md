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

contexta 需要一个名字表示 semantic-lint 中被命名的语义偏移 warning。

这个名字用于避免把 trigger、policy violation、docwarden review item 或 assertion 混成同一个对象。

## Definition

signal 是 semantic-lint 中被命名的语义偏移 warning。

signal 由 trigger 触发，并通过 Source 指向判断依据。

signal 是 warning，不是最终判罚。

具体 signal definition 以 `kind: signal` 的 module 存在于 `.contexta/mapping/bootstrap/modules/signal/`。

`kind: signal` 表示 signal definition language，不表示 signal instance。

未来 CLI lint step 输出的是 signal instance，而不是抽象 signal definition。

signal candidate 可以只有上下文；signal instance 需要 locator 指向 assertion marker。
