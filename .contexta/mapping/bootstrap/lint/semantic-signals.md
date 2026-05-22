---
kind: semantic-lint
---

# semantic-signals

## Scope

本 lint module 承载当前第一批 semantic-lint signal definitions。

当前 signal definitions 来自已经暴露过的误用，不穷举全部 policy。

## `concept-as-policy`

Trigger:

- `frontmatter.kind == concept`
- `heading in [Definition, Naming Need]`
- `section contains MUST / SHOULD / MUST NOT`

Why:

concept 是命名语言，policy 是约束语言。concept 写成 policy 会让命名和约束职责混在一起。

Source:

- [[mapping/bootstrap/modules/concept/concept|concept]]
- [[mapping/bootstrap/modules/concept/policy|policy]]

Inspection:

- 检查 Definition 是否仍在命名和界定。
- 如果内容是约束，迁移到 policy。

## `workflow-as-policy`

Trigger:

- `frontmatter.kind == workflow`
- `section contains MUST / SHOULD / MUST NOT`
- `body missing state / move / transition terms or sections`

Why:

workflow 是推进结构，policy 是约束语言。workflow 写成 policy 会丢失推进关系。

Source:

- [[mapping/bootstrap/modules/concept/workflow|workflow]]
- [[mapping/bootstrap/modules/concept/policy|policy]]

Inspection:

- 检查内容是否表达 state、move、transition。
- 如果只是在保护边界，迁移到 policy。

## `architecture-as-responsibility-card`

Trigger:

- `frontmatter.kind == architecture`
- `body contains responsibility / owner / function descriptions`
- `body missing layer / relation / boundary terms or sections`

Why:

architecture 是层级结构。只写职责卡片不能构成 architecture。

Source:

- [[mapping/bootstrap/modules/concept/architecture|architecture]]
- [[mapping/bootstrap/modules/concept/structure|structure]]

Inspection:

- 检查是否存在 layer、relation、boundary。
- 如果只是职责说明，不能标为 architecture。

## `template-owns-lifecycle`

Trigger:

- `path matches mapping/*/templates/*.md`
- `section contains source / review / pick / update / write / lifecycle terms`
- `section contains MUST / SHOULD / MUST NOT with concrete subject`

Why:

template 只负责复制后的内容骨架。docwarden workflow 负责操作生命周期，policy 负责规则本体。

Source:

- [[mapping/bootstrap/modules/concept/template|template]]
- [[mapping/bootstrap/modules/policy/template-boundary|template-boundary]]

Inspection:

- 生命周期内容回到 docwarden workflow。
- 规则本体回到 policy。
- template 只保留复制骨架和占位。

## `example-as-kind`

Trigger:

- `frontmatter.kind == example`
- `path contains /templates/example.md`
- `directory name == example`
- `text states example proves kind or content type`

Why:

example 是样本语言，kind 是内容语言入口。example 不能反向证明一个 content kind 成立。

Source:

- [[mapping/bootstrap/modules/concept/example|example]]
- [[mapping/bootstrap/modules/concept/kind|kind]]
- [[mapping/bootstrap/modules/policy/kind-boundary|kind-boundary]]

Inspection:

- 检查 example 是否在提供具体样本。
- 不要让 example 反向制造 kind。

## `composition-as-list`

Trigger:

- `frontmatter.kind == composition`
- `body contains list items`
- `body missing whole / part / stable semantic boundary terms or sections`

Why:

composition 是组合结构，list 只是语言形式。没有稳定语义边界的列表不构成 composition。

Source:

- [[mapping/bootstrap/modules/concept/composition|composition]]
- [[mapping/bootstrap/modules/concept/structure|structure]]

Inspection:

- 检查是否说明 part 为什么属于同一个 whole。
- 如果只是并列信息，不能标为 composition。
