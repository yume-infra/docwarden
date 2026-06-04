---
name: ym-skill-improver
description: 当用户点名 skill-improver 并给出一个 target skill 或指出现有 skill 的
  trigger、读取策略、boundary、workflow 偏差时使用；把目标 skill 改成最小可验证 patch。不用于从零创建新 skill
  或普通 code review。
---

# Skill Improver

用这个 skill 接住用户对某个 target skill 的直接纠偏，把 target skill 改成下一次会更正确触发和读取的最小 patch。

## Core Constraint

本轮迭代默认执行五条约束：

1. Question every requirement：先问这次 friction 是否会在下一次真实调用中重复。
2. Delete any part or process you can：删除不影响下一次行为改善的解释、schema、流程和 polish。
3. Simplify and optimize：默认只改被点名的一个 target skill；如果 target 是本 skill，就只改本 skill。
4. Accelerate cycle time：先让下一次调用不再踩同一个坑。
5. Automate：只有同类 skill 改进反复发生时才新增脚本。

## Pressure

agent 容易在用户点名某个 skill 后，把反馈理解成普通聊天建议，而不是改 target skill 的触发面、读取顺序或边界。下一轮换 agent 或 compact 后，同一个过重读取、trigger 漂移或 boundary 混淆会再次发生。

当前典型场景：

- 为了继续一个 handoff 后的 loop，agent 同时读了 `ym-handoff` skill 本体和 handoff 文档。
- 用户指出下一轮应该优化成只读 handoff 文档，除非要创建、更新或判断 handoff boundary。
- 这不是普通总结问题，而是一个可复现的 skill 使用策略问题。

## Trigger

使用本 skill，当出现这些信号：

- 用户同时点名 `skill-improver` 和另一个 target skill。
- 用户连续点名 `skill-improver` 本身，表示本 skill 的定位或 workflow 需要自我改进。
- 用户明确指出某个 skill 的触发、读取、输出或验证过重。
- dogfood 中发现 agent 读了不该每次读的本体材料、reference 或生成文件。
- skill 的 positive trigger 与 exclusion boundary 导致误触发、漏触发或过度触发。
- compact / handoff / resume 后，恢复执行依赖了错误材料层级。
- 已有 skill 能跑，但真实使用显示下一轮会重复踩同一个判断坑。

不用于：

- 从零创建一个全新的 behavior skill；先用 `ym-harness-wire`。
- 只做普通代码 review 或文案润色。
- 没有可复现 failure 的个人偏好记录。
- 改 hard validation、CLI behavior 或 schema；那些走对应 CLI / script / code path。

## Workflow

1. 识别 target：
   - 用户点名了哪个 skill；
   - 如果用户给了 skill 正文，先使用这份正文做 review surface；
   - 如果用户连续点名本 skill，target 就是 `skill-improver` 自己。
2. 命名 patch intent：
   - 这次真实使用哪里慢、重、错或漂移；
   - 下一次最小改善是什么；
   - 不改善会重复造成什么损失。
3. 先删 scope：
   - 不重写整个 skill；
   - 不新增 docs；
   - 不创建跨 skill framework；
   - 不改 generated runtime copy。
4. 判断改哪里：
   - source skill trigger 不准：改 frontmatter `description` 和 `Trigger`。
   - 每次读取材料过重：改 `Workflow` 或新增 `Read Order`。
   - boundary 混淆：改 positive / negative boundary。
   - 验证漏掉真实路径：改 `Validation` 或 smoke command。
   - 只是一次临时执行状态：写 handoff / task log，不改 skill。
5. 写最小 patch：
   - source of truth 在 `.contexta/packs/ai-harness/skills/{skill-name}/SKILL.md`；
   - 如果改了 trigger 或 UI metadata，再重新生成 `agents/openai.yaml`；
   - 通过 `contexta export` 更新 `.agents/skills/ym-{skill-name}`。
6. 验证：
   - source skill quick validate；
   - repo-local runtime skill quick validate；
   - 如果 pack manifest 或 export surface 改了，刷新 `contexta assets`；
   - 必要时跑 plugin dry-run。
7. 报告一个 rough edge：
   - 本次修掉了什么重复 failure；
   - 下一轮真实使用还要观察什么。

## Read Order Rule

改进 skill 时按这个顺序读：

1. 用户消息里已经给出的 target skill 正文。
2. 需要写 patch 时，再读 source skill：

```text
.contexta/packs/ai-harness/skills/{skill-name}/SKILL.md
```

3. 只有这些情况才读 generated runtime copy：

- 检查 `contexta export` 是否漂移；
- runtime copy 是当前唯一可用 surface；
- 用户给出的路径就是 `.agents/skills/ym-*`，且需要解释 runtime 行为。

对于 handoff 类恢复场景：

- 继续已有 loop：先读最新 handoff 文档。
- compact 后恢复执行：不读 `ym-handoff` skill 本体。
- 创建或更新 handoff：读 `ym-handoff` skill 或其 source。
- 判断 handoff 是否被误用：读 `ym-handoff` skill。
- 只是按 handoff `Next Entry` 继续：只读 active handoff 文档。

## Boundary

- 本 skill 负责把 dogfood feedback 路由成 skill improvement。
- 具体 skill 创建仍走 `ym-harness-wire`。
- 具体 skill 质量判断仍走 `iso-skill-creator`。
- source edit 只改 `.contexta/packs/ai-harness/skills/**`。
- generated `.agents/skills/ym-*` 只由 `contexta export` 更新。
- 除非用户明确要求具体 docs edit，否则不改 `docs/`。

## Validation

```bash
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .contexta/packs/ai-harness/skills/skill-improver
rtk apps/contexta/dist/index.js --root . assets --json
rtk apps/contexta/dist/index.js --root . export codex skill:ym/skill-improver --target-dir . --force --json
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .agents/skills/ym-skill-improver
```
