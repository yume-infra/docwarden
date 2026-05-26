---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# locator family boundary

## Purpose

本文件设计 contexta locator family 的命名与适用边界。

当前目标不是全量标注 `.contexta`，而是避免 `def-*` 在未定义边界时被直接推广。

## First Principle

locator target 指向 stable 文档中需要长期外部引用的 assertion。

locator family 应表达 assertion 所在的 content surface，而不是表达 assertion 类型、重要性、置信度或 judgment。

编号只在同一 family 内稳定区分 target。

## Accepted Base Rule

marker 采用：

```text
^<family>-<number>
```

例如：

```text
^def-1
^def-2
```

规则：

- 不使用 `a-` prefix。
- `family` 来自 content surface。
- `number` 只负责同 family 内稳定区分。
- stable 后不重排编号。
- 新增 target 使用该 family 下一个未用编号。

## Candidate Families

### `def-*`

Surface:

```text
## Definition
```

Applies to:

- concept module 的正面定义。
- signal module 的 warning name definition。
- 其他 module 中明确承担 definition surface 的 assertion。

Does not apply to:

- policy `Rules`。
- relation `Reading`。
- example 判断材料。

Status:

已在 `.contexta/mapping/bootstrap/modules/concept/assertion.md` 第一轮验证。

### `rule-*`

Surface:

```text
## Rules
```

Applies to:

- policy module 中可单独审查的规范性规则。

Does not apply to:

- example 中展示的规则片段。
- code fence 中的规则样例。
- signal trigger 条件。

Open:

policy rule 数量多，是否要 full cover 需要单独判断。

### `qual-*`

Surface:

```text
## Qualification
```

Applies to:

- 判断某个对象是否满足当前 concept 的条件项。

Does not apply to:

- policy `Scope`。
- arbitrary checklist。

Open:

`Qualification` 当前只在 `assertion.md` 出现；是否作为通用 family 需要更多样本。

### `car-*`

Surface:

```text
## Carrier
```

Applies to:

- 说明 assertion 可由哪些 md surface 承载的 assertion。

Does not apply to:

- relation 的 From / To。
- magic-word registry token body。

Open:

当前只在 `assertion.md` 出现；可能只是局部 family。

### `read-*`

Surface:

```text
relation block 的 Reading
```

Applies to:

- relation file 中某个 relation heading 下的 `Reading` assertion。

Does not apply to:

- `Read next` links。
- From / To target lists。

Open:

relation block 没有显式 `## Reading` heading，而是字段标签。是否使用 `read-*` 还是 relation verb family 需要后续判断。

### `in-* / out-* / trans-*`

Surface:

```text
pipeline Input / Output / Transform
```

Applies to:

- pipeline structure 中 input / transform / output 的关键 assertion。

Open:

pipeline 可能需要按 structure position 命名 family；当前不急于落地。

## Not First-round Families

以下 heading 暂不进入第一批 locator family：

- `Intent`
- `Scope`
- `Rationale`
- `Examples`
- `Scenario`
- `Judgment Material`
- `Positive`
- `Negative`
- `Borderline`
- `Consumer`
- `Source`
- magic-word token headings

原因：

- 它们未必直接承载 stable assertion。
- 有些是解释、样本、来源或消费关系。
- 过早纳入会鼓励全量标注。

## Current Recommendation

第一批 stable family 只接受：

```text
def-*
rule-*
```

理由：

- `def-*` 服务 concept / signal definition，是当前已验证 family。
- `rule-*` 服务 policy rule，是最明显的 assertion-heavy surface。

`qual-*`、`car-*`、`read-*`、pipeline position family 先作为 candidate，不立即推广。

## Accepted Landing

当前已落地：

- locator 理论仍由 `.contexta/mapping/bootstrap/modules/concept/locator.md` 承接。
- 具体 locator instance 放在 `.contexta/mapping/bootstrap/modules/locator/`。
- `.contexta/mapping/bootstrap/modules/locator/definition.md`
- `.contexta/mapping/bootstrap/modules/locator/rule.md`

本轮不新增 `locator-family` concept。

当前已接受 stable family：

```text
def-*
rule-*
```

当前曾尝试第一轮 `rule-*` 标识：

```text
.contexta/mapping/bootstrap/modules/policy/semantic-lint-boundary.md
```

第一轮只标 3 条核心 Rules：

```text
^rule-1
^rule-2
^rule-3
```

后续纠正：

`rule-*` 不应直接当成 accepted stable marker。

原因是 policy Rules 中的 RFC2119 magic words 已经承担规则强度和规范性 assertion 识别，locator 与 magic-word 的关系需要先单独厘清。

当前 `.contexta` 已撤回 `semantic-lint-boundary.md` 中的 `^rule-*` marker。
