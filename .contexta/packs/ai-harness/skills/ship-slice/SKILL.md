---
name: ship-slice
description: 当用户要把零散 theory、想法或产品方向立刻转成粗糙实现时使用；做最小可执行 repo change，只记录必要工作材料，并用最快真实命令验证。不用于长期 architecture planning。
---

# Ship Slice

用这个 skill 从想法直接进入 first implementation，不等待完整 theory。

## Core Constraint

本轮迭代默认执行五条约束：

1. Question every requirement：先问需求是否服务今天的可用 baseline。
2. Delete any part or process you can：删除不影响首个可用版本的流程。
3. Simplify and optimize：用最少文件和最短路径改变真实行为。
4. Accelerate cycle time：优先跑最快真实反馈命令。
5. Automate：只自动化重复或易错的手工环节。

质量不作为第一门槛；能用后再迭代变好。

## Pressure

agent 容易在用户要 runnable baseline 时继续讨论原则。这个 skill 把对话压成可回滚实现 slice。

## Workflow

1. 先挑战目标：
   - 用户要的是质量，还是先可用？
   - 一个粗糙工具能否证明方向？
   - 现有 CLI 或 skill surface 能否完成？
2. 只选一个 execution surface：
   - repo-local Codex skill；
   - contexta pack asset；
   - existing CLI command；
   - 无 CLI 时才加 small script。
3. 只有需要 durable working material 时才创建 task：

```bash
rtk pnpm exec docwarden --root "$WORKSPACE_ROOT" task create --id "$TASK_ID" --title "$TASK_TITLE" --json
```

4. 做能改变真实 agent behavior 的最小编辑。
5. 跑最快相关检查：
   - skill: `rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py "$SKILL_DIR"`；
   - contexta: `rtk pnpm -C apps/contexta build`，再跑 `rtk apps/contexta/dist/index.js --root . assets --json`；
   - docwarden: `rtk pnpm -C apps/docwarden test`；
   - isomorph: `rtk pnpm -C apps/isomorph typecheck`。
6. 第一个 usable baseline 通过后停下，把质量迭代留给下一 slice。

## Done Shape

交付 slice 必须包含：

- 改了哪些文件；
- 如何使用的精确命令；
- 已跑的验证命令；
- 已知粗糙点。

## Boundary

- 首个工具存在前，不建设完整 framework。
- 不把长篇 rationale 写进 runtime skill。
- 除非用户明确要求具体 docs edit，否则不改 `docs/`。
- 用户已经选择速度优先时，不用 polish 阻塞。
