---
name: harness-smoke
description: 创建或修改 AI harness skill、contexta pack、repo-local Codex skill、plugin export 或 workflow helper script 后使用；跑最小真实验证并报告可用命令和粗糙点。不替代大范围代码变更后的 full CI。
---

# Harness Smoke

用这个 skill 证明 harness 工具足够可用，能进入下一轮迭代。

## Core Constraint

本轮迭代默认执行五条约束：

1. Question every requirement：只验证首用必要 surface。
2. Delete any part or process you can：删除完整 CI matrix 和不相关检查。
3. Simplify and optimize：每个 changed surface 选一个最短真实 check。
4. Accelerate cycle time：先证明能加载、能导出、能调用。
5. Automate：smoke 命令重复后再合并成脚本。

写完文件不算 done；至少跑一个真实 load、validation 或 export path。

## Pressure

agent 容易写完文件就说 harness 完成。这个 skill 要求至少一条真实 smoke path。

## Workflow

1. 识别 changed surface：
   - source skill；
   - generated repo skill；
   - contexta catalog；
   - plugin export；
   - CLI 或 script。
2. 选择最快真实 check：
   - skill syntax：

```bash
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py "$SKILL_DIR"
```

   - contexta catalog：

```bash
rtk pnpm -C apps/contexta build
rtk apps/contexta/dist/index.js --root . assets --json
```

   - repo-skill export：

```bash
rtk apps/contexta/dist/index.js --root . export codex "skill:ym/skill-name" --target-dir . --force --json
```

   - plugin export dry run：

```bash
rtk apps/contexta/dist/index.js --root . export codex ai-harness --target-dir /tmp/contexta-smoke --dry-run --json
```

3. check 失败时，只修阻塞加载或调用的问题。
4. 报告：
   - 可用命令；
   - 验证命令；
   - changed files；
   - 后续要改善的 rough edge。

## Boundary

- 优先每个 changed surface 一个 smoke check，而不是完整 verification matrix。
- 只有实现代码大范围变动时才跑 full package tests。
- plugin dry-run 不能证明 generated repo skills 已存在。
- 不为了 smoke 结果改 `docs/`。
