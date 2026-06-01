---
status: draft
created: 2026-05-27
updated: 2026-05-27
owner: sayori
---

# executable contract tests

本文件记录当前 v0 可执行合同和测试缺口。

## Current Passing Evidence

当前 v0 已经证明：

- package-local typecheck 通过。
- `apps/contexta/tests/runtime.test.ts` 7 个测试通过。
- build / smoke / lint 通过。
- `contexta --help` 可运行。
- 临时目录 `init` 可创建 `.contexta` 和 pin。
- `lint` 可对 concept fixture 输出 `concept-as-policy` signal。
- `primitive skill` happy path 可返回 ready。
- `upgrade` 可输出 pinned baseline。

这些证明 v0 能跑。

它们还不能证明 runtime 合同稳定。

## Missing CLI Contract Tests

当前测试主要直接调用 runtime API。

需要增加 subprocess 或 Effect CLI-level tests，覆盖：

- `contexta init`
- `contexta init --json`
- duplicate init -> exit 2 / config stderr
- `contexta recognize --json`
- `contexta lint` no signal -> exit 0
- `contexta lint` with signal -> exit 1
- `contexta lint --json`
- missing target / outside root -> exit 2
- `contexta primitive skill` ready -> exit 0
- `contexta primitive skill` needs-work -> exit 1
- `contexta upgrade` pinned -> exit 0
- malformed pin -> exit 2 / config or parse error
- `--help`

## Pin Failure Tests

必须补：

- missing pin
- malformed JSON
- missing field
- wrong field type
- unsupported schemaVersion
- invalid digest
- invalid createdAt

所有 metadata 缺失或不一致都应是 config / parse class error。

## Local Customization Tests

必须证明 runtime 普通执行读取 local `.contexta`。

测试应覆盖：

- 修改 local signal definition 后，lint candidate / signal scope 改变。
- 添加 local kind / recognition material 后，recognition 结果改变。
- 删除或改坏 local signal trigger 后，diagnostic 或 non-applicable 状态可观察。

如果这些测试无法通过，说明 runtime 仍然更像固定类型表。

## Signal Fixture Coverage

当前只覆盖 `concept-as-policy` happy path。

seed 中其他 signal 至少需要正反例：

- `workflow-as-policy`
- `template-owns-lifecycle`
- `architecture-as-responsibility-card`
- `example-as-kind`
- `composition-as-list`

每个 signal 至少：

- positive fixture
- negative fixture
- evidence / basis expectation

## Primitive Skill Tests

需要覆盖：

- missing `Semantic Basis`
- missing expected OFM links
- missing `Export Position`
- wrong `frontmatter.kind`
- local `.contexta` 无 skill primitive material
- output model includes capability / trigger / semantic basis / export position

## Upgrade Tests

需要覆盖：

- pinned v0 instance
- pre-v0 local `.contexta` without pin
- invalid pin
- upgrade command is read-only
- local customization remains untouched

## Test Style

Effect 迁移后，优先使用：

- Effect-level service tests
- layer injection tests
- CLI subprocess tests for final contract

普通 async Vitest 可以保留在纯 parser / pure function 层。

