---
kind: policy
---

# <policy-id>

## Intent

<用 1-3 句话说明这个 policy 要解决什么问题，或保护什么边界。>

## Scope

Applies to:

- [[<concept-id>]]

适用条件：

- <说明这个 policy 在哪些场景、对象或文件范围内生效。>

不适用条件：

- <说明这个 policy 不适用于哪些相邻场景，避免规则被错误泛化。>

## Rules

- <主体> <MUST|MUST NOT|SHOULD|SHOULD NOT|MAY> <动作> <对象/范围/条件>。

## Rationale

<可选：解释这些规则背后的原因。若没有必要，删除本段。>

## Examples

### Scenario

<agent 或作者正在处理的具体规则场景。>

### Judgment Material

<放入容易出现的错误规则、错误落点或错误命名。>

### Positive

```md
正确写法：

<放入符合本 policy 的具体写法。>

正确判断：

<说明为什么正确写法符合本 policy。>
```

<说明这个 example 如何帮助 agent 在相邻场景中判断。>

### Negative

```md
<放入只有抽象结论、没有判断场景的例子。>
```

<说明为什么无效。没有必要时删除本段。>

### Borderline

```md
<放入容易误判的相邻场景。>
```

<说明缺少哪些条件。没有必要时删除本段。>
