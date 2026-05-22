---
kind: concept
---

# module

## Designation

Canonical: `module`

Aliases:

- md module

## Naming Need

contexta 需要一个名字表示 md 文件形成的文档作用域。

这个名字用于避免把 file scope、content kind、template、docwarden workflow 对象和 assertion 混成同一种对象。

## Definition

module 是 md file scope。

在当前 contexta / docwarden 描述系统中，只要一个描述对象以 `.md` 文件存在，它就天然是 module。

module 以一个 md 文件为作用域，承载 metadata 和结构化正文，并为 assertion 提供上下文和归属范围。

module 的成立来自 md file scope，不来自 frontmatter `kind`、stable semantic boundary 或 composition。

stable semantic boundary 是 module 组织 assertion 的质量边界，不是 module 是否成立的前提。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| file | file 是存储对象；module 是 md 文件在当前文档系统中的作用域。非 md file 不自动成为 module。 |
| [[mapping/bootstrap/modules/concept/assertion|assertion]] | assertion 是 module 内部的最小可审查语义单元；module 是 assertion 所在的 md file scope。 |
| kind | `kind` 表达 module 的内容类型或内容语言；module 不等于 `kind: module`。 |
| [[mapping/bootstrap/modules/concept/template|template]] | template 是复制骨架这一内容角色；template 文件本身也可以是 md module，但 template 角色不等于 module 定义。 |
| task | task 是 docwarden 的短命过程工作面；task 中的 md 文件可以是 module，但 task 生命周期不属于 module 定义。 |

## Examples

### Scenario

agent 需要判断 `.contexta/mapping/bootstrap/modules/concept/module.md` 是不是 module。

### Judgment Material

- `.contexta/mapping/bootstrap/modules/concept/module.md` 是一个 md 文件。
- frontmatter 中写的是 `kind: concept`。
- 该文件定义 `module` 这个 concept。

### Positive

```md
`.contexta/mapping/bootstrap/modules/concept/module.md` 是 module，因为它是一个 md file scope。

它的 `kind` 是 `concept`，说明这个 module 的内容语言是 concept。
```

这个 example 让 agent 看到 module 和 kind 不在同一层：module 来自 md file scope，kind 表达内容类型。

### Negative

```yaml
kind: module
```

这不是定义 module 的正确方式。`module` 不是 content kind；把 module 写进 `kind` 会把 file scope 和内容类型混在一起。

### Borderline

```text
.contexta/mapping/bootstrap/templates/policy.md
```

这是一个 md file，因此在 file scope 意义上也是 module。但它的内容角色是 template，负责提供复制骨架，不是 policy module 实例。
