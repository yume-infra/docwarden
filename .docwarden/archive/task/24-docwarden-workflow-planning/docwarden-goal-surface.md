---
status: draft
created: 2026-05-31
updated: 2026-05-31
owner: sayori
---

# Docwarden Goal Surface

## Review Lead

docwarden 的第一目标不是“让 agent 写文档”，而是让一次项目推进之后产生的知识、决策、纠偏和上下文变化，能被可靠地整理、审核、分流并进入合适的长期资产。

v0 应以任务收口时自动进入的 `review` 阶段作为最小纵切，但目标面必须覆盖更大的文档维护系统。

## 核心追求

### 1. 过程材料不丢失

task、log、plan、对话纠偏、实现决策、风险判断，都先进入短命过程层。

docwarden 要做的是从过程层提炼长期价值，而不是让 agent 临场猜哪些内容该写进文档。

### 2. 人审是核心控制面

docwarden 的输出必须先变成 sayori 可快速审核的最小单元。

这包括：

- 本轮发生了什么。
- 哪些内容应该 promote。
- 哪些内容应该 pick。
- 哪些内容只是过程记录。
- 哪些位置存在 drift 或缺口。
- 哪些改动建议可以安全落地。

### 3. promote / pick 是基础分流

promote 处理项目主线资产的稳定化。

pick 处理不属于主线但有长期复利的内容，例如：

- 用户偏好。
- 纠错经验。
- ADR seed。
- wiki seed。
- 可复用样本。
- agent 错误模式。

### 4. 文档系统要能持续同步

docwarden 不只在任务结束时追加内容，还要能发现已确认口径与现有文档之间的 drift。

这种 drift 可以来自：

- 当前实现已经变了。
- 当前命名已经变了。
- 理论层边界已经纠正。
- 用户偏好已经改变。
- 旧 task/archive 中保留了历史口径但不应继续指导当前实现。

### 5. docwarden 消费 isomorph，但不替代 isomorph

docwarden 可以使用 isomorph 的 semantic lint、locator、signal、diagnostic 来辅助 review。

但 docwarden 不自己定义 semantic primitive engine。

docwarden 关心的是：这些诊断如何服务文档维护动作。

### 6. docwarden 通过 contexta 被分发和激活

docwarden 的 skills、prompts、agents、workflow assets、review surfaces、checks 可以由 contexta catalog 管理和安装。

但 contexta 不拥有 docwarden 的业务语义。

### 7. docwarden 需要反向反馈能力缺口

当 docwarden 跑不动时，缺口可能属于不同产品线：

- 缺少分发 / 激活 / materialize 能力：回流到 `ctx:`。
- 缺少语义定位 / lint / signal 能力：回流到 `iso:`。
- 缺少文档维护动作 / review surface：回流到 `dw:`。
- 缺少个人协作偏好或个人工具：回流到 `ym:`。

## v0 最小纵切

v0 建议只做一条可运行链路：

```text
task completed
  -> docwarden reads task/log/plan/diff/current confirmed context
  -> docwarden enters review phase
  -> docwarden produces review surface
  -> sayori reviews
  -> docwarden routes reviewed material into promote / pick / log / transfer / no-op
  -> approved changes land outside docs first, unless explicitly authorized
```

## v0 输入

- 当前 task 目录。
- task index。
- git diff / recent commits。
- 当前对话中已确认的口径。
- 相关 archive provenance。
- 项目规则和 user profile。

## candidate 的位置

`candidate` 不是独立层。

它只是 review 前的临时判定状态，表示“agent 认为这段材料可能应进入某个后续动作，但还没有经过用户审核，也没有确定实体落点”。

历史里的 `promote-candidates.md` 是 dry run 中的候选投影，不是长期资产层。

candidate 只能存在于 task working material 或 review surface 的 backing 中，不能成为 docwarden 的稳定输出层。

## v0 输出

- review surface：包含 lead 和 backing，给 sayori 审核本轮文档维护判断。
- reviewed route decisions：审核后确认的 promote / pick / log / transfer / no-op 分流。
- promote delta：经过 review 的主线基线变化。
- pick review item：需要进入 side 长期化的内容，但仍必须单独经过 pick review surface。
- drift notes：已确认口径与现有材料的偏差。
- capability gaps：本次运行暴露的 `ctx:` / `dw:` / `iso:` / `ym:` 缺口。
- cleanup recommendation：当前 task 是否归档、保留或拆分后续任务。

## 入口修正

`review` 不应被设计成主路径上的手动 skill 调用。

手动入口可以作为高级用法存在，但主路径应是任务完成、归档、提交或收口前，由 workflow 内部调度 review skill 进入 review phase。

## 暂不进入 v0

- 自动修改 `docs/`。
- 完整 HTML review system。
- 完整 docwarden plugin。
- 完整 semantic lint engine。
- 完整 contexta schema。
- 多项目文档治理。

这些不应消失，只是不作为第一条可运行链路的完成条件。
