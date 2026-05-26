---
status: accepted
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# target availability review

## Review Lead

没有真实 target 时，不做 semantic-lint dry run。

这里不伪造 fixture。

## Existing Target Model

此前已经设计过两层 target。

### target scope

target scope 说明 semantic-lint 可以扫描哪些 md。

旧 dry run 中的 scope 是：

```text
.contexta/mapping/**/*.md
```

`.docwarden/task/**` 只作为工作材料，不进入 semantic lint target。

`docs/` 当前不检查。

### locator target

locator target 说明一次 signal 命中最终指向哪条可审查 assertion。

当前已接受口径：

- locator 服务 assertion 审核定位。
- assertion marker 第一版采用 `^a-*`。
- module path、heading 和 relation block heading 只能提供定位上下文。
- 如果只能定位到 heading，而没有 assertion marker，它最多是 candidate。

## Usable Target

可用靶子至少需要：

- 位于当前 target scope 内。
- 是真实存在的 md 内容，不是为了测试临时编造的 fixture。
- 有一个可能命中的 signal name。
- 有 trigger hit 或可疑现象。
- 有 evidence 原文片段。
- 最好有 locator 指向 `^a-*` assertion marker。

如果没有 assertion marker：

- 可以记录为 candidate / context。
- 不升级为 review-ready lint result。
- 不强行做 dry run。

## Relation To Review-ready Lint Result

review-ready lint result 需要尽量接近 `lead + backing`。

因此它需要一个可被 user 审核的 target。

可用 target 的核心不是“有文件”，而是“有可定位、可审查的 assertion”。

## Current Decision

当前没有真实 target。

所以本轮不做 lint dry run。

后续等真实编辑、审查或 semantic-lint 扫描中出现 candidate，再判断它是否能升级为 review-ready lint result。
