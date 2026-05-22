---
kind: policy
---

# template-boundary

## Intent

定义 contexta template 的职责边界。

本 policy 用于避免 template 承接规则本体、内容本体或 docwarden 生命周期。

## Scope

Applies to:

- [[template]]
- [[module]]
- [[assertion]]
- [[kind]]

适用条件：

- contexta 需要创建或修改 template。
- contexta 需要判断某个内容应进入 template、module 还是 policy。
- contexta 需要在 template 中提供 assertion 或 module 的书写槽位。
- contexta 需要判断某个 template 是否会反向制造 kind。

不适用条件：

- 需要定义某个 concept 的含义。
- 需要定义某条 policy 的规则本体。
- 需要处理 docwarden 的 task、review、promote、pick 或 cleanup。

## Rules

- template MUST 只负责复制后的内容骨架。
- template MUST 指向已确认的目标内容语言。
- template MUST 提供稳定正文骨架，而不是只提供一个未来可能有用的名称。
- template MUST NOT 承接来源、review、pick、更新、写入或生命周期。
- template MUST NOT 作为规则本体的长期落点。
- template MUST NOT 作为 concept 定义的长期落点。
- template MUST NOT 仅因为某个 concept 存在就被创建。
- template MUST NOT 反向证明一个 kind 成立。
- template 文件中的 `kind` MAY 指向复制后目标 module 的 content kind。
- template 文件中的 `kind` MUST NOT 被解释为 template artifact 自身的 kind。
- template MAY 提供 assertion 的书写槽位。
- template MAY 提供 module 的默认章节结构。
- template 中的占位内容 MUST 被视为写作提示，而不是已接受的 assertion。

## Rationale

template 的价值是降低新建内容时的结构偏移。

如果 template 同时承接规则本体、概念定义或生命周期，contexta 会把内容格式协议和 docwarden 操作流程混在一起。

规则本体应进入 policy module，概念定义应进入 concept module，生命周期应由 docwarden workflow 处理。

template 是否存在取决于目标内容语言是否已经成立、骨架是否稳定、复制是否能降低结构偏移。

如果 template 只是为了让一个词看起来像 kind，它会把内容语言设计反向交给文件存在性决定。

## Examples

### Scenario

agent 准备把 template 边界规则写进 `.contexta/templates/policy.md`。

### Judgment Material

```md
## Rules

- template MUST NOT 承接来源、review、pick、更新、写入或生命周期。
```

### Positive

```md
这是真实规则，应进入 `.contexta/modules/policy/template-boundary.md`。template 只能保留占位骨架。
```

这个 example 给出 template 最容易越界的场景：把规则本体写进复制骨架。

### Negative

```md
template 不应该写规则。
```

这只是抽象结论。它没有展示真实误写位置，也没有说明规则应该改落到哪个 module。

### Borderline

```md
## Rules

- <主体> <MUST|MUST NOT|SHOULD|SHOULD NOT|MAY> <动作> <对象/范围/条件>。
```

这是占位规则句，可以留在 template 中。占位一旦被替换成具体规则，就应进入 policy module。
