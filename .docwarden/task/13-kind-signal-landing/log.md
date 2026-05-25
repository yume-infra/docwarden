---
status: draft
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# kind signal landing log

## [2026-05-25] task-started | 建立 kind / signal 落点复核任务

task 12 收口后，sayori 确认下一步应先做 kind / signal 落点复核。

原因：

- task 12 引入了 `modules/signal/*.md`。
- 这些文件使用 `kind: signal`。
- `kind` 是 content language entry，因此需要确认 `signal` 是否作为内容语言入口成立。
- 如果不先确认落点，后续 signal module 质量审查会在“它到底是什么 module”上反复摇摆。

本任务边界：

- 先确认 `kind: signal` 与 `modules/signal/*.md` 是否成立。
- 再审查具体 signal module 质量。
- 暂不实现 CLI lint engine。
- 暂不扩展 signal 覆盖范围。

已生成：

- `index.md`
- `plan.md`
- `log.md`
- `kind-signal-landing-review.md`

## [2026-05-25] loop-1-signal-necessity-review | 评估 signal 必要性

sayori 要求从不同角度评估 signal 设计必要性，并给出 10 分制评分。

已派出三个 subagent：

- 理论架构角度。
- 未来 CLI semantic lint engine 角度。
- 文档维护 / Obsidian 阅读面 / 长期可审查性角度。

综合结论：

- signal 必要性约 8/10。
- signal 作为独立 concept 成立。
- `kind: signal` 作为 signal definition language 成立。
- `modules/signal/*.md` 比 signal collection file 更适合当前 md module 模型。

风险：

- signal 容易膨胀成 policy。
- 当前没有 CLI，过度设计 signal schema 会提前固定实现。
- signal module 数量少，继续扩张会制造 Obsidian 噪音。

当前决策：

- 保留 signal concept。
- 保留 `kind: signal`。
- 保留 `modules/signal/*.md`。
- 不新增 `signal-definition` kind。
- 不继续扩 signal 数量。
- 不设计 severity / engine schema / CLI spec。

已落地最小修订：

- 修订 `.contexta/mapping/bootstrap/modules/concept/metadata/kind.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/signal.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/semantic-lint.md`。
- 新增 `.contexta/mapping/bootstrap/relations/semantic-lint-chain.md`。

## [2026-05-25] loop-1-metadata-layer | 拆出 metadata 主类型

sayori 确认：`kind` 可以拆开定义，`metadata` 是上位概念，`kind` 是 metadata 的一种。

进一步修正：

- 主类型自己的定义应放在 `concept/` 根下。
- 下级概念再进入主类型目录。
- 避免 `concept/metadata/metadata.md` 或 `concept/structure/structure.md` 这种重复路径。

已落地：

- 新增 `.contexta/mapping/bootstrap/modules/concept/metadata.md`。
- 移动 `kind` 到 `.contexta/mapping/bootstrap/modules/concept/metadata/kind.md`。
- 移动 structure subtype 到 `.contexta/mapping/bootstrap/modules/concept/structure/`。
- 保留 `.contexta/mapping/bootstrap/modules/concept/structure.md` 作为 structure 主类型定义。
- 新增 `.contexta/mapping/bootstrap/relations/metadata-language.md`。
- 更新 `.contexta` 与 task material 中的 OFM path alias。

## [2026-05-25] loop-1-accepted | 收口 kind / signal 落点

sayori 确认本轮结论。

最终结论：

```text
signal = semantic-lint 的 warning type naming
kind: signal = signal definition module 的 content language entry
modules/signal/*.md = signal definition 的正确落点
signal instance = 未来 CLI 输出，不作为长期 module
```

保留限制：

```text
不新增 signal-definition kind
不扩 signal 数量
不设计 CLI schema / severity
```

metadata 结论：

```text
metadata = md module frontmatter 中的结构化说明字段
kind = metadata 中负责选择 content language 的字段
```

下一步：

- 进入 Loop 2：signal module 质量审查。

## [2026-05-25] loop-2-started | 审查 signal module 质量

进入 Loop 2。

本轮审查当前 6 个 signal module：

- `concept-as-policy`
- `workflow-as-policy`
- `architecture-as-responsibility-card`
- `template-owns-lifecycle`
- `example-as-kind`
- `composition-as-list`

当前候选判断：

- 6 个 signal module 可以作为第一版保留。
- 当前 schema `Trigger / Why / Source / Inspection` 足够第一版。
- 不新增 signal schema。
- 不扩 signal 数量。
- 不实现 CLI lint engine。
- 弱 Trigger 先保留为 warning trigger，后续用真实 lint dry run 校准。

已生成：

- `signal-module-quality-review.md`

## [2026-05-25] loop-2-accepted | 收口 signal module 质量判断

sayori 确认本轮决策可以收口。

当前结论：

- 当前 6 个 signal module 作为第一版保留。
- 不扩 signal 数量。
- 不新增 schema。
- 弱 Trigger 作为 warning trigger 保留，后续通过真实 lint dry run 校准。

## [2026-05-25] loop-3-accepted | 收口 minimal concept surface ADR

sayori 确认：这轮决策可以收口，准备进入下一轮大迭代。

已收口 ADR：

- `minimal-concept-surface-adr.md`

ADR 决策：

```text
concept = Designation / Naming Need / Definition
Delimitation = 不再作为 concept 标准章节
Examples = 不再作为 concept 默认章节
example = 独立样本语言
```

职责拆分：

```text
concept = 命名与定义
relation = 稳定概念连接 / 阅读路径
signal = 可复用误用检测 warning type
policy = 约束规则
example = 样本教学
```

目录组织边界：

```text
Only stable primary type families get directories.
All other hierarchy belongs to relation, not path.
```

下一轮大迭代建议：

- 先处理 concept template，移除默认 `Delimitation` / `Examples`。
- 再做 Delimitation / Examples migration inventory。
- 不直接机械删除现有内容。
