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

## Delimitation

| Neighbor | Difference |
| --- | --- |
| workflow | workflow 关注 state 如何经 move 和 transition 推进；architecture 关注 layer 如何通过 relation 和 boundary 共同成立。 |
| pipeline | pipeline 关注 input 如何经 transform 形成 output；architecture 关注层级、关系和边界。 |
| branch | branch 关注 condition 如何 route 到 target；architecture 关注 target 所在整体的层级位置和边界。 |
| [[policy]] | policy 表达约束强度；architecture 表达层级关系和边界。 |
| [[template]] | template 提供复制骨架；architecture 是被骨架承载的层级表达。 |

## Concept Relations

- [[structure]]：architecture 是 structure subtype 的建模材料，但当前不反向重写 structure。
- [[workflow]]：workflow 可以发生在 architecture 的某些 layer 之间，但 workflow 不定义 layer 的稳定边界。
- [[pipeline]]：pipeline 可以发生在 architecture 的某个 layer 内，但 pipeline 不定义整体层级。
- [[template]]：architecture template 提供 architecture 的复制骨架。
- [[module]]：architecture 可以作为 module 承载具体层级内容。
- [[assertion]]：architecture 的 layer、relation 和 boundary 说明可以由 assertion 表达。
- [[naming]]：architecture 名称应表达它描述的整体对象。
- [[example]]：example 可以示范 architecture 如何书写。

## Examples

### Positive

```text
layer: docwarden / contexta
relation: docwarden operates task/review/promote/pick lifecycle; contexta supplies content format protocols
boundary: docwarden does not own content format definitions; contexta does not own operation lifecycle
```

这个表达说明了层级、关系和边界，因此是 architecture。

### Negative

```text
state: task material is ready
move: generate review surface
transition: enter user review
```

这个表达关注推进，不是组成和边界。

### Borderline

```text
docwarden = task / review / promote / pick / cleanup
```

这个表达列出了层位，但只有补足 layer 之间的 relation 和 boundary 后，才构成完整 architecture。
