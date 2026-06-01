---
status: active
created: 2026-06-01
updated: 2026-06-01
owner: sayori
---

# Quality Observations

## Source

本文件来自 task25 第一轮 dogfood 产物：

- `.docwarden/review/20260601071342869-task-25-docwarden-v0-dogfood-workflow/lead.md`
- `.docwarden/spec/25-docwarden-v0-dogfood-workflow-spec-20260601071345854.md`
- `.docwarden/wiki/25-docwarden-v0-dogfood-workflow-wiki-pick-20260601071349850.md`

## Review Lead 问题

- lead 只提出泛化问题，无法让用户直接判断本轮应该 promote、pick、补上下文还是 no-op。
- lead 没有从 task material 中提炼具体分歧、风险和决策点。
- lead 搬运片段过多，review surface 仍然像摘要，不像最小审查面。

## Spec 产物问题

- spec artifact 只是把 task index/plan 转成 bullet，仍包含 frontmatter、代码围栏碎片和原始任务描述。
- 产物没有形成 agent-facing 执行规范。
- 产物没有明确哪些内容已经稳定、哪些只是来源 trace。

## Wiki Pick 产物问题

- wiki pick 仍是 raw snippet，不是可长期复用的知识节点。
- pick 没有说明为什么该内容是 side material，也没有记录触发 signal。
- 产物没有形成概念、判断、来源、适用边界。

## Workflow 问题

- promote/pick 当前只要求 task 存在，不要求 review artifact 或用户确认。
- task index 追加策略会产生重复的 `## 当前 active task` 标题。
- 当前测试主要验证文件存在，还没有验证产物语义质量。

## Next

task26 应先修质量链路，不继续扩命令面。
