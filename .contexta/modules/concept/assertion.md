---
kind: concept
---

# assertion

## Designation

Canonical: `assertion`

Aliases:

- semantic assertion
- semantic unit

## Naming Need

contexta 需要一个名字表示文档迭代中可以被单独审查的最小语义单位。

这个名字用于避免审查只能停留在整篇文档、整段解释或整个 module 上。

## Definition

最小可审查语义单元，表达一条可以被接受、拒绝、修改、引用、检查或迁移的语义判断。

assertion 的核心不是句子长度，而是语义是否能被单独审查。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[module]] | module 是语义组合单位；assertion 是 module 内部的最小可审查语义单位。 |
| [[structure]] | structure 表达多个对象之间的组织关系；assertion 表达可单独审查的语义判断。 |
| sentence | sentence 是语言形式；assertion 是可审查语义判断。 |
| rule | rule 是规范性 assertion 的一种；assertion 也可以是定义性判断或边界判断。 |
| [[template]] | template 可以提供 assertion 的书写槽位；template slot 不是 assertion 本身。 |

## Concept Relations

- [[module]]：assertion 通常在 module 内获得上下文。
- [[policy]]：policy 中的规则是规范性 assertion。
- [[concept]]：concept 中的定义和消歧内容可以包含定义性 assertion。
- [[structure]]：structure 中的节点、关系和边界说明可以由 assertion 表达。

## Examples

### Scenario

agent 准备把用户对 review surface 的口径整理成可审核内容。

### Judgment Material

- review surface 是 pick 后进入用户审核的对接口径。
- review surface SHOULD 组织最小 review 单元。
- review surface MUST NOT 在用户确认后改变已确认口径。

### Positive

```md
这三条都是 assertion。每一条都能被用户单独接受、拒绝、修改或迁移，不需要整篇文档一起审核。
```

这个 example 让 agent 看到 assertion 的判断点不是句子长短，而是语义是否可以独立审查。

### Negative

```text
review surface
semantic-granularity
```

这些只是名称或主题入口，没有表达可以被审查的语义判断。

### Borderline

```text
review surface 是 pick 后进入用户审核的对接口径，并且不能在用户确认后改变。
```

这句话包含两个判断：review surface 的定义位置，以及确认后不可变更的约束。写作时可以是一句话，但 review 时应拆成两个 assertion。
