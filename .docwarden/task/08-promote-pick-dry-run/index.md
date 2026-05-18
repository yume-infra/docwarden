---
status: accepted
workspace_status: closed
created: 2026-05-18
updated: 2026-05-18
owner: sayori
---

# promote / pick dry run

本 task 目录用于对当前 review workflow 做一次最小 dry run。

## 边界

- 本目录是对话产生的 task material。
- 本任务已关闭。
- 本任务只做 dry run，不直接修改 `docs/`。
- 本任务先产出 promote 前的 review artifact，再根据 user review 生成 promote / pick 候选。
- 本任务不直接写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`，除非后续 user 明确确认进入真实 apply。

## 来源基线

- `.docwarden/task/05-review-input-design/`
- `.docwarden/task/06-review-surface-design/`
- `.docwarden/task/07-review-trace-design/`

## 当前判断

- 本次 dry run 的目标不是继续扩展理论，而是验证已形成的实践框架是否能跑通。
- 主流程 review surface 应发生在 promote 之前。
- 本次 promote surface 的 lead 应聚焦主线基线 delta。
- Loop 1 已确认：review artifact 拆为 `index.md` / `lead.md` / `backing.md`。
- Loop 1 已确认：`lead.md` 只放待审核内容本体，即一个模块及其可审核断言。
- Loop 2 已确认 promote candidates 方向，不真实写入长期层。
- Loop 3 已确认 pick review artifact。
- pick 也必须经过 review surface，不能由 agent 直接长期化。
- Loop 4 已确认 dry run 结论。

## 内容

- `plan.md`：本轮的小循环列表。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `promote-candidates.md`：Loop 2 promote 候选。
- `dry-run-conclusion.md`：Loop 4 dry run 结论。
- `.docwarden/review/docwarden-review-workflow/`：Loop 1 review artifact。
- `.docwarden/review/review-lead-minimality/`：Loop 3 pick review artifact。
- `.docwarden/review/sayori-working-profile/`：Loop 3 pick review artifact。

## 文件索引

- `index.md`：工作面 lead file，状态：accepted；同时通过 `workspace_status: closed` 表示本工作面已关闭。
- `plan.md`：本轮 loop 计划，状态：accepted。
- `log.md`：时间线记录，状态：draft；后续可继续追加。
- `promote-candidates.md`：Loop 2 promote 候选，状态：accepted。
- `dry-run-conclusion.md`：Loop 4 dry run 结论，状态：accepted。

关联 review artifacts：

- `.docwarden/review/docwarden-review-workflow/index.md`：review artifact 入口，状态：draft。
- `.docwarden/review/docwarden-review-workflow/lead.md`：本轮最小 user review 单元，状态：draft。
- `.docwarden/review/docwarden-review-workflow/backing.md`：lead 的承载层，状态：draft。
- `.docwarden/review/review-lead-minimality/index.md`：pick review artifact 入口，状态：accepted。
- `.docwarden/review/review-lead-minimality/lead.md`：用户层资产候选，状态：accepted。
- `.docwarden/review/review-lead-minimality/backing.md`：lead 的承载层，状态：accepted。
- `.docwarden/review/sayori-working-profile/index.md`：pick review artifact 入口，状态：accepted。
- `.docwarden/review/sayori-working-profile/lead.md`：用户层资产候选，状态：accepted。
- `.docwarden/review/sayori-working-profile/backing.md`：lead 的承载层，状态：accepted。

## 下一步

本轮 dry run 已完成并关闭。
