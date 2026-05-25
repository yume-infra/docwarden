---
kind: concept
---

# branch

## Designation

Canonical: `branch`

Aliases:

- routing

## Naming Need

contexta 需要一个名字表示内容、判断或行动在条件成立时进入不同承接路径。

这个名字用于避免把条件分流误写成 workflow 推进、pipeline 转换、architecture 组成、policy 约束或 template 骨架。

## Definition

branch 是由 condition、route、target 三个位置共同成立的分流表达。

condition 是触发分流判断的条件。

route 是条件成立后选择的路径。

target 是该路径承接的落点或后续对象。

缺少 condition、route 或 target 中任一位置，都不构成完整 branch。
