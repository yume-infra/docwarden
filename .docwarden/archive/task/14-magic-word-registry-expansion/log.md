---
status: draft
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# magic word registry expansion log

## [2026-05-25] task-started | 建立 magic-word registry 扩充任务

task 13 收口后，sayori 提出：magic words 后续会持续扩张，是否需要继续扩充或拆出。

当前判断：

- 这已经超出 task 13 的 kind / signal landing 边界。
- 应建立独立 task 处理 magic-word registry expansion。
- 下一步先做 review，而不是直接批量新增 registry。

已生成：

- `index.md`
- `plan.md`
- `log.md`
- `registry-expansion-review.md`

## [2026-05-25] loop-1-accepted | 落地第一批 magic-word registry

sayori 确认可以落地第一批 magic-word registry，并确认 locator 的分层判断：

- `locator` 是机制。
- `locator-marker` 是该机制里的 magic-word family。

已落地：

- `.contexta/mapping/bootstrap/modules/magic-word/constraint-strength.md`
- `.contexta/mapping/bootstrap/modules/magic-word/designation-role.md`
- `.contexta/mapping/bootstrap/modules/magic-word/locator-marker.md`

本轮延后：

- `kind-value`
- `signal-id`
- `relation-verb`

## [2026-05-25] loop-1-corrected | 修正 registry schema 与命名

sayori 指出第一版 registry 有两个问题：

- `Consumer` 和 `Source` 应是 module 级别字段，不应在每个 token 下重复。
- `Registry` 不需要作为二级标题，registry module 应直接讲自己的内容。
- `policy-modal` 命名不好。

已修正：

- 将 `Consumer` / `Source` 上移为 module 级别字段。
- 删除 registry files 中的 `## Registry` 二级标题。
- 将 `policy-modal` 重命名为 `constraint-strength`。

## [2026-05-26] loop-2-corrected | 收窄 registry token body

sayori 指出：在 magic-word registry 中区分 `Reading Role` 和 `Confidence Role` 太重，继续保留 `Role` 字段标签也没有必要。

当前决策：

- 每个 token heading 下直接写作用说明。
- confidence 是后续 semantic-lint / confidence 层的内容。
- magic-word registry 不提前散落置信度建模。

已修正：

- 删除所有 registry token 下的 `Reading Role`、`Confidence Role` 和 `Role` 字段标签。
- `section-heading` registry 不再记录 `Role` heading。

## [2026-05-25] loop-2-accepted | 落地 section heading 与 frontmatter field registry

sayori 确认先引入 `section-heading` 和 `frontmatter-field`，并指出 semantic output 相关内容需要更多设计，因为需要界定 signal 和其他内容的关系与建模。

已落地：

- `.contexta/mapping/bootstrap/modules/magic-word/section-heading.md`
- `.contexta/mapping/bootstrap/modules/magic-word/frontmatter-field.md`

当前判断：

- `section-heading` 是必要 magic-word family，因为 heading 会影响 module surface 读取和 semantic-lint 消费。
- `frontmatter-field` 是必要 magic-word family，因为 frontmatter field 是 md module 的结构化读取入口。
- semantic output 暂不落地 registry，后续单独设计。
