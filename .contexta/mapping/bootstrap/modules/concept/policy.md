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

## Examples

### Scenario

用户要求 agent 记录“template 只负责复制后的内容骨架，不负责来源、review、pick、更新、写入、生命周期”。

### Judgment Material

- template MUST 只负责复制后的内容骨架。
- template MUST NOT 承接来源、review、pick、更新、写入或生命周期。

### Positive

```md
这是 policy。它不是在命名 template，而是在规定 template 的使用边界和禁止行为。
```

这个 example 让 agent 看到 policy 的核心是约束强度、适用范围和执行边界。

### Negative

```text
template 是内容复制骨架。
```

这是 concept definition，不是 policy。它说明 template 是什么，没有规定 agent 或作者应该如何处理 template。

### Borderline

```text
semantic-granularity 会提到 module 和 assertion。
```

如果它重新定义 module 或 assertion，就是 concept 越界；如果它只约束这些语义单元如何拆分、组合和审查，就是 policy。
