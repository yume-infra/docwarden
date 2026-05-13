---
status: accepted
created: 2026-05-13
updated: 2026-05-13
owner: sayori
loop: 3
review: accepted
---

# pipeline 最小目录结构

本文件记录 Loop 3 已通过 review 的 working 定义，用于定义 `task -> review system -> spec / guide / wiki` 的最小目录结构。

## 已执行迁移

现有 `.docwarden/working/` 已迁移为 `.docwarden/task/`。

不保留 `.docwarden/working/` 中间态。

原因：

- `task` 已经替代 `working` 成为短命任务过程层的正式命名。
- 如果保留 `working`，会继续制造理论和目录之间的混淆。
- 当前既然已经确认方向，就应该直接迁移，避免半状态。

## 目标结构

当前目录结构先按五层设计：

```text
.docwarden/
  task/
  review/
  spec/
  guide/
  wiki/
```

## task

`task/` 是短命任务过程层。

它承载：

- 上下文捕获
- 草案
- log
- review 过程记录
- 临时判断
- 任务推进材料

当前 `.docwarden/task/` 已经承接原 `.docwarden/working/` 的所有工作面。

由于 `task/` 已经成为实际层级，已创建：

```text
.docwarden/task/index.md
```

## review

`review/` 是 review system 的 artifact 存放层。

review system 本身不是一个目录；目录只保存 review system 产生的 review artifacts。

review artifact 可以是 HTML、JSON、Markdown 或未来其他形式。

HTML 是重要候选形态，因为它更适合承载复杂审查界面。

## spec

`spec/` 是 agent-facing 执行规范层。

它服务 agent 编码和项目执行。

spec 应该比 task 更稳定，比 review 更面向执行。

## guide

`guide/` 是 user-facing 叙事层。

它服务 user 理解项目，也服务新需求构建时的上下文恢复。

guide 不追求 wiki 式的小颗粒组合，而是追求更线性的理解路径。

## wiki

`wiki/` 是长期知识网络。

它承接 `llm-wiki` 思路，适合小颗粒、可组合、可链接、可查询的知识沉淀。

wiki 不等于 guide。

guide 可以基于 wiki / spec / task 进行叙事组织。

## 入口文件

每个长期层都应该有入口文件。

入口文件统一命名为：

```text
index.md
```

原因：

- `index.md` 更偏 agent 倾向的命名。
- 统一入口名可以降低 agent 查询成本。
- 不再区分 `index.md` / `index.md` 的不同入口风格。

目标形态：

```text
.docwarden/
  task/
    index.md
  review/
    index.md
  spec/
    index.md
  guide/
    index.md
  wiki/
    index.md
```

Loop 3 review 通过后，已创建其他长期层目录和入口文件：

```text
.docwarden/review/index.md
.docwarden/spec/index.md
.docwarden/guide/index.md
.docwarden/wiki/index.md
```

## 当前结论

- `.docwarden/working/` 不保留，已迁移为 `.docwarden/task/`。
- 未来目标结构是 `task / review / spec / guide / wiki`。
- `review` 是 review system 的 artifact 存放层，不等于 review system 本身。
- `spec` 服务 agent 执行。
- `guide` 服务 user 理解和新需求构建。
- `wiki` 服务长期知识链接、组合和查询。
- 各层入口文件统一命名为 `index.md`。

## Review 问题

这个目录结构是否可以作为 Loop 3 的 task 定义？

## Review 状态

sayori 已接受这个目录结构作为当前 working 定义。
