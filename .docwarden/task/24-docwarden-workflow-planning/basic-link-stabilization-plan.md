---
status: draft
created: 2026-06-01
updated: 2026-06-01
owner: sayori
---

# Basic Link Stabilization Plan

本文件记录修正后的 docwarden 基本链路推进计划。

## 当前收口判断

先不走“一次做完 plan，再交给 symphony 推进”的路线。

当前优先目标是小步稳定 definition layer 到使用层 config 的基本链路。

核心链路：

```text
isomorph workflow structure
  -> .isomorph/mapping/docwarden/ workflow definition
  -> docwarden init
  -> .docwarden/ 基本框架与 runtime config
  -> dw:review 执行
  -> review surface
  -> user review
  -> promote / pick / log / cleanup
```

其中：

- `.isomorph/mapping/bootstrap/` 是 isomorph 自举。
- 旧 `.isomorph/mapping/docwarden/` 下的 user-context 示例应迁到 contexta 口径。
- 新 `.isomorph/mapping/docwarden/` 承接 docwarden workflow definition。
- `.docwarden/` 是 docwarden 使用层，由 `docwarden init` 创建。
- runtime config 应是 yaml 或其他机器友好的配置，不是 Markdown + frontmatter definition。
- `dw:review` 是执行单元，不是 definition 或 config 的唯一真相。

## 非目标

当前不做：

- 直接编辑 `docs/`。
- 直接把 definition 写进 `.docwarden/workflow/review.md`。
- 完整 workflow engine。
- 完整 `review-later` 机制。
- 完整 HTML review surface。
- symphony 端调度集成。

## 推进原则

- 先修正 mapping 层命名和 definition/use layer 边界。
- 每一步只产生一个可审核对象。
- definition layer 使用 Markdown + frontmatter。
- 使用层 config 由 `docwarden init` 创建和维护。
- 先用 `review-first` 跑通，保留 `review-later` 作为 runtime config mode。

## Loop 1: mapping 层纠偏

目标：确认当前 `.isomorph/mapping/docwarden/` 的历史命名问题和新层级。

最小问题：

- 旧 `.isomorph/mapping/docwarden/` 是否迁为 `.isomorph/mapping/contexta/`。
- 新 `.isomorph/mapping/docwarden/` 是否承接 docwarden workflow definition。
- 当前 user-context 示例是否作为 contexta mapping 示例保留。

产出：

- `mapping-layer-correction.md`

审核点：

- 是否正确表达 bootstrap / contexta / docwarden 三个 mapping 层。
- 是否没有把 docwarden 使用层 config 写进 definition layer。

## Loop 2: docwarden workflow definition draft

目标：在 task working material 中起草新的 docwarden workflow definition。

最小问题：

- `dw:review` workflow 的 state / move / transition 是什么。
- 这份 definition 将来落在 `.isomorph/mapping/docwarden/` 的哪个结构位置。
- 它如何复用 isomorph 的 workflow template。

产出：

- `docwarden-review-workflow-definition-draft.md`

审核点：

- 是否满足 workflow structure。
- 是否只是定义层，不混入 runtime config。

## Loop 3: docwarden init skeleton

目标：定义 `docwarden init` 应创建的使用层最小框架。

最小问题：

- `.docwarden/` 下需要哪些目录。
- runtime config 文件名和格式是什么。
- review surface 输出位置是什么。
- task / review / archive 如何最小衔接。

产出：

- `docwarden-init-skeleton-draft.md`

审核点：

- 是否能让真实项目开始使用。
- 是否没有把 mapping definition 复制进 runtime config。

## Loop 4: runtime config draft

目标：定义使用层配置的最小 schema。

最小问题：

- `review.mode` 如何表达。
- cleanup policy 如何表达。
- route targets 是否可配置。
- pending review marker 是否只为 `review-later` 保留。

产出：

- `runtime-config-draft.md`

审核点：

- 是否足够驱动 `dw:review`。
- 是否避免过早实现通用 workflow engine。

## Loop 5: dw:review skill contract

目标：定义 `dw:review` 作为执行单元的契约。

最小问题：

- skill 读取哪些输入。
- skill 如何读取 runtime config。
- skill 是否需要读取 mapping definition。
- skill 输出哪些 review surface 文件。
- 手动调用如何只作为补跑 / 高级用法。

产出：

- `dw-review-skill-contract.md`

审核点：

- skill 不拥有 definition 或 runtime config。
- skill 不绕过 user review。

## 第一优先

下一步先完成 Loop 1 的审核，然后进入 Loop 2。

理由：

- 当前最大风险是 mapping 层历史命名与 docwarden 使用层 config 混淆。
- 不先修正这个边界，后续会继续把定义写到错误落点。
