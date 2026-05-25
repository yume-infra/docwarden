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

状态：next。

目标：逐个审查当前 6 个 signal module 的内容质量。

需要 review：

- Trigger 是否可观察。
- Why 是否解释语义偏移，而不是写成 policy。
- Source 是否足够指向已有 concept / policy。
- Inspection 是否能指导 review。
- 是否需要占位缺失真实例子。

## Loop 3：relation 同步

状态：pending。

目标：把 task 12 和 task 13 新增概念与结构同步到 relation layer。

候选内容：

- `signal` 与 `semantic-lint` 的关系。
- `signal definition` 与 `signal instance` 的关系。
- `magic-word`、`confidence`、`locator` 如何共同服务 semantic-lint pipeline。
- `modules/signal` 与 `structures/pipeline` 的连接。

## 当前不做

- 修改 `docs/`。
- 实现 CLI lint engine。
- 扩展 signal 覆盖范围。
- 自动生成 signal instance。
- 自动补 assertion marker。
- 新增 metadata subtype tree。
