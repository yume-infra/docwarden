---
kind: policy
---

# language-policy

## Intent

定义 contexta 规范性规则的语言强度表达方式。

本 policy 要减少自然语言约束在 agent 执行时的偏移，让规则强度可以被稳定审查和识别。

## Scope

适用范围：

- contexta 中面向 agent 的规范性规则表达。
- contexta 中使用 `MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY` 的规则句。

不适用范围：

- 不面向 agent 执行的解释性文字、设计讨论或示例文本。
- agent-facing 与 user-facing 的受众选择和表达模式。
- module 的文档模板、必填段落、组合方式、输出目标、提取流程或生命周期状态。

## Rules

### RFC2119 Constraint Strength

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

### RFC2119 Constraint Strength

当前只采用 RFC2119 作为第一条语言策略。后续如果出现中文术语、双语表达、prompt 语言选择或其他规则语言策略，继续加入本 module，而不是新建过碎的 language policy。

contexta 使用 RFC2119 关键词，是为了让规则的强度更稳定地传递给 agent。

中文自然语言中的“应该”“最好”“不要”“必须”等表达，在不同上下文中强度不稳定。使用固定关键词后，规则更容易被人审查，也更容易在后续被脚本或组合流程识别。

contexta 先采用精简关键词集合，避免同义词过多导致规则强度分散。

## Examples

### RFC2119 Constraint Strength

RFC2119 规则句推荐形态：

```text
- <主体> <关键词> <动作> <对象/范围/条件>。
```

RFC2119 规则句示例：

```md
- agent MUST 先读取当前目录的 `roadmap.md`。
- agent SHOULD 根据 `roadmap.md` 中的 Read Order 继续读取相关 module。
- agent MUST NOT 在确认写入范围前修改目标文件。
```

## Reference

- RFC2119: https://datatracker.ietf.org/doc/html/rfc2119
