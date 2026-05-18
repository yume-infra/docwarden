---
status: accepted
created: 2026-05-13
updated: 2026-05-13
owner: sayori
---

# review index

`.docwarden/review/` 是 review system 的 artifact 存放层。

review system 本身不是一个目录；本目录只保存 review system 产生的 review artifacts。

review artifact 可以是 HTML、JSON、Markdown 或未来其他形式。

HTML 是重要候选形态，因为它更适合承载复杂审查界面。

## 当前状态

当前已有 review artifacts：

- `docwarden-review-workflow/`：`08-promote-pick-dry-run` 的 review artifact，用于审查 docwarden review workflow 的主线基线表达。
- `review-lead-minimality/`：`08-promote-pick-dry-run` 的 pick review artifact，用于审查 review lead minimality 是否值得作为用户层资产候选。
- `sayori-working-profile/`：`08-promote-pick-dry-run` 的 pick review artifact，用于审查 sayori working profile 是否值得作为用户层资产候选。

review artifact 的最小形态仍在 dry run 中验证。
