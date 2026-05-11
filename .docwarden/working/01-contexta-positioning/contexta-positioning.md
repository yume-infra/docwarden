---
status: candidate
created: 2026-05-11
source: conversation
target_docs:
  - docs/ai基建建设/理念-v1.md
  - README.md
---

# Contexta Positioning

## Conversation Capture

当前仓库不只是一个单独的 `docwarden` 项目。它同时承载主项目 `docwarden` 和副产品 `contexta`。

`docwarden` 是主项目，关注 agent 时代的文档体系、文档维护机制，以及后续 CLI / plugin 形态。

`contexta` 是 AI 基建方向的正式产品线，关注 skills、schema、workflow 和上下文维护。它从一开始就定义为可扩展到 user 层级的基建，不只是当前项目内的局部工具。

暂时不拆成两个项目，原因是：

1. 两份理念有很多共同点，目前没有清晰拆分头绪。
2. 两者都处于 very early 阶段。
3. 两者可以互相作为内容来开发：`docwarden` 保障自身文档，`contexta` 服务于 `docwarden` 的编写。

## Candidate Stable Assertions

- `docwarden` MUST be treated as the primary project in this repository.
- `contexta` MUST be treated as the formal name of the AI infrastructure product line in this repository.
- `contexta` SHOULD cover skills, schema, workflow, and context-maintenance practices that support `docwarden`.
- `contexta` MUST be designed from the start as infrastructure that can expand to the user level, not only as project-local tooling.
- `docwarden` and `contexta` SHOULD NOT be split into separate projects yet.
- The current reason for not splitting is that their ideas overlap heavily, their boundaries are unclear, and both are still very early.
- The two lines MAY use each other as development material: `docwarden` protects and structures its own documents; `contexta` supports the writing and iteration of `docwarden`.
- Agents MUST NOT directly move these assertions into `docs/`; they must stay in working material until sayori reviews and picks them.

## Proposed Stable Landing

Primary landing candidate:

- `docs/ai基建建设/理念-v1.md`
- Suggested section: `## 定位`
- Reason: the file already defines the AI infra line as a layer above `docwarden`.

Secondary landing candidate:

- `README.md`
- Suggested position: under `# docwarden`, before the generated CLI description.
- Status: applied after user confirmation.
- Reason: README is the repository entrypoint and must make the current multi-project workspace explicit.

## Proposed Text For Review

This text is not applied. It is a review candidate only.

```md
当前仓库里实际存在两条产品线：

1. docwarden 是主项目，负责文档体系、文档维护机制，以及后续 CLI / plugin 的产品实现。
2. contexta 是正式命名的 AI 基建产品线，负责 skills 组织、schema、workflow 和上下文维护，并从一开始定义为可扩展到 user 层级的基建。

暂时不把 contexta 拆成独立项目。原因是 docwarden 与 contexta 在理念上有很多共同点，目前还没有清晰的拆分边界；同时两者都处于 very early 阶段，可以互相作为内容来开发：docwarden 保障自身文档，contexta 服务于 docwarden 的编写与迭代。
```

## Open Questions

- 已确认：`contexta` 是正式命名。
- 已确认：`contexta` 从一开始就定义为可扩展到 user 层级的 AI 基建。
- 已确认：双项目定位需要进入 README。
- 已确认：`docwarden 保障它的文档` 中的“它”指 `docwarden` 自身。
- 待确认：这些内容是否继续进入 `docs/ai基建建设/理念-v1.md`，或先拆出新的 `docs` 文档。

## Pick Checklist

- [x] sayori review 候选断言。
- [x] sayori 选择采纳、改写或拒绝。
- [x] README 入口定位已获明确授权并应用。
- [ ] 若进入 `docs/`，生成更精确的 proposed patch。
- [ ] 仅在 sayori 明确授权后，修改对应 `docs/` 稳定文档。
