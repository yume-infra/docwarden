---
status: accepted
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 9
---

# semantic lint instance dry run

## Purpose

本轮把 Loop 8 的 signal definitions 放到当前 `.contexta` 内容上做一次手动 dry run。

目标不是设计完整 CLI，也不是扩大 signal definitions，而是验证：

- raw hit 如何进入 candidate。
- candidate 如何经过 inspection 才能成为 signal instance。
- locator 在当前阶段能否至少指到 module / heading。
- 当前 signal definitions 是否会误伤 example、code fence 或 template skeleton。

## Scope

本轮只检查当前 `.contexta/mapping/**/*.md`。

`.docwarden/task/**` 只作为工作材料，不进入本轮 semantic lint target。

当前不检查 `docs/`，也不设计完整 lint engine。

## Instance Flow

```text
raw hit -> candidate -> signal instance
```

raw hit 是脚本或人工扫描看到的文本、heading、path、frontmatter 或 link 现象。

candidate 是 raw hit 与某个 signal definition 有相似触发压力，但还没完成完整 trigger 和 inspection 的对象。

signal instance 是 candidate 满足 signal definition 的完整 trigger，并经过 inspection 后仍然成立的具体 warning。

## Instance Shape

Signal:

触发的 signal definition 名称。

Locator:

指向被检查位置。当前只使用 module / heading 级 locator。

Trigger:

本次命中的可观察条件。

Evidence:

最小证据片段。

Inspection:

人工检查后的语义判断。

Disposition:

本次 dry run 的处理结果。

当前 disposition 只使用：

- `accepted-instance`：成为真正 signal instance。
- `rejected-candidate`：raw hit / candidate 被 inspection 排除。
- `definition-pressure`：暴露 signal definition 需要后续收窄或扩展。

## Dry Run Summary

当前 `.contexta/mapping/**/*.md` 中没有确认的 `accepted-instance`。

本轮发现的主要内容是 rejected candidates。它们说明当前 signal definitions 必须区分：

- section text 与 code fence。
- concept 的 Definition / Naming Need 与 Examples。
- template skeleton 中的占位语法与实际 module 内容。
- signal definition 自己描述 trigger 时出现的 trigger 词。

这轮结果不表示 semantic lint 没有价值，而是说明第一版 signal definitions 在当前内容上没有发现已确认语义偏移。

## Candidate Hits

### `concept-as-policy` / concept Examples

Signal:

`concept-as-policy`

Locator:

`[[mapping/bootstrap/modules/concept/concept#Examples|concept#Examples]]`

Trigger observed:

section contains `MUST NOT`

Evidence:

```text
agent MUST NOT 直接创建 assertion 文件。
```

Inspection:

这是 concept module 的 Negative example，用来教 agent 区分 policy assertion 和 concept。

它不在 `Definition` 或 `Naming Need` 中，因此不满足 `concept-as-policy` 的完整 trigger。

Disposition:

`rejected-candidate`

### `concept-as-policy` / semantic-lint code fence

Signal:

`concept-as-policy`

Locator:

`[[mapping/bootstrap/modules/concept/semantic-lint#Examples|semantic-lint#Examples]]`

Trigger observed:

code fence 中出现 `## Definition` 和 `MUST / SHOULD`

Evidence:

```md
## Definition

agent MUST use OFM path alias.
```

Inspection:

这段文本是 Judgment Material，不是 semantic-lint module 自己的 Definition。

未来 CLI 如果只按 heading 文本切 section，会把 code fence 里的 `## Definition` 误识别成真实 heading。

Disposition:

`rejected-candidate`

Follow-up:

未来 lint parser 必须识别 code fence，并且不能把 code fence 内部 heading 当作 module heading。

### `concept-as-policy` / trigger example

Signal:

`concept-as-policy`

Locator:

`[[mapping/bootstrap/modules/concept/trigger#Examples|trigger#Examples]]`

Trigger observed:

example 中展示了完整 trigger 条件，并包含 `MUST / SHOULD / MUST NOT`

Evidence:

```text
section contains MUST / SHOULD / MUST NOT
```

Inspection:

这是 trigger concept 的 Positive example，内容正在展示 trigger 语法本身。

它不说明 trigger module 的 Definition 被写成了 policy。

Disposition:

`rejected-candidate`

Follow-up:

未来 raw scan 需要能把 “signal definition 描述自身 trigger” 和 “目标内容命中 trigger” 分开。

### `composition-as-list` / composition concept

Signal:

`composition-as-list`

Locator:

`[[mapping/bootstrap/modules/concept/composition#Definition|composition#Definition]]`

Trigger observed:

Definition 中有 list items。

Evidence:

```md
- module 是 whole。
- assertion 是 part。
- stable semantic boundary 判断哪些 assertion 应共同归入同一个 module。
```

Inspection:

该 module 的 frontmatter 是 `kind: concept`，不是 `kind: composition`。

这段 list 也明确表达 whole / part / stable semantic boundary，不是普通列表。

Disposition:

`rejected-candidate`

### `template-owns-lifecycle` / policy template

Signal:

`template-owns-lifecycle`

Locator:

`[[mapping/bootstrap/templates/policy#Assertions|policy template#Assertions]]`

Trigger observed:

template 中出现 `<MUST|MUST NOT|SHOULD|SHOULD NOT|MAY>`。

Evidence:

```md
- <主体> <MUST|MUST NOT|SHOULD|SHOULD NOT|MAY> <动作> <对象/范围/条件>。
```

Inspection:

这是 policy template 的复制骨架，不是 template 自己承接 lifecycle，也不包含 source / review / pick / update / write / lifecycle terms。

Disposition:

`rejected-candidate`

## Design Findings

本轮 dry run 暴露出三个需要后续进入 lint layer 的最小设计点：

1. signal definition 需要稳定表达 target scope。
2. raw scan 需要先产生 raw hit，不能直接生成 signal instance。
3. signal instance 必须带 locator、evidence 和 inspection，否则用户无法判断 warning 是否成立。

## Review Outcome

本轮接受以下口径：

- 当前没有 accepted signal instance 是合理结果。
- Loop 9 的主要价值是确认 `raw hit -> candidate -> signal instance`。
- 后续可以把 target scope / code fence exclusion 补入 lint layer，但当前不扩大成完整 CLI 设计。
- 当前不需要奢求一次做好 semantic lint instance 体系。
- 先稳定 concept / signal / trigger / locator / assertion 等基础概念。
- 等后续落实到 CLI lint engine 时，再用本轮 dry run 作为具体参照物校准实现。
