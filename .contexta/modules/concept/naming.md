---
kind: concept
---

# naming

## Designation

Canonical: `naming`

Aliases:

- semantic naming

Avoid:

- style
- label
- decoration

## Naming Need

contexta 需要一个名字表示内容系统中的语义定位机制。

这个名字用于避免把命名误解为表面风格。对 agent 而言，目录名、文件名、标题名和 concept 名都是搜索入口和语义落点。

## Definition

语义定位机制，用于让名称稳定指向内容对象、内容类型、概念关系或规则主题。

naming 的核心是让 agent 能通过名称找到正确内容，并避免把相邻语义对象混淆。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[concept]] | concept 稳定一个名字指向的语义对象；naming 关注名称如何形成并保持可定位。 |
| [[policy]] | policy 表达约束；naming 可以被 policy 约束，但不是规则本体。 |
| [[template]] | template 提供复制骨架；naming 决定骨架实例应如何命名。 |
| style | style 关注表现一致；naming 关注语义定位和消歧。 |

## Concept Relations

- [[concept]]：concept 依赖 naming 建立稳定 designation。
- [[module]]：module 文件名应表达稳定主题边界。
- [[policy]]：naming 的规范由 policy 承接。
- [[template]]：template 可以提供命名占位符。

## Examples

### Positive

```text
semantic-granularity
template-boundary
module
assertion
```

这些名称表达稳定语义对象或规则主题。

### Negative

```text
docs-must-not-edit
do-not-create-assertion-files
good-rules
misc
```

这些名称过于局部、过于行为化或语义不清。

### Borderline

`language` 可以指自然语言、规则语言或编程语言。作为 policy 主题时，它需要通过 intent、scope 或更具体的文件名消歧。
