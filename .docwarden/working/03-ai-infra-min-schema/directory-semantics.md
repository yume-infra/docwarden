---
status: accepted
created: 2026-05-12
updated: 2026-05-12
owner: sayori
loop: 2
review: accepted
---

# 目录与状态语义

本文件记录 Loop 2 已通过 review 的 working 定义。

这些定义只服务于 `.docwarden/working/` 下的 `docwarden` workflow，不扩展到其他区域。

## 工作面单位

`.docwarden/working/` 下以工作面目录作为基本单位。

每个工作面目录对应一个相对独立的任务、讨论线或实践线。

工作面目录名采用“编号 + 短语义 slug”，具体命名规则见 `naming-policy.md`。

## 固定文件

每个工作面最小固定文件：

- `roadmap.md`
- `log.md`

`roadmap.md` 是工作面的 lead file，也是该工作面的唯一震源。

它负责：

- 描述工作面边界
- 说明来源基线
- 维护当前判断
- 说明文件散发关系
- 汇总当前文件状态
- 指示下一步入口

`log.md` 只负责按时间记录事件。

它不承担主线解释，不承担命名增强，也不替代 `roadmap.md`。

## 散发文件

除 `roadmap.md` 和 `log.md` 外，其他文件按任务需要从 `roadmap.md` 散发。

例如：

- `plan.md`
- `schema-scope.md`
- `naming-policy.md`
- `directory-semantics.md`
- 后续 loop 的草案文件

这些文件不是每个工作面都必须存在。

## 两层状态

采用两层状态：

1. 工作面状态：描述整个工作面是否仍在推进。
2. 文件状态：描述单个文件在 review 生命周期中的位置。

为了避免冲突，工作面状态使用 `workspace_status`；文件状态使用 `status`。

## 工作面状态

工作面状态写在 `roadmap.md` frontmatter 中：

```yaml
workspace_status: active
```

当前只保留三个状态：

- `active`：当前正在推进。
- `paused`：暂时暂停，未来可能恢复。
- `closed`：工作面已经结束，不再继续推进。

暂不引入 `superseded`。

如果某个工作面未来被替代，先在 `roadmap.md` 和 `log.md` 中用自然语言说明。

## 文件状态

文件状态写在每个文件 frontmatter 中：

```yaml
status: draft
```

当前只保留三个状态：

- `draft`：agent 已生成，等待 sayori review。
- `reviewing`：正在 review，或正在根据 review 修改。
- `accepted`：sayori 接受为当前 working 定义。

`accepted` 不表示进入 stable，也不表示已经发生 promote 或 pick。

暂不引入文件级 `superseded`。

如果某个文件未来被替代，先在 `roadmap.md` 文件索引和 `log.md` 中用自然语言说明。

## roadmap 文件索引

采用 C 方案：

- 每个文件 frontmatter 自己带最小状态。
- `roadmap.md` 维护文件索引，作为人类和 agent 进入工作面的统一入口。

文件索引用自然语言补充状态含义。

示例：

```md
## 文件索引

- `schema-scope.md`：Loop 1 范围草案，状态：accepted；只是当前可容忍的工作定义，不是稳定理论定义。
- `naming-policy.md`：Loop 2 命名 policy，状态：accepted。
```

## 当前结论

本轮 review 已通过：

- 工作面采用编号目录。
- `roadmap.md` 是 lead file / 唯一震源。
- `log.md` 只记时间线。
- 状态采用 `workspace_status` + `status` 两层。
- 工作面状态先保留 `active`、`paused`、`closed`。
- 文件状态先保留 `draft`、`reviewing`、`accepted`。
