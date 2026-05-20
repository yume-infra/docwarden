---
kind: concept
---

# example

## Designation

Canonical: `example`

## Naming Need

contexta 需要一个名字表示用于教 agent 理解、书写或判断的具体样本。

这个名字用于避免只靠抽象定义、规则或骨架推进内容设计，导致 agent 知道概念但不知道具体怎么落笔。

## Definition

example 是样本语言：用一个具体样本让 agent 学会如何理解、书写或判断某个对象。

example 的核心不是证明正文正确，而是在一个具体判断场景里教 agent 下次如何看、如何写、如何避免误判。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[concept]] | concept 稳定名字和含义；example 用具体样本帮助 agent 理解这个名字如何被使用。 |
| [[policy]] | policy 表达约束；example 把约束放进具体判断场景中示范。 |
| [[template]] | template 提供复制骨架；example 提供一个可读、可模仿或可对照的具体样本。 |
| [[structure]] | structure 表达多个语义位置如何共同成立；example 用具体场景示范这些位置如何被理解或使用。 |
| [[module]] | module 是语义组合单位；example 文件本身也是一种 module。 |
| [[assertion]] | assertion 是最小可审查语义单元；example 可以用 assertion 解释样本里的判断点。 |
| test case | test case 偏验证预期结果；example 偏教学、示范和迁移。 |

## Concept Relations

- [[concept]]：example 可以帮助 agent 理解 concept 的命名和使用场景。
- [[policy]]：example 可以示范 policy 在具体文本中的表现。
- [[template]]：example 可以展示 template 被填充后的内容形态。
- [[structure]]：example 可以示范 structure 在具体文本中的表现。
- [[module]]：example 文件本身也是一种 module。
- [[assertion]]：example 的解释和迁移说明可以由 assertion 组成。
- [[naming]]：example 的名称应表达它示范的对象或场景。

## Examples

### Scenario

用户要求 agent “把 template 规则写进 `.contexta/templates/user-context.md`”。

### Judgment Material

```md
## Rules

- template MUST NOT 承接来源、review、pick、更新、写入或生命周期。
```

### Positive

```md
这条内容是 policy，不是 template 骨架。template 只能提供复制后的初始结构；template 的边界规则应进入 `.contexta/modules/policy/template-boundary.md`。
```

这个 example 有具体场景、具体错误写法和具体纠偏判断。agent 下次遇到类似请求时，能判断“这是规则落点问题，不是模板内容问题”。

### Negative

```text
template 不应该写规则。
```

这只是抽象结论。它没有展示 agent 会在哪里误写，也没有给出可读、可迁移的判断场景。

### Borderline

```text
合理：占位规则句。
不合理：真实规则句。
```

这个 example 有对照意图，但缺少具体场景、具体文本和判断理由。它能提示差异，却还不能稳定教 agent 下次如何判断。
