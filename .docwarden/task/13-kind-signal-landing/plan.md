---
status: draft
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# kind signal landing 计划

本任务承接 task 12 中 `semantic-lint pipeline / signal modules` 拆分后的直接边界问题。

## Loop 1：kind / signal 落点复核

状态：accepted。

目标：确认 `kind: signal` 是否作为 metadata 中的 content language entry 成立，以及 `modules/signal/*.md` 是否是具体 signal definition 的正确落点。

当前基线：

- `metadata` 是 md module frontmatter 中的结构化说明字段。
- `kind` 是 metadata 中负责选择 content language 的字段。
- `module` 是 md file scope。
- `signal` 是 semantic-lint 中被命名的 warning 类型。
- `signal definition` 是定义某类 warning 如何被识别的 md module。
- `signal instance` 是未来 CLI lint engine 的一次具体命中。
- `locator` 指向 assertion marker，不泛化为任意文件或标题地址。

需要 review：

- `signal` 是否可以作为 content language entry。
- `kind: signal` 是否只表示“此 module 使用 signal definition 语言”，而不是把 signal instance 写成 module。
- `modules/signal/*.md` 是否比 `structures/pipeline/semantic-lint-signals.md` 更合理。
- `metadata` / `kind` / `signal` / `semantic-lint` / `pipeline` 是否需要补最小边界。
- 是否需要新增或调整 relation，让 `signal -> semantic-lint -> pipeline -> locator/assertion` 的关系可读。
- concept 目录是否应按主类型分层，并把主类型定义保留在 `concept/` 根下。

当前产物：

- `kind-signal-landing-review.md`

当前进展：

- 已使用三个 subagent 评估 signal 必要性，综合评分 8/10。
- 当前判断是保留 signal concept、`kind: signal` 和 `modules/signal/*.md`，但压低建设强度。
- 已补最小 `.contexta` 修订：`metadata`、`kind`、`signal`、`semantic-lint` 边界说明，以及 `metadata-language` / `semantic-lint-chain` relation。
- 已将 concept 目录按主类型分层：`structure.md` / `metadata.md` 保留在根下，子类型分别进入 `concept/structure/` 与 `concept/metadata/`。
- 当前不新增 `signal-definition` kind，不扩 signal 数量，不设计 severity / CLI schema。

当前结果：

- 已通过 sayori 审核。
- 已确认 `signal` 可以作为 content language entry。
- 已确认 `kind: signal` 只表示 signal definition module，不表示 signal instance。
- 已确认具体 signal definitions 放在 `modules/signal/*.md`。
- 已确认 pipeline 只引用 signal modules，不拥有 signal definitions。
- 已确认 `metadata` 是主类型，`kind` 是 metadata 中负责选择 content language 的字段。
- 已确认主类型定义放在 `concept/` 根下，子类型放入对应子目录。
- 下一步进入 Loop 2：signal module 质量审查。

## Loop 2：signal module 质量审查

状态：accepted。

目标：逐个审查当前 6 个 signal module 的内容质量。

需要 review：

- Trigger 是否可观察。
- Why 是否解释语义偏移，而不是写成 policy。
- Source 是否足够指向已有 concept / policy。
- Inspection 是否能指导 review。
- 是否需要占位缺失真实例子。

当前产物：

- `signal-module-quality-review.md`

当前候选：

- 当前 6 个 signal module 可以作为第一版保留。
- 当前 schema `Trigger / Why / Source / Inspection` 足够第一版。
- 不新增 `Evidence`、`Severity`、`Target Scope` 或 CLI parser 字段。
- 不扩 signal 数量。
- 弱 Trigger 先保留为 warning trigger，后续通过真实 lint dry run 校准。
- 当前更适合记录质量审查结论，不直接修改 signal module。

当前结果：

- 已通过 sayori 审核。
- 已确认当前 6 个 signal module 作为第一版保留。
- 已确认本轮不改 signal schema。
- 已确认不新增 signal 数量。
- 已确认弱 Trigger 后续通过真实 lint dry run 校准。

## Loop 3：minimal concept surface ADR

状态：accepted。

目标：收口 concept 最小职责、Delimitation deprecation、example 独立和 concept 目录组织边界。

当前结果：

- 已确认 `concept` 的标准职责收窄为 `Designation / Naming Need / Definition`。
- 已确认 `Delimitation` 不再作为 concept 标准章节。
- 已确认 `Examples` 不再作为 concept 默认章节。
- 已确认 `example` 是独立样本语言。
- 已确认目录只表达少数稳定主类型和维护分区，不无限表达 concept network。
- 已新增 `minimal-concept-surface-adr.md`。

## Loop 4：clean concept surface migration

状态：accepted。

目标：按最新 ADR 直接清空旧 concept surface，让后续重建在干净路径上进行。

当前结果：

- 已从 concept template 移除默认 `Delimitation` / `Examples`。
- 已从 bootstrap concept modules 移除现有 `Delimitation` / `Examples`。
- 已从 docwarden mapping 的 `user-context` concept module 移除现有 `Delimitation` / `Examples`。
- 已清理残留的额外 `Rules`、重复 `Definition` 和旧 example 片段，确保 concept modules 回到三段 surface。
- 已清理 relation files 中指向 `#Delimitation` 的旧 OFM 链接。
- 已修订 relation policy，把旧 `Delimitation` 承接口径改为 signal / relation / policy / example / Definition 分工。

本轮不重建被删除内容，只保留干净 surface，等待下一步讨论哪些关键点值得以 signal、relation 或 policy 形式重建模。

## Loop 5：module / assertion / composition relation

状态：accepted。

目标：把 clean surface 后需要保留的稳定概念连接同步到 relation layer。

当前第一组 review：

- `module / assertion / composition` 三角关系。
- 候选 relation：`module-assertion-composition`。
- 候选判断：`assertion` 是 `module` 的 part，`module` 是 `assertion` 的 whole，`composition` 命名这组 part-whole structure。
- 当前不保留抽象 example；真实案例后续出现后再补。

当前产物：

- `module-assertion-composition-review.md`

当前结果：

- 已新增 `.contexta/mapping/bootstrap/relations/module-assertion-composition.md`。
- 已在 `semantic-granularity` policy 中连接该 relation。
- 已确认当前不保留抽象 example；真实案例后续出现后再补。

## Loop 6：template / format / semantic-lint 关系审查

状态：accepted。

目标：确认 `template / format / semantic-lint` 应作为 relation 承接，而不是新增 pipeline 或把职责塞回 concept definition。

当前候选：

- `template` 负责 0->1 初始骨架。
- `format` 负责 1->2 时保持 md 可消费形态。
- `semantic-lint` 消费 formatted md，产生 warning signal；未来 CLI 可再区分 candidate / instance。
- `template / format / semantic-lint` 本身不是 pipeline；真正的执行转换仍由 semantic-lint pipeline 表达。
- 当前不新增抽象 example；真实案例后续出现后再补。

当前产物：

- `template-format-semantic-lint-review.md`

当前结果：

- 已新增 `.contexta/mapping/bootstrap/relations/template-format-semantic-lint.md`。
- 已将 `format` 收紧为 1->2 的形态保持。
- 已将 `semantic-lint` 的结果收紧为 warning signal；未来 CLI 可再区分 candidate / instance。
- 已在 `semantic-lint-chain` 中连接该 relation。
- 已确认 `0->1` 和 `1->2` 是 transition magic words，不新增 `phase` concept。

## 当前不做

- 修改 `docs/`。
- 实现 CLI lint engine。
- 扩展 signal 覆盖范围。
- 自动生成 signal instance。
- 自动补 assertion marker。
- 新增 metadata subtype tree。
- 机械删除 policy / relation / signal 等非 concept module 的教学样本。
