---
kind: policy
---

# kind-boundary

## Intent

约束 `kind` 只作为 content language entry 使用。

本 policy 用于避免把 `kind` 写成 primitive 层级、subtype metadata、module file scope、assertion locator 或 docwarden workflow 状态字段。

## Scope

Applies to:

- [[kind]]
- [[module]]
- [[template]]
- [[relation]]

适用条件：

- contexta 需要读取或创建 md module frontmatter。
- contexta 需要判断某个词是否可以作为 `kind`。
- contexta 需要区分 content metadata 与 docwarden operation metadata。
- contexta 需要处理 template 文件中 `kind` 对复制后目标 module 的指向。

不适用条件：

- 需要设计完整 frontmatter schema。
- 需要设计 template 复制或生成机制。
- 需要设计 assertion locator 标识。
- 需要处理 docwarden task / review / promote / pick / cleanup 生命周期。

## Rules

- `kind` MUST 表达 md module 的内容语言入口。
- `kind` MUST NOT 表达 primitive 层级。
- `kind` MUST NOT 表达 concept network 上位关系。
- `kind` MUST NOT 被用作 `module`、`assertion`、`example` 或 `role` 的伪分类字段。
- contexta MUST NOT 用 `sub_type`、`structure_type` 或等价 frontmatter 字段表达 structure 关系。
- structure language 之间的上位关系 SHOULD 由 [[relation]] 承接。
- template 文件中的 `kind` MAY 指向复制后目标 module 的 content kind。
- template 文件中的 `kind` MUST NOT 被解释为 template artifact 自身的 kind。
- `status / created / updated / owner` MUST 被视为 docwarden operation metadata，而不是 contexta content kind。

## Rationale

`kind` 的价值是让 agent 快速选择正文读取方式。

如果 `kind` 同时表达层级、subtype、生命周期或 locator，它会退化成混合 metadata，导致 agent 无法判断一个 md module 到底应按哪种内容语言读取。

contexta 的理论关系应通过 concept、relation、policy 和 example 维护，不应塞进 frontmatter subtype 树。

## Examples

### Scenario

agent 需要为 workflow 内容选择 frontmatter。

### Judgment Material

```yaml
kind: structure
structure_type: workflow
```

### Positive

```yaml
kind: workflow
```

正确判断：

`workflow` 是当前 module 的内容语言入口。它与 `structure` 的关系由 relation 体系承接，不由 subtype metadata 承接。

### Negative

```yaml
kind: module
```

`module` 是 md file scope，不是内容语言入口。

### Borderline

```yaml
kind: policy
```

在 `.contexta/mapping/bootstrap/templates/policy.md` 中，这个字段暂时指向复制后目标 module 的 kind。是否改成 `target_kind` 属于 template loop，不在本 policy 中直接修改。
