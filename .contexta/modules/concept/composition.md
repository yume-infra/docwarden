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

composition 是由 whole、part、stable semantic boundary 三个位置共同成立的组合结构。

whole 是被组成的语义整体。

part 是组成 whole 的语义部分。

stable semantic boundary 是让多个 part 能够属于同一个 whole 的稳定语义边界。

缺少 whole、part 或 stable semantic boundary 中任一位置，都不构成完整 composition。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[module]] | module 可以作为 composition 的 whole；composition 表达 whole、part 和 stable semantic boundary 如何共同成立。 |
| [[assertion]] | assertion 可以作为 composition 的 part；composition 不等于单条 assertion。 |
| pipeline | pipeline 关注 input 如何经 transform 形成 output；composition 关注 part 如何组成 whole。 |
| workflow | workflow 关注 state 如何经 move 和 transition 推进；composition 关注组成关系，不表达推进。 |
| architecture | architecture 关注 layer 的 relation 和 boundary；composition 关注 part 在语义边界下组成 whole。 |
| list | list 是并列语言形式；composition 必须表达 part 为什么属于同一个 whole。 |
| [[policy]] | policy 表达约束强度；composition 表达组合结构。 |

## Concept Relations

- [[structure]]：composition 是 structure subtype 的建模材料，但当前不反向重写 structure。
- [[module]]：module 是 contexta 中最常见的 composition whole。
- [[assertion]]：assertion 可以作为 module composition 中的 semantic part。
- [[template]]：composition template 提供 composition 的复制骨架。
- [[naming]]：composition 名称应表达它描述的组合整体或组合关系。
- [[example]]：example 可以示范 composition 如何书写。

## Examples

### Scenario

agent 需要判断 module 和 assertion 的关系应该建模为 policy 规则，还是 structure subtype。

### Judgment Material

- module 是语义组合单元。
- assertion 是最小可审查语义单元。
- assertion 不默认独立成文件，但 review 时可以被单独审查。

### Positive

```md
这是 composition。module 是 whole，assertion 是 part，module 的稳定主题边界是 stable semantic boundary。
```

这个 example 让 agent 看到 module / assertion 的关系首先是组合结构，不是约束规则。

### Negative

```text
assertion MUST NOT 独立成文件。
```

这是一条 policy assertion。它可以约束 composition 的使用，但不能替代 composition 模型。

### Borderline

```text
## Rules

- contexta MUST 将断言视为最小语义审查单位。
- contexta MUST 将 md module 视为默认组合单位。
```

这段内容有 composition 的材料，但它本身是 policy module 的规则组。只有显式说明 whole、part 和 stable semantic boundary 时，才是在表达 composition。
