---
name: ym-push-loop
description: 当用户已有明确决策方向，但复杂理论、task 工作面或多轮纠偏需要持续同步口径到完全一致时使用；用 relentless loop
  组织 draft、review、实现和验证。需求方向未定时先用 probe-loop。
---

# Push Loop

用这个 skill 在方向已经明确后，把复杂任务推进成一串小 loop，并 relentless 地逼近共识，直到和用户完全一致。

## Core Constraint

本轮迭代默认执行五条约束：

1. Question every requirement：每个 loop 先问它服务哪个可验证判断。
2. Delete any part or process you can：删除不能帮助达成共识或交付 baseline 的流程。
3. Simplify and optimize：每轮只推进一个可审查判断或一个可回滚 slice。
4. Accelerate cycle time：缩短从用户反馈到下一版 draft / implementation 的时间。
5. Automate：只有重复、易错、或能缩短下一轮时才自动化。

`relentless` 表示对齐上不松手：发现歧义、漂移、误解或用户纠偏时，继续追问、重写、验证，直到用户明确接受或给出新的方向。

## Precondition

进入本 skill 前，用户已经有基本决策方向：

- 要解决什么问题大致明确；
- 不同方案分支已经被选掉或暂时搁置；
- 当前需要的是同步口径、拆 slice、review、实现或验证。

如果用户还在“需求本身没整明白 / 方向没定 / 需要 agent 帮忙探索和协同决策”，先用 `probe-loop`。

## Source Pattern

本 skill 抽自早期 `.docwarden/task` 的 task 组织方式：

- `index.md` 做 lead file：记录 Context、Objective、Boundary、Current Judgment、Next Entry。
- `plan.md` 拆成 Loop：每个 Loop 有目标、要问的问题、草案产物、review 门槛、本轮不做。
- `log.md` 只记录时间线、用户纠偏、已接受判断、route 和验证结果。
- 每轮最多问三个问题，能问一个就问一个。
- 当前环节未被用户接受、拒绝、修改或暂停前，不进入下一环节。
- 需要实现时，先把模型 review 到足够一致，再做可回滚 baseline。
- 收口时判断 route：promote、pick、log-only、continue-task、transfer-lane。

## Workflow

1. 先压缩任务：
   - 一句话写出当前目标。
   - 确认方向已经明确；不明确则移交 `probe-loop`。
   - 写出本轮不做什么。
   - 写出下一次需要用户判断的最小单元。
2. 建立或读取 task working surface：
   - 如果已经有 `.docwarden/task`，先读 `index.md`、`plan.md`、`log.md`。
   - 如果只是当前对话推进，不为了形式创建 task。
   - 只有需要 durable working material 时才用 `docwarden task create`。
3. 运行 relentless loop：
   - capture：抓住用户原话、纠偏、目标和失败模式；
   - diagnose：指出当前误解或理论缺口；
   - model：给出最小候选判断；
   - review：让用户只审一个 lead；
   - route：决定 implement、revise、log-only、promote、pick 或 transfer；
   - implement：只做已通过 review 的 slice；
   - verify：跑最快真实检查；
   - loop：如果用户未明确接受，继续下一轮。
4. 每轮输出要短：
   - 当前判断；
   - 缺口；
   - 下一步；
   - 需要用户回答的一个问题，或直接执行的一个 slice。
5. 用户已经给出明确方向时，不再问宽泛确认；直接推进下一个可回滚 slice。

## Relentless Rules

- 不把“差不多”当成一致。
- 不把用户纠偏当成局部措辞问题；先判断是否暴露了理论边界或 workflow 边界。
- 不用长解释掩盖没对齐的核心判断。
- 不一次塞多个 lead 给用户审。
- 不因实现已经能跑就停止对齐；先交付 baseline，再继续让真实使用暴露差距。
- 如果连续两轮都在同一处卡住，降级成一个更小的问题。

## Task Material Shape

需要写 task material 时，优先保持这个最小结构：

```text
index.md
- Context
- Objective
- Boundary
- Current Judgment
- Next Entry

plan.md
- Loop 1
- Loop 2
- Loop 3
- 本轮不做

log.md
- 用户纠偏
- 已接受判断
- route
- 验证结果
```

## Boundary

- 本 skill 负责协作推进和 judgment loop，不负责 hard writes。
- 本 skill 不负责探索未成形需求；那是 `probe-loop`。
- task/review/promote/pick 写入走 `docwarden` CLI。
- skill / plugin materialization 走 `contexta` CLI。
- semantic primitive / lint 判断归 `isomorph`。
- 除非用户明确要求具体 docs edit，否则不改 `docs/`。
- 不为每个对话都创建 task；只有材料需要跨轮保存时才创建。

## Validation

```bash
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .contexta/packs/ai-harness/skills/push-loop
rtk apps/contexta/dist/index.js --root . export codex skill:ym/push-loop --target-dir . --force --json
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .agents/skills/ym-push-loop
```
