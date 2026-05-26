---
status: draft
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# semantic-lint pipeline structure review

## Lead

本轮把 semantic-lint 的执行链路从旧的 `lint/` 目录口径中拆出来，初步落到 `structures/pipeline/`。

核心判断：

- semantic-lint 是检测语言 concept。
- pipeline 是 structure subtype。
- semantic-lint 的运行链路属于 pipeline structure。
- 服务这个 pipeline 的 concept 仍留在 `modules/concept`，不归入 pipeline 文件夹重定义。

## Current Split

Concept layer:

- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]：检测语言。
- [[mapping/bootstrap/modules/concept/signal|signal]]：被命名的 warning。
- [[mapping/bootstrap/modules/concept/trigger|trigger]]：可观察触发条件。
- [[mapping/bootstrap/modules/concept/locator|locator]]：assertion 定位机制。
- [[mapping/bootstrap/modules/concept/magic-word|magic-word]]：semantic-lint 可消费的控制 token 角色。
- [[mapping/bootstrap/modules/concept/confidence|confidence]]：signal candidate / instance 的识别强度。

Structure layer:

- [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint]]：从 formatted md 到 signal candidate / instance 的 pipeline。

Signal modules:

- [[mapping/bootstrap/modules/signal/concept-as-policy|concept-as-policy]]
- [[mapping/bootstrap/modules/signal/workflow-as-policy|workflow-as-policy]]
- [[mapping/bootstrap/modules/signal/architecture-as-responsibility-card|architecture-as-responsibility-card]]
- [[mapping/bootstrap/modules/signal/template-owns-lifecycle|template-owns-lifecycle]]
- [[mapping/bootstrap/modules/signal/example-as-kind|example-as-kind]]
- [[mapping/bootstrap/modules/signal/composition-as-list|composition-as-list]]

## Why

旧口径把 signal definitions 放成独立层，容易让人以为现在已经有一个完整 CLI lint engine。

当前阶段更准确的表达是：

```text
formatted md -> trigger -> signal candidate -> locator -> signal instance
```

这是一条 pipeline，不是 workflow，也不是 policy。

## Landing

已落地初版：

- 新增 `.contexta/mapping/bootstrap/structures/pipeline/semantic-lint.md`。
- 新增 `.contexta/mapping/bootstrap/modules/signal/*.md`，每个 signal 一个 module。
- 新增 `.contexta/mapping/bootstrap/modules/concept/confidence.md`。
- 新增 `.contexta/mapping/bootstrap/modules/policy/signal-boundary.md`。
- 删除旧 signal collection 路径。
- 删除中间 signal collection 路径。
- 修订 semantic-lint / pipeline / structure / magic-word concept 的关系说明。

## Review Focus

需要确认：

- `structures/pipeline/` 是否足以表达当前 semantic-lint 的结构定位。
- `modules/signal/*.md` 是否足以表达具体 signal definition。
- `confidence` 是否应作为 concept 独立存在，而不是 signal 或 magic-word 的字段。
- 后续是否还需要区分更多 `structures/` subtype instance 目录。
