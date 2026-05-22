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

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[relation]] | relation 表达 concept network 中的稳定连接；mapping 表达理论对象到实体层的落成关系。 |
| [[kind]] | kind 是 module frontmatter 中的内容语言入口；mapping 是目录层表达的理论到实体关系。 |
| [[template]] | template 是复制骨架；mapping 决定 template 属于 bootstrap 实体还是 docwarden 映射实体。 |
| docwarden workflow | docwarden workflow 负责 task / review / promote / pick / cleanup；mapping 只说明 contexta 理论如何对应到实体层。 |
| [[module]] | module 是 md file scope；mapping 说明这个 module 属于哪类理论到实体映射。 |

## Examples

### Scenario

agent 需要判断 `user-context` 应该和 `kind`、`relation` 放在同一组 bootstrap concept 里，还是放在 docwarden 映射层。

### Judgment Material

```text
.contexta/mapping/bootstrap/modules/concept/kind.md
.contexta/mapping/docwarden/modules/concept/user-context.md
.docwarden/user/profile.md
```

### Positive

```md
`kind` 是 contexta 的 bootstrap concept，放在 bootstrap mapping。

`user-context` 是 contexta 面向 docwarden 资产定义的内容语言，放在 docwarden mapping。

`.docwarden/user/profile.md` 是 docwarden 长期资产，不放入 `.contexta`。
```

这个 example 让 agent 看到 mapping 的重点是理论对象映射到哪一类实体，而不是只按 content kind 分目录。

### Negative

```md
把 `user-context.md` 放回 `.contexta/mapping/bootstrap/modules/concept/`，因为它也是 concept。
```

这会重新压平 bootstrap mapping 和 docwarden mapping，让目录无法表征 contexta 与 docwarden 的关系。

### Borderline

```md
.contexta/mapping/bootstrap/templates/concept.md
```

这是 bootstrap mapping 中的 template，因为它用于创建 contexta 自己的 concept module。
