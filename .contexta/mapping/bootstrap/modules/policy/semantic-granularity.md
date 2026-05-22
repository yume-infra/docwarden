---
kind: policy
---

# semantic-granularity

## Intent

定义 contexta 中断言与 md module 的语义粒度。

本 policy 用于避免把单条规则过早升级为 module，也避免把多个主题混进同一个 module。

## Scope

Applies to:

- [[mapping/bootstrap/modules/concept/module|module]]
- [[mapping/bootstrap/modules/concept/assertion|assertion]]

适用条件：

- contexta 需要拆分、命名、组合或 review module。
- contexta 需要组织 assertion 在 module 内部的语义粒度。

不适用条件：

- 需要定义具体 module template。
- 需要定义 profile 结构、adapter 输出格式或断言提取流程。
- 需要处理 docwarden task / review / promote / pick / cleanup 生命周期。

## Rules

- contexta MUST 将断言视为最小语义审查单位。
- contexta MUST 将 md module 视为默认组合单位。
- 单条断言 SHOULD NOT 仅因为重要就升级为独立 module。
- 一个 module MUST 围绕一个 stable semantic boundary 组织断言。
- 当多条断言共享同一主题边界时，它们 SHOULD 放在同一个 module 中。
- 一个 module SHOULD NOT 混合 stable semantic boundary 不同的断言。
- module 名称 SHOULD 表达稳定主题边界，而不是表达单条断言。
- 当一个 module 包含多个断言组时，`## Rules` SHOULD 使用三级标题组织断言组。
- `## Rules` 下的每条列表项 SHOULD 表达一条可审查断言。
- 断言组标题 SHOULD 在同一 module 内保持稳定。
- `## Rationale` 和 `## Examples` MAY 复用 `## Rules` 中的断言组标题，以保持解释和示例的审查对齐。
- contexta SHOULD NOT 为断言默认创建独立文件或独立存储位置。

## Rationale

本 policy 已通过 `Applies to` 指向 [[mapping/bootstrap/modules/concept/assertion|assertion]] 和 [[mapping/bootstrap/modules/concept/module|module]]。

这里不重新定义这两个 concept，只解释为什么需要约束它们的粒度关系。

如果每条断言都升级为 module，组合会变得过碎，review 和使用成本都会上升。如果一个 module 混入多个 stable semantic boundary，规则边界会变得模糊，后续复用和修改也会困难。

当一个 module 内部存在多个断言组时，需要稳定的局部结构。`## Rules` 下的三级标题可以表达断言组，列表项可以表达具体断言。这样既不需要把断言拆成独立文件，也能让 review、diff 和后续提取有稳定锚点。

## Examples

### Scenario

agent 想把三条规则分别创建为三个文件。

### Judgment Material

- contexta MUST 将断言视为最小语义审查单位。
- contexta MUST 将 md module 视为默认组合单位。
- 单条断言 SHOULD NOT 仅因为重要就升级为独立 module。

### Positive

```md
这三条规则共享“语义粒度”主题，应放入 `semantic-granularity` module。它们可以作为独立 assertion 被审查，但不应各自升级成独立 module。
```

这个 example 展示了 assertion 与 module 的粒度差异，也给出 agent 常犯的过度拆分错误。

### Negative

```text
rfc2119-language
docs-must-not-edit
frontmatter-only-state
language-policy
```

这些名称更像单条断言、局部规则或重复 kind，不能稳定表达 module 的主题边界。

### Borderline

```md
## Rules

### Audience Decision

- contexta 文档作者 MUST 在写作前明确目标读者。
- contexta 文档作者 MUST 在写作前明确读者目标。

### Agent-Facing Instruction Mode

- agent-facing 内容 MUST 使用指令模式，而不是纯描述模式。
- 描述性文字 MUST NOT 替代 agent-facing 的规范性规则。
```

同一个 module 内可以用三级标题组织断言组。它增加局部结构，但不意味着每个断言组都要拆成独立 module。
