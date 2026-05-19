---
kind: policy
---

# naming

## Intent

定义 contexta 中名称如何形成和保持稳定。

本 policy 用于让目录名、文件名、标题名、concept designation 和 policy 主题成为可靠的语义定位入口。

## Scope

Applies to:

- [[naming]]
- [[module]]
- [[concept]]
- [[policy]]
- [[template]]

适用条件：

- contexta 需要创建或重命名 module。
- contexta 需要命名 concept、policy 或 template。
- contexta 需要判断名称是否表达稳定语义对象或规则主题。

不适用条件：

- 需要定义某个 concept 的含义。
- 需要决定某条 policy 的规则内容。
- 需要处理 docwarden task / review / promote / pick / cleanup 生命周期。

## Rules

- contexta module filename MUST 表达 module 的稳定语义主题。
- 当目录和 frontmatter 已经表达 kind 时，contexta module filename MUST NOT 再编码 module kind。
- contexta module title MUST 与 module filename stem 一致。
- concept canonical designation MUST 与 concept module filename stem 一致。
- policy module filename MUST 表达约束主题，而不是重复 `policy`。
- template filename MUST 表达它提供骨架的 kind 或 content role。
- aliases MUST 只包含可以合理指向同一 concept 的可替代名称。
- aliases MUST NOT 包含解释性描述。
- avoid entries MUST 记录容易误导的 designation，而不是已经由 delimitation 覆盖的相邻 concept。
- 无效名称示例 SHOULD 说明其命名失败点。

## Rationale

对 contexta 来说，naming 是语义基础设施。

agent 会把名称当作查询入口。若名称混入 kind、规则文本、生命周期状态或含糊标签，agent 就必须额外推断内容落点，也更容易混淆相邻层级。

目录和 frontmatter 已经承载 kind 信息。文件名重复 kind 会增加名称长度，却不能提升语义定位能力。

## Examples

policy filename 推荐：

```text
language
audience
semantic-granularity
template-boundary
```

避免：

```text
language-policy
audience-policy
docs-must-not-edit
misc
```

concept aliases 推荐：

```md
Aliases:

- semantic naming
```

避免：

```md
Aliases:

- semantic location mechanism
```

第二个短语是在解释 concept，不是实际可替代的 designation。
