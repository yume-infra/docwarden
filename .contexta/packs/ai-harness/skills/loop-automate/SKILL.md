---
name: loop-automate
description: 当手工 repo workflow、harness validation step 或重复 agent action 需要变成 command、script、package script、hook 或 exported skill 时使用；只有循环重复或易错时才自动化。不自动化一次性 theory work。
---

# Loop Automate

用这个 skill 把重复手工 loop 变成更小的 command surface。

## Core Constraint

本轮迭代默认执行五条约束：

1. Question every requirement：先问这一步是否已经重复或易错。
2. Delete any part or process you can：能用一条命令交付就不自动化。
3. Simplify and optimize：选择最小 automation target。
4. Accelerate cycle time：自动化必须缩短下一轮验证。
5. Automate：只编码已经证明值得编码的 loop。

automation 是最后一步，不是第一步。

## Pressure

agent 要么太早自动化增加维护负担，要么永远不自动化重复易错步骤。这个 skill 把 automation 放在已证明的 loop 后面。

## Workflow

1. 质疑 automation request：
   - 这一步重复了吗？
   - 它是否脆弱到值得编码？
   - 现有 CLI 或 script 能否完成？
2. 如果一条 documented command 足够，就删除 automation。
3. 选择最小 automation target：
   - 组合现有命令用 package script；
   - deterministic state change 用 CLI command；
   - 脆弱文件或格式操作用 script；
   - 判断和 workflow steering 用 Codex skill；
   - 只有强制 lifecycle event 才用 hook。
4. 输入保持最少且显式。
5. 加一个 smoke command 证明 automation 能跑。
6. quality、naming、broad integration 不阻塞首用时，留到后续 slice。

## Command Preference

优先级如下：

```text
existing package script
existing CLI command
small script
new CLI command
Codex skill
hook
```

重复步骤偏 judgment-heavy 时选 Codex skill；偏 deterministic 时选 script 或 CLI。

## Boundary

- 不为 soft workflow preference 加 hook。
- 没有 consumer 前不加 schema。
- 一个 package script 能证明 loop 时，不加 cross-package automation。
- 除非用户明确要求具体 docs edit，否则不改 `docs/`。
