---
kind: policy
---

# mapping-boundary

## Intent

约束 contexta mapping layer 的目录和职责边界。

本 policy 用于避免 contexta 的 bootstrap 内容与 contexta 到 docwarden 的映射内容被压平到同一层。

## Scope

Applies to:

- [[mapping]]
- [[kind]]
- [[template]]
- [[module]]

适用条件：

- contexta 需要新增、迁移或判断 `.contexta` 下的 module / template 落点。
- contexta 需要判断某个内容属于 bootstrap mapping 还是 docwarden mapping。
- contexta 需要说明 docwarden 资产如何使用 contexta 定义的内容语言。

不适用条件：

- 需要移动 docwarden 具体长期资产。
- 需要设计 docwarden task / review / promote / pick / cleanup lifecycle。
- 需要设计 format、locator 或 semantic lint 的完整机制。

## Rules

- contexta MUST 用目录结构表达 mapping 关系。
- contexta 的 bootstrap 内容 MUST 放在 `.contexta/mapping/bootstrap/` 下。
- contexta 面向 docwarden 资产的内容语言定义和 template MUST 放在 `.contexta/mapping/docwarden/` 下。
- docwarden 具体长期资产 MUST 保留在 `.docwarden/` 下。
- mapping MUST NOT 把 docwarden 具体资产移入 `.contexta`。
- mapping MUST NOT 替代 `kind`。
- mapping MUST NOT 替代 docwarden workflow。
- `kind` MUST 继续表达 md module 的内容语言入口。
- template MUST 继续只提供复制后的内容骨架。
- format、locator 和 semantic lint SHOULD 在 mapping 关系稳定后再继续设计。

## Rationale

contexta 本身就是理论到实体的映射。

它一方面要用自己的内容语言定义自己，另一方面也要把内容语言投射给 docwarden 资产使用。

如果 `.contexta` 只按 `modules/concept`、`modules/policy`、`templates` 分层，目录只能表达 content kind，不能表达 bootstrap mapping 和 docwarden mapping 的差异。

mapping layer 把这条关系提到目录第一层，让 agent 先判断“理论映射到哪里的实体”，再判断该实体使用哪种内容语言。

## Examples

### Scenario

agent 准备为 `user-context` 选择 `.contexta` 落点。

### Judgment Material

```text
user-context 是 docwarden 用户上下文资产的内容语言。
```

### Positive

```md
`.contexta/mapping/docwarden/modules/concept/user-context.md`
```

这是 docwarden mapping，因为它定义的是 docwarden 资产可以使用的内容语言。

### Negative

```md
`.contexta/mapping/bootstrap/modules/concept/user-context.md`
```

这会把 docwarden 资产映射误放成 contexta 的 bootstrap concept。

### Borderline

```md
`.contexta/mapping/bootstrap/modules/concept/template.md`
```

这属于 bootstrap mapping，因为它定义 contexta 自己如何理解 template。
