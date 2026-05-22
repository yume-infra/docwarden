---
kind: concept
---

# kind

## Designation

Canonical: `kind`

Aliases:

- content kind
- content language entry

## Naming Need

contexta 需要一个名字表示 md module frontmatter 中选择内容语言的入口字段。

这个名字用于避免把内容语言入口、module file scope、concept 层级、template artifact 和 docwarden workflow 状态混成同一种 metadata。

## Definition

kind 是 content language entry。

它回答：

```text
这个 md module 的正文应按哪种内容语言读取？
```

`kind` 指向 module 的内容语言。

它不表达 primitive 层级，不表达 concept network 关系，也不表达 docwarden workflow 状态。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/module|module]] | module 是 md file scope；kind 是 module frontmatter 中的内容语言入口。 |
| [[mapping/bootstrap/modules/concept/relation|relation]] | relation 表达 concept network 中的稳定连接；kind 不表达上位关系或 subtype metadata。 |
| [[mapping/bootstrap/modules/concept/template|template]] | template 是复制骨架；template 文件中的 kind 指向复制后目标 module 的内容语言。 |
| [[mapping/bootstrap/modules/concept/assertion|assertion]] | assertion 是 module 内部最小可审查语义判断；assertion 当前不作为 kind。 |
| [[mapping/bootstrap/modules/concept/example|example]] | example 是样本语言；当前不作为独立 module kind、template kind 或 directory kind。 |
| status | status 是 docwarden workflow 维护状态字段；不是 contexta content kind。 |

## Examples

### Scenario

agent 需要判断 `kind: workflow` 是否意味着 `workflow` 是 frontmatter subtype。

### Judgment Material

```yaml
kind: workflow
```

### Positive

```md
`kind: workflow` 表示这个 md module 使用 workflow 这门内容语言。

workflow 与 structure 的关系应由 relation 体系表达，不由 `sub_type` 或 `structure_type` 字段表达。
```

这个 example 让 agent 看到 kind 是内容语言入口，不是 ontology hierarchy。

### Negative

```yaml
kind: structure
sub_type: workflow
```

这把 concept network 关系写成 metadata subtype。当前不采用这种结构。

### Borderline

```yaml
kind: policy
```

如果这出现在 `.contexta/mapping/bootstrap/modules/policy/*.md` 中，它表示当前 module 使用 policy 内容语言。

如果这出现在 `.contexta/mapping/bootstrap/templates/policy.md` 中，它表示复制后目标 module 的 kind 是 policy；template 自身作为复制骨架的身份由路径和 template 边界承接。
