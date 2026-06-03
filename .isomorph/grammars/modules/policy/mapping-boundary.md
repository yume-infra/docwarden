---
kind: policy
---

# mapping-boundary

## Intent

约束 isomorph mapping layer 的目录和职责边界。

本 policy 用于避免 isomorph 的 bootstrap、contexta、docwarden 三类 mapping 层被压平到同一层。

## Scope

Applies to:

- [[primitives/modules/concept/mapping|mapping]]
- [[primitives/modules/concept/metadata/kind|kind]]
- [[primitives/modules/concept/template|template]]
- [[primitives/modules/concept/module|module]]

适用条件：

- isomorph 需要新增、迁移或判断 `.isomorph` 下的 module / template 落点。
- isomorph 需要判断某个内容属于 bootstrap mapping、contexta mapping 还是 docwarden mapping。
- isomorph 需要说明 contexta 与 docwarden 资产如何使用 isomorph 定义的内容语言。

不适用条件：

- 需要移动 docwarden 具体长期资产。
- 需要设计 docwarden task / review / promote / pick / cleanup lifecycle。
- 需要设计 format、locator 或 semantic lint 的完整机制。

## Rules

- isomorph MUST 用目录结构表达 mapping 关系。
- isomorph 的 bootstrap 内容 MUST 放在 `.isomorph/` 下。
- contexta 的语义映射（如 user-context / capability）MUST 放在 `.isomorph/exports/contexta/` 下。
- docwarden 的 workflow definition 映射（定义层）MUST 放在 `.isomorph/exports/docwarden/` 下。
- docwarden 具体长期资产 MUST 保留在 `.docwarden/` 下。
- mapping MUST NOT 把 docwarden 具体资产移入 `.isomorph`。
- mapping MUST NOT 替代 `kind`。
- mapping MUST NOT 替代 docwarden workflow。
- `kind` MUST 继续表达 md module 的内容语言入口。
- template MUST 继续只提供复制后的内容骨架。
- format、locator 和 semantic lint SHOULD 在 mapping 关系稳定后再继续设计。

## Rationale

isomorph 本身就是理论到实体的映射。

它一方面要用自己的内容语言定义自己，另一方面也要把内容语言投射给 contexta 与 docwarden 资产使用。

如果 `.isomorph` 只按 `modules/concept`、`modules/policy`、`templates` 分层，目录只能表达 content kind，不能表达 bootstrap/contexta/docwarden mapping 的差异。

mapping layer 把这条关系提到目录第一层，让 agent 先判断“理论映射到哪里的实体”，再判断该实体使用哪种内容语言。

## Examples

### Scenario

agent 准备为 `user-context` 选择 `.isomorph` 落点。

### Judgment Material

```text
user-context 是 contexta 用户上下文资产的内容语言。
```

### Positive

```md
`.isomorph/exports/contexta/modules/concept/user-context.md`
```

这是 contexta mapping，因为它承接的是 user-context / capability 这类语义映射。

### Negative

```md
`.isomorph/primitives/modules/concept/user-context.md`
```

这会把 contexta 映射误放成 isomorph 的 bootstrap concept。

### Borderline

```md
`.isomorph/primitives/modules/concept/template.md`
```

这属于 bootstrap mapping，因为它定义 isomorph 自己如何理解 template。
