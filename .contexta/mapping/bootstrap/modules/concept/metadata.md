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
