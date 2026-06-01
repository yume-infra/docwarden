---
status: draft
created: 2026-05-31
updated: 2026-05-31
owner: sayori
---

# Capability Map

本文件记录 docwarden 后续规划时需要同时考虑的 capability 分类。

## 修正

“每个 task 完成后做一次文档维护 review”只是 docwarden 的主链路入口，不是完整目标。

当前项目真正要建设的是多条可以互相 dogfood 的能力系统，而不是一条 contexta 上层分发 docwarden 的所有权链。

上一版表述的问题是：把 artifact kind 列表写得像 contexta 的语义所有权清单。

修正后：

- contexta 负责 prompts / agents / skills 等 capability 的 mapping、catalog、依赖、选择、激活、安装、物料化和运行入口准备。
- contexta 不负责解释 capability 内部的文档语义、primitive 语义、lint 语义或 workflow 业务语义。
- isomorph 负责 semantic primitive engine，包括语义建模、primitive、locator、lint、signal、diagnostic。
- docwarden 负责文档维护 workflow，包括 task / review / promote / pick / sync / cleanup。

## 两个分类轴

第一轴是 namespace：

- `ym:`：sayori 个人层能力。
- `ctx:`：contexta mapping、分发、激活、物料化和 capability 管理能力。
- `dw:`：docwarden 文档维护 workflow 能力。
- `iso:`：isomorph semantic primitive / lint / signal 能力。

第二轴是 artifact kind。

artifact kind 只描述 contexta 可以分发和物料化的载体形态，不表示这些内容由 contexta 解释或拥有语义：

- `skill`：Codex 原生 skill，用于改变 agent 的具体执行能力。
- `prompt`：可复用 prompt / prompt fragment / default prompt。
- `agent`：带角色、上下文、工具选择和执行约束的 agent package。
- `workflow-config`：workflow structure instance 的配置载体；workflow 的语义定义归 isomorph，成立条件是 state / move / transition 共同成立。
- `template`：可复制的内容骨架或 artifact 骨架。
- `context`：项目、用户、任务、产品线、运行环境的上下文文件。
- `policy`：可分发的约束材料；其语义归属取决于 namespace，语义级 policy 通常应由 isomorph 解释。
- `check`：可分发的校验入口；安装/环境检查可以属于 contexta，语义 lint / diagnostic 应属于 isomorph。
- `review-surface`：给人审核的最小可读界面或材料。
- `example`：用于教 agent 判断、生成或使用某类能力的样本。

## 当前已出现的能力

- `ym:write-skill`：个人层 skill 创建能力，当前物料化为 Codex 原生 `write-skill`。
- `ctx:catalog-registry`：contexta catalog 从硬编码转向数据驱动的能力候选。
- `ctx:codex-skill-materializer`：把 capability 安装为 Codex skill 的能力候选。
- `ctx:activation-profile`：按运行场景激活一组 capability 的能力候选。
- `ctx:capability-resolver`：解析 capability id、版本、依赖、target 和 profile 的能力候选。
- `dw:review`：docwarden review phase，用于任务收口前生成 review surface 并进入 promote / pick / log 分流。
- `dw:promote-pick-sync`：把 review 结果分流到 promote / pick / sync 的 workflow 候选。
- `iso:semantic-lint`：语义 lint 和 signal 识别能力候选。
- `iso:locator`：让 assertion / signal 可定位、可审核的能力候选。

## contexta / isomorph 边界

contexta 关心的是：

- 这个 capability 叫什么。
- 属于哪个 namespace。
- 它是什么 artifact kind。
- 从哪里来。
- 安装到哪里。
- 依赖什么。
- 在哪个 profile 中激活。
- 如何交给 Codex / symphony / 本地环境消费。

isomorph 关心的是：

- 这个内容表达了什么语义。
- 哪些 primitive 成立。
- 哪些 assertion 可以被定位。
- 哪些 pattern 构成 lint signal。
- 哪些诊断结果可以支持 review。
- 哪些语义变化会影响文档一致性。

因此 `iso:semantic-lint` 可以经由 contexta 安装或激活，但它的规则、信号、locator 和诊断不属于 contexta。

同理，`dw:review` 相关的 skill / prompt / agent 可以借用 contexta 映射，但 docwarden workflow config、阶段、状态和文档维护判断不属于 contexta。

workflow 不需要被命名成独立产品线。精确说，它是 isomorph `structure` language 下的推进结构；`dw:`、`ctx:`、`iso:` 或 `ym:` 中可以出现 workflow structure instance，其产品语义和配置所有权由所在 namespace / 产品线决定。

## docwarden 的目标面

docwarden 不只是输出文档改动，而是维护文档系统的长期一致性。

它至少要覆盖：

- 过程层：task / log / plan / review 的短命工作材料。
- 审核层：把 agent 产出的文档维护建议变成最小可审核单元。
- 主线层：promote 到项目主线文档、spec、guide 或其他长期资产。
- 侧向层：pick 出用户偏好、纠错经验、ADR、wiki seed、可复用样本。
- 同步层：发现已确认口径和现有文档之间的 drift。
- 反馈层：把真实 dogfood 中暴露的问题回流到 contexta / isomorph capability。

## 规划原则

- 先保留完整目标面，再选择 v0 最小纵切。
- v0 可以只跑主链路，但命名和结构不能让系统误以为只有主链路。
- contexta 负责 mapping、分发、激活和物料化 prompts / agents / skills 等 capability；docwarden 负责自己的文档维护 workflow；isomorph 负责语义 primitive、识别和检查。
- symphony-ts 负责调度执行，不承载这些能力的产品语义。
