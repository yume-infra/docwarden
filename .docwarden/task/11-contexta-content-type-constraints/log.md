---
status: draft
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# contexta content type constraints 日志

## [2026-05-19] setup | 启动 contexta 内容类型约束设计

创建 `11-contexta-content-type-constraints` task。

来源判断：

- `10-promote-output-content-format` 已跑通 promote output 候选内容。
- 但 `workflow` 被写成了 policy-like 结构。
- sayori 明确指出：workflow 应该是单独 architecture，而不是 policy 结构。

当前任务：

- 先确认 contexta 约束设计边界。
- 后续定义 policy 与 workflow / architecture 的差异。
- 再定义 workflow / architecture 的最小骨架。
- 不直接修改 `.contexta/templates/`。

## [2026-05-19] loop-1 | 内容类型约束边界通过

sayori 要求继续推进设计。

已将 `.docwarden/review/contexta-content-type-constraints/` 下的 review artifact 标记为 accepted。

下一步进入 Loop 2：policy 与 workflow / architecture 边界。

## [2026-05-19] loop-2 | 生成 policy / workflow 边界草案

创建 `policy-workflow-boundary.md`。

本轮定义：

- policy 表达稳定约束，以 Rules 为核心。
- workflow / architecture 表达组成、阶段、关系和流转。
- workflow / architecture 不应直接套 policy 骨架。
- semantic lint 应识别类型误用。

当前等待 sayori review。

## [2026-05-19] loop-2 | policy / workflow 边界通过

sayori 确认本边界方向成立。

已将 `policy-workflow-boundary.md` 标记为 accepted。

## [2026-05-19] loop-3 | 生成 structure 上位内容类型草案

sayori 要求进入 `structure` 设计。

当前判断：

- `structure` 是上位内容类型。
- `workflow`、`pipeline`、`architecture` 是 structure subtype。
- `branch` 更适合作为 structure 内部机制，必要时再形成 `branch-map` subtype。
- 当前完整主线 `task -> review surface -> user review -> promote -> pick -> cleanup` 是 workflow。

已创建 `structure-content-type.md`。

当前等待 sayori review。

## [2026-05-19] loop-3 | 回退 structure_type 并同步 primitive 基线

sayori 指出 contexta 希望维护“元”的概念，即更上级、更 primitive 的内容。

当前纠偏：

- 不应把字段层、工具机制、artifact role 或 docwarden 流程职责混成内容类型。
- `structure_type` 会把完整分类树塞进 metadata，破坏当前 contexta 体验。
- workflow / pipeline / architecture / branch 先作为 `structure` 下的子概念或子模块处理。

已创建 `meta-concept-baseline.md`。

当前 primitive 元概念基线：

- `policy`：约束。
- `structure`：结构。
- `module`：语义组合单元。
- `assertion`：最小可审查语义单元。
- `concept`：概念 / 术语定义。
- `example`：正例、反例、边界例。

已将 `structure-content-type.md` 标记为 superseded。

后续为六个 primitive 元概念逐个开启 loop。

## [2026-05-19] loop-4 | policy 直接通过

sayori 确认：policy 直接通过。

已创建 `policy-meta-concept.md` 记录本轮结论。

当前处理：

- policy 定义不再展开新草案。
- 以 `.contexta/modules/policy/` 和 `policy-workflow-boundary.md` 作为当前基线。

## [2026-05-19] loop-6 | 进入 module 定义

sayori 要求进入 `module` 的定义。

当前处理：

- structure 正式定义暂不阻塞 module。
- 已创建 `module-meta-concept.md`。

本轮候选判断：

- `module` 是语义组合单元。
- `module` 是组合层，不默认等于 `kind: module`。
- 一个 module 应围绕稳定 intent 和 scope 组织多条 assertion。
- 单条 assertion 不应仅因为重要就升级为 module。

## [2026-05-19] loop-6.1 | 生成 module / assertion 落地草案

sayori 确认 module 和 assertion 的理解基本正确，并指出关键是如何在 contexta 中落地。

当前处理：

- 已将 `module-meta-concept.md` 标记为 accepted。
- 已创建 `module-assertion-landing.md`。

本轮候选判断：

- module 的第一版落点是 `.contexta/modules/<kind>/<module-id>.md`。
- assertion 的第一版落点是 module 内部的可审查语义项，通常是列表项。
- 第一版不新增 `kind: module`。
- 第一版不新增 assertion 独立文件或全局 ID。
- template 只提供 assertion 书写槽位，不管理 assertion 生命周期。

## [2026-05-19] state | 提交前现状整理

sayori 要求先整理现状并提交 git，然后直接把草案落地到 concept 中。

已创建 `current-state.md`。

当前确认：

- policy 层有必要存在，但应保持为薄 policy 层。
- contexta 当前更缺 concept 层。
- concept 负责定义“是什么 / 不是什么 / 与相邻概念差异”。
- policy 负责定义“在什么 scope 下必须、禁止、应该或可以怎么处理”。

下一步：

- 提交当前 `.docwarden` task / review 工作材料。
- 提交后进入 `.contexta/modules/concept/`，优先落地 `module` 和 `assertion` 的 concept 草案。

## [2026-05-19] concept | 落地 module / assertion concept 草案

已提交当前 `.docwarden` 工作材料。

提交：

- `3702a4b docs: record contexta content type design`

提交后进入 `.contexta/modules/concept/` 草案落地。

已新增：

- `.contexta/modules/concept/module.md`
- `.contexta/modules/concept/assertion.md`

当前处理：

- concept 草案只定义概念、边界、关系和识别方式。
- concept 草案不承接 policy 规则强度。
- concept 草案不修改 template。
- concept 草案不改变 docwarden workflow。

## [2026-05-19] correction | concept 草案表达方式错误

sayori 指出：当前 concept 写得像 policy，方向错误。

当前纠偏：

- `policy 是约束语言`。
- `concept 是命名语言`。
- concept 不能与 policy 重复。
- concept 需要和 policy 并排设计，各自负责各自的表意。

已创建 `policy-concept-expression-boundary.md`。

当前判断：

- 现有 `.contexta/modules/concept/module.md` 与 `.contexta/modules/concept/assertion.md` 不合格。
- 问题不是 module / assertion 概念完全错误，而是 concept 表达方式错误。
- 下一步应先确认 policy / concept 表意分工，再重写 concept template 和 concept module。

## [2026-05-19] architecture | 按新架构落地 contexta

sayori 确认关系已理顺，并要求直接按新架构大改。

当前架构：

- concept 是命名语言。
- policy 是约束语言。
- policy 通过 `Applies to` 指向 concept。
- template 是复制骨架，不承接规则本体、concept 定义本体或生命周期。

已修改：

- `.contexta/templates/concept.md`
- `.contexta/templates/policy.md`
- `.contexta/modules/concept/module.md`
- `.contexta/modules/concept/assertion.md`
- `.contexta/modules/concept/concept.md`
- `.contexta/modules/concept/policy.md`
- `.contexta/modules/concept/template.md`
- `.contexta/modules/policy/language.md`
- `.contexta/modules/policy/audience.md`
- `.contexta/modules/policy/semantic-granularity.md`
- `.contexta/modules/policy/template-boundary.md`
- `.contexta/modules/concept/naming.md`
- `.contexta/modules/policy/naming.md`

已创建 `contexta-architecture-baseline.md` 记录当前架构基线。

## [2026-05-19] review-fix | 修复 subagent 审核发现

subagent 只读审核后未发现阻塞问题，但指出三处需要修复：

- `semantic-granularity` 的 Rationale 中仍有 concept 定义回流。
- `concept 不反向引用 policy` 的表述存在歧义。
- task index 中 primitive 理论序列与当前长期层落地集合容易混淆。

已修复：

- `semantic-granularity` 的 Rationale 改为只解释粒度约束原因，不重新定义 [[assertion]] 或 [[module]]。
- `plan.md` 明确：concept 不通过 `Applies to` 或规则内容反向挂载 policy，但 concept network 可以出现 `[[policy]]` 作为相邻 concept。
- `index.md` 明确：六个 primitive 是理论建设序列，当前长期层只先落地 concept / policy / module / assertion / template；template 不是 primitive，structure / example 仍未落地。

## [2026-05-19] naming | 设计 naming 语义定位机制

sayori 指出命名也需要绝对规范和严格，并询问命名是否适合作为理论。

当前判断：

- naming 是语义定位机制。
- naming 不是表面风格。
- agent 通过目录名、文件名、标题名和 concept designation 定位内容。
- naming 当前不升格为 primitive，但作为 contexta 的 foundational concern 落地。

已新增：

- `.contexta/modules/concept/naming.md`
- `.contexta/modules/policy/naming.md`

已按 naming policy 修正：

- `.contexta/modules/policy/language-policy.md` -> `.contexta/modules/policy/language.md`
- `.contexta/modules/policy/audience-policy.md` -> `.contexta/modules/policy/audience.md`
- 对应标题同步改为 `# language` 与 `# audience`。

## [2026-05-19] close-review-fix | 修复收口审核发现

sayori 确认按 subagent 收口建议继续。

已修复：

- 清理 concept module 中把相邻概念写入 `Avoid` 的用法。
- 将 `assertion` concept 的边界例改回命名语言，不再写成 policy 或 semantic lint 判断。
- 收敛 `template` concept 中的 workflow / lifecycle 口吻，只表达 template 与 workflow 的边界。
- 将 `audience` policy 的英文小标题改为中文表达，保留必要英文术语。
- 在 task index 中补齐 `language`、`audience`、`semantic-granularity` policy 文件记录。
