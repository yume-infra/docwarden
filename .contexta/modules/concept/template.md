---
kind: concept
---

# template

## Designation

Canonical: `template`

## Naming Need

contexta 需要一个名字表示复制后的内容骨架。

这个名字用于避免把内容骨架与规则本体、实际 module 内容或 workflow 过程混在一起。

## Definition

内容复制骨架，用于给某类 module 提供初始结构。

template 的语义重点是生成初始形状，而不是承接内容本体或操作流程。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[module]] | module 是实际语义组合单位；template 是创建 module 时可复制的骨架。 |
| [[policy]] | policy 承载规则本体；template 只提供结构槽位。 |
| [[assertion]] | assertion 是最小可审查语义单元；template 只能提供 assertion 的书写位置。 |
| [[structure]] | structure 表达对象之间的组织关系；template 可以提供 structure 的书写槽位。 |
| docwarden workflow | docwarden workflow 处理操作流程；template 不表达流程过程。 |

## Examples

### Scenario

agent 要新建一个 policy module，并准备从 `.contexta/templates/policy.md` 复制初始结构。

### Judgment Material

## Intent

<用 1-3 句话说明这个 policy 要解决什么问题，或保护什么边界。>

## Rules

- <主体> <MUST|MUST NOT|SHOULD|SHOULD NOT|MAY> <动作> <对象/范围/条件>。

### Positive

```md
这是 template。它只提供复制后的骨架和占位提示，不承接真实规则本体。
```

这个 example 让 agent 看到 template 的价值是生成初始形状，而不是保存已确认内容。

### Negative

```text
- template MUST NOT 承接来源、review、pick、更新、写入或生命周期。
```

这是真实规则，不是占位骨架。它应进入 policy module。

### Borderline

```text
- <主体> MUST <动作> <对象/范围/条件>。
```

这可以出现在 template 中，因为它是占位规则句。只有当占位被替换为具体规则后，才成为 policy 内容。
