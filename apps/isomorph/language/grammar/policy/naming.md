---
kind: policy
---

# naming

## Intent

定义 isomorph 中名称如何形成和保持稳定。

本 policy 用于让目录名、文件名、标题名、concept designation 和 policy 主题成为可靠的语义定位入口。

## Scope

Applies to:

- [[language/primitive/concept/naming|naming]]
- [[language/primitive/concept/module|module]]
- [[language/primitive/concept/concept|concept]]
- [[language/primitive/concept/policy|policy]]
- [[language/primitive/concept/template|template]]
- [[language/structure/concept/structure|structure]]

适用条件：

- isomorph 需要创建或重命名 module。
- isomorph 需要命名 concept、policy 或 template。
- isomorph 需要命名 structure 或 structure 的具体关系形态。
- isomorph 需要判断名称是否表达稳定语义对象或规则主题。

不适用条件：

- 需要定义某个 concept 的含义。
- 需要决定某条 policy 的规则内容。
- 需要处理 docwarden task / review / promote / pick / cleanup 生命周期。

## Rules

- isomorph module filename MUST 表达 module 的稳定语义主题。
- 当目录和 frontmatter 已经表达 kind 时，isomorph module filename MUST NOT 再编码 module kind。
- isomorph module title MUST 与 module filename stem 一致。
- concept canonical designation MUST 与 concept module filename stem 一致。
- concept canonical designation MUST 被 semantic-lint 作为 primary magic word 消费。
- aliases MAY be treated as fallback tokens with lower confidence than canonical.
- aliases MUST NOT be treated as primary magic words.
- avoid entries MUST be treated as negative tokens, not aliases.
- policy module filename MUST 表达约束主题，而不是重复 `policy`。
- template filename MUST 表达它提供骨架的 kind 或 content role。
- structure module filename SHOULD 表达关系形态或被组织的语义对象。
- aliases MUST 只包含可以合理指向同一 concept 的可替代名称。
- aliases MUST NOT 包含解释性描述。
- avoid entries MUST 记录容易误导的 designation，而不是已经由 delimitation 覆盖的相邻 concept。
- 无效名称示例 SHOULD 说明其命名失败点。

## Rationale

对 isomorph 来说，naming 是语义基础设施。

agent 会把名称当作查询入口。若名称混入 kind、规则文本、生命周期状态或含糊标签，agent 就必须额外推断内容落点，也更容易混淆相邻层级。

目录和 frontmatter 已经承载 kind 信息。文件名重复 kind 会增加名称长度，却不能提升语义定位能力。

semantic-lint 可以直接消费命名 token。canonical designation 是强锚点；alias 只能作为低置信度 fallback；avoid 只能作为误称压力。

## Examples

### Scenario

agent 新建一个约束 template 职责边界的 policy module。

### Judgment Material

- `apps/isomorph/language/grammar/policy/template-boundary-policy.md`
- `apps/isomorph/language/grammar/policy/template-must-not-own-lifecycle.md`

### Positive

```md
正确命名：

- `apps/isomorph/language/grammar/policy/template-boundary.md`

正确判断：

目录和 frontmatter 已经表达 kind，文件名不应重复 `policy`。文件名也不应直接写成单条规则；它要表达稳定约束主题。
```

这个 example 把命名失败点放进真实创建文件场景里，agent 能判断何时保留复合词、何时删除 kind 后缀。

### Negative

```md
Aliases:

- semantic location mechanism
```

这不是 alias，而是在解释 concept。alias 应是可以合理替代 canonical designation 的名称。

### Borderline

```md
Canonical: `language`
```

`language` 可能指自然语言、规则语言或编程语言。当前可通过 policy 的 intent 和 scope 消歧；只有当多个 language 主题并存且无法消歧时，才需要更具体名称。

### Consumption

```md
Canonical: `locator`

Aliases:

- semantic locator

Avoid:

- location
```

semantic-lint 可以把 `locator` 作为 primary magic word。

`semantic locator` 只能作为 fallback token。

`location` 只能作为 negative token。
