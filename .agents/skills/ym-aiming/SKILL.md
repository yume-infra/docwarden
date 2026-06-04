---
name: ym-aiming
description: 当用户已经给出初始 aim，但后续对话、临时想法或新请求可能偏离最初目标时使用；提醒 aim drift
  并让用户选择继续、切换或暂存。不用于开启专注执行循环、替用户设 goal、或阻止用户主动改目标。
---

# Aiming

用这个 skill 帮用户看住最初的 aim：后续对话是否还在服务它，还是已经偏航。

## Core Constraint

本轮迭代默认执行五条约束：

1. Question every requirement：新请求先问它是否服务最初 aim。
2. Delete any part or process you can：不做长篇复盘，不创建 goal，不新增流程。
3. Simplify and optimize：只输出当前 drift 判断和一个最小选择。
4. Accelerate cycle time：发现偏航时立刻提醒，不等任务跑远。
5. Automate：只有 aim drift 反复发生时才抽成脚本、模板或 handoff 字段。

## Pressure

agent 容易顺着用户后续的新想法继续执行，忘记最初 aim。用户自己也可能在连续探索中偏离一开始真正想达成的结果。

`goal` 偏向开启专注执行循环；`aiming` 不开启循环。它只做软判断：当前动作是否还瞄准最初 aim。

## Trigger

使用本 skill，当出现这些信号：

- 用户先给了一个明确 aim，后续请求开始转向相邻但不同的目标。
- 当前对话出现多个好点子，但它们可能稀释原本要完成的 baseline。
- agent 准备执行新 slice 前，发现它不明显服务最初 aim。
- 用户说“突然想起来”“顺便”“再创建一个”“先做这个”，但当前 loop 还没收口。
- 长时间 `probe-loop` / `push-loop` 后，当前动作和最初目标之间的关系变弱。

不用于：

- 用户明确宣布切换目标；直接接受新 aim，并在必要时写 handoff / task log。
- 用户要求创建或管理 formal `goal`；那是 goal 工具或显式目标流程。
- 已经确定方向但需要同步口径；用 `push-loop`。
- 需求方向还未成形；用 `probe-loop`。
- 普通范围裁剪；用 `requirement-cut`。

## Workflow

1. 找到 active aim：
   - 优先用用户最初明确说出的目标；
   - 如果有 active handoff / task / conversation summary，用其中的 `Current Objective` 或 `Next Entry` 辅助；
   - 不把 agent 自己猜的目标当成事实。
2. 对照当前请求：
   - `aligned`：直接服务 active aim；
   - `adjacent`：有帮助，但可能拖慢 active aim；
   - `drift`：换了目标或开始做另一个方向；
   - `unknown`：关系不清，需要一个最小问题。
3. 删除无用判断：
   - 不评价用户想法好坏；
   - 不阻止目标切换；
   - 不展开多个备选计划。
4. 给出最小提醒：
   - 当前 aim 是什么；
   - 当前请求和 aim 的关系；
   - 推荐动作；
   - 需要用户选择的一个问题。
5. 路由：
   - `continue aim`：回到原 loop；
   - `switch aim`：承认新 aim，必要时写 handoff / task log；
   - `park`：把新想法暂存到当前工作材料或对话记录，继续原 aim；
   - `split`：如果两个 aim 都重要，建议分 task / thread / handoff，但不自动创建。

## Output Shape

保持短：

```text
Aim check:
- Active aim:
- Current request:
- Drift judgment:
- Recommended action:
- Question:
```

如果无需打断，只内化判断并继续；不要每轮都显式输出 aim check。

## Boundary

- 本 skill 只负责 soft aim drift 判断。
- 不调用 `create_goal`，除非用户明确要求创建 goal。
- 不把用户的新想法删掉；只判断继续、切换或暂存。
- 不改 `docs/`。
- 不新增 schema、CLI 或自动化。
- 如果偏航判断会影响持久材料，先写 handoff / task working material，不直接 promote / pick。

## Validation

```bash
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .contexta/packs/ai-harness/skills/aiming
rtk apps/contexta/dist/index.js --root . export codex skill:ym/aiming --target-dir . --force --json
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .agents/skills/ym-aiming
```
