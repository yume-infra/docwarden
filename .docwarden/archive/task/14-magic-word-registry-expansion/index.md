---
status: accepted
workspace_status: archived
created: 2026-05-25
updated: 2026-05-26
owner: sayori
---

# magic word registry expansion

本 task 处理 magic-word registry 的扩充与分层。

当前 task 已归档。后续真实内容 dry run 靶子准备进入 `.docwarden/task/17-real-content-dry-run-target/`。

## 边界

- 本目录是对话产生的 task material。
- 本任务处理 `modules/magic-word/*.md` 是否扩充、如何命名、哪些 family 先落地。
- 本任务可以在用户确认后修改 `.contexta/`。
- 本任务不新增 `phase` concept。
- 本任务不把所有英文术语都纳入 magic-word。
- 本任务不修改 `docs/`。

## 来源基线

- `.contexta/mapping/bootstrap/modules/concept/magic-word.md`
- `.contexta/mapping/bootstrap/modules/magic-word/transition.md`
- `.contexta/mapping/bootstrap/modules/concept/metadata/kind.md`
- `.contexta/mapping/bootstrap/modules/policy/language.md`
- `.contexta/mapping/bootstrap/modules/policy/naming.md`
- `.contexta/mapping/bootstrap/modules/policy/link-resolution.md`
- `.contexta/mapping/bootstrap/relations/template-format-semantic-lint.md`
- `.docwarden/task/13-kind-signal-landing/`

## 归档判断

- `magic-word` 是 formatted md 中可被 semantic-lint 直接消费的控制性 token 或短表达。
- `concept/magic-word.md` 只定义 magic-word 和准入边界。
- 具体 magic-word family 进入 `modules/magic-word/*.md` registry。
- 当前已有 `transition.md` registry，维护 `0->1` 和 `1->2`。
- 第一批新增 `constraint-strength`、`designation-role`、`locator-marker`。
- 第二批新增 `section-heading`、`frontmatter-field`。
- `locator` 是机制，`locator-marker` 是该机制里的 magic-word family。
- `kind-value`、`signal-id`、`relation-verb` 延后。
- semantic output 需要进一步设计，暂不落地 registry。
- registry module 中 `Consumer` 和 `Source` 是 module 级别字段。
- registry token heading 下直接写作用说明，confidence 后续再建模。

## 内容

- `plan.md`：本任务 loop 计划。
- `log.md`：任务时间线记录。
- `registry-expansion-review.md`：Loop 1 magic-word registry 扩充审查材料。

## 下一步

本 task 已完成当前阶段并归档。
