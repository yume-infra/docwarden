---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# current state before concept landing

本文件记录进入 `.contexta/modules/concept/` 之前的当前状态。

## 已确认

当前已确认的边界：

- docwarden 负责操作流程协议。
- contexta 负责内容格式协议。
- template 只负责复制后的内容骨架，不负责来源、review、pick、更新、写入或生命周期。
- policy 是约束类元概念。
- concept 是概念 / 术语定义类元概念。
- module 是语义组合单元。
- assertion 是最小可审查语义单元。
- module 和 assertion 的概念方向基本正确。

## 当前关键判断

contexta 需要保留 policy 层，但只能是薄 policy 层。

policy 层用于承载会影响后续内容建设的基础约束，例如：

- 规则强度如何表达。
- module 和 assertion 如何拆分。
- template 不管理生命周期。
- contexta 不承接 docwarden workflow。

policy 不应承接 contexta 缺少的所有内容。

contexta 当前更缺的是 concept 层。

concept 层用于定义：

- module 是什么，不是什么。
- assertion 是什么，不是什么。
- policy 和 concept 的差别。
- 后续 structure、example 等 primitive 如何被理解和区分。

## policy 与 concept 的当前区别

concept 回答：

- X 是什么。
- X 不是什么。
- X 和相邻概念差在哪里。

policy 回答：

- 面对 X 时，agent / 作者 / 系统 MUST / MUST NOT / SHOULD / MAY 怎么处理。
- 在什么 scope 下这些约束生效。

因此：

- `module` / `assertion` 的概念定义应进入 concept。
- `module` / `assertion` 的落地约束应进入 policy。

## 当前候选

`module-assertion-landing.md` 仍是候选草案。

其核心候选判断为：

- module 第一版落在 `.contexta/modules/<kind>/<module-id>.md`。
- assertion 第一版落在 module 文件内部，通常是可审查列表项。
- 第一版不新增 `kind: module`。
- 第一版不新增 assertion 独立文件。
- 第一版不新增 assertion 全局 ID。
- template 只提供 assertion 书写槽位，不管理 assertion 生命周期。

这些判断应在后续落地时被拆分：

- 概念定义进入 `.contexta/modules/concept/`。
- 行为约束进入 `.contexta/modules/policy/`。
- 模板变化另行 review，不在当前提交处理。

## 下一步

下一步直接进入 concept 草案落地。

优先补：

- `.contexta/modules/concept/module.md`
- `.contexta/modules/concept/assertion.md`

这两个 concept module 应先作为可审核草案落地，再由 sayori 核对、修改和确认。
