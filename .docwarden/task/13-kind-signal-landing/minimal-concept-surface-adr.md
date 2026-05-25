---
status: accepted
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# ADR: minimal concept surface

## Status

Accepted.

## Context

contexta 追求最简和单一职责。

当前 `concept` module 中的 `Delimitation` 和 `Examples` 逐渐承担了多种职责：

- 概念连接。
- 误用检测。
- 约束提示。
- 定义补充。
- 样本教学。

这些职责现在已经有更明确的承接层：

```text
relation = 稳定概念连接
signal = 可复用误用检测
policy = 约束规则
example = 样本教学
concept = 命名与定义
```

继续让 `concept` 默认包含 `Delimitation` / `Examples`，会让 concept 重新膨胀成混合文档。

## Decision

`concept` 的标准职责收窄为：

```text
Designation
Naming Need
Definition
```

`Delimitation` 不再作为 concept 标准章节。

`Examples` 不再作为 concept 默认章节。

`example` 作为独立样本语言存在；需要教学样本时，应进入 example 体系或由 concept 通过 relation / link 指向 example，而不是默认塞进 concept。

## Responsibility Split

```text
concept
  稳定 semantic object 的名称、命名理由和正面定义。

relation
  维护 concept network 中稳定连接和阅读路径。

signal
  维护可复用的误用检测 warning type。

policy
  维护约束、禁止、允许和适用范围。

example
  用具体样本教 agent 如何理解、书写或判断。
```

## Directory Rule

目录只表达少数稳定主类型和维护分区，不无限表达 concept network。

当前接受的形态：

```text
concept/metadata.md
concept/metadata/kind.md

concept/structure.md
concept/structure/pipeline.md
concept/structure/workflow.md
...
```

规则：

```text
Only stable primary type families get directories.
All other hierarchy belongs to relation, not path.
```

也就是说：

- path 负责落点和阅读分区。
- relation 负责概念网络层级。
- kind 负责 module 的内容语言入口。

## Migration Rule

现有 `Delimitation` 内容不机械删除，逐条分类迁移：

```text
稳定连接 -> relation
误用检测 -> signal
约束规则 -> policy
定义性区分 -> Definition
教学样本 -> example
无稳定价值 -> delete
```

现有 `Examples` 内容不机械删除，逐条判断：

```text
高价值样本 -> example
只是解释 Definition -> Definition
占位或低价值样本 -> delete
```

## Consequences

- `concept` module 更薄，只承担命名与定义。
- 新 concept template 不再默认生成 `Delimitation` 和 `Examples`。
- relation 文件不再引用 `#Delimitation` 作为稳定边界来源。
- signal 成为误用检测的唯一正式承接层。
- example 成为样本教学的正式承接层。
- CLI / semantic-lint 可以更稳定地按 `kind` 和章节结构消费文档。

## Rejected Alternatives

保留 `Delimitation` 作为局部误用边界：拒绝。它会和 `signal` 重叠。

保留 `Delimitation` 作为同级概念比较：拒绝。它会复制 `relation` 的职责。

把 `Delimitation` 改名为 `Boundary`：拒绝。只是换名，职责重叠仍然存在。

立即删除所有 `Delimitation` / `Examples`：拒绝。现有内容里可能有可迁移判断，直接删除会丢失信息。

把所有概念层级都映射成目录：拒绝。目录会过度承担 ontology 表达，最终复制 relation 的职责。

## Acceptance Criteria

- concept template 不再默认包含 `Delimitation` / `Examples`。
- 新 concept module 不要求 `Delimitation` / `Examples`。
- relation files 不再依赖 `#Delimitation` 链接。
- reusable misuse detection 进入 `modules/signal/*.md`。
- stable concept connection 进入 `relations/*.md`。
- constraints 进入 `modules/policy/*.md`。
- teaching samples 进入 example layer。
- concept 正文只保留命名、定义和必要正面语义。
- 没有未审查的大规模删除。
