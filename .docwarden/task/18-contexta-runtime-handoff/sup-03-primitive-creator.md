---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# primitive creator

本文件说明 primitive-creator 的地位。

## Core Position

primitive-creator 是 contexta 扩展自身语言体系的核心能力。

它不是普通文件生成器，也不是单独的 skill scaffold 工具。

primitive-creator 的职责是让 agent 依照 contexta 的语义建模，创建新的 local primitive。

## First Instance

primitive-creator 第一版落地对象是 skill primitive。

原因：

- skill 是 agent 行为层的主要出口。
- skill 教 agent 如何写、检查、修复。
- CLI 提供硬反馈，skill 教 agent 如何使用这些反馈。
- contexta 后续 skill 族需要一个能被语义建模约束的创建原语。

## Skill Primitive

skill primitive 不等同于最终 `SKILL.md` 文件。

它首先是 contexta local model 中的 primitive，后续才可以展开为具体 skill artifact。

第一版不预设 skill primitive 的完整字段。

字段应由真实 md surface、runtime parser 和后续 skill 使用场景共同反推。

## Skill Export Position

skill primitive 必须保留导出为 agent 可消费 skill artifact 的模型位置。

第一版不要求完成 `SKILL.md` compiler，也不要求生成最终 skill artifact。

但第一版不能把 skill primitive 做成只能停留在内存 AST 的对象；它至少应能表达后续 skill export 所需的语义依据。

## Relation to Custom Skill Creator

custom-skill-creator 是 primitive-creator 的第一个具体场景。

它不应被理解为孤立脚手架，而应被理解为：

```text
primitive-creator
  -> skill primitive
  -> custom-skill-creator
  -> contexta skill family
```

## Boundary

- 不在本轮定义完整 skill schema。
- 不在本轮生成最终 skill artifact。
- 不把 skill primitive 降级成普通 template。
- 不绕过 lint 和 recognition 直接生成 agent instruction。
