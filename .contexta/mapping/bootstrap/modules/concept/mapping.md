---
kind: concept
---

# mapping

## Designation

Canonical: `mapping`

Aliases:

- 映射

## Naming Need

contexta 需要一个名字表示理论对象如何落成可读、可维护、可检查的 md 实体。

这个名字用于区分 contexta 自己的 bootstrap 映射，以及 contexta 到 docwarden 资产的映射，避免把两类实体压平在同一个目录关系中。

## Definition

mapping 是理论到实体的映射关系。

它回答：

```text
这个理论对象被映射成哪一类 md 实体？
```

当前 contexta 至少需要区分两类 mapping：

- bootstrap mapping：contexta 用自己的内容语言定义 contexta 自己。
- docwarden mapping：contexta 定义的内容语言被 docwarden workflow 用来生成和维护具体长期资产。
