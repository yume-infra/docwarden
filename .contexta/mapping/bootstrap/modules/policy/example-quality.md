---
kind: policy
---

# example-quality

## Intent

记录 contexta example 的当前临时质量提示。

本模块用于避免 example 变成抽象说明、伪 policy assertion、空泛教程或没有判断力的片段。

当前内容不是成熟的 quality policy。example 的质量模型需要等待更多真实使用场景、误判纠偏和调优反馈后再重新抽象。

## Scope

Applies to:

- [[mapping/bootstrap/modules/concept/example|example]]
- [[mapping/bootstrap/modules/concept/template|template]]

适用条件：

- contexta 需要创建或修改 example 内容、章节或教学材料。
- contexta 需要判断一个 example 是否足以教 agent 理解、书写或判断。
- contexta 需要维护 example 章节中的例子质量。

不适用条件：

- 需要定义 example 的概念本体。
- 需要规定某个非 example 内容类型的完整写作方法。
- 需要把 example 的写法升级为独立 structure module。
- 需要把 example 设计为独立 module kind、template kind 或目录 kind。
- 需要处理 docwarden task / review / promote / pick / cleanup 生命周期。

## Rules

- example MUST 使用具体样本，不能只写抽象判断、规则结论或概念定义。
- example MUST 服务一个明确的判断场景。
- example MUST 让 agent 看出下一次遇到相邻场景时应如何判断或书写。
- example SHOULD 展示 agent 容易犯错的相邻写法或相邻判断。
- example SHOULD 说明为什么这个具体例子有效，说明重点应落在具体文本上，而不是只重复规则。
- example SHOULD 保留足够上下文，让例子离开当前段落后仍能被理解。
- example SHOULD 一次只教一个主要判断。

## Rationale

example 的价值在于降低 agent 从抽象理解到实际判断之间的损耗。

坏 example 往往没有真正提供判断场景：它只写结论、复述规则，或把一条 policy assertion 包装成例子。这样的内容不能教 agent 下次如何判断，也很难迁移到相邻场景。

好的 example 不只是贴一个正确片段或错误片段。它要展示一个具体文本在具体压力下为什么应该这样读、这样写或这样改。

## Accepted Limitation

当前 example 结构已经先行落地，但具体 example 的质量仍依赖真实使用场景继续补充。

本轮接受的局限是：现有 examples 主要用于验证结构形状，未必都是高质量教学样本。后续在实际使用、误判纠偏和内容调优中，应持续把真实判断场景补回 `Scenario` 和 `Judgment Material`，再据此重写 `Positive`、`Negative` 和 `Borderline`。

缺少真实场景时，example SHOULD 明确占位，说明后续需要补哪类用例，而不是编造一个看似完整但没有判断压力的片段。

后续应重新判断本模块是否仍属于 policy，或应被抽象为更合适的模型。

## Examples

### Scenario

用户要求 agent “把 template 规则写进 `.contexta/mapping/docwarden/templates/user-context.md`”。

### Judgment Material

```md
## Rules

- template MUST NOT 承接来源、review、pick、更新、写入或生命周期。
```

### Positive

```md
这条内容是 policy，不是 template 骨架。template 只能提供复制后的初始结构；template 的边界规则应进入 `.contexta/mapping/bootstrap/modules/policy/template-boundary.md`。
```

这个 example 有真实压力、具体错误文本和可迁移的纠偏判断。agent 下次遇到“把规则写进 template”的请求时，能判断落点问题。

### Negative

```text
template 不应该写规则。
```

这只是结论。它没有展示 agent 会怎么误写，也没有教 agent 在真实场景里如何判断。

### Borderline

```text
合理：占位规则句。
不合理：真实规则句。
```

这个写法有对照，但缺少具体上下文。它能说明一个结论，却不能充分训练 agent 在文件落点、内容类型和用户请求之间做判断。
