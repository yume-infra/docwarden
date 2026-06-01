---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# contexta runtime handoff log

## [2026-05-26] task-started | runtime handoff

sayori 要求新开 task18，产出一份 lead 和若干 supporting docs，供下一个 Codex goal 直接进入 contexta CLI runtime 实现阶段。

本 task 不实现 CLI。

## [2026-05-26] correction | 从 CLI 命令列表回到整体建模

早期讨论过度偏向 `bootstrap / inspect / explain` 之类命令列表。

sayori 纠偏：

- 下个实现目标是完整 runtime 第一版，不是单个命令。
- task18 应回答要实现什么。
- supporting docs 是执行 agent 的 goal 补充材料。
- runtime 必须形成真实可执行 CLI。

## [2026-05-26] decision | init 边界

sayori 确认：

- init 只产生 `.contexta`。
- contexta 设计应最小影响外部、自包含。
- contexta 设计应保持最大可自定义程度和可配置。
- 当前仓库可以理解为已经执行过 init，只是 runtime handoff 尚未形成。

后续进一步确认：

- 第一版不需要根部 `contexta.md`。

## [2026-05-26] decision | vendor 与 local

sayori 确认：

- vendor 保持在远端，作为概念层。
- local `.contexta` 暴露给用户修改。
- runtime 实际读取 local `.contexta`。
- upgrade 合理，并且是核心语义。

当前结论：

- vendor 是 pinned baseline 和 upgrade diff 来源。
- runtime 普通执行读取 local effective contexta instance。

## [2026-05-26] decision | recognition primitive

sayori 确认 recognition 是核心 primitive。

任意 md target 进入 contexta 的识别能力是当前理论缺口，应建模为 pipeline。

当前结论：

```text
arbitrary md
  -> md surface parse
  -> recognition primitive
  -> recognition result
  -> applicable lint signals
```

## [2026-05-26] decision | primitive schema 暂不预设

sayori 纠偏：

- primitive 的最小结构不应在理论阶段强行预设。
- 应等 Effect 代码实现中解析出真实 md surface 后，再依照真实内容设计。

当前结论：

- task18 不写死 primitive 字段 schema。

## [2026-05-26] decision | primitive-creator

sayori 确认：

- 后续要做 primitive-creator。
- primitive-creator 第一版落地为 skill primitive。

当前结论：

- custom-skill-creator 是 primitive-creator 的第一个具体场景。

## [2026-05-26] review | subagent audit

sayori 要求派出 subagents 从不同角度审核 task18：

- 理论切合度。
- 可行度。
- 文档口径一致性。

审核结论：

- task18 的理论方向基本成立。
- 需要补 v0 executable contract，避免下个实现 agent 现场发明 seed、pin metadata、recognition result、lint output 和 primitive-creator 验收。
- 需要明确 contexta runtime 自包含但不自广告。
- 需要明确 mapping 是 recognition 的重要输入，但 recognition 不等同于 mapping lookup。
- 需要为 skill export 保留模型位置，但不要求第一版完成 `SKILL.md` compiler。

已新增：

```text
sup-06-v0-executable-contract.md
```

并同步修正 sup-01 到 sup-05。

## [2026-05-26] implementation-context | Effect reference

sayori 要求根部 `AGENTS.md` 教会后续执行 agent 如何使用 Effect。

当前新增要求：

- Effect implementation work 先读 `repos/effect/ai-docs/src/index.md`。
- 再读相关 `repos/effect/ai-docs/src/**` examples。
- 不懂时继续探索 `repos/effect/packages/**` 的真实源码、测试和示例。
- 应用代码仍只能从 installed dependencies import Effect APIs。
- 用 `tsgo` / package-local `typecheck` 作为主要校验。
