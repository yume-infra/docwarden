---
status: draft
created: 2026-05-31
updated: 2026-05-31
owner: sayori
---

# Archive Mainline Decisions

本文件整理 archive 中已经通过 review 的 docwarden 主链路判断。

这些内容不应在 v0 规划中重新发明，只需要改写成可执行版本。

## 1. 主模型已经从 stable 改成 pipeline

已接受模型：

```text
task -> review system -> spec
                    -> guide
                    -> wiki
```

含义：

- `task` 是短命任务过程层。
- `review system` 从 task 中提炼可审查内容。
- `spec` 服务 agent 执行。
- `guide` 服务 user 理解和新需求上下文恢复。
- `wiki` 服务长期知识网络。

来源：

- `.docwarden/archive/task/04-task-review-spec-pipeline/pipeline-positioning.md`
- `.docwarden/archive/task/04-task-review-spec-pipeline/pipeline-structure.md`

## 2. review surface 是短命审查面，不是长期层

已接受判断：

- review 是系统，不只是目录或 Markdown 文件。
- review surface 应降低 user review 成本。
- review surface 本体短命。
- review 后只保留足够 decision trace。
- review 不作为长期知识入口。

当前最小 artifact 结构已经 dry run 通过：

```text
review artifact/
  index.md
  lead.md
  backing.md
```

其中：

- `index.md` 负责入口和交接。
- `lead.md` 只放待审核内容本体。
- `backing.md` 承载来源、上下文、边界和校验材料。

来源：

- `.docwarden/archive/task/04-task-review-spec-pipeline/review-surface-shape.md`
- `.docwarden/archive/task/08-promote-pick-dry-run/dry-run-conclusion.md`

## 3. promote 是主线基线 delta

已接受判断：

promote 的核心问题是：

```text
这轮 user review 之后，项目的主线稳定基线应该发生什么变化？
```

promote 处理：

- 已通过 user review 的主线理解。
- 项目主线基线变化。
- 面向 spec / guide / wiki 的职责投影。

promote 不处理：

- raw task material。
- 完整 review lead / backing 展示。
- review 中顺手发现的 side 信息。
- user-level asset。

来源：

- `.docwarden/archive/task/07-review-trace-design/promote-rules.md`
- `.docwarden/archive/task/09-promote-pick-entity-landing/promote-entity-landing.md`

## 4. pick 发生在 promote 之后

已接受判断：

pick 不是和 promote 对称的第二条主流程。

pick 是：

```text
promote 之后的信息损失控制
```

它回答的问题是：

```text
promote 之后，哪些被主线稳定化过程隐去的信息仍有长期价值？
```

pick 处理：

- user-level asset。
- 用户协作偏好。
- 用户纠偏信号。
- agent 错误模式。
- 不改变项目主线、但能帮助后续协作的判断资产。

pick 不处理：

- 项目主线规则。
- review artifact schema。
- cleanup config。
- spec / guide / wiki 的主线内容。
- template / metadata / module / assertion / semantic lint。

来源：

- `.docwarden/archive/task/07-review-trace-design/pick-rules.md`
- `.docwarden/archive/task/09-promote-pick-entity-landing/pick-entity-landing.md`

## 5. review 后没有独立 result / ledger 层

已接受判断：

user review 之后不引入独立 `review result`。

也不把 `decision trace` 设计成新的持久化账本层。

review 后真正需要处理的是分流：

```text
promote / pick / log
```

来源：

- `.docwarden/archive/task/07-review-trace-design/promote-pick-log-boundary.md`

## 6. candidate 只是临时状态

archive 中的 `promote-candidates.md` 是 dry run 候选投影。

它不构成 candidates layer。

candidate 只能表示 review 前或实体落点前的临时判断：

```text
agent thinks this may route to X, but user has not confirmed it yet
```

v0 不应把 candidate 设计成稳定输出层。

来源：

- `.docwarden/archive/task/08-promote-pick-dry-run/promote-candidates.md`
- `.docwarden/archive/task/08-promote-pick-dry-run/dry-run-conclusion.md`

## 7. 实体落点先判断功能，再判断文件

已接受判断：

promote 后实体落点顺序：

1. 识别已通过 review 的主线 delta。
2. 判断 delta 服务哪一种稳定功能。
3. 选择或创建具体实体。
4. 确认实体操作不会引入未 review 的新主张。

稳定功能：

- agent 执行规则 -> `.docwarden/spec/`
- user 理解路径 -> `.docwarden/guide/`
- 可链接项目知识 -> `.docwarden/wiki/`

pick 后实体落点顺序：

1. 识别 pick candidate。
2. 生成 pick review surface。
3. 通过 lead 给 user review 资产性质和建议实体落点。
4. user 确认后选择或创建具体实体。
5. 确认实体操作不改变已 review 的用户口径。

来源：

- `.docwarden/archive/task/09-promote-pick-entity-landing/promote-entity-landing.md`
- `.docwarden/archive/task/09-promote-pick-entity-landing/pick-entity-landing.md`

## 8. cleanup 只在分流完成后接手

已接受判断：

cleanup 只处理 task working materials 的生命周期。

cleanup 不判断内容格式，不判断资产性质，不选择实体落点。

cleanup 接手前必须满足：

- promote delta 已 review。
- promote 实体操作已完成、延后或明确无落点。
- pick 已经过 review surface。
- pick 资产性质和实体落点已由 user 确认。
- 未进入 promote / pick 的内容已明确只留在 task log。
- 当前 task 缺口和后续承接位置已写明。

默认完成策略：

```text
after_promote_pick: delete | archive
default: delete
```

来源：

- `.docwarden/archive/task/09-promote-pick-entity-landing/cleanup-handoff.md`

## v0 判断

docwarden v0 不应重新设计主链路。

它应实现已确认主链路的最小可执行版本：

```text
task material
  -> surface for promote
  -> user review
  -> promote mainline delta
  -> pick user-level compoundable assets
  -> log only for residue
  -> cleanup handoff
```

入口修正：

- 主路径不应要求用户手动触发 review。
- v0 可以用 review skill 作为 workflow 内部调度单元。
- `review` 应作为 task execution 之后、cleanup / archive / commit 之前的自然 workflow phase。
- 手动 `review` skill 入口可以存在，但只作为高级用法、补跑入口或失败恢复入口。

v0 最小成功标准：

- 能从一个 task 生成 `index.md / lead.md / backing.md` review artifact。
- lead 聚焦主线基线 delta。
- backing 能说明来源、边界、风险和 candidate routing。
- user review 后能形成 promote / pick / log 分流。
- promote 只处理已确认主线 delta。
- pick 在 promote 后处理被隐去但有长期价值的 user-level asset。
- cleanup 前能写明未处理缺口和后续承接位置。
