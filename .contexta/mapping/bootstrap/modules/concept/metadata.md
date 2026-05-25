---
kind: concept
---

# metadata

## Designation

Canonical: `metadata`

Aliases:

- frontmatter metadata

## Naming Need

contexta 需要一个名字表示 md module frontmatter 中的结构化读取和维护信息。

这个名字用于区分 module 正文内容、concept network relation、docwarden workflow 状态和 frontmatter 字段本身。

## Definition

metadata 是 md module frontmatter 中的结构化说明字段。

metadata 为 module 提供读取入口、维护状态或生成辅助信息。

metadata 不等于 module 正文。

metadata 不表达 concept network 上位关系。

metadata 不替代 relation。

当前已确认的 contexta metadata field 是 [[mapping/bootstrap/modules/concept/metadata/kind|kind]]。

`kind` 是 metadata 中负责选择 content language 的字段。

`status / created / updated / owner` 是 docwarden workflow 维护的 operation metadata，不属于 contexta content kind。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/module|module]] | module 是 md file scope；metadata 是 module frontmatter 中的结构化字段。 |
| [[mapping/bootstrap/modules/concept/metadata/kind|kind]] | kind 是 metadata 的一种，负责选择 content language。 |
| [[mapping/bootstrap/modules/concept/relation|relation]] | relation 表达 concept network；metadata 不承接上位关系或 subtype 树。 |
| body | body 承载正文 assertion；metadata 提供结构化读取和维护信息。 |
| docwarden operation metadata | docwarden operation metadata 维护 workflow 状态；contexta 只定义内容读取相关 metadata。 |

## Examples

### Scenario

agent 需要判断 `kind` 是不是 metadata。

### Judgment Material

```yaml
kind: signal
status: draft
updated: 2026-05-25
```

### Positive

```md
`kind` 是 metadata field。它负责声明当前 module 的 content language。
```

这个 example 让 agent 看到 metadata 是 frontmatter 字段层，而不是正文内容。

### Negative

```yaml
sub_type: workflow
```

这把 concept network 关系写成 metadata subtype。当前不采用这种结构。

### Borderline

```yaml
status: accepted
```

这是 metadata field，但它属于 docwarden workflow 维护状态，不属于 contexta content kind。
