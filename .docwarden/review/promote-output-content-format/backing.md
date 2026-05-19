---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
source_task: 10-promote-output-content-format
---

# promote output content format backing

本文件是 `lead.md` 的 backing。

它只承担承载职责：支撑、展开和校验 `lead.md`。

## 来源覆盖

| lead 审核点 | backing material | 支撑关系 |
| --- | --- | --- |
| 1. 本轮对象是 promote 后内容生产 | `.docwarden/task/08-promote-pick-dry-run/promote-candidates.md`、`.docwarden/task/09-promote-pick-entity-landing/promote-entity-landing.md` | 08 产生 promote candidates，09 确认 promote 后实体落点。 |
| 2. 输入是已通过 review 的 promote delta | `.docwarden/review/docwarden-review-workflow/lead.md`、`.docwarden/task/08-promote-pick-dry-run/promote-candidates.md` | 08 的 candidates 来源于已 review 的 workflow lead。 |
| 3. 输出是格式实例候选，不真实写入 | `.docwarden/task/08-promote-pick-dry-run/promote-candidates.md`、`.docwarden/task/10-promote-output-content-format/promote-output-format-boundary.md` | 08 已说明 promote candidates 不能真实写入，10 只处理格式实例。 |
| 4. spec / guide / wiki 是不同表达 | `.docwarden/task/04-task-review-spec-pipeline/pipeline-positioning.md`、`.docwarden/task/09-promote-pick-entity-landing/promote-entity-landing.md` | 04 定义三层职责，09 确认三种稳定功能。 |
| 5. spec module 服务 agent 执行规则 | `.docwarden/task/04-task-review-spec-pipeline/pipeline-positioning.md`、`.docwarden/task/09-promote-pick-entity-landing/promote-entity-landing.md` | spec 是 agent-facing 执行规范层。 |
| 6. guide page 服务 user 理解路径 | `.docwarden/task/04-task-review-spec-pipeline/pipeline-positioning.md`、`.docwarden/task/09-promote-pick-entity-landing/promote-entity-landing.md` | guide 是 user-facing 叙事层。 |
| 7. wiki node 服务可链接项目知识 | `.docwarden/task/04-task-review-spec-pipeline/pipeline-positioning.md`、`.docwarden/task/09-promote-pick-entity-landing/promote-entity-landing.md` | wiki 是长期知识网络。 |
| 8. docwarden 提供来源、review、落点和写入流程 | `.docwarden/task/09-promote-pick-entity-landing/entity-landing-boundary.md` | 09 确认 docwarden 是操作流程协议。 |
| 9. contexta 后续承接内容格式协议 | `.docwarden/task/09-promote-pick-entity-landing/entity-landing-boundary.md`、`.docwarden/task/03-ai-infra-min-schema/schema-scope.md` | contexta 负责 template / metadata / module / assertion / semantic lint。 |
| 10. 本轮不改模板、不重设 surface / 落点 | `.docwarden/task/06-review-surface-design/index.md`、`.docwarden/task/09-promote-pick-entity-landing/index.md` | 06 已定 review surface，09 已定实体落点。 |

## 当前 agent context

本轮有一个已纠正的方向：

- 不能用 pick 后的 `.docwarden/user/profile.md` 作为主例。
- 当前任务必须使用 promote 后内容生产实例。
- 主例应来自 `08` 的 spec / guide / wiki promote candidates。

这个纠偏影响本轮 lead，因此在 backing 中显式记录。

## 不纳入本轮 lead 的内容

以下内容不进入本轮 lead：

- spec module 的具体格式。
- guide page 的具体格式。
- wiki node 的具体格式。
- contexta template 落盘。
- semantic lint 规则。
- 真实写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- cleanup config。

这些内容应在后续 loop 中处理。

## 拆分判断

本轮 lead 只处理一个问题：

```text
promote 后内容格式实例任务的边界是否成立？
```

spec / guide / wiki 三种格式实例应拆到后续 loop。
