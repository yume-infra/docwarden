---
status: draft
created: 2026-05-20
updated: 2026-05-22
owner: sayori
---

# contexta model followup

本 task 目录承接 task 11 归档后仍需继续推进的 contexta 模型缺口。

## 边界

- 本目录是对话产生的 task material。
- 本任务处理 contexta 模型后续补全，不处理 docwarden workflow 编排。
- 本任务可以在用户确认后修改 `.contexta/`。
- 本任务不写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 本任务不修改 `docs/`。

## 来源基线

- `.docwarden/archive/task/11-contexta-content-type-constraints/`
- `.docwarden/archive/task/11-contexta-content-type-constraints/contexta-architecture-baseline.md`
- `.docwarden/archive/task/09-promote-pick-entity-landing/frontmatter-field-boundary.md`
- `.contexta/mapping/bootstrap/modules/concept/composition.md`
- `.contexta/mapping/bootstrap/templates/composition.md`

## 当前判断

- task 11 已归档，当前 active task 切换到本目录。
- composition 已作为 structure subtype 落地，且已用于定义当前 module / assertion 的 part-whole 关系。
- module 已明确为 md file scope。
- assertion 已明确为 module 内部最小可审查语义判断，并保留后续成为 locator target 的需求。
- `kind` 应表达内容类型；docwarden operation metadata 应表达 workflow 维护状态。
- template 只应服务已成立的内容语言骨架，不应制造伪 kind。
- contexta 目录第一层应表达 mapping 关系，区分 bootstrap mapping 和 docwarden mapping。
- Delimitation 只保留关键边界压力；contexta 自己的 relation 后续应进入 bootstrap mapping 下的独立 relation layer。
- contexta 内部连接只使用 OFM path alias，不使用短 link。
- example 已被修正为样本语言，不是 kind、role、template kind 或 directory kind。
- `example-quality` 当前只是临时质量提示，未来需要真实使用反馈再抽象。
- semantic lint 后续需要从实际误用中整理第一批可审查信号。

## 内容

- `plan.md`：本任务 loop 计划。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `composition-module-assertion-landing.md`：Loop 1 composition / module / assertion 落地记录。
- `kind-metadata-boundary.md`：Loop 2 kind / metadata 边界落地记录。
- `relation-delimitation-boundary.md`：Loop 2 relation / delimitation 分工记录。
- `template-skeleton-review.md`：Loop 3 template 骨架审查落地记录。
- `mapping-layer-review.md`：Loop 4 mapping layer 落地记录。
- `delimitation-narrowing-review.md`：Loop 5 Delimitation 收窄记录。
- `relation-content-model-review.md`：Loop 6 relation content 建模审查材料。
- `ofm-link-resolution-review.md`：Loop 7 OFM link resolution 审查材料。

## 下一步

Loop 7 已通过审核。下一步进入 Loop 8：semantic lint 误用信号。
