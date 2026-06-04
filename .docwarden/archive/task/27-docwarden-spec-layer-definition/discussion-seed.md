---
status: closed
created: 2026-06-01
updated: 2026-06-02
owner: sayori
---

# Discussion Seed

## Current Problem

task26 生成的 spec/wiki/review 产物形式上变得更结构化，但用户判断“全错”。

当前要接受这个判断：问题不在于再把模板写漂亮一点，而在于 `spec` 层还没有被定义清楚。

## Working Assumption

`spec` 不应该只是 `task material` 的摘要。

`spec` 需要成为 agent-facing 的稳定执行层，但它内部可能仍需要分层，否则任何 `promote --to spec` 都会把不同性质的内容混在一个文件里。

## Must Decide

- `spec` 层到底服务谁：agent、human maintainer，还是两者不同视图？
- `spec` 内部是否需要多种类型：workflow spec、artifact spec、command spec、policy spec、architecture spec。
- 哪些内容应该进入 `spec`，哪些应该留在 `guide/wiki/task/review`。
- `spec` 产物的最小单元是什么：一个规则、一个模块、一个 workflow、一个 artifact contract，还是别的。
- `promote --to spec` 在没有明确目标类型时应该报错、生成 review surface，还是创建待分类草案。

## Non-goals

- 不继续修 task26 的 CLI 产物模板。
- 不把 docs/ 作为写入目标。
- 不新增 candidates 层。
- 不改变 docwarden / contexta / isomorph 的边界。

## Return Path

本 task 给出可审核的 spec 分层定义后，回到 task26 修复 `promote --to spec` 的真实产物语义。
