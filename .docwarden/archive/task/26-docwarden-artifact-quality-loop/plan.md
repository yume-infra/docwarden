---
status: closed
created: 2026-06-01
updated: 2026-06-04
owner: sayori
---

# Plan

## Resolved Blocker

Status: done

用户审核指出 task26 的真实产物全错。根因是 `spec` 层级划分和定义没有先稳定，导致 `promote --to spec` 无法知道要生成什么。

`.docwarden/task/27-docwarden-spec-layer-definition/` 已收口。当前 task 恢复执行，不再重新设计 spec 层级。

新的执行口径：

- `promote --to spec` 必须落到 `.docwarden/spec/<target>.md`。
- `<target>` 使用当前 monorepo 资产分组：`workspace/`、`apps/`、`packages/`、`harness/`。
- 目标 module 缺失时，用 `--kind` 创建最小 module；已存在时更新 module assertions。
- review lead 必须帮助用户判断具体落点、可接受 assertion、side material 和缺口。

## Step 1: 固化质量观察

Status: done

目标：基于 task25 的 dogfood 产物，明确第一版不可接受的具体点。

验收：

- `quality-observations.md` 列出 review lead / backing / spec / wiki 的问题。
- 每个问题都能映射到后续实现改动。

## Step 2: 重写 review lead 生成语义

Status: done

目标：`review --task` 生成的 `lead.md` 不再是泛化问题，而是围绕本轮 task 产生最小可审核判断。

验收：

- lead 明确本轮用户要判断什么。
- lead 区分 mainline、side material、缺失上下文。
- lead 给出推荐 spec target 或明确说明暂不能定位。
- lead 不搬运长片段。

## Step 3: 重写 promote / pick 产物形态

Status: done

目标：promote/pick 生成稳定层候选时，不再只是 raw excerpt。

验收：

- `promote --to spec --target <asset-group>/<module>` 更新具体 spec module assertion。
- `promote --to guide` 产物像 user-facing 理解路径。
- `promote --to wiki` 与 `pick --to wiki` 产物像长期知识节点。
- 每个产物都保留来源 trace。

收口判断：

- 当前 CLI 已将 spec promote 改为具体 module assertion 写入，并保留 source trace。
- guide/wiki/pick 产物已脱离 frontmatter/raw markdown 搬运的旧形态。
- task26 自身没有新的精确 stable assertion 或 side signal，因此不再机械写入新的 spec/wiki artifact。

## Step 4: 增加质量 contract 测试

Status: done

目标：用测试锁住基础质量，不只测文件存在。

验收：

- 测试覆盖 lead 中的具体判断字段。
- 测试覆盖 spec promote 必须有 target。
- 测试覆盖 spec module 输出不再生成 task-summary artifact。
- 测试覆盖 spec/wiki 产物不包含未整理的 frontmatter/raw markdown 搬运。
- 测试覆盖 promote/pick 仍只写 `.docwarden`。

收口判断：

- docwarden CLI 测试已覆盖 review lead 的具体判断字段、spec target 必填、spec module 输出、wiki pick 基础结构和 review gate。
- `pnpm test` 下 docwarden 测试通过。

## Step 5: 再次 dogfood

Status: done

目标：对 task26 自己运行新链路。

验收：

- 生成新的 review artifact。
- 生成或更新至少一个具体 `.docwarden/spec/<target>.md`。
- 生成至少一个更像长期知识节点的 wiki pick。
- task log 记录本轮结果。

收口判断：

- 已生成新的 task review artifact：`.docwarden/review/20260603101156487-task-26-docwarden-artifact-quality-loop/`。
- 用户确认本轮 dogfood 不为了旧验收机械生成 spec/wiki；没有精确 stable delta 时应选择 log-only / no-op。
- task log 已记录实现、review 产物和最终收口判断。
