---
status: active
created: 2026-06-04
updated: 2026-06-04
owner: sayori
---

# Plan

## Step 1: 对齐 docs 理论与现状

Status: done

目标：从 docs 的 docwarden 理论和 AI infra 实践中确认 v1 当前最短路径。

验收：

- 明确为什么下一步是 v1 skills + CLI dogfood，而不是先细化 decision trace。
- 明确当前 lane 能做什么、不能做什么。

结论：

- docs 当前口径要求先让 docwarden dogfood 所需的 skills / prompts / agents 跑起来。
- 本 lane 只实现 repo-local docwarden runtime skills 与 CLI 使用路径，不接管 contexta catalog / install / activation。

## Step 2: 梳理现有 repo-local skills

Status: done

目标：确认 `.agents/skills/` 下当前已有 docwarden workflow 能力、缺口和 CLI 对接方式。

验收：

- 列出已有 docwarden skills。
- 找到最小需要补齐的 v1 skill 行为。

结论：

- repo-local workflow skill 使用正常动作命名：`review`、`promote`、`pick`。
- `review` 承接文档维护 review workflow。
- `promote` 承接主线 stable 写入判断。
- `pick` 承接 side signal / 用户层资产判断。

## Step 3: 实现最小 skills + CLI 形态

Status: done

目标：让 Codex 能通过 repo-local skills 使用 docwarden CLI 主链路。

验收：

- skill 文档能直接指向可执行 CLI 流程。
- CLI 提供必要的 v1 dogfood 入口或输出，避免用户手写内部路径。
- 保持硬约束由 CLI 校验，软判断由 skill 承接。

结论：

- `review` 已补齐最小 review workflow。
- `promote` 承接 reviewed task material 的主线 stable 写入判断。
- `pick` 已改用 repo-local `rtk pnpm exec docwarden` CLI 入口。
- 当前 CLI 已通过 root package bin 暴露，不新增命令面。

## Step 4: 验证

Status: done

目标：验证 docwarden package 与 repo-local skill 形态可用。

验收：

- `apps/docwarden` typecheck / build / tests / smoke 通过。
- 新 skill 形态有最小 dogfood 记录。

结果：

- `review` / `promote` / `pick` 均通过 quick_validate。
- `apps/docwarden` typecheck / build / tests / smoke 通过。
