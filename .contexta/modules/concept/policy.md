---
kind: concept
---

# policy

## Designation

Canonical: `policy`

## Naming Need

contexta 需要一个名字表示约束语言。

这个名字用于避免把规则强度、适用范围和执行边界混入 concept、template 或 docwarden workflow。

## Definition

约束表达单元，用于在明确适用域内规定 agent、作者或系统必须、禁止、默认应该或可以如何处理某类内容。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[concept]] | concept 稳定名字和含义；policy 稳定使用和处理约束。 |
| [[template]] | template 提供复制骨架；policy 提供规则本体。 |
| [[structure]] | structure 表达组织关系；policy 表达约束强度。 |
| workflow | workflow 表达阶段、流转和交接；policy 表达约束强度。 |
| guide | guide 服务连续理解；policy 服务执行约束。 |

## Concept Relations

- [[concept]]：policy 通过 `Applies to` 指向其约束适用的 concept。
- [[assertion]]：policy 的规则通常是规范性 assertion。
- [[module]]：policy 文件是以约束为主题的 module。
- [[template]]：policy template 提供 policy module 的复制骨架。
- [[structure]]：policy 可以约束 structure 的使用，但不替代 structure 表达关系形态。
- [[naming]]：policy module filename 应由 naming policy 约束。

## Examples

### Positive

```text
naming
language
audience
semantic-granularity
template-boundary
```

这些 module 以约束为核心。

### Negative

```text
module
assertion
template
```

这些名称指向 concept，而不是 policy。

### Borderline

`semantic-granularity` 会提到 module 和 assertion，但它不重新定义 module 或 assertion。它只约束 contexta 如何拆分、组合和审查这些 concept 的使用。
