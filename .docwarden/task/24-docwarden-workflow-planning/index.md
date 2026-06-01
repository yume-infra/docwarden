---
status: active
workspace_status: working
created: 2026-05-31
updated: 2026-05-31
owner: sayori
---

# Docwarden Workflow Planning

本 task 记录 docwarden 自身 workflow 需要实现什么，以及如何承接 `23-symphony-dogfood-planning` 完成后的运行结果。

## 背景

当前项目已经重新确认三层：

- `contexta`：prompt / skill / agent / workflow 的分发与激活基础设施。
- `docwarden`：文档维护 workflow。
- `isomorph`：semantic primitive engine。

上一个 task 负责规划如何用 `/Users/sayori/Desktop/symphony-ts` 调度本仓库迭代。这个 task 在其后承接：当执行层可运行后，docwarden 作为被调度和被 dogfood 的 workflow，应明确自己的第一版能力边界。

## 目标

逐步规划 docwarden 需要实现的 workflow 内容，以及它需要消费和产出的多类型 capability，使它能服务真实文档维护，而不是停留在理论描述。

第一阶段只确认：

- docwarden 维护什么类型的文档资产。
- docwarden 在一次工作流里必须读到哪些上下文。
- docwarden 应输出什么可审核结果。
- docwarden 与 contexta / isomorph 的边界。
- docwarden 第一版最小可运行闭环。
- docwarden 之外还需要哪些 `ym:` / `ctx:` / `iso:` capability 配合。

## 边界

- 本 task 是规划工作面，不直接修改 `docs/`。
- 本 task 不实现 contexta runtime。
- 本 task 不替代 `symphony-ts` 的调度设计。
- 本 task 不把协作 loop 写进 `ym:write-skill`。

## 当前判断

- docwarden 的核心不是“写文档”，而是维护文档系统的长期一致性。
- “一次 task 完成后的文档维护 review”只是主链路入口，不是完整目标。
- 第一版应该围绕一次具体文档变更后的 review / promote / pick / sync 过程展开，同时保留后续多 artifact kind 的扩展面。
- isomorph 的 mapping 层表示 semantic mapping；`bootstrap` 是 isomorph 自举。
- 现有 `.isomorph/mapping/docwarden/` 下的 user-context 示例应按旧产品名理解，后续应改为 contexta 口径。
- 新的 `.isomorph/mapping/docwarden/` 应承接 docwarden workflow definition，并利用 isomorph 的 workflow structure。
- docwarden 使用层不是 Markdown + frontmatter definition；应由 `docwarden init` 创建 `.docwarden/` 基本框架和 runtime config。
- runtime config 可采用 yaml 或其他机器友好格式，配置 `review.mode` 等项目实际运行选项。

## 后续承接

本 task 的直接产出应包括：

- docwarden v0 workflow 目标定义。
- 最小输入 / 输出 / 状态转移。
- 第一批跨 namespace、跨 artifact kind 的 capability 候选。
- 可以交给 symphony 调度的实现任务草案。

## 文件

- `capability-map.md`：namespace × artifact kind 的能力地图草案。
- `docwarden-goal-surface.md`：docwarden 目标面与 v0 最小纵切草案。
- `archive-mainline-decisions.md`：archive 中已通过的 docwarden 主链路判断整理。
- `review-user-flow.md`：从用户视角修正 review 主入口和自动触发链路。
- `config-maintained-workflow.md`：docwarden workflow 由自己的 config 维护、skill 作为执行载体的实现约束。
- `review-mode-options.md`：`review-first` / `review-later` 两种 review 策略选项。
- `docwarden-contexta-separation.md`：docwarden / contexta 在 isomorph mapping 层和使用层中的边界修正。
- `workflow-iso-definition.md`：workflow 在 isomorph 中的精确定义和产品线实例关系。
- `basic-link-stabilization-plan.md`：接下来小步稳定 mapping definition -> docwarden init -> runtime config 的推进计划。
- `mapping-layer-correction.md`：修正 bootstrap / contexta / docwarden mapping 层级和历史命名问题。
- `review-workflow-config-draft.md`：修正 review workflow definition 与 runtime config 的分层草案。
