---
status: active
workspace_status: working
created: 2026-06-04
updated: 2026-06-04
title: Docwarden V1 Skills CLI Dogfood
id: 28-docwarden-v1-skills-cli-dogfood
---

# Docwarden V1 Skills CLI Dogfood

## Context

当前 docwarden v0 已经具备最小 CLI workflow：

```text
init -> task create -> review --task -> promote / pick
```

但 docs 理论与实践文档指出，docwarden 难以继续 dogfood 的关键缺口不是更细的 review state machine，而是 docwarden 第一批可运行 skills / prompts / agent context 尚未以 Codex 可用形态稳定出现。

本 task 不接管 contexta 的完整 catalog / install / activation，也不展开 isomorph 语义引擎。当前目标是尽快让 docwarden v1 具备 repo-local Codex skills + CLI 的可运行形态，使后续任务能用这套流程 dogfood。

## Objective

Docwarden v1 repo-local workflow skills are the user-facing actions `review`, `promote`, and `pick`; contexta owns later namespace/plugin naming, and the `docwarden` CLI remains the hard-constraint writer.

## Boundary

- 可以修改 `apps/docwarden` CLI 与测试。
- 可以修改 `.agents/skills/` 下的 repo-local Codex workflow skills。
- 可以修改 `.docwarden/task/28-docwarden-v1-skills-cli-dogfood/` 工作材料。
- 默认不修改 `docs/`。
- 不实现 contexta 完整 catalog / install / activation。
- 不接管 isomorph / contexta 外层架构。
- 不把 prompt / workflow / profile 伪装成 Codex 不支持的裸 runtime surface。

## Next Entry

- `plan.md`
