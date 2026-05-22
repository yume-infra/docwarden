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
| style | style 关注表现一致；naming 关注语义定位和消歧。 |

## Examples

### Scenario

用户要求 agent 检查当前文件名里是否还有命名违规，并讨论 `-` 分隔是否需要保留。

### Judgment Material

- `language-policy`
- `template-boundary`
- `semantic-granularity`
- `module`

### Positive

```md
`language-policy` 重复编码了 kind，因为目录和 frontmatter 已经说明它是 policy。`template-boundary` 和 `semantic-granularity` 可以保留 `-`，因为它们表达的是稳定复合主题。`module` 是最小核心词，不能为了显得完整改成 `module-concept`。
```

这个 example 展示 naming 的真实作用：名称要帮助 agent 定位语义对象，而不是堆叠类型标签。

### Negative

```text
good-rules
misc
docs-must-not-edit
```

这些名称要么语义空泛，要么只是单条行为规则，不能作为稳定查询入口。

### Borderline

```text
language
```

`language` 可以指自然语言、规则语言或编程语言。作为 policy 主题时，它需要通过 intent 和 scope 消歧；如果后续出现多个 language 主题，再考虑更具体名称。
