---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# v0 executable contract

本文件补充 contexta CLI runtime v0 的可执行合同。

它不是最终 schema，不替代 Effect 实现后的真实模型。

它只降低下一个实现 goal 的现场发明空间。

## Seed And Pin

v0 `init` 需要明确 seed source。

可接受方案：

- CLI package 携带一个 materialized seed snapshot。
- 该 seed snapshot 对应一个 pinned remote vendor baseline。
- runtime 普通执行仍只读取 local `.contexta`。

v0 pin metadata 建议放在 `.contexta/.contexta-pin.json`。

最小字段：

```json
{
  "schemaVersion": 1,
  "vendor": "contexta",
  "ref": "<vendor-ref-or-version>",
  "digest": "<snapshot-digest>",
  "createdAt": "<iso8601>"
}
```

已有 `.contexta` 时，`init` 默认不得覆盖。

测试或演示应使用临时目录；force 行为需要显式设计，不能作为默认。

## Root Resolution

CLI 需要确定 local `.contexta` root。

v0 规则：

```text
--root 参数优先
否则从 target path 向上查找 `.contexta`
否则从 cwd 向上查找 `.contexta`
找不到则报 runtime/config error
```

如果 target 不在 resolved root 下，v0 可以报错，除非实现明确支持 external target。

## Md Surface

v0 必须解析 md surface，但不需要完整 Markdown AST。

最小 surface 可以先覆盖：

- frontmatter
- heading
- section text
- path
- locator marker text

实现可以选择轻量自写 parser 或引入 Markdown/frontmatter parser。

选择应以能被 Effect data model 和 `tsgo` 校验为准，不应绕过类型建模。

## Recognition Result

v0 recognition result 是中间结果，不是 judgment。

最小字段方向：

```text
target
recognizedRole or kind
basis
confidence
candidateSignalScope
```

这些字段不是 primitive 最终 schema。

它们只是 runtime v0 为 lint 提供的执行合同。

## Lint Output

lint 在 recognition 之后运行。

v0 lint signal 输出至少应表达：

```text
signal
target
context or locator
evidence
basis
confidence
```

exit code 建议：

```text
0: no signals
1: signals emitted
2: runtime or config error
```

lint 输出 signal，不输出最终语义 judgment。

## Primitive Creator Demonstration

v0 必须给 primitive-creator / skill primitive 一个可观察结果。

可接受演示：

- 读取 local skill primitive material。
- 输出 skill primitive plan / model / diagnostics。
- 验证一个 skill primitive surface。

v0 不要求生成最终 `SKILL.md`。

v0 不要求完成 skill export compiler。

## Upgrade Skeleton

v0 不实现完整 merge engine。

v0 至少应能：

- 读取 pin metadata。
- 输出当前 pinned baseline。
- 保留 future upgrade diff / migration 的数据模型位置。

upgrade 不应覆盖 local customization。

## Effect Implementation Notes

执行 agent 应优先读取根部 `AGENTS.md` 的 Effect Reference。

Effect 使用顺序：

```text
repos/effect/ai-docs/src/index.md
  -> relevant repos/effect/ai-docs/src/** examples
  -> repos/effect/packages/** source/tests/examples
  -> tsgo diagnostics
```

应用代码只能从 installed dependencies import Effect APIs。
