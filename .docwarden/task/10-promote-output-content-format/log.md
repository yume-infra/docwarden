---
status: draft
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# promote output content format 日志

## [2026-05-19] setup | 启动 promote 后内容格式实例设计

创建 `10-promote-output-content-format` task。

来源判断：

- `08-promote-pick-dry-run` 已产生并通过 promote candidates。
- `09-promote-pick-entity-landing` 已确认 promote 后实体落点。
- 当前缺口不是 pick 后 user context，也不是 review surface，而是 promote 后内容实体如何形成稳定格式实例。

当前任务：

- 使用 `08` 的 spec / guide / wiki candidates 作为实例来源。
- 先确认 promote output format 边界。
- 后续分别生成 spec module、guide page、wiki node 的格式实例。
- 不真实写入长期层，不修改 `.contexta/templates/`。

## [2026-05-19] loop-1 | 生成 review surface

sayori 确认这里应使用同一套 review surface 机制，组织最小 review 单元。

已创建 review artifact：

```text
.docwarden/review/promote-output-content-format/
```

本轮结构：

- `index.md`：review artifact 入口。
- `lead.md`：最小 user review 单元，只放待审核内容本体。
- `backing.md`：lead 的承载层，放来源、边界、纠偏和拆分判断。

当前等待 sayori review `lead.md`。

## [2026-05-19] loop-1 | promote output format 边界通过

sayori 确认理论边界成立，并要求继续输出候选内容。

已将：

- `promote-output-format-boundary.md` 标记为 accepted。
- `.docwarden/review/promote-output-content-format/` 下的 review artifact 标记为 accepted。

## [2026-05-19] loop-2-4 | 生成 promote output 格式实例候选

基于 `08-promote-pick-dry-run/promote-candidates.md` 生成三份格式实例候选：

- `spec-module-format-instance.md`
- `guide-page-format-instance.md`
- `wiki-node-format-instance.md`

当前只生成候选内容，不真实写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`，也不修改 `.contexta/templates/`。

## [2026-05-19] loop-2-5 | 候选内容收口并转向 contexta 约束

sayori 确认主要内容方向已经跑通，并指出关键纠偏：

- workflow 应该是单独的 architecture。
- workflow 不应该套用 policy 的结构。

当前判断：

- `spec-module-format-instance.md` 中的主要内容方向保留。
- 但 `Intent / Scope / Rules / Failure Handling` 结构更像 policy，不适合作为 workflow architecture 的最终结构。
- 这个问题属于 contexta 内容类型约束设计。

已创建 `contexta-format-handoff.md`。

已将本工作面标记为 closed。
