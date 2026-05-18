---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
---

# promote / pick dry run 计划

本轮目标是对已形成的 review workflow 做一次最小 dry run。

本任务只在 `.docwarden/task/08-promote-pick-dry-run/` 中推进，不直接修改 `docs/`，不直接写入长期层。

## Loop 1：surface for promote

状态：accepted。

目标：为本次 promote 生成一个单 lead review artifact，其中 lead 必须是可交接的文档形态。

草案产物：

- `.docwarden/review/docwarden-review-workflow/index.md`
- `.docwarden/review/docwarden-review-workflow/lead.md`
- `.docwarden/review/docwarden-review-workflow/backing.md`

review 门槛：

- sayori review lead 文档内容，并确认它是否可以作为本次 dry run 的主线基线表达。
- sayori 确认 `lead.md` 的最小形态：只放待审核内容本体。

## Loop 2：promote candidates

状态：accepted。

目标：基于已通过 review 的 lead，生成面向 `spec / guide / wiki` 的 promote 候选，但不真实写入长期层。

草案产物：

- `promote-candidates.md`

review 门槛：

- sayori 确认 promote 候选方向。

## Loop 3：pick review surface

状态：accepted。

目标：在 promote 候选之后，为一个用户层资产候选生成 pick review artifact。

草案产物：

- `.docwarden/review/review-lead-minimality/index.md`
- `.docwarden/review/review-lead-minimality/lead.md`
- `.docwarden/review/review-lead-minimality/backing.md`

review 门槛：

- sayori 确认该用户层资产候选是否值得 pick。

## Loop 4：dry run 结论

状态：accepted。

目标：总结 dry run 暴露出的 schema / config / workflow 缺口。

草案产物：

- `dry-run-conclusion.md`

review 门槛：

- sayori 确认 dry run 下一步。

## 本轮不做

- 修改 `docs/`。
- 直接写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 实现真实 CLI。
- 设计完整 renderer config。
- 执行 task cleanup。
