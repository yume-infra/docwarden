---
kind: example
---

# example-authoring

## Target

- [[example]]
- [[policy]]
- [[template]]

## Teaching Point

示范一个好 example 如何用具体 sample 教 agent 书写，而不是只写抽象说明。

## Sample

````md
---
kind: example
---

# policy-applies-to

## Target

- [[policy]]

## Teaching Point

示范 policy 如何通过 `Applies to` 指向 concept，而不是在正文重新定义 concept。

## Sample

```md
## Scope

Applies to:

- [[example]]

适用条件：

- contexta 需要创建或修改 example module。

不适用条件：

- 需要定义 example 的概念本体。
```

## Reading

这个 sample 把被约束对象放在 `Applies to` 中，并把具体生效条件写在适用条件里。

它没有在正文重新定义 `example` 是什么，因此符合 `policy applies to concept` 的关系。

## Transfer

写其他 policy 时，保留 `Applies to` 指向 concept 的做法，并替换适用条件中的具体场景。

## Limits

这个 sample 只示范 policy scope 的写法，不示范 policy 的完整规则设计。
````

## Reading

这个 sample 有明确的 target 和 teaching point，因此 agent 能知道它服务哪个对象、具体要学什么。

它提供了可模仿的 md 片段，而不是只说“policy 要写清楚适用范围”。

`Reading` 解释 sample 中的关键点，`Transfer` 说明如何迁移，`Limits` 阻止 agent 把局部片段当成完整 policy 模板。

## Transfer

写新的 example 时，保留这条教学链：

```text
Target -> Teaching Point -> Sample -> Reading -> Transfer -> Limits
```

如果需要教学多个模式，应拆成多个 example，或在同一个 example 中明确分组。

如果需要使用 positive、negative、borderline，它们应作为未来 sample set 或 contrast set 中的 sample role 处理。当前不要把它们写成单个 `Sample` 的内部小标题。

## Limits

这个 example 只示范单样本 example authoring 的局部质量模式，不定义 `example` 的概念本体，也不把教学链升级为 structure primitive。

sample set / contrast set 当前只是占位，尚未正式落地为 concept、policy 或 structure。
