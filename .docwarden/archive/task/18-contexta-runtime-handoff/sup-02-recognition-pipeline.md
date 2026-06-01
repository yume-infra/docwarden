---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# recognition pipeline

本文件说明任意 md target 如何进入 contexta runtime。

## Core Position

recognition 是核心 primitive。

它回答：

```text
给定一个 arbitrary md target，runtime 如何判断它应由哪个 contexta primitive 解释？
```

这个问题不能交给用户预先指定，也不能由 CLI hardcode 成固定文件类型表。

## Pipeline

第一版 recognition pipeline 的理论形态：

```text
arbitrary md target
  -> parse md surface
  -> collect observable features
  -> apply recognition primitive from local contexta
  -> produce recognition result
  -> produce signal applicability basis / candidate scope
```

## Observable Features

可观察特征至少可能包括：

- path
- frontmatter
- heading shape
- section shape
- OFM links
- locator markers
- magic words
- relation blocks
- template-like structure

本轮不把这些特征提前固化成最终 schema。

真实字段应在 Effect 实现中解析 md surface 后反推。

## Recognition Result

recognition result 应成为 runtime 的一等中间结果。

它至少需要服务后续 lint：

```text
target md
  -> recognition result
  -> applicable signal triggers
  -> lint signal
```

recognition result 不做最终 judgment。

signal 的最终选择和执行属于 lint core。recognition 只为 lint 提供 applicability basis 或 candidate scope。

## Relation to Mapping

recognition rules 来自 local effective contexta model。

mapping 是 recognition 的重要输入，因为 mapping 表达 contexta 内容如何展开到 target。

recognition 也可以消费 template、frontmatter、path、heading、section shape、locator、magic-word 和 signal basis。

recognition 不应被 hardcode 成 CLI 内部固定类型表，也不应被简化成 mapping lookup。

## Boundary

recognition 不是 lint。

recognition 只负责让 arbitrary md 可以进入 contexta 的语义解释域；lint 在 recognition 之后运行。
