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

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[structure]] | composition 是 structure subtype；structure 是上位组织语言。 |
| [[module]] | module 是 md file scope；composition 可以把 module 建模为 whole，但不决定 module 是否成立。 |
| [[assertion]] | assertion 是 module 内部的最小可审查语义判断；composition 可以把 assertion 建模为 part。 |
| pipeline | pipeline 关注 input 如何经 transform 形成 output；composition 关注 part 如何组成 whole。 |
| workflow | workflow 关注 state 如何经 move 和 transition 推进；composition 关注组成关系，不表达推进。 |
| architecture | architecture 关注 layer 的 relation 和 boundary；composition 关注 part 在语义边界下组成 whole。 |
| list | list 是并列语言形式；composition 必须表达 part 为什么属于同一个 whole。 |
| [[policy]] | policy 表达约束强度；composition 表达组合结构。 |

## Examples

### Scenario

agent 需要判断 module 和 assertion 的关系应该建模为 policy 规则，还是 structure subtype。

### Judgment Material

- module 是 md file scope。
- assertion 是 module 内部的最小可审查语义判断。
- assertion 不默认独立成文件，但后续需要能成为 locator target。

### Positive

```md
这是 composition。

module 是 whole，assertion 是 part，stable semantic boundary 判断哪些 assertion 应共同归入同一个 module。
```

这个 example 让 agent 看到 module / assertion 的关系首先是组合结构，不是约束规则，也不是 locator 机制。

### Negative

```text
assertion MUST NOT 独立成文件。
```

这是一条 policy assertion。它可以约束 assertion 的落地方式，但不能替代 composition 模型。

### Borderline

```text
## Rules

- contexta MUST 将断言视为最小语义审查单位。
- contexta MUST 将 md module 视为默认组合单位。
```

这段内容有 composition 的材料，但它本身是 policy module 的规则组。只有显式说明 whole、part 和 stable semantic boundary 如何共同成立时，才是在表达 composition。
