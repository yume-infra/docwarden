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
| docwarden workflow | docwarden workflow 处理操作流程；template 不表达流程过程。 |

## Concept Relations

- [[module]]：template 通常用于创建 module。
- [[policy]]：template 的使用边界由 policy 约束。
- [[assertion]]：template 可以提供 assertion 槽位。
- [[naming]]：template 文件名应表达它提供骨架的 kind 或 content role。

## Examples

### Positive

```text
.contexta/templates/policy.md
.contexta/templates/concept.md
```

这些文件提供复制骨架。

### Negative

```text
.contexta/modules/policy/semantic-granularity.md
```

这个文件是 policy module，不是 template。

### Borderline

template 中可以出现占位规则句或占位定义句，但这些占位内容不是规则本体，也不是 concept 定义本体。
