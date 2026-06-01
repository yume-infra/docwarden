---
kind: concept
---

# mapping

## Designation

Canonical: `mapping`

Aliases:

- 映射

## Naming Need

isomorph 需要一个名字表示理论对象如何落成可读、可维护、可检查的 md 实体。

这个名字用于区分 isomorph 的 bootstrap 映射、contexta 映射和 docwarden 映射，避免把三类实体压平在同一个目录关系中。

## Definition

mapping 是理论到实体的映射关系。

它回答：

```text
这个理论对象被映射成哪一类 md 实体？
```

当前 isomorph 至少需要区分三类 mapping：

- bootstrap mapping：isomorph 用自己的内容语言定义 isomorph 自己。
- contexta mapping：承接 user-context、capability 等 semantic mapping，给 contexta 使用场景提供可复用的内容语言定义。
- docwarden mapping：isomorph 用 workflow structure 输出 docwarden 文档维护 workflow definition（如 review workflow），属于定义层产物。
