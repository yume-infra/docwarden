---
kind: concept
---

# semantic-lint

## Designation

Canonical: `semantic-lint`

Aliases:

- semantic lint

## Naming Need

contexta 需要一个名字表示检查语义偏移的检测语言。

这个名字用于区分 policy 的约束语言、relation 的连接语言、example 的样本语言和未来 CLI 中的 lint step。

## Definition

semantic-lint 是语义偏移检测语言。

它直接消费 formatted md，通过 signal definition 描述可审查的语义偏移风险，并在未来 CLI lint step 中产生 signal instance。

semantic-lint 当前阶段先整理 warning signal，不设计完整 lint engine。

semantic-lint 作为 concept 不承载完整执行结构。

当前执行链路由 [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]] 表达。

当前第一批 signal definitions 放在 `.contexta/mapping/bootstrap/modules/signal/`。

semantic-lint 不等待额外 reading layer 或 facts layer。format 保持 md 形态，semantic-lint 直接检查这个 md。

## Delimitation

- [[mapping/bootstrap/modules/concept/policy|policy]]：policy 表达约束；semantic-lint 检测内容是否疑似偏离已定义语义。
- [[mapping/bootstrap/modules/concept/format|format]]：format 保持 md 可被直接消费的形态；semantic-lint 消费这个 formatted md。
- [[mapping/bootstrap/modules/concept/signal|signal]]：signal 是被命名的 warning；semantic-lint 是组织这些 warning 的检测语言。
- [[mapping/bootstrap/modules/concept/trigger|trigger]]：trigger 是可观察触发条件；semantic-lint 组织 trigger 如何生成 signal。
- [[mapping/bootstrap/modules/concept/locator|locator]]：locator 指向 assertion marker；semantic-lint 使用 locator 把 signal instance 指回具体 assertion。
- [[mapping/bootstrap/modules/concept/confidence|confidence]]：confidence 标记 candidate / instance 的识别强度；semantic-lint 产生 warning 本身。
- [[mapping/bootstrap/modules/concept/pipeline|pipeline]]：pipeline 表达检测链路如何从 formatted md 转换出 candidate / instance；semantic-lint 是检测语言本身。
- docwarden workflow：docwarden workflow 处理 task / review / promote / pick / cleanup；semantic-lint 只产生语义偏移信号。

## Examples

### Scenario

agent 发现一个 concept module 的 Definition 中出现 MUST / SHOULD 约束。

### Judgment Material

```md
## Definition

agent MUST use OFM path alias. ^a-def
```

### Positive

```md
semantic-lint 可以产生 `concept-as-policy` candidate。

如果该 assertion 有 `^a-def` marker，则未来 signal instance 可以用 locator 指向它。
```

这个 example 让 agent 看到 semantic-lint 产生 warning signal，而不是直接判定内容必须迁移。

### Negative

```md
semantic-lint MUST forbid concept modules from using MUST.
```

这是一条 policy assertion。semantic-lint 本身不表达约束强度。

### Borderline

```md
signal: concept-as-policy
locator: [[mapping/bootstrap/modules/concept/example#^a-def|example definition]]
```

这是未来 CLI lint step 可能产生的 signal instance，不是当前 concept definition。
