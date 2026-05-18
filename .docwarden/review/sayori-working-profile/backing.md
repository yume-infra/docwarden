---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
source_task: 08-promote-pick-dry-run
---

# sayori working profile backing

本文件是 `lead.md` 的 backing。

## source context

本 pick 候选主要来自本轮对话上下文。

它是 user-level asset，用于帮助后续 agent 判断需求、偏好和纠偏信号。

## correction trace

| lead 内容 | 对话依据 | 可复利信息 |
| --- | --- | --- |
| 重视理论边界 | “根据我的理论想想”“不要浅层 schema” | 回答前先判断环节为什么存在、服务哪一层。 |
| 从已有理论推导 | “之前聊过”“回头看内容” | 不只处理当前一句话，要沿用已确认理论。 |
| 慢推进循环 | “你问问题，我回答，你生成，我 review” | 未确认前不要直接 apply 长期内容。 |
| lead 只放审核本体 | 多次否定 lead 中的解释、review 方式、本轮不审 | review lead 应极简，只承载模块及断言。 |
| 最小不是字少 | “最小在哪”“理解文档模块和断言吗” | 最小 = 单一职责模块 + 可审核断言。 |
| 纠偏可 pick | “对话上下文也是” | user 纠偏和 agent 错误模式应进入 pick source。 |
| 区分项目/用户资产 | “pick 一定是用户层资产” | 影响项目结构的内容应回 promote。 |
| 少废话 | “废话太多” | 面向 user 的审核内容应压缩到必要信息。 |

## why pick

这组内容不改变 docwarden 项目主线。

它能帮助后续 agent 更早识别协作偏好和纠偏信号。

## not promote

以下内容不属于本 pick：

- review artifact 的 `index / lead / backing` 结构。
- spec / guide / wiki 模板。
- cleanup config。

这些会改变 docwarden 项目主线，应另走 promote。
