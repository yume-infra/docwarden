---
status: draft
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# kind signal landing

本 task 处理 `kind: signal` 引入后的落点复核。

## 边界

- 本目录是对话产生的 task material。
- 本任务处理 contexta 中 `kind`、`signal`、`module`、`assertion`、`locator` 的落点关系。
- 本任务可以在用户确认后修改 `.contexta/`。
- 本任务不实现 CLI lint engine。
- 本任务不扩大 semantic-lint signal 覆盖范围。
- 本任务不修改 `docs/`。

## 来源基线

- `.docwarden/task/12-contexta-model-followup/`
- `.contexta/mapping/bootstrap/modules/concept/metadata.md`
- `.contexta/mapping/bootstrap/modules/concept/metadata/kind.md`
- `.contexta/mapping/bootstrap/modules/concept/structure.md`
- `.contexta/mapping/bootstrap/modules/concept/module.md`
- `.contexta/mapping/bootstrap/modules/concept/assertion.md`
- `.contexta/mapping/bootstrap/modules/concept/locator.md`
- `.contexta/mapping/bootstrap/modules/concept/signal.md`
- `.contexta/mapping/bootstrap/modules/policy/signal-boundary.md`
- `.contexta/mapping/bootstrap/modules/signal/`
- `.contexta/mapping/bootstrap/structures/pipeline/semantic-lint.md`

## 当前判断

- `module` 是 md file scope，不是 `kind: module`。
- `metadata` 是 md module frontmatter 中的结构化说明字段。
- `kind` 是 metadata 中负责选择 content language 的字段。
- `signal` 是 semantic-lint 中被命名的 warning 类型。
- `modules/signal/*.md` 当前表示每个具体 signal definition 是一个 module。
- `kind: signal` 当前表示该 module 的正文应按 signal definition 语言读取。
- `assertion` 是 module 内最小可审查语义判断。
- `locator` 是让 assertion 可被稳定找到的定位机制。
- `signal instance` 是未来 CLI lint engine 的运行产物，必须能通过 locator 指向 assertion。
- `signal definition` 不是 `signal instance`。
- signal 必要性当前评估约 8/10：保留，但压低建设强度。
- 当前不新增 `signal-definition` kind，不继续扩 signal 数量，不设计 CLI schema。
- concept 目录当前按主类型分层：`structure.md` / `metadata.md` 放在 `concept/` 根下；下级概念进入 `concept/structure/` 和 `concept/metadata/`。

## 内容

- `plan.md`：本任务 loop 计划。
- `log.md`：任务时间线记录。
- `kind-signal-landing-review.md`：Loop 1 kind / signal 落点复核审查材料。
- `signal-module-quality-review.md`：Loop 2 signal module 质量审查材料。
- `minimal-concept-surface-adr.md`：Loop 3 concept 最小职责 ADR。
- `module-assertion-composition-review.md`：Loop 5 module / assertion / composition 重建审查材料。
- `template-format-semantic-lint-review.md`：Loop 6 template / format / semantic-lint 关系审查材料。

## 下一步

当前已落地 template / format / semantic-lint 关系审查。下一轮进入 kind / module / content language 关系检查。
