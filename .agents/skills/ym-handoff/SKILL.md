---
name: ym-handoff
description: 当需要在 compact 前创建或更新 handoff 文档、用户显式要求交接/暂停/transfer 时使用；compact
  后恢复已有 handoff 时不要触发，直接读 active handoff 文档。不用于普通总结、review artifact、promote 或
  pick。
---

# Handoff

用这个 skill 在 context 快被压缩前落地或更新执行交接面。compact 后恢复执行时，下一位 agent 只需要读 active handoff 文档，不应该为了继续 loop 再读本 skill 本体。

## Core Constraint

handoff 不是总结全文，也不是 review artifact。它只回答一个问题：

```text
下一位 agent 如何不重新推理、不丢口径地继续当前 loop？
```

继续执行本轮 ai-harness 五条约束：

1. Question every requirement：handoff 只保留恢复执行所需内容。
2. Delete any part or process you can：删除叙事、背景长文、已无用分支、聊天流水。
3. Simplify and optimize：用固定短模板承接状态。
4. Accelerate cycle time：compact 后第一步必须明确。
5. Automate：只有 handoff 频繁发生后才新增脚本或 CLI。

## Trigger

使用场景：

- 当前会话长时间工作，靠近 compact / context 阈值，需要先写 handoff。
- 已有 handoff 文档过期，需要更新后再继续。
- 用户要求交接、handoff、暂停、换 agent 接手或 thread transfer。
- 当前 loop 已有多轮 review / implementation / verification，丢失上下文会导致返工。
- 当前 worktree 有未提交 harness、skill、task 或验证状态，需要恢复执行。

不用于：

- compact 后按已有 active handoff 恢复执行；这时只读 handoff 文档。
- 普通任务完成总结。
- 已经可直接 final 的短任务。
- review / promote / pick 的替代品。
- 把聊天记录完整转存。

## Resume Rule

handoff 文档是 compact 后的恢复入口，本 skill 本体不是恢复入口。

compact / resume 后，如果已经有 active handoff 文档：

1. 读 active handoff 文档。
2. 执行 `Next Entry`。
3. 只有需要创建、更新、审查 handoff 边界或判断 handoff 被误用时，才读取本 skill。

## Landing

默认写入：

```text
.docwarden/handoff/{timestamp}-{slug}.md
```

如果 handoff 属于某个 active task，在文档里链接 task；不要把 handoff 混成 task truth。

如 `.docwarden/handoff/` 不存在，可以创建目录。不要写入 `docs/`。

## Document Shape

handoff 文档使用这个最小结构：

```markdown
# Handoff: {short-slug}

## Trigger
- 为什么需要 handoff。

## Current Objective
- 当前目标，一句话。

## Agreed Constraints
- 已和用户对齐的核心口径。
- 必须持续遵守的原则、边界、命名、禁止事项。

## Current State
- 已完成什么。
- 已写入哪些文件。
- 当前 git / worktree 状态摘要。

## Verification
- 已跑过的命令。
- 通过 / 失败结果。
- 明确哪些内容没有验证。

## Next Entry
- compact 后第一步做什么。
- 精确到一个 action 或一个最小问题。

## Open Questions
- 还没和用户完全一致的点。
- 没有就写 `none`。

## Do Not Do
- 禁止下一位 agent 重开的方向、误区、越界操作。
```

## Workflow

1. 先判断是否真的需要 handoff：
   - context 是否接近 compact；
   - 是否有未提交或未验证工作；
   - 下一位 agent 是否会因为缺少状态而重开推理。
2. 读取当前状态：
   - 用户最近确认的 lead / constraints；
   - active task 的 `index.md`、`plan.md`、`log.md`，如果存在；
   - `git status --short`；
   - 最近验证命令和结果。
3. 删除不必要内容：
   - 不写完整聊天流水；
   - 不写已废弃方案；
   - 不复制长文件；
   - 不把未确认判断写成事实。
4. 写 `.docwarden/handoff/{timestamp}-{slug}.md`。
5. final 里报告 handoff 路径和 `Next Entry`。

## Boundary

- 本 skill 负责 handoff 文档 judgment 和内容组织。
- 文件写入可以直接写 `.docwarden/handoff/**`，因为这是 compact recovery working material。
- task/review/promote/pick 的 deterministic state change 仍走 `docwarden` CLI。
- skill / plugin materialization 走 `contexta` CLI。
- semantic primitive / lint 判断归 `isomorph`。
- 除非用户明确要求具体 docs edit，否则不改 `docs/`。

## Validation

```bash
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .contexta/packs/ai-harness/skills/handoff
rtk apps/contexta/dist/index.js --root . export codex skill:ym/handoff --target-dir . --force --json
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .agents/skills/ym-handoff
```
