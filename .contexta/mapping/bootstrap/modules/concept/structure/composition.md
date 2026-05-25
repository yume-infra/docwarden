---
kind: concept
---

# composition

## Designation

Canonical: `composition`

## Naming Need

contexta 需要一个名字表示多个语义部分如何在稳定语义边界下组成一个整体。

这个名字用于避免把 module / assertion 的关系误写成 policy 约束、pipeline 转换、workflow 推进、architecture 层级或普通列表。

## Definition

composition 是 structure subtype。

composition 是由 whole、part、stable semantic boundary 三个位置共同成立的组合结构。

whole 是被组成的语义整体。

part 是组成 whole 的语义部分。

stable semantic boundary 是判断多个 part 是否应共同归属于同一个 whole 的组织边界。

在当前 module / assertion 关系中：

- module 是 whole。
- assertion 是 part。
- stable semantic boundary 判断哪些 assertion 应共同归入同一个 module。

module 的成立来自 md file scope，不来自 composition。

composition 定义 module / assertion 的 part-whole 关系，不把 module 改成 `kind: composition` 的文件实例。
