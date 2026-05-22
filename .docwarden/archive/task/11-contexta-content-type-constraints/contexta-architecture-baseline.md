---
status: accepted
created: 2026-05-19
updated: 2026-05-20
owner: sayori
loop: 6.4
---

# contexta architecture baseline

本文件记录 task 11 归档时已落地到 `.contexta` 的架构基线。

## 核心架构

contexta 是内容格式协议。

它用多种内容语言稳定 agent 对 md 内容的理解、拆分、审查和生成。

当前核心关系：

```text
designation -> concept -> module -> assertion

policy --applies to--> concept

template -> copied skeleton
example -> semantic teaching material
structure -> organization language
composition -> whole / part / stable semantic boundary
semantic lint -> consumes concept / policy / template / example / structure
```

## concept

concept 是命名语言。

它负责：

- designation 如何指向 concept。
- 为什么需要这个命名。
- concept 如何定义。
- concept 与相邻 concept 如何区分。
- concept 在概念网络里如何连接。
- 哪些例子帮助理解这个命名。

concept 不承接：

- 约束强度。
- 落地规则。
- lint 规则。
- docwarden 生命周期。

已落地：

- `.contexta/templates/concept.md`
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

## policy

policy 是约束语言。

它负责：

- 说明约束 intent。
- 通过 `Applies to` 指向 concept。
- 说明适用 / 不适用范围。
- 用 RFC2119 表达规则强度。
- 解释约束原因。
- 提供帮助识别约束边界的例子。

policy 不重新定义 concept。

已落地：

- `.contexta/templates/policy.md`
- `.contexta/modules/policy/language.md`
- `.contexta/modules/policy/audience.md`
- `.contexta/modules/policy/semantic-granularity.md`
- `.contexta/modules/policy/template-boundary.md`
- `.contexta/modules/policy/naming.md`
- `.contexta/modules/policy/example-quality.md`

## template

template 是复制骨架。

它负责：

- 给已成立的内容类型提供初始章节结构。
- 给 assertion、definition 或 rule 提供书写槽位。

template 不负责：

- 规则本体。
- concept 定义本体。
- 来源。
- review。
- pick。
- 更新。
- 写入。
- 生命周期。

template 的概念定义在：

- `.contexta/modules/concept/template.md`

template 的约束定义在：

- `.contexta/modules/policy/template-boundary.md`

## example

example 是样本语言。

它负责：

- 用具体样本教 agent 理解某个语义对象。
- 用具体样本教 agent 如何书写或判断某类内容。
- 提供可模仿、可对照、可迁移的内容实例。

example 不负责：

- 定义 concept。
- 规定 policy。
- 提供 template 骨架。
- 替代 review 或 semantic lint。
- 成为 independent module kind、template kind、directory kind 或 role。

边界识别、review 对照或 semantic lint 参考是样本产生的派生用途，不是 example 的本体定义。

example 的概念定义在：

- `.contexta/modules/concept/example.md`

example 的质量提示在：

- `.contexta/modules/policy/example-quality.md`

当前 example 编写的已确认局部口径：

- Positive / Negative / Borderline 是 example section 内的对照材料。
- Scenario 与 Judgment Material 是三类样本共享的外部上下文，不放入 Positive 层级。
- 现在的 example 质量仍有限，后续会在实际使用和调优中补充真实 example。

当前不做：

- 不新增 `.contexta/templates/example.md`。
- 不新增 `.contexta/modules/example/`。
- 不把 sample set / contrast set 作为当前 structure subtype。
- 不把 example quality 抽象成成熟质量模型。

## structure

structure 是组织语言。

它负责：

- 表达多个语义位置如何在同一目的下共同成立。
- 作为 pipeline、workflow、architecture、branch、composition 的上位组织语言。

structure 不负责：

- 定义 concept。
- 规定 policy。
- 提供 template 骨架。
- 提供 example 样本。
- 承接 docwarden 操作流程生命周期。

structure 的概念定义在：

- `.contexta/modules/concept/structure.md`

当前不做：

- 不新增 `structure_type` metadata。
- 不新增 structure template。
- 不把 subtype 固化为 `structure_type` metadata 分类树。
- 不直接把 sample set / contrast set 落为 structure module。

## pipeline

pipeline 是已落地的 structure subtype。

当前 pipeline 不按 structure 定义，而是直接由三个位置完整定义：

- input：被处理的内容。
- transform：对 input 执行的转换。
- output：transform 产生的结果。

pipeline 的概念定义在：

- `.contexta/modules/concept/pipeline.md`

pipeline 的复制骨架在：

- `.contexta/templates/pipeline.md`

## workflow

workflow 是已落地的 structure subtype。

当前 workflow 不按 structure 定义，而是直接由三个位置完整定义：

- state：当前可行动处境。
- move：使协作、理解或材料状态继续推进的行动。
- transition：move 如何使一个 state 进入下一个 state 的成立关系。

workflow 的概念定义在：

- `.contexta/modules/concept/workflow.md`

workflow 的复制骨架在：

- `.contexta/templates/workflow.md`

workflow 与 pipeline 的边界：

- workflow 表达推进。
- pipeline 表达转换。
- workflow 的最小问题是 state 如何通过 move 和 transition 进入 next state。
- pipeline 的最小问题是 input 如何通过 transform 形成 output。

## architecture

architecture 是已落地的 structure subtype。

当前 architecture 不按 structure 定义，而是直接由三个位置完整定义：

- layer：整体中的稳定层位。
- relation：layer 之间的相邻、依赖、承接或包含关系。
- boundary：layer 之间不可混淆或不可跨越的边界。

architecture 的概念定义在：

- `.contexta/modules/concept/architecture.md`

architecture 的复制骨架在：

- `.contexta/templates/architecture.md`

architecture 与 workflow / pipeline / branch 的边界：

- architecture 表达层级关系与边界。
- workflow 表达推进。
- pipeline 表达转换。
- branch 表达条件分流。

## branch

branch 是已落地的 structure subtype。

当前 branch 不按 structure 定义，而是直接由三个位置完整定义：

- condition：触发分流判断的条件。
- route：条件成立后选择的路径。
- target：该路径承接的落点或后续对象。

branch 的概念定义在：

- `.contexta/modules/concept/branch.md`

branch 的复制骨架在：

- `.contexta/templates/branch.md`

branch 与 workflow / pipeline / architecture 的边界：

- branch 表达条件分流。
- workflow 表达推进。
- pipeline 表达转换。
- architecture 表达层级关系与边界。

## composition

composition 是已落地的 structure subtype。

当前 composition 不按完整 structure 分类树定义，而是直接由三个位置完整定义：

- whole：被组成的语义整体。
- part：组成 whole 的语义部分。
- stable semantic boundary：让多个 part 能够属于同一个 whole 的稳定语义边界。

composition 的概念定义在：

- `.contexta/modules/concept/composition.md`

composition 的复制骨架在：

- `.contexta/templates/composition.md`

composition 与 module / assertion 的边界：

- module 可以作为 composition 的 whole。
- assertion 可以作为 composition 的 part。
- composition 不是 module 本身，也不是 assertion 本身。
- composition 表达 whole 与 part 为什么能在同一稳定语义边界下共同成立。

composition 与其他 structure subtype 的边界：

- composition 表达组合。
- workflow 表达推进。
- pipeline 表达转换。
- architecture 表达层级关系与边界。
- branch 表达条件分流。

## naming

naming 是语义定位机制。

它负责让名称稳定指向内容对象、内容类型、概念关系或规则主题。

naming 的概念定义在：

- `.contexta/modules/concept/naming.md`

naming 的约束定义在：

- `.contexta/modules/policy/naming.md`

## module

module 是语义组合单元。

它不是 `kind: module`。

一个 md 文件可以是 module，同时通过 `kind` 表达内容语言：

```yaml
kind: concept
```

或：

```yaml
kind: policy
```

module 可以作为 composition 的 whole。

## assertion

assertion 是最小可审查语义单元。

第一版不将 assertion 默认独立成文件。

assertion 可以作为 composition 的 part。

assertion 的概念定义在 concept 中；assertion 的拆分、组合和落地约束后续由 task 12 继续推进。

## 当前落地原则

- 同一个 concept 只在 concept module 中定义一次。
- policy 只通过 `Applies to` 指向 concept，并约束其使用。
- template 只提供骨架和槽位，不承接内容本体。
- example 只提供样本和示范，不承接 concept 定义本体或 policy 规则本体。
- example 不作为 kind、role、template kind 或 directory kind。
- structure 已由 pipeline / workflow / architecture / branch / composition 反推为组织语言定义，不通过 `structure_type` 固化分类树。
- composition 暂时承接 module / assertion 的组合关系，但具体落地规则转入 task 12。
- docwarden 仍负责 task / review / promote / pick / cleanup。
- contexta 不承接 docwarden 操作流程生命周期。
