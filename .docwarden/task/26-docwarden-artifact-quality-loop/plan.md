---
status: active
created: 2026-06-01
updated: 2026-06-01
owner: sayori
---

# Plan

## Step 1: 固化质量观察

目标：基于 task25 的 dogfood 产物，明确第一版不可接受的具体点。

验收：

- `quality-observations.md` 列出 review lead / backing / spec / wiki 的问题。
- 每个问题都能映射到后续实现改动。

## Step 2: 重写 review lead 生成语义

目标：`review --task` 生成的 `lead.md` 不再是泛化问题，而是围绕本轮 task 产生最小可审核判断。

验收：

- lead 明确本轮用户要判断什么。
- lead 区分 mainline、side material、缺失上下文。
- lead 不搬运长片段。

## Step 3: 重写 promote / pick 产物形态

目标：promote/pick 生成稳定层候选时，不再只是 raw excerpt。

验收：

- `promote --to spec` 产物像 agent-facing 执行规范。
- `promote --to guide` 产物像 user-facing 理解路径。
- `promote --to wiki` 与 `pick --to wiki` 产物像长期知识节点。
- 每个产物都保留来源 trace。

## Step 4: 增加质量 contract 测试

目标：用测试锁住基础质量，不只测文件存在。

验收：

- 测试覆盖 lead 中的具体判断字段。
- 测试覆盖 spec/wiki 产物不包含未整理的 frontmatter/raw markdown 搬运。
- 测试覆盖 promote/pick 仍只写 `.docwarden`。

## Step 5: 再次 dogfood

目标：对 task26 自己运行新链路。

验收：

- 生成新的 review artifact。
- 生成至少一个更像稳定文档的 spec/wiki 产物。
- task log 记录本轮结果。
