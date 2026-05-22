---
status: accepted
workspace_status: archived
created: 2026-05-19
updated: 2026-05-20
owner: sayori
---

# contexta content type constraints

本 task 目录用于记录 contexta 内容类型约束设计的已完成工作面。

当前 task 已归档。后续仍需推进的模型问题已拆入：

- `.docwarden/task/12-contexta-model-followup/`

## 边界

- 本目录是对话产生的 task material。
- 本任务处理 contexta 内容类型约束，不处理 docwarden workflow 编排。
- 本任务早期不真实修改 `.contexta/templates/`；Loop 6.4 后已按 sayori 指令直接修改 `.contexta` 长期层。
- 本任务不写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 本任务不修改 `docs/`。

## 来源基线

- `.docwarden/archive/task/10-promote-output-content-format/contexta-format-handoff.md`
- `.docwarden/archive/task/10-promote-output-content-format/spec-module-format-instance.md`
- `.docwarden/archive/task/09-promote-pick-entity-landing/frontmatter-field-boundary.md`
- `.contexta/modules/policy/`
- `.contexta/modules/concept/`
- `.contexta/templates/`

## 归档判断

- contexta 负责内容格式协议。
- contexta 维护更上级的内容元概念。
- 本任务确认了第一批元概念建设线索：policy、structure、module、assertion、concept、example。
- `policy` 是约束语言。
- `concept` 是命名语言。
- `structure` 是组织语言。
- `module` 是语义组合单元，不是 `kind: module`。
- `assertion` 是最小可审查语义单元。
- `template` 是复制骨架和 artifact role，不是 primitive 元概念。
- `naming` 是语义定位机制，不是 primitive 元概念。
- workflow 不应套用 policy 结构。
- workflow / pipeline / architecture / branch / composition 当前作为 structure subtype 建模材料处理，不进入 `structure_type` metadata。
- pipeline 已落地为 input / transform / output 共同成立的转换表达。
- workflow 已落地为 state / move / transition 共同成立的推进表达。
- architecture 已落地为 layer / relation / boundary 共同成立的层级表达。
- branch 已落地为 condition / route / target 共同成立的分流表达。
- composition 已落地为 whole / part / stable semantic boundary 共同成立的组合表达。
- example 已被修正为样本语言：用具体样本教 agent 理解、书写或判断某个对象。
- example 不是 independent module kind、template kind、directory kind 或 role。
- `.contexta/templates/example.md` 与 `.contexta/modules/example/` 已移除。
- `example-quality` 当前只是临时质量提示，不是成熟质量抽象；未来需要真实使用反馈再设计。
- 当前关系已确定为 `policy applies to concept`。
- 当前已按新架构直接修改 `.contexta/templates/` 与 `.contexta/modules/`。

## 内容

- `plan.md`：本轮的小循环列表，已同步为归档口径。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `policy-workflow-boundary.md`：Loop 2 policy 与 workflow / architecture 边界定义。
- `meta-concept-baseline.md`：Loop 3 primitive 元概念基线。
- `structure-content-type.md`：已被基线修正的早期 structure 草案。
- `policy-meta-concept.md`：Loop 4 policy 元概念记录。
- `module-meta-concept.md`：Loop 6 module 元概念记录。
- `module-assertion-landing.md`：Loop 6.1 module / assertion 落地草案，已被 composition 模型重写方向替代。
- `current-state.md`：进入 concept 落地前的状态快照。
- `policy-concept-expression-boundary.md`：Loop 6.3 policy / concept 表意分工草案。
- `contexta-architecture-baseline.md`：Loop 6.4 后的 contexta 架构基线，已同步到当前实现。
- `.contexta/modules/concept/module.md`：`module` concept module 草案。
- `.contexta/modules/concept/assertion.md`：`assertion` concept module 草案。
- `.contexta/modules/concept/concept.md`：`concept` concept module 草案。
- `.contexta/modules/concept/policy.md`：`policy` concept module 草案。
- `.contexta/modules/concept/template.md`：`template` concept module 草案。
- `.contexta/modules/concept/naming.md`：`naming` concept module 草案。
- `.contexta/modules/concept/example.md`：`example` concept module 草案。
- `.contexta/modules/concept/structure.md`：`structure` concept module 草案。
- `.contexta/modules/concept/pipeline.md`：`pipeline` concept module 草案。
- `.contexta/modules/concept/workflow.md`：`workflow` concept module 草案。
- `.contexta/modules/concept/architecture.md`：`architecture` concept module 草案。
- `.contexta/modules/concept/branch.md`：`branch` concept module 草案。
- `.contexta/modules/concept/composition.md`：`composition` concept module 草案。
- `.contexta/templates/pipeline.md`：pipeline template。
- `.contexta/templates/workflow.md`：workflow template。
- `.contexta/templates/architecture.md`：architecture template。
- `.contexta/templates/branch.md`：branch template。
- `.contexta/templates/composition.md`：composition template。
- `.contexta/modules/policy/example-quality.md`：example quality 临时质量提示。
- `.contexta/modules/policy/naming.md`：naming policy。
- `.contexta/modules/policy/language.md`：language policy。
- `.contexta/modules/policy/audience.md`：audience policy。
- `.contexta/modules/policy/semantic-granularity.md`：semantic granularity policy。
- `.contexta/modules/policy/template-boundary.md`：template 职责边界 policy。
- `.docwarden/review/contexta-content-type-constraints/`：Loop 1 review artifact。

## 文件索引

- `index.md`：工作面 lead file，状态：archived。
- `plan.md`：本轮 loop 计划，状态：archived。
- `log.md`：时间线记录，状态：archived。
- `policy-workflow-boundary.md`：Loop 2 policy 与 workflow / architecture 边界定义，状态：accepted。
- `meta-concept-baseline.md`：Loop 3 primitive 元概念基线，状态：accepted。
- `structure-content-type.md`：早期 structure 草案，状态：superseded。
- `policy-meta-concept.md`：Loop 4 policy 元概念记录，状态：accepted。
- `module-meta-concept.md`：Loop 6 module 元概念记录，状态：accepted。
- `module-assertion-landing.md`：Loop 6.1 module / assertion 落地草案，状态：superseded by task 12。
- `current-state.md`：进入 concept 落地前的状态快照，状态：accepted。
- `policy-concept-expression-boundary.md`：Loop 6.3 policy / concept 表意分工草案，状态：accepted。
- `contexta-architecture-baseline.md`：Loop 6.4 contexta 架构基线，状态：accepted。
- `.contexta/templates/concept.md`：concept template，状态：draft。
- `.contexta/templates/policy.md`：policy template，状态：draft。
- `.contexta/modules/concept/module.md`：`module` concept module 草案，状态：draft。
- `.contexta/modules/concept/assertion.md`：`assertion` concept module 草案，状态：draft。
- `.contexta/modules/concept/concept.md`：`concept` concept module 草案，状态：draft。
- `.contexta/modules/concept/policy.md`：`policy` concept module 草案，状态：draft。
- `.contexta/modules/concept/template.md`：`template` concept module 草案，状态：draft。
- `.contexta/modules/concept/naming.md`：`naming` concept module 草案，状态：draft。
- `.contexta/modules/concept/example.md`：`example` concept module 草案，状态：draft。
- `.contexta/modules/concept/structure.md`：`structure` concept module 草案，状态：accepted。
- `.contexta/modules/concept/pipeline.md`：`pipeline` concept module 草案，状态：accepted。
- `.contexta/modules/concept/workflow.md`：`workflow` concept module 草案，状态：accepted。
- `.contexta/modules/concept/architecture.md`：`architecture` concept module 草案，状态：accepted。
- `.contexta/modules/concept/branch.md`：`branch` concept module 草案，状态：accepted。
- `.contexta/modules/concept/composition.md`：`composition` concept module 草案，状态：draft。
- `.contexta/templates/pipeline.md`：pipeline template，状态：draft。
- `.contexta/templates/workflow.md`：workflow template，状态：draft。
- `.contexta/templates/architecture.md`：architecture template，状态：draft。
- `.contexta/templates/branch.md`：branch template，状态：draft。
- `.contexta/templates/composition.md`：composition template，状态：draft。
- `.contexta/modules/policy/example-quality.md`：example quality 临时质量提示，状态：draft。
- `.contexta/modules/policy/naming.md`：naming policy，状态：draft。
- `.contexta/modules/policy/language.md`：language policy，状态：draft。
- `.contexta/modules/policy/audience.md`：audience policy，状态：draft。
- `.contexta/modules/policy/semantic-granularity.md`：semantic granularity policy，状态：draft。
- `.contexta/modules/policy/template-boundary.md`：template 职责边界 policy，状态：draft。

关联 review artifact：

- `.docwarden/review/contexta-content-type-constraints/index.md`：review artifact 入口，状态：accepted。
- `.docwarden/review/contexta-content-type-constraints/lead.md`：本轮最小 user review 单元，状态：accepted。
- `.docwarden/review/contexta-content-type-constraints/backing.md`：lead 的承载层，状态：accepted。

## 后续承接

task 11 已归档。

后续进入 `.docwarden/task/12-contexta-model-followup/`，优先处理：

- composition 与 module / assertion 的落地关系。
- `kind`、content type metadata 与 docwarden operation metadata 的边界。
- template 是否只服务已成立的内容类型。
- example quality 的未来抽象方式。
