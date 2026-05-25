---
status: draft
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# magic word registry expansion 计划

## Loop 1：registry expansion review

状态：accepted。

目标：判断当前是否应该扩充 `modules/magic-word/`，以及第一批应该拆出哪些 magic-word family。

当前候选：

- 现在应该扩充，但不应该一次性把所有候选都落地。
- 第一轮应先建立准入标准和优先级。
- 当前最适合优先拆出的 family 是 `constraint-strength`、`designation-role`、`locator-marker`。
- `kind-value`、`signal-id`、`relation-verb` 暂时延后，避免重复已有 source 或提前冻结未稳定词表。

当前产物：

- `registry-expansion-review.md`

当前结果：

- 已新增 `.contexta/mapping/bootstrap/modules/magic-word/constraint-strength.md`。
- 已新增 `.contexta/mapping/bootstrap/modules/magic-word/designation-role.md`。
- 已新增 `.contexta/mapping/bootstrap/modules/magic-word/locator-marker.md`。
- 已确认 `locator` 是机制，`locator-marker` 是该机制里的 magic-word family。
- 已确认 `Consumer` 和 `Source` 是 registry module 级别字段。
- 已确认不使用 `Registry` 作为二级标题。
- 已确认每个 token heading 下直接写作用说明，不保留 `Role` / `Reading Role` / `Confidence Role` 字段标签。
- `kind-value`、`signal-id`、`relation-verb` 延后。

## Loop 2：section heading / frontmatter field registry

状态：accepted。

目标：补充两个已确认必要的 magic-word family。

当前结果：

- 已新增 `.contexta/mapping/bootstrap/modules/magic-word/section-heading.md`。
- 已新增 `.contexta/mapping/bootstrap/modules/magic-word/frontmatter-field.md`。
- 已确认 `section-heading` 用于稳定 module surface 的读取。
- 已确认 `frontmatter-field` 用于稳定 frontmatter 结构化读取入口。
- 已确认 semantic output 相关内容需要进一步设计，暂不落地。

## 当前不做

- 不新增 `phase` concept。
- 不把所有英文术语都纳入 magic-word。
- 不一次性创建所有 registry。
- 不落地 semantic output registry。
- 不修改 `docs/`。
