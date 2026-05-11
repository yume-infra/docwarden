---
status: working
updated: 2026-05-11
owner: sayori
---

# Contexta Positioning Roadmap

本工作面记录 `docwarden` 与 `contexta` 的早期定位讨论。

## 边界

- 本目录是 conversation-derived working material。
- agent 可以维护本目录，用于记录候选断言、review notes 和 proposed patch。
- 本目录中的内容不会自动进入 `docs/`。
- 进入 `docs/` 前必须由 sayori review / pick。

## 内容

- `contexta-positioning.md`：本次对话形成的候选定位、候选断言、拟议落点和待确认问题。

## 源上下文

- 用户指出：当前仓库不止一个项目，主项目是 `docwarden`，副产品是 AI 基建 `contexta`。
- 用户指出：暂时不拆分的原因包括理念共同点多、边界尚不清晰、二者都处于 very early 阶段。
- 用户指出：`docwarden` 保障文档，`contexta` 服务于 `docwarden` 的编写与迭代。
- 用户纠正：agent 不允许直接修改 `docs/`，应先进入 working / review / pick 流程。
- 用户确认：`contexta` 是正式命名。
- 用户确认：`contexta` 从一开始就定义为可扩展到 user 层级的基建。
- 用户确认：双项目定位需要进入 README。
- 用户确认：`docwarden` 保障它的文档，其中“它”指 `docwarden` 自身。

## Review Points

- 已确认：`contexta` 是正式产品名。
- 已确认：`contexta` 从一开始就定义为可扩展到 user 层级的基建。
- 已确认：README 需要作为仓库入口表达双项目定位。
- 待确认：这组断言是否还应进入 `docs/ai基建建设/理念-v1.md`，或先拆出新的 `docs` 文档。
