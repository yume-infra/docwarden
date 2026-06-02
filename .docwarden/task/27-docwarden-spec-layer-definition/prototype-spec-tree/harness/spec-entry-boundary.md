---
kind: policy
---

# spec-entry-boundary

## Intent

约束什么内容可以进入 `.docwarden/spec/`。

本 policy 用于避免 task summary、review note 或未定位的候选内容被直接写成 stable spec。

## Scope

Applies to:

- `.docwarden/spec/`
- `.docwarden/review/`
- `.docwarden/task/`
- `docwarden promote --to spec`

适用条件：

- agent 准备把 review 后材料写入 `.docwarden/spec/`。
- agent 准备创建新的 spec module。
- agent 准备修改已有 spec module。

不适用条件：

- 内容只是 task 内部记录。
- 内容只是 review surface 的 backing material。
- 内容应进入 guide 或 wiki，而不是 spec。

## Rules

- spec entry MUST be a reviewed candidate assertion or a proposed patch awaiting review.
- spec entry MUST target a concrete workspace asset module path under `.docwarden/spec/<target>.md`.
- spec entry SHOULD identify the section, list item, or future locator position it intends to modify.
- `promote --to spec` MUST NOT generate a task-summary spec when the target module is unclear.
- When target module is unclear, `promote --to spec` MUST stop before writing stable spec.
- New stable spec modules MAY be created by the docwarden CLI's built-in minimal scaffold when `--kind` is provided.

## Rationale

spec 是稳定现状层。没有当前 workspace 资产落点的内容无法判断它属于当前仓库的哪个真实对象。
