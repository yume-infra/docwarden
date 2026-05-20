---
kind: policy
---

# example-quality

## Intent

定义 contexta example 的质量约束。

本 policy 用于避免 example 变成抽象说明、伪 policy assertion、空泛教程或不可迁移的片段。

## Scope

Applies to:

- [[example]]
- [[template]]

适用条件：

- contexta 需要创建或修改 example module。
- contexta 需要判断一个样本是否足以教 agent 理解、书写或判断。
- contexta 需要维护 example template 的默认章节结构。

不适用条件：

- 需要定义 example 的概念本体。
- 需要规定某个非 example 内容类型的完整写作方法。
- 需要把 example 的局部教学结构升级为独立 structure module。
- 需要正式定义 sample set 或 contrast set 的结构。
- 需要处理 docwarden task / review / promote / pick / cleanup 生命周期。

## Rules

- example MUST 有一个明确的 primary target。
- example MUST 有一个明确的 teaching point。
- teaching point MUST 说明该 example 要教 agent 理解、书写或判断什么。
- teaching point SHOULD 比 primary target 更窄。
- example MUST 包含具体 sample。
- sample MUST 是 agent 可以模仿、对照或迁移的具体内容。
- sample MUST NOT 被抽象说明、规则结论或概念定义替代。
- example SHOULD 按 `Target -> Teaching Point -> Sample -> Reading -> Transfer -> Limits` 组织。
- reading MUST 解释 sample 中哪些部分值得注意。
- reading MUST NOT 只重复 teaching point。
- transfer SHOULD 说明 sample 如何迁移到相邻场景。
- limits SHOULD 说明 sample 不能被泛化到哪里。
- 当 sample 容易被误用为 concept 定义、policy 规则或 template 骨架时，limits MUST 明确限制。
- example SHOULD 一次只教一个主要模式。
- example SHOULD 使用单个 sample。
- 单样本 example SHOULD 使用 `Sample` 表达具体样本。
- 当前不引入 sample set 或 contrast set。
- 如果一个 example 需要多个样本互相对照，应回到 example 设计 loop，而不是在当前 template 中硬补。
- positive、negative、borderline MUST NOT 被写成单个 sample 的内部小标题。
- positive、negative、borderline MUST NOT 替代 example 的 teaching point。
- example 的局部教学结构 MUST NOT 仅因为 structure concept 已落地就自动升级为独立 structure module。

## Rationale

example 的价值在于降低 agent 从抽象理解到实际生成之间的损耗。

坏 example 往往没有真正提供样本：它只写结论、复述规则，或把一条 policy assertion 包装成例子。这样的内容不能教 agent 如何落笔，也很难迁移到相邻场景。

`Target -> Teaching Point -> Sample -> Reading -> Transfer -> Limits` 是 example 内部的轻结构。它服务 example 编写，不等于这条教学链已经成为独立 structure module。

positive、negative、borderline 不是单个 sample 的内部结构。当前不为它们引入 sample set 或 contrast set；如果后续需要多样本对照，应重新讨论 example 的设计。

## Examples

合理的 teaching point：

```text
示范 policy 如何通过 `Applies to` 指向 concept，而不是在正文重新定义 concept。
```

不合理的 teaching point：

```text
说明 policy。
```

第二个说法太宽，不能指导 agent 生成具体样本。

合理的 sample：

```md
## Scope

Applies to:

- [[example]]

适用条件：

- contexta 需要创建或修改 example module。
```

这个 sample 给出了可以模仿的具体写法。

不合理的 sample：

```text
policy 应该写清楚适用范围。
```

这是一条抽象判断，不是足够具体的样本。

多样本对照不应写成：

```text
positive sample
negative sample
borderline sample
```

这些名称不是当前 example template 的章节，也不是当前已落地的 structure subtype。
