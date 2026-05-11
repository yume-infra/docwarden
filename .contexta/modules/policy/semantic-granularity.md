---
kind: policy
---

# semantic-granularity

## Intent

定义 contexta 中断言与 md module 的语义粒度。

本 policy 用于避免把单条规则过早升级为 module，也避免把多个主题混进同一个 module。

## Scope

本 policy 适用于 contexta module 的拆分、命名、组合和 review。

本 policy 不定义具体 module 模板、profile 结构、adapter 输出格式或断言提取流程。

## Rules

- contexta MUST 将断言视为最小语义审查单位。
- contexta MUST 将 md module 视为默认组合单位。
- 单条断言 SHOULD NOT 仅因为重要就升级为独立 module。
- 一个 module MUST 围绕一个稳定的 intent 和 scope 组织断言。
- 当多条断言共享同一主题边界时，它们 SHOULD 放在同一个 module 中。
- 一个 module SHOULD NOT 混合 intent 或 scope 不同的断言。
- module 名称 SHOULD 表达稳定主题边界，而不是表达单条断言。

## Rationale

断言和 md module 处在不同层级。

断言适合用于 review、diff、lint、trace 和 pick。它是被审查和迁移的最小语义单位。

md module 适合用于组合和复用。它提供 intent、scope 和相关断言的上下文，避免组合时丢失语义边界。

如果每条断言都升级为 module，组合会变得过碎，review 和使用成本都会上升。如果一个 module 混入多个主题，规则边界会变得模糊，后续复用和修改也会困难。

## Examples

合理的 module 名称：

```text
language-policy
semantic-granularity
document-authority
```

不合理的 module 名称：

```text
rfc2119-language
docs-must-not-edit
frontmatter-only-state
```

这些名称更像单条断言或单组局部规则，而不是稳定主题边界。
