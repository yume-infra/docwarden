---
status: draft
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# contexta content type constraints

本 task 目录用于设计 contexta 的内容类型约束。

## 边界

- 本目录是对话产生的 task material。
- 本任务处理 contexta 内容类型约束，不处理 docwarden workflow 编排。
- 本任务早期不真实修改 `.contexta/templates/`；Loop 6.4 后已按 sayori 指令直接修改 `.contexta` 长期层。
- 本任务不写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 本任务不修改 `docs/`。

## 来源基线

- `.docwarden/task/10-promote-output-content-format/contexta-format-handoff.md`
- `.docwarden/task/10-promote-output-content-format/spec-module-format-instance.md`
- `.contexta/modules/policy/`
- `.contexta/templates/`

## 当前判断

- contexta 负责内容格式协议。
- contexta 维护更上级的内容元概念。
- 当前先落地六个 primitive 元概念：policy、structure、module、assertion、concept、example。
- 六个 primitive 是理论建设序列，不表示已经全部落到 `.contexta` 长期层。
- workflow 不应套用 policy 结构。
- template 是 artifact role，metadata 是字段层，semantic-lint 是工具机制，当前不作为 primitive 元概念。
- workflow / pipeline / architecture / branch 先作为 structure 下的子概念或子模块处理，不先进入 `structure_type` metadata。
- 当前已补 `.contexta/modules/concept/`，优先落地 concept / policy / module / assertion / example / template；其中 template 不是 primitive，而是补齐命名和边界所需的 artifact role。
- 当前已新增 naming 作为语义定位机制；naming 不是 primitive，但作为 contexta foundational concern 落地。
- structure 仍未落地到 `.contexta` 长期层。
- example 已落地为样本语言。
- 当前关系已确定为 `policy applies to concept`。
- 当前已按新架构直接修改 `.contexta/templates/` 与 `.contexta/modules/`。

## 内容

- `plan.md`：本轮的小循环列表。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `policy-workflow-boundary.md`：Loop 2 policy 与 workflow / architecture 边界定义。
- `meta-concept-baseline.md`：Loop 3 primitive 元概念基线。
- `structure-content-type.md`：已被基线修正的早期 structure 草案。
- `policy-meta-concept.md`：Loop 4 policy 元概念记录。
- `module-meta-concept.md`：Loop 6 module 元概念记录。
- `module-assertion-landing.md`：Loop 6.1 module / assertion 落地草案。
- `current-state.md`：进入 concept 落地前的状态快照。
- `policy-concept-expression-boundary.md`：Loop 6.3 policy / concept 表意分工草案。
- `contexta-architecture-baseline.md`：Loop 6.4 contexta 架构基线。
- `.contexta/modules/concept/module.md`：`module` concept module 草案。
- `.contexta/modules/concept/assertion.md`：`assertion` concept module 草案。
- `.contexta/modules/concept/concept.md`：`concept` concept module 草案。
- `.contexta/modules/concept/policy.md`：`policy` concept module 草案。
- `.contexta/modules/concept/template.md`：`template` concept module 草案。
- `.contexta/modules/concept/naming.md`：`naming` concept module 草案。
- `.contexta/modules/concept/example.md`：`example` concept module 草案。
- `.contexta/templates/example.md`：example template。
- `.contexta/modules/policy/naming.md`：naming policy。
- `.contexta/modules/policy/language.md`：language policy。
- `.contexta/modules/policy/audience.md`：audience policy。
- `.contexta/modules/policy/semantic-granularity.md`：semantic granularity policy。
- `.contexta/modules/policy/template-boundary.md`：template 职责边界 policy。
- `.docwarden/review/contexta-content-type-constraints/`：Loop 1 review artifact。

## 文件索引

- `index.md`：工作面 lead file，状态：draft。
- `plan.md`：本轮 loop 计划，状态：draft。
- `log.md`：时间线记录，状态：draft。
- `policy-workflow-boundary.md`：Loop 2 policy 与 workflow / architecture 边界定义，状态：accepted。
- `meta-concept-baseline.md`：Loop 3 primitive 元概念基线，状态：accepted。
- `structure-content-type.md`：早期 structure 草案，状态：superseded。
- `policy-meta-concept.md`：Loop 4 policy 元概念记录，状态：accepted。
- `module-meta-concept.md`：Loop 6 module 元概念记录，状态：accepted。
- `module-assertion-landing.md`：Loop 6.1 module / assertion 落地草案，状态：draft。
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
- `.contexta/templates/example.md`：example template，状态：draft。
- `.contexta/modules/policy/naming.md`：naming policy，状态：draft。
- `.contexta/modules/policy/language.md`：language policy，状态：draft。
- `.contexta/modules/policy/audience.md`：audience policy，状态：draft。
- `.contexta/modules/policy/semantic-granularity.md`：semantic granularity policy，状态：draft。
- `.contexta/modules/policy/template-boundary.md`：template 职责边界 policy，状态：draft。

关联 review artifact：

- `.docwarden/review/contexta-content-type-constraints/index.md`：review artifact 入口，状态：accepted。
- `.docwarden/review/contexta-content-type-constraints/lead.md`：本轮最小 user review 单元，状态：accepted。
- `.docwarden/review/contexta-content-type-constraints/backing.md`：lead 的承载层，状态：accepted。

## 下一步

继续 review 已落地的 `.contexta` 新架构，下一步补齐 structure。
