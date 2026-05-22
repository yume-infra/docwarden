---
status: accepted
workspace_status: archived
created: 2026-05-19
updated: 2026-05-20
owner: sayori
---

# contexta content type constraints 计划

本轮目标是设计 contexta 的 primitive 内容元概念，并避免把字段层、工具机制、artifact role 或 docwarden 流程职责混入内容类型层。

本 task 已完成当前阶段并归档。仍需推进的模型缺口已拆入 `.docwarden/task/12-contexta-model-followup/`。

## Loop 1：内容类型约束边界

状态：accepted。

目标：确认 contexta 约束设计的对象是内容类型，而不是 docwarden workflow。

草案产物：

- `.docwarden/review/contexta-content-type-constraints/`

当前结果：

- contexta 负责内容格式协议。
- docwarden 负责 task / review / promote / pick / cleanup / 具体实体落点。
- workflow / architecture 不应套用 policy 结构。

## Loop 2：policy 与 workflow / architecture 边界

状态：accepted。

目标：定义 policy 和 workflow / architecture 的结构差异与误用信号。

草案产物：

- `policy-workflow-boundary.md`

当前结果：

- policy 是约束语言。
- workflow、pipeline、architecture、branch、composition 是结构建模材料。
- semantic lint 后续应能识别 workflow 被写成 policy、structure 被写成 policy、template 承接生命周期等误用。

## Loop 3：primitive 元概念基线

状态：accepted。

目标：确认当前先建设的元概念，并记录哪些内容不升格为同级 primitive。

草案产物：

- `meta-concept-baseline.md`

当前结果：

- 当前建设线索为 policy / structure / module / assertion / concept / example。
- template、metadata、semantic-lint、audience、trace/provenance 当前不作为同级 primitive。
- template 是 artifact role。
- metadata 是字段层。
- semantic lint 是工具机制。

## Loop 4：policy

状态：accepted。

目标：定义 `policy` 作为约束类元概念。

草案产物：

- `policy-meta-concept.md`

当前结果：

- policy 解决约束表达问题。
- policy 不承接结构、概念定义或例子本体。
- policy 通过 `Applies to` 指向 concept。

## Loop 5：structure

状态：accepted。

目标：定义 `structure` 作为组织语言。

落地产物：

- `.contexta/modules/concept/structure.md`

当前结果：

- structure 是组织语言。
- structure 表达多个语义位置如何在同一目的下共同成立。
- 当前不新增 `structure_type` metadata。
- 当前不新增 structure template。
- 当前不把 subtype 固化为 `structure_type` metadata 分类树。

## Loop 5.1：pipeline

状态：accepted。

目标：直接定义 `pipeline`，作为第一个 structure subtype 建模材料。

落地产物：

- `.contexta/modules/concept/pipeline.md`
- `.contexta/templates/pipeline.md`

当前结果：

- pipeline 定义为 input、transform、output 三个位置共同成立的转换表达。
- pipeline template 只保留 Input / Transform / Output。

## Loop 5.2：workflow

状态：accepted。

目标：直接定义 `workflow`，并与 `pipeline` 保持最小且清楚的边界。

落地产物：

- `.contexta/modules/concept/workflow.md`
- `.contexta/templates/workflow.md`

当前结果：

- workflow 定义为 state、move、transition 三个位置共同成立的推进表达。
- workflow template 只保留 State / Move / Transition。
- workflow 与 pipeline 的边界是推进表达 vs 转换表达。

## Loop 5.3：architecture

状态：accepted。

目标：直接定义 `architecture`，并与 workflow / pipeline / branch 保持最小且清楚的边界。

落地产物：

- `.contexta/modules/concept/architecture.md`
- `.contexta/templates/architecture.md`

当前结果：

- architecture 定义为 layer、relation、boundary 三个位置共同成立的层级表达。
- architecture 处理层级关系与边界，不处理推进、转换或分流。
- architecture template 只保留 Layer / Relation / Boundary。

## Loop 5.4：branch

状态：accepted。

目标：直接定义 `branch`，并承接当前 promote / pick / log 与 pick entity landing 暴露出的条件分流问题。

落地产物：

- `.contexta/modules/concept/branch.md`
- `.contexta/templates/branch.md`

当前结果：

- branch 定义为 condition、route、target 三个位置共同成立的分流表达。
- `routing` 作为 branch 的 alias，不单独建 concept。
- branch template 只保留 Condition / Route / Target。

## Loop 5.5：composition

状态：accepted as baseline。

目标：直接定义 `composition`，用于承接 module / assertion 暴露出的组合关系。

落地产物：

- `.contexta/modules/concept/composition.md`
- `.contexta/templates/composition.md`

当前结果：

- composition 定义为 whole、part、stable semantic boundary 三个位置共同成立的组合表达。
- composition 不是普通列表、policy 约束、pipeline 转换、workflow 推进或 architecture 层级。
- module 可以作为 composition 的 whole。
- assertion 可以作为 composition 的 part。
- composition 当前是已落地基线，但 module / assertion 的具体落地方式转入 task 12 继续 review。

## Loop 6：module

状态：accepted。

目标：定义 `module` 作为语义组合单元。

草案产物：

- `module-meta-concept.md`

当前结果：

- module 解决多个语义单元如何组成一个 md 单元的问题。
- module 不等于单条 assertion。
- module 不是 `kind: module`。

## Loop 6.1：module / assertion 落地

状态：superseded by task 12。

目标：定义 module 和 assertion 在 `.contexta` 中的第一版落地方式。

草案产物：

- `module-assertion-landing.md`

当前结果：

- 早期草案把重点放在路径与 `kind` 上，尚未充分表达 module / assertion 的理论关系。
- composition 已补上 whole / part / stable semantic boundary 的模型。
- module / assertion 如何在 `.contexta` 中落地，转入 task 12 继续推进。

## Loop 6.2：concept 层草案落地

状态：rejected。

目标：将 module 和 assertion 的概念定义先落到 `.contexta/modules/concept/`，供 sayori 核对和修改。

草案产物：

- `.contexta/modules/concept/module.md`
- `.contexta/modules/concept/assertion.md`

当前结果：

- 草案概念方向基本相关，但表达方式错误。
- 现有 concept 草案把 concept 写成了准 policy。
- 后续通过 policy / concept 表意分工重写。

## Loop 6.3：policy / concept 表意分工

状态：accepted。

目标：并排设计 policy 和 concept，避免 concept 与 policy 重复。

草案产物：

- `policy-concept-expression-boundary.md`

当前结果：

- `policy 是约束语言，concept 是命名语言`。
- 关系定为 `policy applies to concept`。
- concept 不通过 `Applies to` 或规则内容反向挂载 policy。
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
- `.contexta/modules/concept/naming.md`
- `.contexta/modules/concept/example.md`
- `.contexta/modules/concept/structure.md`
- `.contexta/modules/concept/pipeline.md`
- `.contexta/modules/concept/workflow.md`
- `.contexta/modules/concept/architecture.md`
- `.contexta/modules/concept/branch.md`
- `.contexta/modules/concept/composition.md`
- `.contexta/templates/pipeline.md`
- `.contexta/templates/workflow.md`
- `.contexta/templates/architecture.md`
- `.contexta/templates/branch.md`
- `.contexta/templates/composition.md`
- `.contexta/modules/policy/template-boundary.md`
- `.contexta/modules/policy/language.md`
- `.contexta/modules/policy/audience.md`
- `.contexta/modules/policy/naming.md`
- `.contexta/modules/policy/semantic-granularity.md`
- `.contexta/modules/policy/example-quality.md`
- `contexta-architecture-baseline.md`

当前结果：

- 已按新架构直接修改 `.contexta` 长期层。
- example 的伪 kind / template / directory 已移除。
- composition 已补入当前架构基线。

## Loop 7：assertion

状态：absorbed by Loop 6.4 and task 12。

目标：定义 `assertion` 作为最小可审查语义单元。

当前结果：

- `assertion` concept module 已先落地到 `.contexta/modules/concept/assertion.md`。
- assertion 不默认独立成文件。
- assertion 与 module 的组合关系转入 composition 模型继续推进。

## Loop 8：concept

状态：absorbed by Loop 6.4。

目标：定义 `concept` 作为概念 / 术语定义。

当前结果：

- `concept` concept module 已先落地到 `.contexta/modules/concept/concept.md`。
- concept template 已落地到 `.contexta/templates/concept.md`。

## Loop 9：example

状态：accepted。

目标：定义 `example` 作为样本语言。

落地产物：

- `.contexta/modules/concept/example.md`

当前结果：

- example 是样本语言：用一个具体样本让 agent 学会如何理解、书写或判断某个对象。
- 边界识别、review 对照或 semantic lint 参考是样本产生的派生用途，不是 example 的本体定义。
- example 不是 independent module kind、template kind、directory kind 或 role。
- `.contexta/templates/example.md` 与 `.contexta/modules/example/` 已移除。

## Loop 9.1：example 编写质量

状态：accepted as limited baseline。

目标：改善当前 example 的编写质量，同时避免把局部教学结构提前升级为独立 structure module。

落地产物：

- `.contexta/modules/policy/example-quality.md`

当前结果：

- 当前保留 Positive / Negative / Borderline 作为 example section 内的对照材料。
- Scenario 与 Judgment Material 是三类样本共享的外部上下文，不放入 Positive 层级。
- 当前 example 不够好，但这是承认且可接受的局限。
- 后续会在实际使用和调优中继续补充真实 example。
- `example-quality` 当前只是临时质量提示，不是成熟质量抽象；未来需要真实使用反馈再重新抽象。

## 本轮不做

- 真实写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 修改 `docs/`。
- 设计 docwarden review / promote / pick / cleanup 流程。
- 处理 pick 后 user context。
- 把 sample set / contrast set 作为 structure subtype。
- 把 example 作为 module kind、template kind、directory kind 或 role。

## 后续承接

以下内容转入 `.docwarden/task/12-contexta-model-followup/`：

- composition 与 module / assertion 的落地关系。
- `kind`、content type metadata 与 docwarden operation metadata 的边界。
- template 是否只服务已成立的内容类型。
- semantic lint 的第一批误用信号。
- example quality 的未来抽象方式。
