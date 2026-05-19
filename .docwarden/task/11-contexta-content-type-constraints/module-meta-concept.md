---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 6
---

# module meta concept

本文件定义 contexta 中 `module` 作为语义组合单元的候选基线。

## 核心判断

`module` 是语义组合单元。

它解决的问题是：多条可审查语义如何在一个稳定边界内组成可阅读、可复用、可维护的 md 单元。

`module` 不是单条规则、不是目录索引、不是 workflow task、不是 review artifact，也不是 template。

## 第一性原理

contexta 需要同时避免两个损失：

- 只保留单条 assertion：语义过碎，缺少 intent、scope 和上下文，后续复用成本高。
- 把多个主题塞进一个文件：边界过大，review、lint、迁移和维护都会失真。

因此 module 的存在理由是提供稳定的语义组合边界。

一个 module 应围绕同一个 intent 和 scope 组织内容。

## 统一内容

一个 module 至少应该能说明：

- 它围绕什么稳定主题成立。
- 它适用于什么语义范围。
- 它不适用于什么语义范围。
- 它包含哪些可审查 assertion。
- 它需要哪些 concept 或 example 来支撑理解和校验。

这些是 module 的共同语义，不等于固定标题模板。

不同 `kind` 的 module 可以使用不同骨架：

- policy module 可以突出 `Rules`。
- structure module 可以突出组成、关系、流转和边界。
- concept module 可以突出定义、非定义和术语关系。
- example module 可以突出正例、反例和边界例。

## 与 kind 的关系

`module` 是组合层，不等于 `kind: module`。

第一版不需要引入：

```yaml
kind: module
```

一个 md 文件可以是 module，同时通过 `kind` 表达它的内容元概念。

例如：

```yaml
kind: policy
```

表示这个 module 的内容元概念是 policy。

## 与其他 primitive 的边界

### policy

当一个 module 的核心是稳定约束，它是 policy module。

module 只说明这些约束如何组合在一个稳定语义边界内。

### structure

当一个 module 的核心是组成、关系、流转和承接，它是 structure module。

module 不把 workflow、pipeline 或 architecture 强行塞进 policy 骨架。

### assertion

assertion 是最小可审查语义单元。

module 可以包含多条 assertion，但 module 不等于 assertion。

单条 assertion 不应仅因为重要就默认升级为 module。

### concept

concept 定义术语或概念边界。

module 可以包含 concept；当某个 concept 本身成为稳定主题时，它也可以形成自己的 concept module。

### example

example 用于说明、校验或挑战边界。

module 可以包含 example；example 不替代 module 的主题边界。

## semantic lint 候选

contexta 后续 semantic lint 应能识别：

- module 名称只表达单条 assertion，而不是稳定主题边界。
- module 混合多个 intent 或 scope。
- module 缺少可审查 assertion。
- module 只有例子，没有定义或约束本体。
- module 只有目录或导航功能，没有语义组合功能。
- module 被用来承接 docwarden task / review / promote / pick / cleanup 生命周期。

## 当前例子

`.contexta/modules/policy/semantic-granularity.md` 可以被视为一个 policy module。

原因是：

- 它的 `kind` 是 policy。
- 它围绕 semantic granularity 这个稳定主题组织规则。
- 它包含多条共享 intent 和 scope 的 assertion。
- 它没有把每条 assertion 拆成独立 module。

不应作为 module 的例子：

```text
docs-must-not-edit
```

这个名称更像单条 assertion，而不是稳定主题边界。

## 审核点

- `module` 是否应定义为语义组合单元。
- `module` 是否应作为组合层，而不是默认 `kind: module`。
- module 是否应围绕稳定 intent 和 scope 组织多条 assertion。
- 单条 assertion 是否不应仅因为重要就升级为 module。
- module 是否不承接 docwarden 操作流程生命周期。

## Review

sayori 确认 module 和 assertion 的理解基本正确。

后续关键不在继续扩写概念定义，而在设计这两个概念如何在 contexta 中落地。
