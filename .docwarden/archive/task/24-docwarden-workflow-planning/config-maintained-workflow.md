---
status: draft
created: 2026-05-31
updated: 2026-06-01
owner: sayori
---

# Config Maintained Workflow

本文件记录修正后的约束：docwarden workflow 仍然是 config maintain，但 config 属于 docwarden 使用层，不等同于 isomorph mapping definition。

## 核心修正

需要区分两种东西：

```text
definition layer
  -> .isomorph/mapping/docwarden/
  -> Markdown + frontmatter
  -> 用 isomorph 的 workflow structure 定义 docwarden workflow 是什么

runtime config layer
  -> .docwarden/ 下由 docwarden init 创建
  -> yaml 或其他机器友好的配置文件
  -> 配置当前项目实际怎么跑
```

上一版把它们合成了“docwarden-owned workflow config”，这是错误的。

## 为什么仍然是 config maintain

`dw:review` 可以物料化为 Codex skill，但 review workflow 的运行选项不应 hardcode 在 skill 里。

runtime config 至少应能维护：

- `review.mode`：`review-first` / `review-later`。
- review surface 文件形态。
- route targets。
- cleanup policy。
- 当前项目的启用资产或执行偏好。

这些属于 docwarden 使用层 config。

## definition layer 的职责

`.isomorph/mapping/docwarden/` 应承接 docwarden workflow 的语义定义。

它回答：

```text
docwarden 的 review workflow 作为 workflow structure，由哪些 state / move / transition 成立？
```

它不回答：

```text
某个项目现在选 review-first 还是 review-later？
某个项目的 .docwarden 目录怎么初始化？
某次任务的 review surface 输出到哪里？
```

这些交给使用层 config 和运行资产。

## runtime config 的职责

`docwarden init` 应创建基本框架和 config。

候选形态：

```text
.docwarden/
  config.yaml
  task/
  review/
  archive/
```

其中 `config.yaml` 只是候选名，最终文件名可后续确认。

候选配置：

```yaml
review:
  mode: review-first
  pending_marker: review-pending

cleanup:
  after_promote_pick: delete

review_surface:
  files:
    - index.md
    - lead.md
    - backing.md

route_targets:
  - promote
  - pick
  - log-only
  - transfer
  - no-op
```

## skill 的职责

`dw:review` skill 是执行单元。

它可以读取：

- `.docwarden/` 使用层 runtime config。
- 当前 task material。
- 必要时读取 `.isomorph/mapping/docwarden/` 的 workflow definition。
- 项目规则和 user profile。

它不能拥有：

- isomorph workflow structure 的定义权。
- docwarden workflow definition 的唯一真相。
- 当前项目 runtime config 的唯一真相。

## v0 取舍

v0 不做完整 workflow engine。

v0 先跑通：

```text
workflow definition
  -> docwarden init
  -> runtime config
  -> dw:review
  -> review surface
  -> user review
```

这样既保留 config maintain，又不会把 mapping definition 错放到 `.docwarden/` 使用层里。
