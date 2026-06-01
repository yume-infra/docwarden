---
status: draft
created: 2026-06-01
updated: 2026-06-01
owner: sayori
---

# Docwarden Contexta Mapping Boundary

本文件修正上一版“只强调 docwarden 与 contexta 拆开”的过粗判断。

## 核心修正

当前问题不是简单的“docwarden 和 contexta 是两条产品线”。

更准确的是：

```text
isomorph
  -> 定义 semantic primitive
  -> 定义 mapping / workflow 等结构语义

.isomorph/mapping/bootstrap
  -> isomorph 自举

.isomorph/mapping/contexta
  -> contexta 层语义映射
  -> 现有 user-context 示例应归到这个口径

.isomorph/mapping/docwarden
  -> 新的 docwarden 层语义映射
  -> 用 workflow structure 整理 docwarden workflow 初版定义

docwarden 使用层
  -> 由 docwarden init 创建项目框架、资产和 runtime config
```

## 产品名更新影响

现有 `.isomorph/mapping/docwarden/` 里的 `user-context` 示例，是旧产品名时期留下的层级。

按当前命名，它应理解为 contexta 层 mapping 示例，而不是当前 docwarden 文档维护 workflow。

因此后续迁移应是：

```text
旧 .isomorph/mapping/docwarden/
  -> .isomorph/mapping/contexta/

新的 .isomorph/mapping/docwarden/
  -> docwarden workflow definition mapping
```

## docwarden 的位置

docwarden 仍是文档维护 workflow 的产品线。

但它的 workflow 初版实现需要分两层：

- definition layer：在 `.isomorph/mapping/docwarden/` 中，用 isomorph 的 workflow structure 表达。
- use layer：通过 `docwarden init` 创建 `.docwarden/` 框架，并用 yaml 或其他 config 表达项目运行选项。

这两层不能合并。

## contexta 的位置

contexta 是 capability / prompt / skill / agent / user-context 等内容的映射与分发产品线。

它可以有自己的 mapping definition。

它不直接拥有 docwarden 的文档维护 workflow。

但当前 repo 的历史命名会造成误读：旧 `mapping/docwarden` 下的 user-context 示例，现在应归入 contexta。

## 对 v0 的影响

上一版错误链路：

```text
docwarden workflow config
  -> .docwarden/workflow/review.md
  -> dw:review skill
```

修正后链路：

```text
isomorph workflow structure
  -> .isomorph/mapping/docwarden/ workflow definition
  -> docwarden init
  -> .docwarden/ runtime config
  -> dw:review skill 执行
  -> review surface
```

其中 `.isomorph/mapping/docwarden/` 解决定义层问题，`.docwarden/` 解决项目使用层问题。
