---
name: ym-requirement-cut
description: 当需求、计划、workflow 或工具想法过宽、过理论、流程过重时使用；先质疑、删除、简化，再压成最小可执行 slice。不用于
  slice 已清楚后的普通 code review 或验证。
---

# Requirement Cut

当请求仍然像 theory、framework、完整流程或“很多工具”时，先用这个 skill 做第一刀。

## Core Constraint

本轮迭代默认执行五条约束：

1. Question every requirement：每个需求都要问“今天证明它有用需要什么”。
2. Delete any part or process you can：先删流程、schema、review、命名、polish。
3. Simplify and optimize：只保留一个 target surface、一个文件组、一个验证命令。
4. Accelerate cycle time：选择仓库里最快的真实反馈回路。
5. Automate：只自动化已经重复或易错的步骤。

如果“完整理论”和“可用 baseline”冲突，先交付可用 baseline。

## Pressure

agent 容易接受每个需求、保留太多流程，把粗糙想法做成大设计。这个 skill 强制先删到最小。

## Workflow

1. Restate the requested outcome in one sentence.
2. Question every requirement：
   - 今天什么结果能证明它有用？
   - 哪个要求只是惯性假设？
   - 哪个要求太早保护质量？
3. Delete first：
   - 用户没要求 docs 时，删除 docs-only 产物；
   - 删除首次使用不需要的 schema、命名体系、review、migration path、polish；
   - 删除不能改变下一次 agent 行动的工具。
4. 把剩余 slice 简化成：
   - 一个 target surface；
   - 一个可回滚文件组；
   - 一个能证明可用的命令或用户动作。
5. 用仓库已有最快验证回路加速 cycle time。
6. 只自动化重复或易错步骤；未重复的步骤只给命令。

## Output

编辑前先输出这个形状：

```text
Cut:
- 保留:
- 删除:
- 最小 slice:
- 首次验证:
- 现在自动化:
```

如果最小 slice 已经清楚，同一轮直接执行，不问宽泛确认。

## Boundary

- 本 skill 只裁剪范围，不负责 deterministic writes。
- task/review/promote/pick 写入走 `docwarden` CLI。
- Codex 支持的 skill/plugin export 走 `contexta` CLI。
- 新增脚本前先用现有 package scripts。
- 除非用户明确要求具体 docs edit，否则不改 `docs/`。
