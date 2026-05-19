---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 4
---

# cleanup handoff

本文件定义 promote / pick 的实体操作完成后，cleanup 何时接手。

## 核心判断

cleanup 是 docwarden 的操作流程环节。

它处理 task working materials 的完成策略。

它不能由 contexta template 决定。

cleanup 不判断内容格式，不判断资产性质，不选择实体落点。

这些判断必须在 promote / pick / review / entity landing 阶段完成。

## cleanup 接手条件

cleanup 只能在以下条件都满足后接手：

1. promote 的主线 delta 已经过 review。
2. promote 需要的实体操作已经完成、延后，或明确无落点。
3. pick candidate 已经过 review surface。
4. pick 的资产性质和实体落点已经由用户通过 lead 确认。
5. pick 需要的实体操作已经完成、延后，或转交 promote / contexta。
6. 未进入 promote / pick 的内容已明确只留在 task log。
7. 当前 task 的缺口和后续承接位置已经写明。

## cleanup 不应接手的情况

cleanup 不应接手：

- 还有未 review 的 promote delta。
- 还有未 review 的 pick candidate。
- 已 review 的 lead 在实体写入时需要实质变更。
- 资产性质或实体落点未确认。
- 需要转交 promote 或 contexta 的内容还没有记录。
- 当前 task 的缺口和后续承接位置没有写明。

## 默认完成策略

当前已确认的完成策略是：

```text
after_promote_pick: delete | archive
default: delete
```

含义：

- 默认 delete task working materials。
- 可以通过 config 选择 archive。

本文件不设计 config 文件位置、字段归属或执行机制。

## delete / archive 的边界

delete / archive 只处理 task working materials 的生命周期。

它不影响：

- 已写入的主线实体。
- 已写入的用户层实体。
- contexta template。
- 已明确转交的后续任务。

如果某个内容还没有被 promote、pick、转交或明确只留在 log，就不能因为 cleanup 而消失。

## 与 review 的关系

review 是用户口径对接点。

cleanup 不能改变 review 已确认的内容。

cleanup 只能在已确认内容完成实体落点后，处理剩余 working materials。

如果 cleanup 前发现实体写入需要改变 review 口径，应回到 review。

## 本轮不判断

- cleanup config 的文件位置。
- cleanup config 的字段 schema。
- delete / archive 的具体执行命令。
- review artifact 的长期保留策略。
- 自动化 cleanup 的 CLI 实现。

## 审核点

- cleanup 是否只在 promote / pick 的 review 和实体操作完成后接手。
- cleanup 是否属于 docwarden 操作流程，而不是 contexta template。
- cleanup 是否只处理 task working materials 生命周期。
- cleanup config 是否应另行设计，本轮只保留已确认的 `delete | archive` 边界。

## Review

sayori 确认本边界没有问题。
