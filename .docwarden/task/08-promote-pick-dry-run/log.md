---
status: draft
created: 2026-05-18
updated: 2026-05-18
owner: sayori
---

# promote / pick dry run 日志

## [2026-05-18] setup | 启动 dry run

创建 `08-promote-pick-dry-run` task。

本任务用于验证当前实践框架：

```text
task
  -> surface for promote
  -> user review
  -> promote mainline delta
  -> pick user-level compoundable assets
  -> delete/archive working
```

当前先生成 promote 前 review surface，不直接写入长期层。

## [2026-05-18] loop-1 | 修正 lead 形态

sayori 指出此前把 lead 写成流程命题，不是可交接文档。

纠偏：

- lead 必须是可交接的最小 user review 单元。
- 本次 dry run 的 lead 应该是一个文档，而不是一句 delta。
- review 问题不应询问“是否进入下一步”，而应要求 user 审查 lead 文档内容是否成立。
## [2026-05-18] loop-1 | 修正 review artifact 位置与命名

sayori 指出 review 文档没有放在正确位置，命名也不好。

纠偏：

- review artifact 不应放在 task 目录。
- review artifact 应放在 `.docwarden/review/`。
- 本轮 review artifact 目录为 `.docwarden/review/docwarden-review-workflow/`。
- review artifact 入口统一使用 `index.md`。
- task 08 只记录 dry run 推进与指向关系。

## [2026-05-18] loop-1 | 修正 backing 结构

sayori 指出 lead 大致正确，但其他内容仍有问题。

纠偏：

- review artifact 只保留 `lead + backing` 两层。
- lead 是可交接 baseline 文档。
- backing 不是泛泛来源列表，而是围绕 lead 组织来源覆盖、当前上下文、未纳入范围和拆分判断。
- 移除 `lead document`、`review readiness`、`review question` 等混乱层级。

## [2026-05-19] loop-1 | 拆分 review artifact 模块

sayori 确认应符合文档模块级别和单一职责理念。

当前纠偏：

- `index.md` 只作为 review artifact 入口，负责路由、交接和文件索引。
- `lead.md` 是真正的最小 user review 单元。
- `backing.md` 是被 `lead.md` 统摄的承载层。
- 不再把 lead 正文塞进 `index.md`。

## [2026-05-19] loop-1 | 改写 lead 可读性

sayori 指出方向正确，但可读性仍差。

当前纠偏：

- lead 不采用 agent-facing policy 写法。
- lead 面向 user，以读者模式组织。
- lead 作为单一职责文档模块，内部用审核点暴露可逐条判断的断言。
- 每个审核点都说明候选判断和 user 需要判断的问题。

## [2026-05-19] loop-1 | lead 最小形态通过

sayori 确认当前 `lead.md` 符合需求。

当前确认：

- `lead.md` 只放待审核内容本体。
- `lead.md` 是一个模块及其可审核断言。
- `lead.md` 不放解释性废话。
- `lead.md` 不放“本轮不审”。
- `lead.md` 不放 review 方式或教用户如何审核。
- 边界、来源和上下文应放在 `index.md` / `backing.md`。

## [2026-05-19] loop-2 | 生成 promote candidates

基于 `.docwarden/review/docwarden-review-workflow/lead.md` 生成 promote 候选。

当前只生成候选，不写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。

本轮候选暴露一个缺口：

- spec / guide / wiki 目前只有入口文件。
- 三个长期层的最小产物模板尚未定义。
- 因此当前只能验证投影方向，不能真实 apply。

## [2026-05-19] loop-2 | promote candidates 通过

sayori 确认 promote candidates 方向正确。

已将 `promote-candidates.md` 标记为 accepted。

下一步进入 Loop 3：pick candidates。

## [2026-05-19] loop-3 | 生成 pick candidates

基于本次 dry run 中 promote 未吸收的内容，生成 pick 候选。

当前只生成候选，不写入用户层资产。

## [2026-05-19] loop-3 | 纠正为 pick review artifact

sayori 指出 pick source 不限于原材料，对话上下文也是 source。

同时确认：

- pick 是动作，不是文档类型。
- pick 目标是用户层资产。
- 只要要长期化，就必须有 review surface。
- pick 不能由 agent 直接生成候选并长期化。

当前纠偏：

- 删除 `pick-candidates.md`。
- 创建 `.docwarden/review/review-lead-minimality/`。
- 用 `index.md` / `lead.md` / `backing.md` 组织 pick review artifact。
- 本轮 pick lead 审查 `review lead minimality` 是否值得作为用户层资产候选。

## [2026-05-19] loop-3 | 扩展 pick source

sayori 指出，最初 pick 应多拿信息，尤其是本轮对话中反复纠正 agent 错误的情况。

当前修正：

- pick source 不只包括 task material 或 promote residue。
- pick source 包括 current conversation context。
- pick source 包括 user 纠偏。
- pick source 包括 agent 错误模式。
- 已在 `review-lead-minimality/backing.md` 增加 correction trace。

## [2026-05-19] loop-3 | pick review 通过

sayori 确认 `review-lead-minimality` 这个 pick 写法可以。

已将 `.docwarden/review/review-lead-minimality/` 下的 review artifact 标记为 accepted。

下一步进入 Loop 4：dry run 结论。

## [2026-05-19] loop-4 | 生成 dry run 结论

已创建 `dry-run-conclusion.md`。

结论聚焦：

- dry run 跑通了哪些环节。
- 暴露了哪些 blocker。
- 下一步是否应先设计 spec / guide / wiki 最小产物模板。

## [2026-05-19] loop-3 | 生成 sayori working profile pick

sayori 指出本轮对话已经很长，可以初步给出用户画像。

当前新增 pick review artifact：

```text
.docwarden/review/sayori-working-profile/
```

该 artifact 用于审查 sayori working profile 是否值得作为用户层资产候选。

同时在 `dry-run-conclusion.md` 中补充：

- pick 最终承接层未定是缺口。
- 但未来必须存在用户层资产承接内容。
- accepted pick 不应停在 review artifact。

## [2026-05-19] loop-3 | sayori working profile pick 通过

sayori 确认 `sayori-working-profile` 这个 pick 合理。

已将 `.docwarden/review/sayori-working-profile/` 下的 review artifact 标记为 accepted。

## [2026-05-19] close | dry run 完成

sayori 确认本轮可以结束，并建议提交 git。

已将：

- `dry-run-conclusion.md` 标记为 accepted。
- `index.md` 的 `workspace_status` 标记为 closed。
- `plan.md` 标记为 accepted。

## [2026-05-19] follow-up | user profile 实体落到 docwarden

sayori 指出 user 层不是 policy 规范，并进一步纠正：contexta 只适合定义 user context 的内容格式，具体 user profile 实体应放在 docwarden。

当前确认：

- `profile.md` 属于 `.docwarden/user/`。
- 这是 docwarden 当前协作中的用户层实体资产。
- contexta 后续只应定义 user context 的内容格式或 template。
- 该实体不是 policy 层，也不是 docwarden 工作流。

已将已通过的 pick `sayori-working-profile` 写入：

```text
.docwarden/user/profile.md
```
