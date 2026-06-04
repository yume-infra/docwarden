---
name: probe-loop
description: 当用户的需求、目标或设计方向还没想清楚，需要 agent 探索上下文、拆 decision tree、给 recommended answer 并协同收敛决策时使用；方向明确后移交 push-loop。不用于用户已有明确方向只需同步口径或直接实现的情况。
---

# Probe Loop

用这个 skill 把“我也没想清楚”推进到“我们决定先走这个方向”。

## Core Constraint

本轮迭代默认执行五条约束：

1. Question every requirement：先问当前不清楚的是目标、约束、方案还是优先级。
2. Delete any part or process you can：不展开完整 theory，不写大方案，不创建不必要 task。
3. Simplify and optimize：每轮只处理 decision tree 里最上游的一个分支。
4. Accelerate cycle time：每个问题都给 `recommended answer`，让用户修正而不是从零回答。
5. Automate：探索期不自动化；只有决策路径反复出现才抽成新 skill。

## Pressure

agent 容易在需求还没整明白时直接进入实现或 `push-loop`，结果同步的是错误方向。也容易把探索变成宽泛访谈，一次抛出很多问题，让用户承担全部判断。

这个 skill 要求 agent 主动探索、提出候选判断，并和用户一起收敛上游决策。

## Trigger

使用本 skill，当出现这些信号：

- 用户说想法还散、方向没定、需求没整明白。
- 用户需要 agent 帮忙探索问题、拆设计分支或协同决策。
- 当前任务存在多个互相依赖的方案分支，最上游决策还没选。
- 用户要求 stress-test plan / design，但真正缺的是先决定走哪条路。
- agent 无法判断该进入实现、`push-loop`、task、promote 还是 log-only。

不用于：

- 用户已经明确方向，只需要和 agent 同步口径；用 `push-loop`。
- 用户已经给出明确可执行 slice；直接实现或用 `ship-slice`。
- 需求太大但方向明确，只需要删 scope；用 `requirement-cut`。
- 普通 code review、bug fix 或验证。

## Workflow

1. 压缩未知：
   - 当前一句话目标是什么；
   - 哪个判断还没定；
   - 本轮不讨论什么。
2. 探索可查事实：
   - 如果问题能通过 repo、代码、已有 task、handoff 或用户上下文回答，先查；
   - 不把可查事实变成用户问题。
3. 拆最小 `decision tree`：
   - 写出 2-3 个候选分支；
   - 标出最上游依赖；
   - 删除当前不影响首轮方向的分支。
4. 问一个问题：
   - 默认只问一个；
   - 问题必须指向最上游决策；
   - 附带 `recommended answer`；
   - 说明如果采用推荐答案，下一步会进入哪个 workflow。
5. 接住用户反馈：
   - 用户接受：记录 chosen direction，进入 exit；
   - 用户修正：更新 decision tree，只问下一个最小问题；
   - 用户否定方向：降级成更小的上游判断。
6. Exit：
   - 输出 `Decision Summary`：目标、选择、理由、暂不做、下一步；
   - 方向已明确后移交 `push-loop`；
   - 如果已经能直接实现，移交 `ship-slice`。

## Output Shape

每轮输出保持短：

```text
当前未知：
候选分支：
我的 recommended answer：
需要你判断的问题：
```

收敛时输出：

```text
Decision Summary
- Goal:
- Chosen direction:
- Why:
- Not doing:
- Next workflow:
```

## Boundary

- 本 skill 负责探索和协同决策，不负责长期对齐、实现或验证。
- `probe-loop` 在 `push-loop` 之前；`push-loop` 在方向明确之后。
- 不创建 task，除非探索结果需要跨轮保存。
- 不改 `docs/`。
- 不把未确认推荐答案写成项目事实。
- 不为了探索新增 schema、CLI、script 或 automation。

## Validation

```bash
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .contexta/packs/ai-harness/skills/probe-loop
rtk apps/contexta/dist/index.js --root . export codex skill:ym/probe-loop --target-dir . --force --json
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .agents/skills/ym-probe-loop
```
