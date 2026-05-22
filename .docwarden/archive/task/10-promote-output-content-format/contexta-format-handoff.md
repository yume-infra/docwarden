---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 5
---

# contexta format handoff

本文件记录 `10-promote-output-content-format` 收口后需要转给 contexta 约束设计的内容。

## 已跑通的部分

基于 `08-promote-pick-dry-run/promote-candidates.md`，本轮已经产出三类 promote output 候选：

- `spec-module-format-instance.md`
- `guide-page-format-instance.md`
- `wiki-node-format-instance.md`

主要内容方向已经成立：

- spec 候选服务 agent 执行。
- guide 候选服务 user 理解路径。
- wiki 候选服务可链接项目知识。

## 暴露的核心问题

`workflow` 不应直接套用 policy 结构。

当前 `spec-module-format-instance.md` 使用了：

```text
Intent / Scope / Rules / Failure Handling
```

这更接近 policy 内容类型。

但 `review workflow` 本质上应属于 architecture 内容类型。

因此后续 contexta 约束设计需要区分：

- policy 内容类型。
- workflow / architecture 内容类型。
- guide page 内容类型。
- wiki node 内容类型。

## contexta 后续承接

contexta 应设计内容类型约束，而不是由 docwarden task 继续临时决定格式。

后续至少需要判断：

- workflow / architecture 的内容骨架是什么。
- policy 的内容骨架是什么。
- 两者如何避免混用。
- 哪些字段属于内容类型字段。
- module / assertion 如何在不同内容类型中组织。
- semantic lint 如何识别“workflow 被写成 policy”的错误。

## 本轮不继续做

本轮不修改：

- `.docwarden/spec/`
- `.docwarden/guide/`
- `.docwarden/wiki/`
- `.contexta/templates/`

本轮不真实写入长期层。
