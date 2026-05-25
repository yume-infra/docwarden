---
kind: concept
---

# workflow

## Designation

Canonical: `workflow`

## Naming Need

contexta 需要一个名字表示协作或工作对象如何从一个可行动处境推进到下一个可行动处境。

这个名字用于避免把推进关系误写成 pipeline 转换、policy 约束、template 骨架或普通步骤列表。

## Definition

workflow 是由 state、move、transition 三个位置共同成立的推进表达。

state 是当前可行动处境。

move 是使协作、理解或材料状态继续推进的行动。

transition 是 move 如何使一个 state 进入下一个 state 的成立关系。

缺少 state、move 或 transition 中任一位置，都不构成完整 workflow。
