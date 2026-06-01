---
status: draft
created: 2026-06-01
updated: 2026-06-01
owner: sayori
---

# Mapping Layer Correction

本文件记录 2026-06-01 的关键纠偏：上一版把 definition layer 和 docwarden 使用层 config 混在了一起。

## 修正后的层级

当前应按下面的层级理解：

```text
isomorph
  -> 提供 semantic primitive
  -> 定义 workflow structure：state / move / transition

.isomorph/mapping/
  -> 表示 semantic mapping，即理论对象如何映射成可维护实体

.isomorph/mapping/bootstrap/
  -> isomorph 的自举映射
  -> 用 isomorph 自己的内容语言定义 isomorph 自己

.isomorph/mapping/contexta/
  -> contexta 层映射
  -> 当前 repo 里的 user-context mapping 示例应按这个口径理解
  -> 现有 `.isomorph/mapping/docwarden/` 是产品名更新前的命名，需要后续迁到 contexta 口径

.isomorph/mapping/docwarden/
  -> 新的 docwarden 层映射
  -> 利用 isomorph 的 workflow structure，整理 docwarden workflow 初版实现的定义层内容

docwarden 使用层
  -> 由 `docwarden init` 创建基本框架和资产
  -> 用 yaml 或其他配置文件保存项目实际 config
```

## 关键纠错

上一版错误点：

- 把 `.docwarden/workflow/review.md` 当成 workflow 定义入口。
- 把 Markdown + frontmatter 当成 docwarden 使用层 config 的默认形态。
- 把 docwarden workflow 的 definition layer 和 runtime config layer 写成了同一个东西。

修正后：

- Markdown + frontmatter 先属于 `.isomorph/mapping/<layer>/...` 下的定义层。
- docwarden 使用层 config 应由 `docwarden init` 创建的资产承接，形态可以是 yaml 或其他更适合机器消费的配置文件。
- `review.mode` 等运行选项应落在 docwarden 使用层 config，而不是把 definition layer 当 runtime config。
- 新的 docwarden mapping 层应利用 isomorph 的 `workflow = state + move + transition`，定义 docwarden v0 workflow 的结构。

## 当前 repo 的命名迁移含义

现有：

```text
.isomorph/mapping/docwarden/modules/concept/user-context.md
.isomorph/mapping/docwarden/templates/user-context.md
```

应按“旧 docwarden 名称，现应改为 contexta”的口径看待。

它们不是当前要设计的 docwarden 文档维护 workflow。

后续需要一个明确迁移：

```text
.isomorph/mapping/docwarden/ 旧内容
  -> .isomorph/mapping/contexta/

新的 docwarden workflow mapping
  -> .isomorph/mapping/docwarden/
```

## 新的基本链路

v0 不应从 `.docwarden/workflow/review.md` 起步。

更合理的链路是：

```text
isomorph workflow structure
  -> .isomorph/mapping/docwarden/ 下的 workflow definition
  -> docwarden init
  -> .docwarden/ 基本框架与项目资产
  -> .docwarden/ 下的 yaml 或其他 runtime config
  -> dw:review 等执行单元读取 config
  -> review surface
  -> user review
  -> promote / pick / log / cleanup
```

其中 definition layer 负责“这个 workflow 语义上是什么”，docwarden 使用层 config 负责“这个项目实际怎么跑”。
