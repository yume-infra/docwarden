---
status: draft
created: 2026-05-31
updated: 2026-05-31
owner: sayori
---

# Review User Flow

本文件修正 `review` 的产品入口。

## 核心修正

`review` 不应该是用户手动想起来调用的普通 skill。

手动触发 `review` 可以存在，但它属于高级用法或恢复入口，不应该是主用法。

主用法应该是：用户正常推进一个任务，任务进入可收口状态时，docwarden 自动进入 review 阶段，把需要用户确认的内容整理成 review surface。

这不意味着 v0 不设计 review skill。

更准确的取舍是：v0 可以用 skill 作为流程内部调度单元，只是不把“用户手动调用 skill”设计为主体验。

同时，workflow 本体应由 config 维护。skill 是读取和执行 workflow config 的载体，不是 workflow 的唯一真相。

本文件描述的是 `review-first` 模式。

另一个模式是 `review-later`：先生成内容并打 pending review 标记，最后集中 final review，再清除标记。

## 用户视角

用户不应该需要说：

```text
请运行 review skill
```

用户更自然的路径是：

```text
我让 agent 做一件事
  -> agent 完成实现 / 规划 / 文档整理
  -> 系统发现本轮产生了可能需要长期化的内容
  -> 自动生成 review surface
  -> 用户只审核本轮主线 delta
  -> 系统根据审核结果继续 promote / pick / log / cleanup
```

用户感知到的是“任务结束前有一个收口审查面”，不是“我需要手动调用一个工具”。

## 系统链路

`review-first` 主链路应理解为：

```text
task execution
  -> completion candidate
  -> review phase
  -> review surface
      -> lead
      -> backing
  -> user review
  -> route
      -> promote
      -> pick
      -> log only
      -> transfer
      -> no-op
  -> cleanup handoff
```

## review phase 的触发

v0 可以先用 agent 工作流约定实现，而不是一开始做完整 daemon / hook。

触发条件可以先是：

- 当前 task 被认为完成。
- 当前 task 产生了新的设计判断、用户纠偏、主线口径变化或实现事实变化。
- 准备归档 task。
- 准备提交 git。
- 用户要求“收口”“归档”“提交”“下一步”。

这些触发不要求用户显式说“review”。

在 `review-later` 模式下，触发点不同：workflow 可以先生成内容并标记 pending review，最后在 final review 阶段集中处理。

## review capability 的位置

可以存在 `dw:review` capability。

v0 中它可以主要物料化为 Codex skill。

但这个 skill 的主职责不是提供一个用户手动调用的入口，而是给 agent / workflow runner 提供 review phase 的执行规则、模板和脚本。

这些执行规则应来自可维护的 workflow config，而不是全部 hardcode 在 skill 文本里。

可能的物料化形态：

- Codex skill：v0 的主要执行载体，同时也可作为高级手动入口。
- workflow asset：描述 review phase 的状态转移。
- prompt：用于生成 lead / backing。
- template：生成 review artifact 骨架。
- check：检查 review artifact 是否满足最小结构。

这些都可以由 contexta 分发，但 review 的业务语义属于 docwarden。

## 手动入口

手动触发 `review` 仍有价值，但不是主用法。

适用场景：

- 补跑某个历史 task。
- 对一个 archive task 重新生成 review surface。
- 用户明确想审查某个材料集合。
- workflow 自动触发失败后人工恢复。

## v0 实现判断

v0 应先实现“任务完成时由流程内部调度 review skill”的最小约定。

可以先不做底层自动监听，而是在 symphony / Codex agent 的任务收口规则中要求：

```text
before task close / archive / commit:
  dispatch dw:review when task contains long-term-worthy changes
```

这样可以避免把主体验设计成“用户手动调用 review skill”。

同时也避免把 docwarden workflow 做成不可配置的 skill 内部流程。
