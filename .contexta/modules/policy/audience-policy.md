---
kind: policy
---

# audience-policy

## Intent

定义 contexta 文档的目标读者与表达模式选择。

本 policy 用于避免把 agent-facing 指令和 user-facing 说明混成同一种文档表达。

## Scope

适用范围：

- contexta 中面向 agent 或 user 的文档表达。
- 同一主题需要服务不同读者时的表达层判断。

不适用范围：

- 具体文档类型的模板设计。
- README、roadmap、skill、guide 等具体文档的完整写作方法。
- RFC2119 关键词的语义定义。

## Rules

### Audience Decision

- contexta 文档作者 MUST 在写作前明确目标读者。
- contexta 文档作者 MUST 在写作前明确读者目标。
- contexta 文档作者 SHOULD 在写作前明确文档 scope。
- 当目标读者、读者目标或文档 scope 不明确时，agent SHOULD 先澄清再写作。
- 同一主题同时服务 agent 和 user 时，contexta SHOULD 分离 agent-facing 表达和 user-facing 表达。

### Agent-Facing Instruction Mode

- agent-facing 内容 MUST 使用指令模式，而不是纯描述模式。
- 指令模式 MUST 告诉 agent 在什么条件和边界下执行什么行为。
- 指令模式 SHOULD 优先表达源、条件、边界和关键正反例。
- 描述性文字 MAY 用于解释背景、原因或例子。
- 描述性文字 MUST NOT 替代 agent-facing 的规范性规则。

### User-Facing Reader Mode

- user-facing 内容 MUST 使用读者模式，而不是 agent 指令模式。
- 读者模式 SHOULD 回答读者需要理解什么、决定什么或完成什么。
- user-facing 内容 SHOULD 优先降低理解成本。
- user-facing 内容 MAY 使用背景、动机、约束和下一步来帮助读者理解。
- user-facing 内容 MUST NOT 把 agent 内部执行规则作为主要阅读路径。

## Rationale

### Audience Decision

文档的表达方式取决于读者。agent 需要可执行的约束和边界；user 需要理解成本更低的说明、背景和判断依据。

如果写作前没有明确目标读者，文档容易同时承担两种入口职责，导致 agent 执行不稳定，也导致 user 阅读困难。

### Agent-Facing Instruction Mode

给 agent 的内容需要起 guide 作用，而不是只提供背景描述。

agent-facing 内容应该让 agent 直接知道可执行模式：依据什么源、满足什么条件、遵守什么边界、参考什么正反例。

### User-Facing Reader Mode

给 user 的内容应该围绕读者问题组织，而不是暴露内部执行规则。

user-facing 内容可以解释背景、动机和限制，因为这些信息能帮助 user 理解为什么、如何使用，以及下一步该做什么。

## Examples

### Agent-Facing Instruction Mode

描述模式示例：

```md
roadmap 用于说明当前目录的文档主线，并帮助 agent 理解有哪些 module 可以继续阅读。
```

指令模式示例：

```md
agent MUST 先读取当前目录的 `roadmap.md`。
agent MUST 根据 `roadmap.md` 中的 Read Order 继续读取相关 module。
agent MUST 在执行写入前确认目标文件是否属于允许写入范围。
```

这两个示例描述的是同一件事：roadmap 如何指导 agent 进入目录。描述模式说明用途；指令模式明确 agent 的读取顺序、判断依据和执行边界。

### User-Facing Reader Mode

agent 指令模式示例：

```md
agent MUST 先读取当前目录的 `roadmap.md`。
agent MUST 根据 `roadmap.md` 中的 Read Order 继续读取相关 module。
```

读者模式示例：

```md
这个目录的入口是 `roadmap.md`。如果你想了解当前 contexta 的设计进度，先读 roadmap；如果你只想查看已经沉淀的规则，直接进入 `modules/`。
```

这两个示例描述的是同一件事：如何进入目录。agent 指令模式强调执行顺序；读者模式强调读者想理解什么、如何选择下一步。
