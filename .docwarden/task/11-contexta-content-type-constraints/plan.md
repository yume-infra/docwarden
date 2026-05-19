---
status: draft
created: 2026-05-19
updated: 2026-05-19
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

状态：deferred。

目标：定义 `structure` 作为结构类元概念。

草案产物：

- `structure-meta-concept.md`

review 门槛：

- sayori 确认 structure 解决组成、关系、流转、边界和承接问题。
- sayori 确认 workflow / pipeline / architecture / branch 先作为 structure 下的子概念或子模块处理。

当前处理：

- structure 早期草案已被回退。
- 正式 structure loop 暂不阻塞当前 module 定义。

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

## 本轮不做

- 真实写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 设计 docwarden review / promote / pick / cleanup 流程。
- 处理 pick 后 user context。
