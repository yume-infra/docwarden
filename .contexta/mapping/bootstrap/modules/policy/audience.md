---
kind: policy
---

# audience

## Intent

定义 contexta 文档的目标读者与表达模式选择。

本 policy 用于避免把 agent-facing 指令和 user-facing 说明混成同一种文档表达。

## Scope

Applies to:

- [[mapping/bootstrap/modules/concept/module|module]]

适用条件：

- contexta module 需要面向 agent 或 user 表达内容。
- 同一主题需要服务不同读者。

不适用条件：

- 具体文档类型的模板设计。
- README、roadmap、skill、guide 等具体文档的完整写作方法。
- RFC2119 关键词的语义定义。

## Rules

### 受众判断

- contexta 文档作者 MUST 在写作前明确目标读者。
- contexta 文档作者 MUST 在写作前明确读者目标。
- contexta 文档作者 SHOULD 在写作前明确文档 scope。
- 当目标读者、读者目标或文档 scope 不明确时，agent SHOULD 先澄清再写作。
- 同一主题同时服务 agent 和 user 时，contexta SHOULD 分离 agent-facing 表达和 user-facing 表达。

### agent-facing 指令模式

- agent-facing 内容 MUST 使用指令模式，而不是纯描述模式。
- 指令模式 MUST 告诉 agent 在什么条件和边界下执行什么行为。
- 指令模式 SHOULD 优先表达源、条件、边界和关键 example。
- 描述性文字 MAY 用于解释背景、原因或例子。
- 描述性文字 MUST NOT 替代 agent-facing 的规范性规则。

### user-facing 读者模式

- user-facing 内容 MUST 使用读者模式，而不是 agent 指令模式。
- 读者模式 SHOULD 回答读者需要理解什么、决定什么或完成什么。
- user-facing 内容 SHOULD 优先降低理解成本。
- user-facing 内容 MAY 使用背景、动机、约束和下一步来帮助读者理解。
- user-facing 内容 MUST NOT 把 agent 内部执行规则作为主要阅读路径。

## Rationale

### 受众判断

文档的表达方式取决于读者。agent 需要可执行的约束和边界；user 需要理解成本更低的说明、背景和判断依据。

如果写作前没有明确目标读者，文档容易同时承担两种入口职责，导致 agent 执行不稳定，也导致 user 阅读困难。

### agent-facing 指令模式

给 agent 的内容需要起 guide 作用，而不是只提供背景描述。

agent-facing 内容应该让 agent 直接知道可执行模式：依据什么源、满足什么条件、遵守什么边界、参考什么关键 example。

### user-facing 读者模式

给 user 的内容应该围绕读者问题组织，而不是暴露内部执行规则。

user-facing 内容可以解释背景、动机和限制，因为这些信息能帮助 user 理解为什么、如何使用，以及下一步该做什么。

## Examples

### Scenario

同一段 roadmap 入口说明需要根据目标读者选择表达模式。

### Judgment Material

roadmap 用于说明当前目录的文档主线，并帮助 agent 理解有哪些 module 可以继续阅读。

### Positive

```md
正确写法：

agent MUST 先读取当前目录的 `roadmap.md`。
agent MUST 根据 `roadmap.md` 中的 Read Order 继续读取相关 module。
agent MUST 在执行写入前确认目标文件是否属于允许写入范围。

正确判断：

如果目标读者是 agent，内容必须进入指令模式。单纯说明 roadmap 的用途不能告诉 agent 如何行动。
```

这个 example 给出同一主题在 agent-facing 场景下的错误写法和修正写法，agent 能迁移到其他入口文档。

### Negative

```md
agent-facing 内容要清楚。
```

这只是抽象要求，没有展示什么叫清楚，也没有暴露 agent 容易把说明写成背景介绍的错误。

### Borderline

```md
错误写法：

agent MUST 先读取当前目录的 `roadmap.md`。
agent MUST 根据 `roadmap.md` 中的 Read Order 继续读取相关 module。

正确写法：

这个目录的入口是 `roadmap.md`。如果你想了解当前 contexta 的设计进度，先读 roadmap；如果你只想查看已经沉淀的规则，直接进入 `modules/`。

正确判断：

同一事实换成 user-facing 场景后，不应暴露 agent 内部执行规则。读者模式要帮助用户理解入口和选择路径。
```
