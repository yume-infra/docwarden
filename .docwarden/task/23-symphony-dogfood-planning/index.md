---
status: active
workspace_status: working
created: 2026-05-31
updated: 2026-05-31
owner: sayori
---

# Symphony Dogfood Planning

本 task 记录用 `/Users/sayori/Desktop/symphony-ts` 驱动本仓库迭代的规划工作。

## 背景

当前仓库已经重新拆清三层：

- `contexta`：prompt / skill / agent / workflow 的分发与激活基础设施。
- `docwarden`：文档维护 workflow。
- `isomorph`：semantic primitive engine。

当前对话确认：`symphony-ts` 不用于承载或迁移 contexta 本体，而是作为外部运行和规划 runtime，负责调度本仓库的后续迭代，并让两边同时 dogfood。

## 目标

规划一个可执行的双向 dogfood 回路：

```text
symphony-ts
  -> 调度 docwarden 仓库里的 contexta / docwarden / isomorph 工作
  -> 启动 Codex agent 执行具体任务
  -> 暴露运行时缺口

contexta
  -> 分发 ym: / ctx: / dw: / iso: capabilities
  -> 准备 symphony 启动 agent 所需的 skills / prompts / workflow assets
  -> 反向服务 symphony 的运行环境
```

## 边界

- 本 task 只规划整体目标、阶段、能力拆分和下一批任务。
- 执行层由 `symphony-ts` 后续运行承接。
- 本 task 不迁移 contexta 到 symphony-ts。
- 本 task 不设计完整 contexta schema。
- 本 task 不修改 `docs/`。

## 当前判断

- `symphony-ts` 是运行/规划层，不是 contexta 的实现层。
- contexta 当前的最小 dogfood 起点是 `ym:write-skill -> Codex skill`。
- 下一阶段应围绕 “由 symphony 调度 contexta 后续 capability 建设” 来拆任务。
- 任务拆分应优先服务可运行闭环，而不是理论完备。

## 后续承接

本 task 的直接产出应包括：

- 总目标定义。
- 阶段路线图。
- 第一批交给 symphony-ts 执行的任务清单。
- 每个任务的完成判据和风险点。
