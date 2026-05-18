---
status: draft
created: 2026-05-13
updated: 2026-05-18
owner: sayori
---

# review input 设计日志

## [2026-05-13] setup | 创建 05 task

创建 05 task，初始用于讨论 review system 最小闭环。

初始判断：

- `04-task-review-spec-pipeline` 已确认 `task -> review system -> spec / guide / wiki`。
- 当前阻塞点是 review system 还没有最小闭环设计。
- 后续 dry run、HTML review surface、decision trace 和 spec / guide / wiki 分发都依赖 review system。

## [2026-05-13] split | 拆分 review system 核心设计

sayori 指出 review system 的输入、surface 和 trace 都是核心设计，不应该混在一个 task 中讨论。

已将原综合设计任务拆分为：

- `05-review-input-design`
- `06-review-surface-design`
- `07-review-trace-design`

当前先推进 `05-review-input-design`。

本任务继续使用慢推进循环。

## [2026-05-13] loop-1 | 起草 review input 边界

sayori 回答 Loop 1：

- review input 是 task 内的一组文件。
- 当前 agent 上下文也属于 review input，这一点需要在理论中显式补足。
- review 本身就是让尚未 review 的文件进入 review 状态，因此 input 不应只限制为 `accepted` 文件。
- user 可以指定 task 文件；如果 user 不指定，则 agent 可以挑选 input。

已创建 `review-input-boundary.md` 草案，等待 review。

## [2026-05-13] loop-1 | 修正文件状态模型

sayori 指出，`reviewing` 状态是否存在取决于 review system 机制设计。

当前判断：

- 03 设计 schema 时仍处于理论 v1。
- 现在理论已推进，文件状态模型需要随之变更。
- 文件状态先只保留 `draft` / `accepted`。
- review 状态后续作为独立机制再讨论设计。

已更新 `review-input-boundary.md`，移除将 `reviewing` 作为文件状态推进的表述。

## [2026-05-18] loop-1 | 修正 input 与 surface 边界

sayori 指出：

- `target / context / source` 分层不好，会让 input 设计滑向过重的证据系统。
- 将 input 直接组织成 lead / support 也是错误的，因为这把 surface 的职责提前塞进了 input。
- review input 应该只定义为 material + current agent context。

最终公式：

```text
review input = material + current agent context
```

`lead + backing` 是 review surface 对 input 的组织结果，不是 input 本体。

## [2026-05-18] loop-2 | 起草 input selection 规则

sayori 指出：

- user 如果能提供 material 范围，甚至已经表达 lead + backing 关系，大概率已经 review 过。
- 这可以视为短路径。
- user 未指定 input 时的 agent selection 规则才是更重要的主路径。

已创建 `review-input-selection.md` 草案，定义 user 未指定 input 时，agent 如何选择 material。

agent selection 选择的是 material，不是直接选择 lead / backing。surface 才负责从 material + context 中提炼 lead + backing。

## [2026-05-18] loop-2 | 修正无天然 lead 场景

sayori 指出，直接使用 multi-lead 不符合理论中的核心约束。

核心约束是：review 必须形成最小 user-review 单元，不能把并列材料结构原样交给 user。

当前修正迁移到 surface 侧：

- 如果 material 没有天然 lead，surface 不能直接进入 multi-lead review。
- agent 必须先提炼临时 review lead，例如主问题、主判断、最小待确认命题或 review surface 中的 lead section。
- 各领域材料作为 backing 围绕临时 review lead 服务。
- 如果 agent 无法提炼共同问题，说明 review 范围过大，应该拆分 review。

## [2026-05-18] loop-1/2 | input 边界 review 通过

sayori 确认前述纠偏信息需要持久化，并要求提交 git 后继续下一环节。

已将：

- `review-input-boundary.md`
- `review-input-selection.md`

标记为 accepted。

当前进入 Loop 3：input readiness。

## [2026-05-18] loop-3 | 修正为 lead rules

sayori 指出，Loop 3 实际上应该讨论 lead 规则。

纠偏：

- 不应该问 material 是否必须先有明确 review 目标。
- 因为 review input = material + current agent context。
- surface 才负责提炼 lead + backing。
- input readiness 的关键，是 surface 能否从 input 中提炼 lead。

已创建 `lead-rules.md` 草案。

## [2026-05-18] loop-3 | lead rules review 通过

sayori 确认：

- 如果 surface 无法生成 lead，说明当前这次 review 不能继续进入 user review。
- 不能把 materials 原样交给 user，让 user 自己组织判断链。
- 失败处理链应为：判断 input 过大、判断 input 不足、判断目标不清、仍不成立则延后 review。
- 任何 fallback 都不能跳过 lead。
- 如果不能回到 `material + context -> surface -> lead + backing`，就不进入 user review。

已将 `lead-rules.md` 标记为 accepted。

## [2026-05-18] close | 关闭 05

05 已完成：

- Loop 1：review input = material + current agent context。
- Loop 2：user 指定 input 是短路径；user 未指定 input 时，agent selection 选择 material。
- Loop 3：lead rules 已通过，surface 无法生成 lead 时不能进入 user review。

已将 `index.md` 的 `workspace_status` 更新为 `closed`。

下一步进入 `06-review-surface-design`。
