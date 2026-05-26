---
status: accepted
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 2
---

# kind / metadata boundary

本文件是 task 12 Loop 2 的最小 review 单元，已通过审核并落地到 `.contexta`。

目标是区分 contexta 内容字段与 docwarden 操作字段，并给 `kind` 一个更稳定的第一版定义。

## 当前已有设计

已确认：

- module 是 md file scope。
- assertion 是 module 内部最小可审查语义判断。
- `kind: user-context` 是内容类型字段，属于 contexta 内容格式协议范围。
- `status / created / updated / owner` 是 docwarden workflow 维护状态字段，不属于 contexta 内容字段。
- 不应把两类字段统称为同一种 metadata。
- template 只负责复制后的内容骨架，不负责来源、review、pick、更新、写入、生命周期。

当前 `.contexta` 中已有的 `kind` 用法：

- `.contexta/mapping/bootstrap/modules/concept/*.md` 使用 `kind: concept`。
- `.contexta/mapping/bootstrap/modules/policy/*.md` 使用 `kind: policy`。
- `.contexta/mapping/bootstrap/templates/concept.md` 使用 `kind: concept`。
- `.contexta/mapping/bootstrap/templates/policy.md` 使用 `kind: policy`。
- `.contexta/mapping/bootstrap/templates/pipeline.md` 使用 `kind: pipeline`。
- `.contexta/mapping/bootstrap/templates/workflow.md` 使用 `kind: workflow`。
- `.contexta/mapping/bootstrap/templates/architecture.md` 使用 `kind: architecture`。
- `.contexta/mapping/bootstrap/templates/branch.md` 使用 `kind: branch`。
- `.contexta/mapping/bootstrap/templates/composition.md` 使用 `kind: composition`。
- `.contexta/mapping/docwarden/templates/user-context.md` 使用 `kind: user-context`。

## 当前缺口

当前缺口不是创建完整 metadata schema。

当前真正缺口是：

- `kind` 到底表达什么。
- 哪些东西可以成为 `kind`。
- 哪些东西不能成为 `kind`。
- template 文件中的 `kind` 是否与普通 module 中的 `kind` 有语义差异。
- contexta 内容字段与 docwarden 操作字段如何避免混写。

## 已通过判断

### 1. kind 是内容语言选择器

`kind` 应回答：

```text
这个 md module 的正文应按哪种内容语言理解？
```

因此，`kind` 指向的是 module 的内容类型、内容语言或正文协议。

它不是：

- file scope。
- 文件名。
- 目录名。
- docwarden workflow 对象类型。
- docwarden task 状态。
- assertion locator。
- template 复制骨架身份。

### 2. kind 不等于 primitive 层级

`kind` 不负责表达一个概念是不是 primitive。

例如：

- `concept` 可以是 kind，因为它有独立正文协议。
- `policy` 可以是 kind，因为它有独立正文协议。
- `pipeline`、`workflow`、`architecture`、`branch`、`composition` 可以暂时作为 kind，因为它们当前各自有直接正文骨架。

这不表示它们和 `concept / policy` 是同一理论层级。

它只表示它们目前有独立的 module 正文协议。

### 3. structure language 当前可直接作为 kind

当前不使用：

```yaml
kind: structure
structure_type: workflow
```

原因：

- 这会重新引入 subtype metadata 分类树。
- 用户已明确不喜欢 `sub_type` 体验。
- 当前 pipeline / workflow / architecture / branch / composition 已经直接用最小三槽结构落地。

因此第一版保留：

```yaml
kind: workflow
```

而不是：

```yaml
kind: structure
structure_type: workflow
```

这里的含义是：

- `workflow` 是当前 module 的内容语言入口。
- `workflow` 仍然是 structure 的一种。
- structure 关系由 relation 体系承接，不由 frontmatter subtype 承接。

### 4. module / assertion 不能成为 kind

`module` 不能成为 `kind`。

原因：

- module 是 md file scope。
- 所有 `.md` 描述文件都已经是 module。
- 写成 `kind: module` 会把 file scope 和内容语言混在一起。

`assertion` 也不能成为 `kind`。

原因：

- assertion 是 module 内部最小语义判断。
- assertion 需要后续可被 locator 指向，但当前不是独立文件、独立资产或正文协议。

### 5. example 当前不作为 kind

example 是样本语言。

它可以出现在 concept、policy、structure 等 module 内部，用于教 agent 理解、书写或判断。

当前不恢复：

```yaml
kind: example
```

原因：

- example 当前不是独立 module kind。
- example 当前不是 template kind。
- example 当前不是 directory kind。
- 真实 example 质量仍需要后续使用反馈补充。

后续如果出现稳定的 example module 正文协议，再重新进入 review。

### 6. template 中的 kind 暂时视为 target kind

`.contexta/mapping/bootstrap/templates/*.md` 里的 `kind` 当前有一个特殊点：

它更像是在说明这个 template 复制后要生成的目标内容语言。

例如：

```yaml
kind: policy
```

在 `.contexta/mapping/bootstrap/templates/policy.md` 中，含义更接近：

```text
这个 template 的目标 module kind 是 policy。
```

这和普通 `.contexta/mapping/bootstrap/modules/policy/*.md` 中的 `kind: policy` 不完全一样。

当前不立刻改成：

```yaml
target_kind: policy
```

原因：

- 当前 template 边界将在 Loop 3 单独审查。
- 过早改 field 可能把 template 骨架问题和 metadata 问题混在一起。

本轮先记录这个差异：

- 普通 module 中的 `kind` 表达自身正文协议。
- template artifact 中的 `kind` 暂时表达复制目标的正文协议。

### 7. docwarden operation metadata 不进入 contexta kind

`status / created / updated / owner` 这类字段不应被解释为 contexta 内容类型字段。

它们属于 docwarden operation metadata：

- status：工作材料或长期资产的维护状态。
- created：创建时间。
- updated：更新时间。
- owner：维护责任人。

这些字段可以出现在 `.docwarden` 资产中，也可以出现在当前项目为了维护长期内容而管理的资产里。

但它们不定义 module 的内容语言。

## protocol 词语澄清

当前不单独引入 `protocol` 字段或 protocol concept。

更准确的表达是：

- `kind` 是 content language entry。
- content language 的读取方式由 concept / template / policy / example 共同稳定。
- relation 负责 content language 之间的概念网络关系。

## 已落地改动

本轮已落地：

- `.contexta/mapping/bootstrap/modules/concept/metadata/kind.md`
- `.contexta/mapping/bootstrap/modules/policy/kind-boundary.md`
- `.contexta/mapping/bootstrap/modules/concept/relation.md`
- `.contexta/mapping/bootstrap/modules/policy/relation.md`
- `.contexta/mapping/bootstrap/templates/concept.md`
- 移除当前 concept modules 中默认的 `Concept Relations` 章节。
- 将 `.contexta/mapping/bootstrap/modules/concept/module.md` 和 `.contexta/mapping/bootstrap/modules/concept/assertion.md` 中误导性的 `entity` 表述改为独立资产或 docwarden workflow 对象表述。
- 将 `.contexta/mapping/bootstrap/modules/concept/structure/workflow.md` 和 `.contexta/mapping/bootstrap/modules/concept/structure/architecture.md` 中的“实体落点”改为“具体资产落点”。

当前仍不做：

- 暂不修改 `.contexta/mapping/*/templates/*.md` 的 frontmatter。
- 将 template artifact 中 `kind` 的特殊语义留给 Loop 3 处理。

## 审核结果

sayori 已确认：

- `kind` 是 content language entry。
- `kind` 不承接 docwarden workflow 字段。
- `status / created / updated / owner` 属于 docwarden workflow 层。
- `module / assertion / example` 当前不作为 kind。
- 不引入 `sub_type`。
- template 下可以理解为 `<kind>-template`，其中 `kind` 指向复制后应成为的 module kind。
- `relation` 应作为独立 concept / policy 维护 concept network。
- Delimitation 只维护正确、必要、简洁的关键边界。
