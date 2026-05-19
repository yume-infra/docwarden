---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 6.3
---

# policy / concept expression boundary

本文件并排设计 `policy` 与 `concept` 的表意职责。

核心判断：

- policy 是约束语言。
- concept 是命名语言。

这两者都可以包含 assertion，但它们让 assertion 发挥作用的方式不同。

## 共同前提

contexta 要减少自然语言到 agent 理解之间的偏移。

但偏移有两类：

- agent 不知道一个词在当前系统中指什么。
- agent 知道这个词，但不知道面对它时应该怎么处理。

这两类问题不能由同一种内容承担。

因此：

- concept 稳定“词指向哪里”。
- policy 稳定“面对这个词时怎么行动”。

## concept 表达什么

concept 负责命名。

它回答：

- 这个名字指向哪个语义对象。
- 为什么需要给这个对象单独命名。
- 这个名字和相邻名字有什么差异。
- 这个名字在概念网络中连接哪些其他名字。
- 哪些例子能帮助 user / agent 把名字落到正确语义。

concept 的核心不是约束强度，而是语义锚定。

concept 应避免把自己写成：

- agent 执行规则。
- lint 规则。
- 生命周期规则。
- 落地规则。
- 文件组织规则。

这些属于 policy、structure、template 或 docwarden workflow。

## policy 表达什么

policy 负责约束。

它回答：

- 在什么 scope 下，这条约束生效。
- agent / 作者 / 系统必须做什么。
- agent / 作者 / 系统禁止做什么。
- 哪些行为默认应该或不应该。
- 为什么这些约束存在。
- 哪些例子能帮助识别约束边界。

policy 的核心不是命名，而是规范性强度。

policy 可以引用 concept，但不重新定义 concept。

policy 应避免把自己写成：

- 术语词典。
- 概念网络。
- 叙事解释。
- wiki node。
- 纯例子集合。

这些属于 concept、guide、wiki 或 example。

## assertion 在两者中的不同角色

concept 和 policy 都可以由 assertion 组成。

但 assertion 的语义力不同。

concept assertion 是命名判断：

```text
module 是 contexta 的语义组合单元。
```

它的作用是稳定“module”这个名字的含义。

policy assertion 是约束判断：

```text
contexta MUST 将 md module 视为默认组合单位。
```

它的作用是稳定 contexta 面对 module 时的处理方式。

同一主题经常需要两个层级：

- concept：先解释名字。
- policy：再约束行为。

不能用 policy 代替 concept，也不能用 concept 代替 policy。

## concept template 候选

concept template 应服务命名语言。

当前骨架：

```md
---
kind: concept
---

# <concept-id>

## Designation

Canonical: <concept-id>

Aliases:

- <可选：同义名、旧名、常见说法>

Avoid:

- <可选：容易误导的叫法>

## Naming Need

<为什么这个语义对象需要被单独命名。它解决什么混淆、偏移或表达缺口。>

## Definition

<这个名字在 contexta 中指向什么。>

## Delimitation

| Neighbor | Difference |
| --- | --- |
| <相邻概念> | <差异> |

## Concept Relations

- [[<related-concept>]]：<关系说明>

## Examples

### Positive

<正例>

### Negative

<反例>

### Borderline

<边界例>
```

### 为什么不是 Boundary / Identification / Landing

`Boundary / Identification / Landing` 容易滑向 policy、semantic lint 或 docwarden workflow。

它会诱导 agent 写：

- 什么是。
- 什么不是。
- 如何判断。
- 什么时候应该怎么处理。
- 应该落到哪里。

这些内容会把 concept 写成准规则集合。

concept 更应该先稳定命名入口：

- designation 如何指向 concept。
- 为什么需要这个名字。
- 这个名字指向什么。
- 它和相邻名字怎么区分。
- 它在概念网络里连接谁。

## policy template 当前形态

当前 policy template 已经基本符合约束语言：

```md
---
kind: policy
---

# <policy-id>

## Intent

## Scope

Applies to:

## Rules

## Rationale

## Examples
```

其中：

- `Intent` 说明约束要保护什么边界。
- `Scope` 说明约束适用 / 不适用范围。
- `Applies to` 是 policy 指向 concept 的适用关系。
- `Rules` 承载 RFC2119 规则。
- `Rationale` 说明规则原因。
- `Examples` 帮助识别规则边界。

policy template 当前不需要引入 concept 的 `Designation / Naming Need / Definition / Delimitation / Concept Relations`。

## policy / concept 关系

最终关系词采用：

```text
policy applies to concept
```

中文表述：

```text
policy 适用于 concept。
```

这个关系只说明 policy 的约束适用对象。

它不表示：

- policy 管理 concept。
- concept 拥有 policy。
- concept 和 policy 是同一对象的两个重复定义。
- 需要额外创建 governance、surface 或 facet 层。

因此第一版落地为：

```md
## Scope

Applies to:

- [[module]]
- [[assertion]]
```

## 并排示例：module

### module as concept

```text
Designation:
Canonical: module

Naming Need:
需要一个名字表示 contexta 中可阅读、可审查、可复用的 md 语义组合单位，避免把文件、template、task、assertion 混成同一个东西。

Definition:
语义组合单元，由同一稳定主题边界内的多条语义材料组成。

Delimitation:
module 不是 assertion；assertion 是 module 内部的最小可审查语义。
module 不是 template；template 是复制骨架。
```

### module as policy

```text
Scope:
Applies to:
- [[module]]
- [[assertion]]

contexta module 的拆分、命名和组合。

Rules:
- contexta MUST 将 md module 视为默认组合单位。
- 一个 module MUST 围绕稳定 intent 和 scope 组织 assertion。
- 单条 assertion SHOULD NOT 仅因为重要就升级为 module。
```

## 并排示例：assertion

### assertion as concept

```text
Designation:
Canonical: assertion

Naming Need:
需要一个名字表示文档迭代中可被单独审查的最小语义单位，避免 review 只能停留在整篇文档或整段解释上。

Definition:
assertion 指一条可被接受、拒绝、修改、引用或迁移的语义判断。

Delimitation:
assertion 不是 module；module 是 assertion 的组合上下文。
assertion 不是任意句子；没有语义判断的句子不是 assertion。
```

### assertion as policy

```text
Scope:
Applies to:
- [[assertion]]
- [[module]]

contexta 中 assertion 的书写、review 和组合。

Rules:
- contexta MUST 将 assertion 视为最小语义审查单位。
- `## Rules` 下的每条列表项 SHOULD 表达一条可审查 assertion。
- contexta SHOULD NOT 为 assertion 默认创建独立文件或独立存储位置。
```

## 当前修正

现有 `.contexta/modules/concept/module.md` 和 `.contexta/modules/concept/assertion.md` 草案不合格。

问题不是概念方向全错，而是表达方式错：

- 它们把 concept 写成了准 policy。
- 它们使用 `Boundary`、`Identification`、`Landing` 等会导向规则或 lint 的结构。
- 它们混入了落地约束和 docwarden 边界。

后续应根据本文件的 policy / concept 表意分工，重写 concept template 和 concept module，并为 policy module 增加 `Applies to`。

## 审核点

- `policy 是约束语言，concept 是命名语言` 是否成立。
- concept 是否应围绕 `Designation / Naming Need / Definition / Delimitation / Concept Relations / Examples` 设计。
- policy 是否保留 `Intent / Scope / Applies to / Rules / Rationale / Examples`。
- concept 是否不承接落地规则、lint 规则或生命周期规则。
- policy 是否可以引用 concept，但不重新定义 concept。
