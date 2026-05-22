---
status: accepted
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 2
---

# relation / delimitation boundary

本文件记录 task 12 Loop 2 中已通过的 relation / delimitation 分工。

## 已通过判断

当前不应在每个 concept module 中都维护 `Concept Relations` 章节。

原因：

- 每个 concept 都维护 relation 会让 concept module 膨胀。
- relation 会分散在多个文件中，难以保持一致。
- agent 容易把 relation 当成 concept module 的必填章节，继续生成无意义内容。
- Delimitation 会被挤压，反而不再认真维护关键边界。

## Delimitation 的职责

Delimitation 负责局部边界审查。

它回答：

- 这个 concept 容易和哪些相邻概念混淆。
- 关键差异是什么。
- 哪些混淆会导致错误落点、错误书写或错误判断。

Delimitation 不负责：

- 枚举所有相关 concept。
- 维护完整 concept network。
- 提供全局导航。
- 承接 subtype metadata。

Delimitation 应保持正确、必要、简洁。

## Relation 的职责

relation 应作为独立的 concept / policy 设计，而不是散落在每个 concept module 的章节里。

relation 负责 concept network 的稳定连接语言。

它回答：

- concept 之间有哪些稳定关系。
- 这些关系如何被命名和读取。
- 哪些关系会影响 agent 的读取路径、落点判断或语义推理。

relation 不负责：

- 替代 Delimitation。
- 变成 frontmatter subtype。
- 要求每个 concept module 枚举自己的所有关系。

## 对 kind 的影响

`kind` 仍然只作为 content language entry。

例如：

```yaml
kind: workflow
```

它只表示这个 md module 使用 workflow 这门内容语言。

`workflow` 与 `structure` 的关系不进入 frontmatter，也不通过 `sub_type` 表达。

后续应由 relation 体系集中表达：

```text
workflow -> structure
pipeline -> structure
composition -> structure
```

## 已落地承接

本轮已新增：

- `.contexta/modules/concept/relation.md`
- `.contexta/modules/policy/relation.md`

这两个长期层文件只负责稳定 relation 语言本身，不要求每个 concept module 都新增 `Concept Relations` 章节。

## entity 词语澄清

本轮曾出现 `entity` 一词。

这里的 `entity` 只是 agent 从早期 docwarden “具体实体落点”语境带入的工作词，用来指 promote / pick 后可能形成的具体资产或落点。

它不是当前 contexta 的 concept。

当前不新增 `entity` concept，也不把它作为 Delimitation neighbor。
