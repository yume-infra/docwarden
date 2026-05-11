---
kind: policy
---

# rfc2119-language

## Intent

定义 RFC2119 关键词在 contexta 中的使用方式，减少自然语言约束在 agent 执行时的偏移。

本 policy 只处理 `MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY` 这些规范词语的语义和使用边界。

## Scope

本 policy 适用于 contexta 中面向 agent 的规范性规则表达。

本 policy 不定义 module 的文档模板、必填段落、组合方式、输出目标、提取流程或生命周期状态。

本 policy 不要求解释性文字、设计讨论或示例文本使用 RFC2119 关键词。

## Rules

- contexta 规范性规则 MUST 使用 RFC2119 关键词表达约束强度。
- 必须执行的行为 MUST 使用 `MUST`。
- 禁止执行的行为 MUST 使用 `MUST NOT`。
- 默认应执行但允许明确例外的行为 MUST 使用 `SHOULD`。
- 默认不应执行但允许明确例外的行为 MUST 使用 `SHOULD NOT`。
- 可选行为 MUST 使用 `MAY`。
- contexta SHOULD 优先使用 `MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY` 这组精简关键词。
- contexta SHOULD NOT 使用 `REQUIRED`、`SHALL`、`SHALL NOT`、`RECOMMENDED`、`NOT RECOMMENDED`、`OPTIONAL` 等别名。
- 一条规范性规则 SHOULD 只描述一个义务、禁止、默认行为或可选能力。
- 使用 RFC2119 关键词的规则 SHOULD 明确其生效范围。
- 使用 RFC2119 关键词的规则 SHOULD 明确其执行主体。
- 使用 RFC2119 关键词的规则 MUST NOT 只依赖加粗、警告图标、重复标点等视觉强调来表达约束。

## Keyword Meanings

- `MUST`：必须执行的行为。
- `MUST NOT`：禁止执行的行为。
- `SHOULD`：默认应执行，但允许有明确理由的例外。
- `SHOULD NOT`：默认不应执行，但允许有明确理由的例外。
- `MAY`：可选行为。

## Rationale

contexta 使用 RFC2119 关键词，是为了让规则的强度更稳定地传递给 agent。

中文自然语言中的“应该”“最好”“不要”“必须”等表达，在不同上下文中强度不稳定。使用固定关键词后，规则更容易被人审查，也更容易在后续被脚本或组合流程识别。

contexta 先采用精简关键词集合，避免同义词过多导致规则强度分散。

## Examples

推荐形态：

```text
- <主体> <关键词> <动作> <对象/范围/条件>。
```

示例：

```md
- agent MUST NOT 直接修改 `docs/` 下的文件。
- contexta module SHOULD 把解释性文字放在规则段落之外。
- adapter MAY 在生成结果中渲染来源追溯信息。
```

## Reference

- RFC2119: https://datatracker.ietf.org/doc/html/rfc2119
