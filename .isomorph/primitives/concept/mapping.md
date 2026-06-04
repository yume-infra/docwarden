---
kind: concept
---

# mapping

## Designation

Canonical: `mapping`

Aliases:

- 映射

## Naming Need

isomorph 需要一个名字表示语义对象如何被某个下游读取面、导出形状或判断过程消费。

这个名字用于避免两类相反偏移：

- 把 `mapping` 降级成简单路径查找或 frontmatter 分发表。
- 把 `mapping` 扩张成 `.isomorph` 的目录组织、contexta asset catalog、docwarden workflow state 或 Codex runtime materialization。

## Definition

mapping 是 isomorph 语义对象与下游读取面或 export shape 之间的语义对应关系。

它回答：

```text
这个语义对象在什么消费面上如何被读取、引用或保留？
```

mapping 可以说明：

- 一个 primitive 如何支撑 recognition、lint 或 primitive-creator。
- 一个 grammar 如何约束某类 md surface。
- 一个 signal 如何把可观察 drift 连接回 semantic basis。
- 一个 export shape 需要为下游保留哪些语义。

mapping 不回答：

- contexta pack asset 如何分发。
- docwarden task / review / promote / pick 状态如何运行。
- Codex runtime artifact 写到哪个官方 surface。
- `.isomorph` 文件应该按旧的 `bootstrap / contexta / docwarden` mapping layer 组织。

因此，mapping 是语义关系，不是 runtime mapping table，也不是 `.isomorph` 的主目录职责。
