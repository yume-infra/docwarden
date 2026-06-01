---
status: closed
created: 2026-05-31
updated: 2026-06-01
owner: sayori
---

# Plan

> 本 plan 已关闭。后续实现入口转入 `.docwarden/task/25-docwarden-v0-dogfood-workflow/`。

## Loop 1: 定位

确认 docwarden v0 到底服务哪类文档维护场景、它和普通“写文档 agent”的差异，以及它只是完整 capability 生态中的哪一条主链路。

## Loop 2: 工作流边界

确认一次 docwarden run 的输入、输出、状态记录、人工审核点和失败条件。

## Loop 3: 能力拆分

把目标拆成第一批跨 namespace、跨 artifact kind 的 capability，明确哪些由 contexta 分发，哪些由 symphony 调度，哪些依赖 isomorph。

## Loop 4: 最小闭环

定义一个可被 `symphony-ts` 调度执行的 docwarden v0 任务，包含完成判据和回流信号。

## Loop 5: 后续扩展

在 v0 闭环成立后，再讨论更复杂的多文档同步、长期记忆、规范提升和文档治理。
