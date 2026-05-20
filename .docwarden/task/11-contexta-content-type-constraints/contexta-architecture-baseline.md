---
status: accepted
created: 2026-05-19
updated: 2026-05-20
owner: sayori
loop: 6.4
---

# contexta architecture baseline

本文件记录当前已落地到 `.contexta` 的架构基线。

## 核心架构

contexta 是内容格式协议。

它用多种内容语言稳定 agent 对 md 内容的理解、拆分、审查和生成。

当前核心关系：

```text
designation -> concept -> module -> assertion

policy --applies to--> concept

template -> copied skeleton
example -> teaching sample
structure -> organization language
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

- 给某类 module 提供初始章节结构。
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

边界识别、review 对照或 semantic lint 参考是样本产生的派生用途，不是 example 的本体定义。

example 的概念定义在：

- `.contexta/modules/concept/example.md`

example 的复制骨架在：

- `.contexta/templates/example.md`

example 的质量约束在：

- `.contexta/modules/policy/example-quality.md`

example 的第一版编写样本在：

- `.contexta/modules/example/example-authoring.md`

当前 example 编写使用局部教学结构：

```text
Target -> Teaching Point -> Sample -> Reading -> Transfer -> Limits
```

这个结构服务 example authoring，不表示这条教学链已经成为独立 structure module。

当前不做：

- 不把 sample set / contrast set 作为当前 structure subtype。
- 不把 positive / negative / borderline 写成单个 `Sample` 的内部小标题。

多样本对照和 example 设计后续重新讨论。

## structure

structure 是组织语言。

它负责：

- 表达多个语义位置如何在同一目的下共同成立。
- 作为 pipeline、workflow、architecture、branch 的上位组织语言。

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
- 不直接把 sample set / contrast set 落为 structure module；example 设计后续重新讨论。

## pipeline

pipeline 是第一个直接落地的 structure subtype 草案。

当前 pipeline 不按 structure 定义，而是直接由三个位置完整定义：

- input：被处理的内容。
- transform：对 input 执行的转换。
- output：transform 产生的结果。

pipeline 的概念定义在：

- `.contexta/modules/concept/pipeline.md`

pipeline 的复制骨架在：

- `.contexta/templates/pipeline.md`

当前不做：

- 不添加 Boundary、Review Checks、failure、handoff 或 lifecycle。
- 不通过 pipeline 立即重写 structure。

## workflow

workflow 是第二个直接落地的 structure subtype 草案。

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

当前不做：

- 不添加 actor、artifact、gateway、lifecycle 或运行时执行语义。
- 不通过 workflow 立即重写 structure。

## architecture

architecture 是第三个直接落地且已通过 review 的 structure subtype 草案。

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

当前不做：

- 不添加 lifecycle、runtime dependency graph 或完整系统设计模板。
- 不通过 architecture 立即重写 structure。

## branch

branch 是第四个直接落地且已通过 review 的 structure subtype 草案。

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

当前不做：

- 不添加 routing table、priority、fallback 或运行时选择算法。
- 不通过 branch 立即重写 structure。

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

## assertion

assertion 是最小可审查语义单元。

第一版不将 assertion 默认独立成文件。

assertion 的概念定义在 concept 中；assertion 的拆分、组合和落地约束由 policy 处理。

## 当前落地原则

- 同一个 concept 只在 concept module 中定义一次。
- policy 只通过 `Applies to` 指向 concept，并约束其使用。
- template 只提供骨架和槽位，不承接内容本体。
- example 只提供样本和示范，不承接 concept 定义本体或 policy 规则本体。
- example 的局部教学结构先停留在 policy、template 和 example module 中，不升级为独立 structure module。
- sample set / contrast set 当前不由 structure 承接；example 设计后续重新讨论。
- structure 已由 pipeline / workflow / architecture / branch 反推为组织语言定义，不通过 `structure_type` 固化分类树。
- docwarden 仍负责 task / review / promote / pick / cleanup。
- contexta 不承接 docwarden 操作流程生命周期。
