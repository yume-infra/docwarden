---
status: superseded
created: 2026-05-19
updated: 2026-05-20
owner: sayori
loop: 6.1
---

# module / assertion landing

## 归档同步

本文件是 Loop 6.1 的历史草案，当前已被 task 11 归档口径部分替代。

保留有效判断：

- module 是语义组合单元，不是 `kind: module`。
- assertion 是最小可审查语义单元。
- assertion 不默认独立成文件。
- template 不管理 assertion 生命周期。

需要转入 task 12 重新 review 的判断：

- `.contexta/modules/<kind>/<module-id>.md` 是否仍是 module 的稳定长期落点。
- assertion 在 module 内如何被最小审查和定位。
- module / assertion 是否应通过 composition 显式建模。
- `kind`、content type metadata 与 docwarden operation metadata 的边界。

当前后续承接：

- `.docwarden/task/12-contexta-model-followup/`

---

本文件定义 `module` 和 `assertion` 在 contexta 中的第一版落地方式候选。

## 核心判断

第一版落地应保持现有 `.contexta` 形状：

- md 文件是 module 的默认落点。
- module 内部的可审查语义项是 assertion 的默认落点。
- assertion 不默认独立成文件。
- template 提供 module 骨架，不提供 assertion 生命周期。

这意味着：

```text
.contexta/modules/<kind>/<module-id>.md
```

是 module 的主落点。

assertion 的主落点在 module 文件内部。

## 为什么这样落地

如果把 assertion 独立落盘，会产生两个问题：

- contexta 会过早变成 assertion database，而不是人可读的内容协议。
- module 的 intent、scope、rationale 和 examples 会被拆散，语义上下文丢失。

如果只承认 module，不承认 assertion，又会产生另两个问题：

- review、diff、lint、pick 无法落到最小可审查语义。
- 一个 module 内部的多条规则或判断无法被稳定定位和讨论。

所以第一版需要同时成立：

- module 是持久组合单位。
- assertion 是最小 review / lint / pick 单位。

## module 落点

module 应落在：

```text
.contexta/modules/<kind>/<module-id>.md
```

其中：

- `<kind>` 对应内容元概念，如 `policy`、`structure`、`concept`、`example`。
- `<module-id>` 对应稳定主题边界，如 `semantic-granularity`。

第一版不新增：

```yaml
kind: module
module_id: ...
```

原因：

- `kind` 应表达内容元概念，而不是组合层。
- `module_id` 可先由文件名承担。
- 过早增加 metadata 会把组合边界问题变成字段设计问题。

## assertion 落点

assertion 应落在 module 内部，通常是列表项。

policy module 中，assertion 的默认位置是：

```md
## Rules

- <subject> <MUST|MUST NOT|SHOULD|SHOULD NOT|MAY> <predicate> <object / condition>。
```

structure / concept / example module 中，assertion 也可以存在，但不要求全部使用 RFC2119。

例如：

```md
- workflow 表达阶段、交接、分支和完成条件。
- concept 定义术语边界，不承担流程编排。
- 这个例子是反例，因为它把 workflow 写成 policy-only Rules。
```

第一版不为 assertion 新增独立 frontmatter、独立文件或全局 ID。

## assertion 定位

第一版 assertion 可通过以下组合定位：

```text
module path + heading path + list item text
```

例如：

```text
.contexta/modules/policy/semantic-granularity.md
## Rules
- contexta MUST 将断言视为最小语义审查单位。
```

如果一个 module 使用三级标题分组，则定位为：

```text
module path + heading path + assertion list item
```

例如：

```text
.contexta/modules/policy/audience.md
## Rules / ### Audience Decision
- contexta 文档作者 MUST 在写作前明确目标读者。
```

第一版不强制给 assertion 添加锚点 ID。

后续只有在 review、diff 或迁移需要更稳定引用时，再考虑：

```md
- [a:<stable-id>] <assertion text>
```

或其他轻量锚点。

## template 如何支持

template 只负责复制后的内容骨架。

因此 template 应支持 module，而不是支持 assertion 生命周期。

policy template 可以提供：

```md
## Rules

- <主体> <MUST|MUST NOT|SHOULD|SHOULD NOT|MAY> <动作> <对象/范围/条件>。
```

这只是 assertion 的书写槽位。

它不表示：

- assertion 有独立文件。
- assertion 有独立状态。
- assertion 由 template 管理来源、review、pick、更新或生命周期。

## semantic lint 如何支持

semantic lint 第一版应把 module 和 assertion 分开检查。

module 层检查：

- module 是否有稳定主题边界。
- module 是否有清晰 intent / scope 或等价结构。
- module 是否混入多个 intent 或 scope。
- module 名称是否像主题边界，而不是单条 assertion。

assertion 层检查：

- assertion 是否是单条可审查语义。
- policy assertion 是否使用 RFC2119 强度。
- assertion 是否有明确主体、动作、对象或条件。
- 一个列表项是否混入多个独立判断。
- assertion 是否缺少所在 module 的语义上下文。

## 与 docwarden 的边界

docwarden 可以在 review / promote / pick 中引用 assertion。

但 assertion 的长期落点仍在 contexta module 内。

docwarden 不应把 assertion 生命周期写进 contexta template。

contexta 不应负责：

- task 状态。
- review surface。
- promote 分流。
- pick 选择。
- cleanup。
- 实体生命周期。

## 第一版落地结论

当前建议：

- 保持 `.contexta/modules/<kind>/<module-id>.md` 作为 module 落点。
- 保持 module 文件内列表项作为 assertion 落点。
- 不新增 `kind: module`。
- 不新增 assertion 独立文件。
- 不新增 assertion 全局 ID。
- 只在 semantic lint 和 review 引用层承认 assertion 的最小单位地位。
- 后续如果定位稳定性不足，再设计轻量 assertion anchor。

## 审核点

- module 是否应落在 `.contexta/modules/<kind>/<module-id>.md`。
- assertion 是否应先落在 module 内部，而不是独立文件。
- 第一版是否不新增 `kind: module` 和 assertion 全局 ID。
- assertion 是否应先通过 `module path + heading path + list item text` 定位。
- template 是否只提供 assertion 书写槽位，不管理 assertion 生命周期。
