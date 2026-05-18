---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
loop: 2
---

# promote 规则

本文件记录 Loop 2 结论，用于定义主流程中的 promote。

## 核心定位

promote 的核心不是把 review 内容搬运到长期目录。

promote 的核心是：

```text
主线基线 delta
```

它回答的问题是：

```text
这轮 user review 之后，项目的主线稳定基线应该发生什么变化？
```

变化可以是：

- 新增。
- 修改。
- 删除。
- 收紧边界。
- 改写表达。
- 明确不再采用某个旧判断。

## promote 处理什么

promote 处理的是经过 user review 后被确认的主线理解。

它不处理 raw material。

它不处理完整 lead / backing 展示。

它不处理 review 中顺手发现的 side 信息。

它从 task 的临时讨论、上下文变量、草案表达中，提炼长期可依赖的主线基线表达。

## review surface 的位置

主流程的 review surface 建设发生在 promote 之前。

review surface 是 review system 为 promote 准备的审查面。

因此主流程中的 lead 不应该是泛泛的“请 review 这些材料”。

它应该聚焦：

```text
这轮 review 后，主线基线应该发生什么 delta？
```

user 审的是这个 delta。

promote 执行的是 user review 后确认过的 delta。

## 职责投影

promote 不应该生成独立中间账本。

promote 应直接面向长期层职责投影：

```text
spec
guide
wiki
```

同一个被确认的主线理解，可能在不同层中表达为不同形态：

- 对 `spec`，可能是 agent-facing 执行规则。
- 对 `guide`，可能是 user-facing 叙事说明。
- 对 `wiki`，可能是小颗粒概念节点或关联知识。

promote 的重点不是保留 review 形态，而是把已确认理解改写成目标层需要的长期表达。

## 与 pick 的顺序

pick 应发生在 promote 之后。

原因是：

```text
只有先知道 promote 抽象、压缩、隐去了什么，
才能判断哪些 side 内容值得 pick。
```

如果 pick 发生在 promote 之前，就容易变成从 working 中随便挑有趣信息，失去理论约束。

## 主流程

当前主流程应理解为：

```text
task
  -> surface for promote
  -> user review
  -> promote mainline delta
  -> pick side value
  -> delete/archive working
```

其中：

- `surface for promote` 将本轮主线基线 delta 整理为 `lead + backing`。
- `user review` 审查这个 delta。
- `promote` 将确认后的 delta 投影到长期主线层。
- `pick` 处理 promote 隐去但仍有长期价值的 side 内容。
- working 完成后默认 delete，可配置 archive。

## 当前结论

promote 是主线稳定化动作。

它的最小问题不是“从哪里来、写到哪里去”，而是：

```text
这轮 review 后，主线基线 delta 是什么？
```
