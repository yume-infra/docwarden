---
status: closed
created: 2026-05-31
updated: 2026-06-01
owner: sayori
---

# Log

## 2026-05-31

- sayori 通过上一轮关于 `symphony-ts` dogfood 方向的规划。
- 新建本 task，用于逐步讨论 docwarden 自身需要实现什么。
- 本 task 应直接服务于上一个 task 实现后的内容：当 symphony 能调度本仓库迭代时，docwarden 应成为可运行、可审核、可反馈的 workflow。
- sayori 纠正：不能只关注 `dw:` skills 或 post-task review 主链路；后续会有多 namespace、多 artifact kind 的 capability。
- 新增 `capability-map.md`，将规划修正为 namespace × artifact kind 的能力地图。
- sayori 继续纠正：需要更清楚区分 contexta 和 isomorph 的边界。
- 修正 `capability-map.md`：artifact kind 是 contexta 可分发的载体形态，不是 contexta 语义所有权；semantic primitive / lint / locator / signal / diagnostic 归 isomorph。
- sayori 确认关键修正点没问题，要求继续推进。
- 新增 `docwarden-goal-surface.md`，先定义 docwarden 的目标面和 v0 最小纵切。
- sayori 纠正：需要明确 `candidates` 层是什么。
- 修正 `docwarden-goal-surface.md`：candidate 不是独立层，只是 review 前临时判定状态；v0 输出改为 review surface、reviewed route decisions、promote delta、pick review item 等。
- sayori 提醒：主链路以前已经决定过一次，应关注 archive 判断。
- 回看 task 04-10 accepted/closed 材料，新增 `archive-mainline-decisions.md`，确认 v0 应实现已接受主链路，而不是重新设计主链路。
- sayori 纠正：主入口不要叫复杂名字，叫 `review`；手动触发 review skill 只能是高级用法，不应是主用法。
- 新增 `review-user-flow.md`，将主路径修正为 task execution 收口时自动进入 review phase。
- sayori 进一步修正：这不代表不设计 review skill；v0 可以按照 skill 为主的链路设计，只是由流程内部调度，而不是要求用户手动调用。
- 修正 `review-user-flow.md`：`dw:review` v0 可以主要物料化为 Codex skill，作为 workflow 内部调度单元。
- sayori 提醒：workflow 一直强调是 config maintain。
- 新增 `config-maintained-workflow.md`，确认 `dw:review` skill 是 workflow config 的执行载体，不是 workflow 本体。
- sayori 补充：当前流程体现的是 `review-first`，另有 `review-later` 路径；review mode 是 workflow config 的选项。
- 新增 `review-mode-options.md`，记录 `review-first` / `review-later`，并初步修正 workflow 不需要独立产品命名。
- sayori 纠正：docwarden 和 contexta 是完全拆开的两块内容；docwarden 自己就是文档维护 workflow，contexta 是另一条负责 prompts / agents / skills mapping 的 workflow。
- 新增 `docwarden-contexta-separation.md`，并修正此前把 contexta 写成 docwarden 上层分发管线的错误。
- sayori 继续修正：workflow 的定义在 iso 中，“workflow 不是独立产品名，而是一种 structure/artifact”需要更精确。
- 新增 `workflow-iso-definition.md`，将 workflow 精确定义为 isomorph structure language 下由 state / move / transition 共同成立的推进结构；产品线中出现的是 workflow structure instance / config。
- sayori 调整推进方式：不先做完整 plan 再交给 symphony，而是先稳定基本链路，小步推进。
- 新增 `basic-link-stabilization-plan.md`，将下一步收敛到 docwarden-owned workflow config、`dw:review` skill contract、review surface template、最小 check 和 task 24 dogfood。
- sayori 确认推进计划合理，要求继续做。
- 新增 `review-workflow-config-draft.md`，起草 docwarden-owned `review` workflow config 的最小形状。
- sayori 纠正：上一版三点都错，把 definition layer 和 docwarden 使用层 config 混在了一起。
- 新增 `mapping-layer-correction.md`：isomorph mapping 层表示 semantic mapping；`bootstrap` 是自举；旧 `.isomorph/mapping/docwarden/` 的 user-context 示例应改为 contexta 口径；新的 `.isomorph/mapping/docwarden/` 承接 docwarden workflow definition。
- 修正 `review-workflow-config-draft.md`：撤回 `.docwarden/workflow/review.md` 作为定义入口；Markdown + frontmatter 属于 mapping definition；docwarden 使用层 config 应由 `docwarden init` 创建并用 yaml 或其他配置格式维护。
- 修正 `docwarden-contexta-separation.md`、`config-maintained-workflow.md`、`basic-link-stabilization-plan.md` 和 `index.md`，将基本链路改为 `isomorph workflow structure -> mapping/docwarden definition -> docwarden init -> .docwarden runtime config -> dw:review -> review surface`。

## 2026-06-01

- 回到 `docs/` 原始理论后确认：docwarden 主链路应为 `task -> review system -> spec / guide / wiki`。
- 本 task 关闭；后续入口转入 `.docwarden/task/25-docwarden-v0-dogfood-workflow/`。
