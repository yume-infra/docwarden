---
status: accepted
created: 2026-05-13
updated: 2026-05-13
owner: sayori
loop: 2
review: accepted
---

# task / review / spec pipeline 定位

本文件记录 Loop 2 已通过 review 的 working 定义，用于修正原先的 stable 层模型。

## 问题

原先使用 `stable` 命名，会把多个不同责任混在一起：

- 短命任务过程材料
- user 可 review 的最小审查单元
- agent-facing 的指挥层 / 规范层

继续用单层 `stable` 会导致目录结构讨论变形：

- 如果拆成 `stable/agent` 与 `stable/user`，容易出现维护漂移。
- 如果合成单文件，agent 指挥表达和 user review 表达会互相污染。
- 如果引入 stable unit，又可能过早复杂化。

因此，问题不只是目录结构没选好，而是理论命名本身需要调整。

## 新模型

当前更合理的模型是：

```text
task -> review system -> spec
                    -> guide
                    -> wiki
```

## task

`task` 是任务过程层。

它承载：

- 上下文捕获
- 草案
- log
- review 过程记录
- 临时判断
- 任务推进材料

task 是短命层。

当前 `.docwarden/task/` 本质上更接近未来的 task 层，但本轮暂不执行目录迁移。

## review system

`review` 是一个系统，不只是一个文件夹或一种文件格式。

它的职责是从 task 中提炼可审查内容，降低 user review 成本，让 user 能够审查、判断和纠偏。

review 不是 spec 的 user 版本，也不是 task 的原始材料副本。

review 是 task 到 spec / guide / wiki 之间的审查系统。

review 的格式不应限定为 Markdown。

HTML 是重要候选形态，因为它可以比 Markdown 更轻松地承载：

- 折叠内容
- 对比视图
- 状态标记
- 颜色和视觉分区
- 表格和卡片
- 主结论 / 风险 / 待确认问题 / 来源上下文的分区展示

因此，review 层更准确的说法是 review surface，而不是 review markdown。

## spec

`spec` 是 agent-facing 的指挥层 / 规范层。

它服务 agent 编码和项目执行。

spec 应该比 task 更稳定，比 review 更面向执行。

spec 不是当前 `docs/`。

当前 `docs/` 是 sayori 编写和 review 的可信理论源，但不是已经完成 agent-facing 表达优化的 spec。

## guide

`guide` 是 user-facing 的叙事层。

它的职责是帮助 user 理解项目，也帮助新需求构建时恢复上下文。

guide 不追求 wiki 式的小颗粒组合，而是追求更线性的理解路径。

guide 可以服务：

- 项目导览
- 理论总览
- 实践手册
- 决策脉络
- 新需求启动时的上下文恢复

review 后可以同时产出 spec 和 guide。

## wiki

`wiki` 是长期知识网络。

它对应 `docs/ai基建建设/llm-wiki.md` 中的 linked wiki 思路。

wiki 适合小颗粒、可组合、可链接、可查询的知识沉淀。

wiki 可以承接：

- ADR
- 纠错经验
- 用户偏好
- 可学习内容
- 项目理解材料
- 关联概念

wiki 不是 guide。

wiki 像模块化代码，维护和组合能力强，但不一定适合新用户线性理解项目。

guide 可以基于 wiki / spec / task 进行叙事组织。

## pipeline 含义

`task -> review system -> spec / guide / wiki` 表达的是：

1. task 捕获任务过程和上下文。
2. review system 从 task 中整理出 user 可审查的 review surface。
3. review 后可以沉淀到 spec、guide 和 wiki。

本轮只定义概念边界。

不定义：

- promote 触发时机
- 完整 workflow 编排
- 最终目录结构
- HTML review 工具实现

## 当前结论

- `stable` 命名不再适合作为核心层级。
- `task -> review system -> spec / guide / wiki` 更符合当前理论。
- review 是一个系统，目录只是 review artifacts 的存储位置。
- review 层的重点是 review surface，而不是 Markdown 文档。
- HTML review surface 是后续值得优先探索的候选形态。
- `spec` 服务 agent 执行。
- `guide` 服务 user 理解，也服务新需求构建。
- `wiki` 服务长期知识链接、组合和查询。
- `.docwarden/task/` 暂时不迁移，但可视为未来 task 层的前身。

## Review 问题

这个 pipeline 定位是否可以替代原先 stable 层模型，作为后续 Loop 的基础？

## Review 状态

sayori 已接受这个 pipeline 定位作为当前 working 定义。
