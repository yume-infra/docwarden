---
status: accepted
created: 2026-05-12
updated: 2026-05-12
owner: sayori
loop: 2
review: accepted
---

# 工作面命名 policy

本文件是 `03-ai-infra-min-schema` 的 working material，用于起草 `.docwarden/working/` 下工作面的命名规则。

这份 policy 只处理 `docwarden` workflow 的操作层问题：agent 如何创建、查找和引用 working 目录。它不定义文档内容 schema，也不处理 `contexta` 的语义建模。

## 目标

工作面命名要同时满足两个目标：

- 稳定引用：agent 和 sayori 能用短目录名反复指向同一个工作面。
- 可查询：agent 在不知道准确目录名时，能通过关键词找到相关工作面。

因此，目录名只承担最小识别责任；更完整的查询增强放在每个工作面的 `roadmap.md` 中。

## 目录命名格式

`.docwarden/working/` 下的工作面目录采用：

```text
NN-short-semantic-slug
```

其中：

- `NN` 是两位编号，用于表达工作面建立时的相对顺序。
- `short-semantic-slug` 是短语义 slug，用连字符连接。
- 目录名只写主对象或主产物，不写成长标题。

例子：

```text
03-ai-infra-min-schema
04-docwarden-operation-schema
05-contexta-content-schema
```

## slug 选择规则

slug 应该短、稳定、可读。

优先选择：

- 工作域或主题：`docwarden`、`contexta`、`ai-infra`
- 主要对象：`schema`、`workflow`、`practice`、`policy`
- 主要产物：`min-schema`、`operation-schema`、`naming-policy`

避免选择：

- 过长的自然语言标题
- 只对当前对话有意义的临时词
- 多个概念堆叠在同一个 slug 里
- 需要频繁改名才能保持准确的表述

如果目录名和后续理解出现轻微偏差，优先在 `roadmap.md` 中补足，不要立刻重命名目录。

## roadmap.md 的查询增强

每个工作面的 `roadmap.md` 是该工作面的 lead file，也是唯一震源。目录名保持短，查询增强由 `roadmap.md` 承担。

`roadmap.md` 可以放这些信息：

- `aliases`：常见别名、旧称、中文名、相关英文名。
- `source baseline`：本工作面依据的理论文件、历史工作面或对话来源。
- `keywords`：agent 可能用于搜索的关键词。
- `scope`：这个工作面负责什么、不负责什么。
- `entry`：agent 进入该工作面后应该先读哪些文件。

这意味着目录名不需要覆盖所有搜索词。只要 `roadmap.md` 能让 `rg` 或 agent 检索命中，查询需求就可以被满足。

## 编号规则

编号用于降低引用成本，不承担理论层级含义。

- 新工作面默认使用下一个可用编号。
- 编号一旦被引用，就不因为后续理解变化而轻易重排。
- 如果某个工作面被暂停或废弃，编号可以保留；不需要为了连续性重命名历史目录。

## 避免事项

不建议：

```text
2026-05-12-design-the-minimal-ai-infra-schema-for-docwarden-working-loop
03-schema
03-current-task
03-docwarden-contexta-ai-infra-stable-working-review-pick-policy
```

原因：

- 日期长目录名会把长期任务绑定到创建日期上。
- 过短 slug 会丢失语义，后续查询困难。
- 临时名称会让历史目录失去稳定性。
- 把所有关键词塞进目录名，会让目录名变成标题，反而不适合反复引用。

## 当前目录名建议

当前目录名 `03-ai-infra-min-schema` 可以保留，不建议改名。

理由：

- 它符合“编号 + 短语义 slug”格式。
- `ai-infra` 能保留当前工作面的主题锚点。
- `min-schema` 能表达本轮产物方向。
- 当前命名已经足够短，查询增强可以由 `roadmap.md` 补足。

如果未来需要更精确的命名，可以在新工作面中使用类似 `04-docwarden-operation-schema` 的目录名，而不是立即重命名当前目录。
