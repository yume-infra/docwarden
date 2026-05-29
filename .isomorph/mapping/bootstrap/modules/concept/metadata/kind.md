---
kind: concept
---

# kind

## Designation

Canonical: `kind`

Aliases:

- content kind
- content language entry

## Naming Need

isomorph 需要一个名字表示 metadata 中选择内容语言的入口字段。

这个名字用于避免把内容语言入口、module file scope、concept 层级、template artifact 和 docwarden workflow 状态混成同一种 metadata。

## Definition

kind 是 metadata 中负责选择 content language 的字段。

它回答：

```text
这个 md module 的正文应按哪种内容语言读取？
```

`kind` 指向 module 的内容语言。

当 `kind: signal` 出现在 `.isomorph/mapping/bootstrap/modules/signal/*.md` 中时，它表示当前 module 使用 signal definition language。

`kind: signal` 不表示 signal instance。

当 `kind: magic-word` 出现在 `.isomorph/mapping/bootstrap/modules/magic-word/*.md` 中时，它表示当前 module 使用 magic-word registry language。

当 `kind: locator` 出现在 `.isomorph/mapping/bootstrap/modules/locator/*.md` 中时，它表示当前 module 使用 locator instance language。

它不表达 primitive 层级，不表达 concept network 关系，也不表达 docwarden workflow 状态。
