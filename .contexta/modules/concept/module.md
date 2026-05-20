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
| [[structure]] | structure 表达对象之间的组织关系；module 是承载这些语义材料的组合单位。 |
| task | task 是 docwarden 的短命过程材料；module 是 contexta 的内容组合单位。 |
| file | file 是存储载体；module 是文件中被组织出来的语义单位。 |

## Concept Relations

- [[assertion]]：module 由 assertion 等语义材料组成。
- [[concept]]：concept module 用于稳定一个命名入口。
- [[policy]]：policy module 用于表达约束语言。
- [[structure]]：structure module 可以承载具体结构内容。
- [[template]]：template 可以提供 module 的复制骨架。
- [[naming]]：module 文件名应表达稳定主题边界。

## Examples

### Scenario

agent 需要保存“不要把单条 assertion 过早拆成独立文件”的规则。

### Judgment Material

- contexta MUST 将断言视为最小语义审查单位。
- contexta MUST 将 md module 视为默认组合单位。
- 单条断言 SHOULD NOT 仅因为重要就升级为独立 module。

### Positive

```md
这些规则共享同一个稳定主题边界，应放入 `.contexta/modules/policy/semantic-granularity.md` 这个 module，而不是为每条规则创建一个文件。
```

这个 example 让 agent 看到 module 是语义组合单位，不是“重要内容就单独成文件”。

### Negative

```text
docs-must-not-edit
```

这个名称像一条局部禁止规则，不能稳定承载一组同主题语义材料。

### Borderline

```text
.contexta/templates/policy.md
```

这是 md 文件，但它是复制骨架。只有复制后承载实际语义内容的文件，才是稳定 module 实例。
