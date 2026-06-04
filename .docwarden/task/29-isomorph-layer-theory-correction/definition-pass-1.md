# Definition Pass 1

Status: accepted

## Accepted Core

`framework vocabulary` 是用户拥有的 semantic framework instance。

`primitive / grammar` 是建构和检查 vocabulary 的上级语言。

`usage contract` 是 vocabulary 进入 agent 工作流的方式。

`feedback loop` 是持续使用、检查、修正 vocabulary 的核心机制。

## Layer Definitions

### isomorph core

isomorph core 是用来建构、读取、检查用户语义框架的上级语言。

它不拥有具体领域理论，不拥有 Animation Vocabulary、docwarden workflow vocabulary、skill authoring vocabulary。它只提供建构这些理论所需的基本对象和判断机制。

### primitive

primitive 是 isomorph core 里的最小语义对象类型。

它回答：

- 什么东西值得被命名。
- 它是什么。
- 它和其他对象有什么关系。
- 它如何被识别、使用、检查。

primitive 不是用户词表本身，而是“用户词表中某类对象如何成立”的定义语言。

### grammar

grammar 是 primitive 如何被表达、组合、识别和约束的规则层。

它回答：

- 一个 semantic object 应该长什么样。
- 什么结构能被系统读懂。
- 什么写法表示边界、关系、例子、loss model。
- 什么写法是 drift。

primitive 偏“对象是什么”，grammar 偏“对象如何被表达和判断”。

### framework vocabulary

framework vocabulary 是用户针对某个框架建构的偏好词汇与语义体系。

它不是 root primitive。它是用户拥有的理论实例。

它回答：

- 用户在这个框架里关心哪些词。
- 这些词是什么意思。
- 它们之间如何关联。
- 它们影响哪些判断。
- 哪些用法是错的。
- 用户偏好的表达边界是什么。

### usage contract

usage contract 是 framework vocabulary 在工作流中如何影响 agent 行为的协议。

它回答：

- 什么时候激活这套 vocabulary。
- agent 读到什么时要使用它。
- 生成内容时要遵守什么。
- review 时检查什么。
- 不确定时问什么。
- 用户纠正后应该更新哪里。

`skill-primitive` 落在这里：它不是核心层，而是 usage contract 的一种 agent-facing 形态。

### feedback loop

feedback loop 是让 vocabulary 持续变好的机制。

它回答：

- agent 使用 vocabulary。
- 用户纠正 agent。
- 系统判断纠正属于 term、relation、boundary、loss model、usage contract 或 projection 的哪一类。
- 系统生成候选更新。
- 用户 review。
- 确认后写回 framework。
- 下一次使用时生效。

## Skill-Creator Placement

`skill-primitive` 可以作为 usage contract 的一种 agent-facing 形态。

`skill-creator` 的 canonical asset 属于 contexta。

repo-local `.agents/skills/iso-skill-creator` 只是 dogfood / install copy。

`.isomorph` 只保留 `skill-primitive` 的理论定义，不拥有 concrete `skill-creator` material。

分层结论：

```text
isomorph
  owns: skill-primitive 作为 usage contract 形态的理论定义

contexta
  owns: skill-creator 作为可分发 Codex skill asset 的 canonical source

repo
  owns: .agents/skills/iso-skill-creator 作为当前 repo 的 dogfood/install copy
```

## Consequence

后续实现不应继续围绕 `.isomorph/primitives/skill-primitive/skill-creator.md` 扩张。

应先定义 framework vocabulary 与 feedback loop，再让 contexta materialize confirmed usage contract。
