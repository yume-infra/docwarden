---
kind: policy
---

# semantic-granularity

## Intent

定义 contexta 中断言与 md module 的语义粒度。

本 policy 用于避免把单条规则过早升级为 module，也避免把多个主题混进同一个 module。

## Scope

本 policy 适用于 contexta module 的拆分、命名、组合、review，以及断言在 md module 内部的组织方式。

本 policy 不定义具体 module 模板、profile 结构、adapter 输出格式或断言提取流程。

## Rules

- contexta MUST 将断言视为最小语义审查单位。
- contexta MUST 将 md module 视为默认组合单位。
- 单条断言 SHOULD NOT 仅因为重要就升级为独立 module。
- 一个 module MUST 围绕一个稳定的 intent 和 scope 组织断言。
- 当多条断言共享同一主题边界时，它们 SHOULD 放在同一个 module 中。
- 一个 module SHOULD NOT 混合 intent 或 scope 不同的断言。
- module 名称 SHOULD 表达稳定主题边界，而不是表达单条断言。
- 当一个 module 包含多个断言组时，`## Rules` SHOULD 使用三级标题组织断言组。
- `## Rules` 下的每条列表项 SHOULD 表达一条可审查断言。
- 断言组标题 SHOULD 在同一 module 内保持稳定。
- `## Rationale` 和 `## Examples` MAY 复用 `## Rules` 中的断言组标题，以保持解释和示例的审查对齐。
- contexta SHOULD NOT 为断言默认创建独立文件或独立存储位置。

## Rationale

断言和 md module 处在不同层级。

断言适合用于 review、diff、lint、trace 和 pick。它是被审查和迁移的最小语义单位。

md module 适合用于组合和复用。它提供 intent、scope 和相关断言的上下文，避免组合时丢失语义边界。

如果每条断言都升级为 module，组合会变得过碎，review 和使用成本都会上升。如果一个 module 混入多个主题，规则边界会变得模糊，后续复用和修改也会困难。

当一个 module 内部存在多个断言组时，需要稳定的局部结构。`## Rules` 下的三级标题可以表达断言组，列表项可以表达具体断言。这样既不需要把断言拆成独立文件，也能让 review、diff 和后续提取有稳定锚点。

## Examples

合理的 module 名称：

```text
language-policy
audience-policy
semantic-granularity
```

不合理的 module 名称：

```text
rfc2119-language
docs-must-not-edit
frontmatter-only-state
```

这些名称更像单条断言或单组局部规则，而不是稳定主题边界。

断言组组织示例：

```md
## Rules

### Audience Decision

- contexta 文档作者 MUST 在写作前明确目标读者。
- contexta 文档作者 MUST 在写作前明确读者目标。

### Agent-Facing Instruction Mode

- agent-facing 内容 MUST 使用指令模式，而不是纯描述模式。
- 描述性文字 MUST NOT 替代 agent-facing 的规范性规则。
```

同一个 module 可以在 `## Rationale` 或 `## Examples` 中复用这些三级标题，分别解释对应断言组的原因或例子。
