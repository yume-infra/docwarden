---
name: ym-harness-wire
description: 当需要把 agent behavior、workflow shortcut 或粗糙 prompt pattern 接成
  repo-local Codex skill 或 contexta 分发的 AI harness 工具时使用；优先走现有 contexta export 和
  skill validation。不用于普通 prose prompt 或 unsupported runtime surface。
---

# Harness Wire

用这个 skill 把 AI harness behavior 物化进仓库，让后续 agent 可以直接调用。

## Core Constraint

本轮迭代默认执行五条约束：

1. Question every requirement：确认这个 behavior 是否真会改变下一次 agent 行动。
2. Delete any part or process you can：删除 plugin、marketplace、hook、schema 等非首用内容。
3. Simplify and optimize：source skill 先可用，复杂资源后补。
4. Accelerate cycle time：写 source 后立刻 validate/export。
5. Automate：只在导出或校验重复时再加脚本。

source of truth 先放 `.contexta/packs`，runtime output 由 `contexta export` 生成。

## Pressure

agent 容易把有用 behavior 留在对话里，或直接手写 generated runtime folder。这个 skill 要求先有 contexta source，再导出。

## Workflow

1. 命名 behavior intervention：
   - 它防止哪种重复 agent failure；
   - 什么时候触发；
   - 什么时候不触发。
2. 删除不是 every-use guidance 的内容。
3. 把 source skill 放到 contexta pack：

```text
.contexta/packs/ai-harness/skills/skill-name/SKILL.md
```

4. `SKILL.md` 只保留：
   - pressure；
   - workflow；
   - boundary；
   - validation command。
5. `SKILL.md` 存在后再生成可选 OpenAI UI metadata：

```bash
rtk python3 .agents/skills/iso-skill-creator/scripts/generate_openai_yaml.py "$SOURCE_SKILL_DIR" --interface "short_description=Short useful description"
```

6. 重新 build contexta 并刷新 assets：

```bash
rtk pnpm -C apps/contexta build
rtk apps/contexta/dist/index.js --root . assets --json
```

7. 如果要立刻可用，导出为 repo skill：

```bash
rtk apps/contexta/dist/index.js --root . export codex "skill:ym/skill-name" --target-dir . --force --json
```

## Boundary

- source 属于 `.contexta/packs`；generated repo skill 属于 `.agents/skills`。
- 除非 `contexta export` 表达不了，否则不手改 `.agents/skills/ym-*`。
- 不导出 unsupported runtime material。
- 首次使用不需要时，不加 plugin、marketplace、hook 或 automation surface。
