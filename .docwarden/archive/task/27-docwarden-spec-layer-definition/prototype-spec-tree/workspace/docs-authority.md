---
kind: policy
---

# docs-authority

## Intent

保护 `docs/` 作为 human-maintained source layer 的边界。

本 policy 用于避免 agent 把 review 后的工作材料直接写入 `docs/`，或把 `.docwarden/spec/` 当成 `docs/` 的替代品。

## Scope

Applies to:

- `docs/`
- `.docwarden/task/`
- `.docwarden/review/`
- `.docwarden/spec/`

适用条件：

- 对话产生了可能属于长期文档体系的内容。
- agent 准备写入、迁移、promote 或整理文档材料。

不适用条件：

- 用户明确要求编辑某个具体 `docs/` 文件。
- agent 只是在读取 `docs/` 作为理论来源。

## Rules

- agent MUST NOT directly edit files under `docs/` without explicit user instruction.
- agent MUST capture uncertain or generated material outside `docs/` first.
- `.docwarden/spec/` MUST describe stable execution context for agents.
- `.docwarden/spec/` MUST NOT be treated as a replacement for human-maintained `docs/`.

## Rationale

docwarden 的价值在于维护文档 workflow，而不是让 agent 绕过人类维护层。
