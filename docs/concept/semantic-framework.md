# Semantic Framework

> 记录来源：2026-06-04 与 sayori 关于 isomorph 定位、用户自定义语义体系和 docwarden 降级关系的讨论。

## Core Finding

`isomorph` 的核心不是预先定义某个项目的全部语义，也不是把 docwarden、contexta 或 runtime mapping 塞进 `.isomorph`。

`isomorph` 的核心是两件事：

1. 建构一套说明“语义体系如何成立”的自举能力。
2. 让 agent 能使用由这套能力建构出来的 semantic framework。

因此，`isomorph` 自身的 primitives 是 bootstrap primitives。它们不是 docwarden 的领域词表，也不是所有项目语义对象的总表，而是用于建构 semantic framework 的最小元语言。

## Definition

`semantic framework` 是用户或项目为某个领域建构的语义体系。

它至少回答：

- 这个领域里哪些对象需要稳定命名；
- 这些对象之间有哪些 relation、basis 和 boundary；
- 哪些 magic word、section heading 或 trigger phrase 会影响 agent 判断；
- 什么情况表示 semantic drift 或 loss；
- 这套语义如何被压成 agent-use contract。

`vocabulary` 是 semantic framework 的命名表面。像 [Animation Vocabulary](https://animations.dev/vocabulary) 这类材料展示的是一个 vocabulary-heavy semantic framework：它通过稳定术语让 agent 更准确理解动画领域的 intent、quality 和 failure mode。

不是所有 semantic framework 都以 vocabulary 为主。`docwarden` 更偏 workflow/entity-heavy framework；它需要稳定 `task`、`review`、`promote`、`pick`、`spec`、`guide`、`wiki` 等语义对象及其边界。

## Isomorph Bootstrap

root `.isomorph` 的职责是自举：

```text
primitives
  最小语义对象：name、kind、relation、basis、grammar、signal、loss、export shape 等。

grammars
  语义对象如何成立、组合、引用和保持边界。

lint
  识别 semantic drift，并说明 loss model。

exports
  描述语义对象交给 agent 或下游 export 时的最小 shape。
```

这些目录不是 `modules` 分类层，也不是项目领域词库。它们服务于 semantic framework construction。

## Correct Direction

正确因果关系是：

```text
isomorph bootstrap primitives
  -> user/project semantic framework
  -> agent-use contract
  -> contexta/export/runtime materialization
```

错误因果关系是：

```text
isomorph defines docwarden mapping
  -> docwarden 被塞进 isomorph
```

`mapping` 原先的问题就是因果倒置。`isomorph` 可以定义 `mapping` 作为 semantic relation 的概念，但不应在 `.isomorph` 内为 docwarden、contexta 或 runtime artifact 建立 mapping authority。

## Docwarden Position

`docwarden` 应建构自己的 semantic framework。

它可以借用 `isomorph` 的能力：

- 定义 docwarden framework 的语义对象；
- 识别 docwarden 文档或 task material 的 semantic role；
- 检查 review、promote、pick 等 workflow material 是否发生 drift；
- 把稳定语义压成 agent 可使用的 contract。

但 `docwarden` 不是由 root `.isomorph` 定义出来的下游对象。现有 docwarden-shaped `.isomorph/exports/docwarden/**` 只能视为迁移期材料、dogfood 样本或待降级候选；它不应代表 isomorph 对 docwarden 的 canonical ownership。

## Agent-Use Contract

当前最小 agent-use contract 暂定为：

```text
recognize -> basis -> loss -> export shape
```

也就是：

```text
识别它是什么 -> 说明为什么 -> 找出哪里漂移 -> 给出可交付形状
```

这是当前阶段的 working contract，不是最终理论。agent-use 层后续会重新设计；当前文档只要求它不反向污染 bootstrap primitives 和 project semantic framework。

## Decisions

- `semantic framework` 是用户或项目自定义语义体系的正式命名。
- root primitives 是 isomorph bootstrap primitives。
- project/domain terms 不默认进入 root primitives。
- docwarden 应拥有自己的 semantic framework，而不是被 root `.isomorph` 定义。
- `mapping` 保留为语义关系概念，不保留为 `.isomorph` 的 runtime 或项目绑定层。
- agent-use contract 当前可用，但明确是临时层，后续允许重构。
