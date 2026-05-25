---
kind: concept
---

# architecture

## Designation

Canonical: `architecture`

## Naming Need

contexta 需要一个名字表示一个整体中有哪些稳定层位，以及这些层位如何通过关系和边界共同成立。

这个名字用于避免把层级关系和边界误写成 workflow 推进、pipeline 转换、branch 分流、policy 约束或 template 骨架。

## Definition

architecture 是由 layer、relation、boundary 三个位置共同成立的层级表达。

layer 是整体中的稳定层位。

relation 是 layer 之间的相邻、依赖、承接或包含关系。

boundary 是 layer 之间不可混淆或不可跨越的边界。

缺少 layer、relation 或 boundary 中任一位置，都不构成完整 architecture。
