---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# meta concept baseline

本文件记录 contexta 内容类型约束设计的当前基线。

## 核心判断

contexta 维护的是更上级的内容元概念。

它不应把字段层、工具机制、artifact role 或 docwarden 操作流程职责混成同一级内容类型。

当前先落地六个 primitive 元概念：

- `policy`：约束。
- `structure`：结构。
- `module`：语义组合单元。
- `assertion`：最小可审查语义单元。
- `concept`：概念 / 术语定义。
- `example`：样本语言。

## 当前不升格为 primitive 的内容

以下内容暂不作为 primitive 元概念：

- `template`：更像 artifact role，负责复制后的内容骨架。
- `metadata`：字段层，用于描述内容，不是内容本体。
- `semantic-lint`：工具机制或校验能力，不是内容本体。
- `audience`：policy 约束域，当前不作为独立 primitive。
- `trace / provenance`：边界未定，容易越界到 docwarden 操作流程；暂不纳入 primitive。

## 关于 structure 的回退

此前 `structure-content-type.md` 提出了：

```yaml
kind: structure
structure_type: workflow | pipeline | architecture | branch-map
```

这个设计需要回退。

原因是：

- contexta 的体验应维护更 primitive 的元概念。
- `structure_type` 会把完整分类树塞进 frontmatter。
- workflow / pipeline / architecture / branch 更适合先作为 `structure` 下的子概念、子模块或章节。

因此当前基线只保留：

```yaml
kind: structure
```

workflow / pipeline / architecture / branch 的关系，应在 structure 概念建设中处理，而不是先进入 metadata。

## 后续 loop

本 task 后续逐个 review 六个 primitive 元概念：

1. policy
2. structure
3. module
4. assertion
5. concept
6. example

每个 loop 只确认一个概念：

- 它解决什么问题。
- 它不解决什么问题。
- 它和其他 primitive 的边界。
- 它是否需要进入 contexta 的长期模块或模板。

## 当前推进状态

- `policy`：已直接通过。
- `structure`：早期草案已回退；当前已作为组织语言占位落地到 `.contexta/modules/concept/structure.md`，但未新增 `structure_type` metadata。下一步从 subtype 反推 structure。
- `module`：当前进入定义。
- `example`：已确认为样本语言，并落地到 `.contexta` 长期层。
