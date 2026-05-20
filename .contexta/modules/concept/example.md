---
kind: concept
---

# example

## Designation

Canonical: `example`

Aliases:

- sample

## Naming Need

contexta 需要一个名字表示用于教 agent 理解、书写或判断的具体样本。

这个名字用于避免只靠抽象定义、规则或骨架推进内容设计，导致 agent 知道概念但不知道具体怎么落笔。

## Definition

样本语言，用具体实例示范某个语义对象、规则、结构或内容骨架应如何被理解、生成或判断。

example 的核心是示范和教学。边界识别、review 对照或 semantic lint 参考是样本产生的派生用途，不是 example 的本体定义。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[concept]] | concept 稳定名字和含义；example 用样本帮助 agent 理解这个名字如何被使用。 |
| [[policy]] | policy 表达约束；example 示范这些约束在具体内容中长什么样。 |
| [[template]] | template 提供复制骨架；example 提供可模仿或可对照的具体样本。 |
| [[structure]] | structure 表达多个对象之间的组织关系；example 使用 sample 教 agent 理解或生成。 |
| [[module]] | module 是语义组合单位；example 是以样本为核心组织的 module。 |
| [[assertion]] | assertion 是最小可审查语义单元；example 可以由多条 assertion 共同说明一个样本。 |
| test case | test case 偏验证预期结果；example 偏教学、示范和迁移。 |

## Concept Relations

- [[concept]]：example 可以帮助 agent 理解 concept 的命名和使用场景。
- [[policy]]：example 可以示范 policy 在具体文本中的表现。
- [[template]]：example 可以展示 template 被填充后的内容形态。
- [[structure]]：example 可以用 structure 表达多个 sample 之间的教学关系。
- [[module]]：example 文件本身也是一种 module。
- [[assertion]]：example 的解释和迁移说明可以由 assertion 组成。
- [[naming]]：example 的名称应表达它示范的对象或场景。

## Examples

### Positive

```text
一个 example module 展示 `policy` module 如何通过 `Applies to` 指向 [[concept]]，并用 RFC2119 表达规则强度。
```

这个样本教 agent 如何书写 policy，而不是重新定义 policy。

### Negative

```text
agent MUST 使用中文表达面向用户的内容。
```

这是一条 policy assertion，不是 example。它规定行为，但没有提供样本。

### Borderline

`positive`、`negative`、`borderline` 可以作为 sample set 中的 sample role，但它们不是 example 的本体定义，也不是单个 sample 的内部结构。example 的本体仍然是样本语言。
