---
status: draft
created: 2026-05-19
updated: 2026-05-20
owner: sayori
---

# contexta content type constraints 计划

本轮目标是设计 contexta 的 primitive 内容元概念，并避免把字段层、工具机制、artifact role 或 docwarden 流程职责混入内容类型层。

本任务早期只在 `.docwarden/task/11-contexta-content-type-constraints/` 中推进。

在 Loop 6.4 中，sayori 明确要求按新架构直接修改 `.contexta` 长期层，因此当前允许修改 `.contexta/templates/` 与 `.contexta/modules/`。

## Loop 1：内容类型约束边界

状态：accepted。

目标：确认 contexta 约束设计的对象是内容类型，而不是 docwarden workflow。

草案产物：

- `.docwarden/review/contexta-content-type-constraints/`

review 门槛：

- sayori 确认 workflow / architecture 不应套用 policy 结构。
- sayori 确认本任务要设计内容类型约束，而不是直接写模板。

## Loop 2：policy 与 workflow / architecture 边界

状态：accepted。

目标：定义 policy 和 workflow / architecture 的结构差异与误用信号。

草案产物：

- `policy-workflow-boundary.md`

review 门槛：

- sayori 确认 policy 和 workflow / architecture 的核心职责区分。
- sayori 确认 semantic lint 应识别 workflow 被写成 policy。

## Loop 3：primitive 元概念基线

状态：accepted。

目标：确认当前先建设六个 primitive 元概念，并记录哪些内容不升格为 primitive。

草案产物：

- `meta-concept-baseline.md`

review 门槛：

- sayori 确认当前 primitive 元概念为 policy / structure / module / assertion / concept / example。
- sayori 确认 template、metadata、semantic-lint、audience、trace/provenance 当前不作为同级 primitive。

## Loop 4：policy

状态：accepted。

目标：定义 `policy` 作为约束类元概念。

草案产物：

- `policy-meta-concept.md`

review 门槛：

- sayori 确认 policy 解决约束表达问题。
- sayori 确认 policy 不承接结构、概念定义或例子本体。

## Loop 5：structure

状态：placeholder。

目标：定义 `structure` 作为组织语言。

落地产物：

- `.contexta/modules/concept/structure.md`

review 门槛：

- sayori 确认 structure 解决组成、关系、流转、边界和承接问题。
- sayori 确认 workflow / pipeline / architecture / branch 先作为 structure 下的子概念或子模块处理。

当前处理：

- structure 早期草案已被回退。
- 当前只落地 structure concept 占位定义。
- 当前保留 `structure = 组织语言` 的方向，但不视为最终定义。
- 下一步先设计 structure subtype，再反推 structure 的 definition、delimitation 和 examples。
- 当前不新增 `structure_type` metadata。
- 当前不新增 structure template。
- 当前不把 subtype 固化为 `structure_type` metadata 分类树。
- 当前不提前落地 sample set / contrast set 或新的 example 结构；example 设计后续重新讨论。

## Loop 5.1：pipeline

状态：revising。

目标：直接定义 `pipeline`，作为第一个 structure subtype 建模材料。

落地产物：

- `.contexta/modules/concept/pipeline.md`
- `.contexta/templates/pipeline.md`

review 门槛：

- sayori 确认 pipeline 不按 structure 定义。
- sayori 确认 pipeline 由 input / transform / output 三个位置完整定义。
- sayori 确认 pipeline template 只保留 Input / Transform / Output。

当前处理：

- pipeline 定义为 input、transform、output 三个位置共同成立的转换表达。
- 当前不添加 Boundary、Review Checks、failure、handoff 或 lifecycle。
- 当前不通过 pipeline 反向修改 structure。

## Loop 5.2：workflow

状态：accepted。

目标：直接定义 `workflow`，并与 `pipeline` 保持最小且清楚的边界。

落地产物：

- `.contexta/modules/concept/workflow.md`
- `.contexta/templates/workflow.md`

review 门槛：

- sayori 确认 workflow 不按完整 structure 分类树定义。
- sayori 确认 workflow 由 state / move / transition 三个位置完整定义。
- sayori 确认 workflow template 只保留 State / Move / Transition。
- sayori 确认 workflow 与 pipeline 的边界是推进表达 vs 转换表达。

当前处理：

- workflow 定义为 state、move、transition 三个位置共同成立的推进表达。
- pipeline 定义为 input、transform、output 三个位置共同成立的转换表达。
- 当前不添加 actor、artifact、gateway、lifecycle 或运行时执行语义。
- 当前不通过 workflow 反向修改 structure。

## Loop 5.3：architecture

状态：draft。

目标：直接定义 `architecture`，并与 workflow / pipeline / branch 保持最小且清楚的边界。

落地产物：

- `.contexta/modules/concept/architecture.md`
- `.contexta/templates/architecture.md`

review 门槛：

- sayori 确认 architecture 由 layer / relation / boundary 三个位置完整定义。
- sayori 确认 architecture 处理层级关系与边界，不处理推进、转换或分流。
- sayori 确认 architecture template 只保留 Layer / Relation / Boundary。

当前处理：

- 原 part / responsibility / boundary 设计不符合 sayori 理念，已回退为 layer / relation / boundary。
- architecture 定义为 layer、relation、boundary 三个位置共同成立的层级表达。
- sayori 已确认 architecture 通过。
- 当前不添加 lifecycle、runtime dependency graph 或完整系统设计模板。
- 当前不通过 architecture 反向修改 structure。

## Loop 5.4：branch

状态：accepted。

目标：直接定义 `branch`，并承接当前 promote / pick / log 与 pick entity landing 暴露出的条件分流问题。

落地产物：

- `.contexta/modules/concept/branch.md`
- `.contexta/templates/branch.md`

review 门槛：

- sayori 确认 branch 由 condition / route / target 三个位置完整定义。
- sayori 确认 branch 处理条件分流，不处理推进、转换或组成边界。
- sayori 确认 branch template 只保留 Condition / Route / Target。

当前处理：

- branch 定义为 condition、route、target 三个位置共同成立的分流表达。
- `routing` 作为 branch 的 alias，不单独建 concept。
- 当前不添加 routing table、priority、fallback 或运行时选择算法。
- 当前不通过 branch 反向修改 structure。

## Loop 6：module

状态：accepted。

目标：定义 `module` 作为语义组合单元。

草案产物：

- `module-meta-concept.md`

review 门槛：

- sayori 确认 module 解决多个语义单元如何组成一个 md 单元的问题。
- sayori 确认 module 不等于单条 assertion。

## Loop 6.1：module / assertion 落地

状态：draft。

目标：定义 module 和 assertion 在 `.contexta` 中的第一版落地方式。

草案产物：

- `module-assertion-landing.md`

review 门槛：

- sayori 确认 module 的长期落点是否应为 `.contexta/modules/<kind>/<module-id>.md`。
- sayori 确认 assertion 是否应先作为 module 内部列表项落地，而不是独立文件。
- sayori 确认第一版是否不新增 `kind: module`、assertion 独立文件或 assertion 全局 ID。

## Loop 6.2：concept 层草案落地

状态：rejected。

目标：将 module 和 assertion 的概念定义先落到 `.contexta/modules/concept/`，供 sayori 核对和修改。

草案产物：

- `.contexta/modules/concept/module.md`
- `.contexta/modules/concept/assertion.md`

review 门槛：

- sayori 确认 `module` concept module 是否正确表达语义组合单元。
- sayori 确认 `assertion` concept module 是否正确表达最小可审查语义单元。
- sayori 确认 concept 草案没有混入 policy 规则或 docwarden workflow。

当前结果：

- 草案概念方向基本相关，但表达方式错误。
- 现有 concept 草案把 concept 写成了准 policy。
- 后续需要先并排设计 policy / concept 的表意职责，再重写 concept template 和 concept module。

## Loop 6.3：policy / concept 表意分工

状态：accepted。

目标：并排设计 policy 和 concept，避免 concept 与 policy 重复。

草案产物：

- `policy-concept-expression-boundary.md`

review 门槛：

- sayori 确认 `policy 是约束语言，concept 是命名语言`。
- sayori 确认 concept template 的核心骨架。
- sayori 确认 policy template 与 concept template 的职责不重复。

当前结果：

- 关系定为 `policy applies to concept`。
- concept 不通过 `Applies to` 或规则内容反向挂载 policy；concept network 可以出现 `[[policy]]` 作为相邻 concept。
- policy 通过 `Applies to` 指向 concept。

## Loop 6.4：contexta 架构落地

状态：accepted。

目标：按新架构直接修改 `.contexta`。

落地产物：

- `.contexta/templates/concept.md`
- `.contexta/templates/policy.md`
- `.contexta/modules/concept/concept.md`
- `.contexta/modules/concept/policy.md`
- `.contexta/modules/concept/module.md`
- `.contexta/modules/concept/assertion.md`
- `.contexta/modules/concept/template.md`
- `.contexta/modules/policy/template-boundary.md`
- `.contexta/modules/policy/language.md`
- `.contexta/modules/policy/audience.md`
- `.contexta/modules/concept/naming.md`
- `.contexta/modules/policy/naming.md`
- `.contexta/modules/policy/semantic-granularity.md`
- `contexta-architecture-baseline.md`

review 门槛：

- sayori 确认 concept module 是否符合命名语言。
- sayori 确认 policy module 是否通过 `Applies to` 指向 concept。
- sayori 确认 template 定位是否清楚。

## Loop 7：assertion

状态：absorbed by Loop 6.4。

目标：定义 `assertion` 作为最小可审查语义单元。

草案产物：

- `assertion-meta-concept.md`

review 门槛：

- sayori 确认 assertion 是最小可审查语义单元。
- sayori 确认 assertion 不默认独立成文件。

当前处理：

- `assertion` concept module 已先落地到 `.contexta/modules/concept/assertion.md`。
- assertion 的拆分、组合和落地约束已由 `semantic-granularity` 与 `template-boundary` 承接。

## Loop 8：concept

状态：absorbed by Loop 6.4。

目标：定义 `concept` 作为概念 / 术语定义。

草案产物：

- `concept-meta-concept.md`

review 门槛：

- sayori 确认 concept 解决术语和概念边界问题。
- sayori 确认 concept 不承担 policy 约束或 structure 流转职责。

当前处理：

- `concept` concept module 已先落地到 `.contexta/modules/concept/concept.md`。
- concept template 已落地到 `.contexta/templates/concept.md`。

## Loop 9：example

状态：accepted。

目标：定义 `example` 作为样本语言。

落地产物：

- `.contexta/modules/concept/example.md`
- `.contexta/templates/example.md`

review 门槛：

- sayori 确认 example 是用具体样本教 agent 理解、书写或判断的样本语言。
- sayori 确认 example 不替代 policy / structure / concept 本体。

当前结果：

- sayori 已纠正：example 的本体不是边界校验语言，而是样本语言。
- 边界识别、review 对照或 semantic lint 参考是样本产生的派生用途，不是 example 的本体定义。

## Loop 9.1：example 编写质量

状态：accepted。

目标：建立高质量 example 的编写模式，同时避免把局部教学结构提前升级为独立 structure module。

落地产物：

- `.contexta/modules/policy/example-quality.md`
- `.contexta/templates/example.md`
- `.contexta/modules/example/example-authoring.md`

review 门槛：

- sayori 确认 example 编写需要局部教学结构。
- sayori 确认该结构先停留在 policy、template 和 example module 中。
- sayori 确认当前不把该结构升级为独立 structure module。

当前结果：

- example authoring 使用 `Target -> Teaching Point -> Sample -> Reading -> Transfer -> Limits`。
- `example-quality` policy 约束好 example 必须有明确 teaching point、具体 sample、reading、transfer 和必要 limits。
- `example-authoring` 用 example 教 agent 如何写 example。
- 当前只收口单样本 example authoring。
- sample set / contrast set 不作为当前后续占位。
- positive / negative / borderline 不是单个 `Sample` 的内部小标题。
- 多样本对照与 example 设计后续重新讨论，不交给当前 structure subtype 承接。

## 本轮不做

- 真实写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 设计 docwarden review / promote / pick / cleanup 流程。
- 处理 pick 后 user context。
- 落地 sample set / contrast set。
