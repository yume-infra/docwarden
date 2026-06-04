---
kind: policy
---

# language

## Intent

定义 isomorph 规范性规则的语言强度表达方式。

本 policy 要减少自然语言约束在 agent 执行时的偏移，让规则强度可以被稳定审查和识别。

## Scope

Applies to:

- [[primitives/concept/policy|policy]]
- [[language/primitive/concept/assertion|assertion]]

适用条件：

- isomorph 需要表达面向 agent 的规范性规则。
- isomorph 需要使用 `MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY` 表达规则强度。

不适用条件：

- 不面向 agent 执行的解释性文字、设计讨论或示例文本。
- agent-facing 与 user-facing 的受众选择和表达模式。
- module 的文档模板、必填段落、组合方式、输出目标、提取流程或生命周期状态。

## Rules

### RFC2119 Constraint Strength

- isomorph 规范性规则 MUST 使用 RFC2119 关键词表达约束强度。
- 必须执行的行为 MUST 使用 `MUST`。
- 禁止执行的行为 MUST 使用 `MUST NOT`。
- 默认应执行但允许明确例外的行为 MUST 使用 `SHOULD`。
- 默认不应执行但允许明确例外的行为 MUST 使用 `SHOULD NOT`。
- 可选行为 MUST 使用 `MAY`。
- isomorph SHOULD 优先使用 `MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY` 这组精简关键词。
- isomorph SHOULD NOT 使用 `REQUIRED`、`SHALL`、`SHALL NOT`、`RECOMMENDED`、`NOT RECOMMENDED`、`OPTIONAL` 等别名。
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

当前只采用 RFC2119 作为第一条语言策略。后续如果出现中文术语、双语表达、prompt 语言选择或其他规则语言策略，继续加入 `language` module，而不是新建过碎的局部 policy module。

isomorph 使用 RFC2119 关键词，是为了让规则的强度更稳定地传递给 agent。

中文自然语言中的“应该”“最好”“不要”“必须”等表达，在不同上下文中强度不稳定。使用固定关键词后，规则更容易被人审查，也更容易在后续被脚本或组合流程识别。

isomorph 先采用精简关键词集合，避免同义词过多导致规则强度分散。

## Examples

### Scenario

agent 正在把一条面向 agent 的读取规则写进 policy。

### Judgment Material

- agent 最好先读取当前目录的 `roadmap.md`。

### Positive

```md
正确写法：

- agent SHOULD 先读取当前目录的 `roadmap.md`。

正确判断：

原句的“最好”强度不稳定。改成 `SHOULD` 后，规则表达了默认应执行但允许明确例外。
```

这个 example 让 agent 看到 language policy 处理的是规则强度，不是句子润色。

### Negative

```md
- agent 应该写得更清楚。
```

这句话没有明确主体、动作、对象或条件，也没有稳定的 RFC2119 强度。

### Borderline

```md
- agent MUST 先读取当前目录的 `roadmap.md`，并根据 Read Order 继续读取相关 module。
```

这句话使用了 `MUST`，但同时承载两个动作。若两个动作需要分别审查，应拆成两条规则。

## Reference

- RFC2119: https://datatracker.ietf.org/doc/html/rfc2119
