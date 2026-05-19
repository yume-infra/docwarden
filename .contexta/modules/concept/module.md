---
kind: concept
---

# module

## Designation

Canonical: `module`

Aliases:

- md module

## Naming Need

contexta 需要一个名字表示 md 内容中的语义组合单位。

这个名字用于避免把文件、template、task 和 assertion 混成同一种东西。

## Definition

语义组合单元，由同一稳定主题边界内的多条语义材料组成。

在 contexta 中，module 通常由一个 md 文件承载，但 module 的语义不等同于文件本身。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[assertion]] | assertion 是最小可审查语义单元；module 是 assertion 的组合上下文。 |
| [[template]] | template 是复制骨架；module 是复制后承载实际语义的内容单元。 |
| task | task 是 docwarden 的短命过程材料；module 是 contexta 的内容组合单位。 |
| file | file 是存储载体；module 是文件中被组织出来的语义单位。 |

## Concept Relations

- [[assertion]]：module 由 assertion 等语义材料组成。
- [[concept]]：concept module 用于稳定一个命名入口。
- [[policy]]：policy module 用于表达约束语言。
- [[template]]：template 可以提供 module 的复制骨架。
- [[naming]]：module 文件名应表达稳定主题边界。

## Examples

### Positive

```text
.contexta/modules/policy/semantic-granularity.md
.contexta/modules/concept/module.md
```

这些文件都是 module，因为它们围绕稳定主题组织语义材料。

### Negative

```text
docs-must-not-edit
```

这个名字更像单条 assertion，而不是稳定主题边界。

### Borderline

一份 md 文件可以承载 module，但空 template 不是 module 的稳定内容实例。
