---
kind: concept
---

# user-context

## Designation

Canonical: `user-context`

Aliases:

- user context

## Naming Need

contexta 需要一个名字表示面向特定用户协作的上下文内容语言。

这个名字用于避免把用户协作上下文误写成项目 policy、docwarden workflow、私人身份信息或普通 note。

## Definition

user-context 是内容语言，用于记录可复用的用户协作上下文。

它帮助 agent 在理解需求、组织审核、处理纠偏和选择表达方式时形成默认判断。

user-context 不覆盖当前用户明确指令，不覆盖项目规则，也不替代后续用户审核。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[policy]] | policy 表达约束语言；user-context 记录用户协作上下文，作为默认判断材料使用。 |
| docwarden workflow | docwarden workflow 处理 task / review / promote / pick / cleanup；user-context 只提供协作判断背景。 |
| 私人身份信息 | 私人身份信息描述个人身份；user-context 不记录私人身份，只记录当前协作需要的上下文断言。 |
| [[template]] | template 是复制骨架；user-context 是复制后目标 module 的内容语言。 |
| [[assertion]] | assertion 是最小可审查语义判断；user-context module 可以包含多条用户上下文 assertion。 |

## Examples

### Scenario

agent 读取当前项目的用户画像文件，需要判断它是不是项目 policy。

### Judgment Material

```yaml
kind: user-context
status: accepted
```

### Positive

```md
这是 user-context module。它记录当前用户的协作偏好、纠偏信号和资产边界，帮助 agent 形成默认判断。

它不是项目 policy，也不能覆盖当前用户明确指令或项目规则。
```

这个 example 让 agent 看到 user-context 的用途：提供协作判断背景，而不是成为更高优先级规则。

### Negative

```md
这是项目 policy。agent 在任何项目中都 MUST 按这里的用户偏好执行。
```

这把用户上下文错误升级成项目约束，并且越过了当前指令和项目规则的优先级。

### Borderline

```md
- agent SHOULD 默认使用中文。
```

这句话在 user-context 中是用户协作偏好的上下文断言。

如果同样的句子出现在 policy module 中，它会变成规则本体，需要重新审查适用范围和约束主体。
