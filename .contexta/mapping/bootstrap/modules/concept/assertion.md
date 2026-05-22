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

contexta 需要一个名字表示 module 内部可以被单独审查的最小语义单位。

这个名字用于避免审查只能停留在整篇 md、整段解释或整个 module 上，也避免把 assertion 误写成文件、独立资产或完整 locator 机制。

## Definition

assertion 是 module 内部的最小可审查语义单元。

它表达一条可以被接受、拒绝、修改、引用、检查或迁移的语义判断。

assertion 的核心不是句子长度、列表形态或标题层级，而是语义是否能被单独审查。

assertion 需要保留后续成为 locator target 的能力，但当前不等于 locator mechanism。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/module|module]] | module 是 md file scope；assertion 是 module 内部的最小可审查语义判断。 |
| sentence | sentence 是语言形式；assertion 是可审查语义判断。一句话可以包含零条、一条或多条 assertion。 |
| rule | rule 是规范性 assertion 的一种；assertion 也可以是定义性判断、边界判断或关系判断。 |
| locator target | assertion 需要未来可被 locator 指向；locator target 需求不等于当前已经存在完整 locator mechanism。 |
| file | file 是存储对象；assertion 不默认独立成文件。 |

## Examples

### Scenario

agent 准备把用户对 review surface 的口径整理成可审核内容。

### Judgment Material

- review surface 是 pick 后进入用户审核的对接口径。
- review surface SHOULD 组织最小 review 单元。
- review surface MUST NOT 在用户确认后改变已确认口径。

### Positive

```md
这三条都是 assertion。

每一条都能被用户单独接受、拒绝、修改、引用或迁移，不需要整篇 module 一起审核。
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
