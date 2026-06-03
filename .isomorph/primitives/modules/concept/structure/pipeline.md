---
kind: concept
---

# pipeline

## Designation

Canonical: `pipeline`

## Naming Need

isomorph 需要一个名字表示内容从输入经过转换形成输出。

这个名字用于避免把转换关系误写成 workflow 推进、列表枚举、policy 约束或 template 骨架。

## Definition

pipeline 是由 input、transform、output 三个位置共同成立的转换表达。

input 是被处理的内容。

transform 是对 input 执行的转换。

output 是 transform 产生的结果。

缺少 input、transform 或 output 中任一位置，都不构成完整 pipeline。

具体 pipeline structure instance 放在 `.isomorph/grammars/structures/pipeline/` 下。

pipeline instance 引用相关 concept、policy、relation 或 signal definition，但不把它们收进自身重新定义。
