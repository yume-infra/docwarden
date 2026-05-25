---
status: accepted
created: 2026-05-13
updated: 2026-05-25
owner: sayori
---

# task index

`.docwarden/task/` 是短命任务过程层。

本层承载：

- 上下文捕获
- 草案
- log
- review 过程记录
- 临时判断
- 任务推进材料

## 工作面索引

- `12-contexta-model-followup/`：contexta 模型后续补全工作面，已完成当前阶段。
- `13-kind-signal-landing/`：kind / signal 落点复核工作面，已完成当前阶段。
- `14-magic-word-registry-expansion/`：magic-word registry 扩充工作面，已完成当前阶段。
- `15-semantic-lint-signal-chain/`：semantic-lint / signal pure chain 工作面，已完成当前阶段。
- `16-signal-review-handoff/`：signal 进入 review 的交接边界工作面，当前 active。

## 归档工作面

历史 task 已移动到 `.docwarden/archive/task/`：

- `.docwarden/archive/task/00-custom-skill-creator/`：custom skill creator 早期工作面，当前延后。
- `.docwarden/archive/task/01-contexta-positioning/`：contexta 定位工作面，基本完成。
- `.docwarden/archive/task/03-ai-infra-min-schema/`：AI infra 最小 schema 工作面，已完成并关闭。
- `.docwarden/archive/task/04-task-review-spec-pipeline/`：task / review system / spec / guide / wiki pipeline 工作面，已完成并关闭。
- `.docwarden/archive/task/05-review-input-design/`：review system 输入边界设计工作面，已完成并关闭。
- `.docwarden/archive/task/06-review-surface-design/`：review surface 最小形态设计工作面，已完成并关闭。
- `.docwarden/archive/task/07-review-trace-design/`：review 后 promote / pick 分流设计工作面，已完成并关闭。
- `.docwarden/archive/task/08-promote-pick-dry-run/`：promote / pick dry run 工作面，已完成并关闭。
- `.docwarden/archive/task/09-promote-pick-entity-landing/`：promote / pick 实体落点设计工作面，已完成并关闭。
- `.docwarden/archive/task/10-promote-output-content-format/`：promote 后内容格式实例设计工作面，已完成并关闭。
- `.docwarden/archive/task/11-contexta-content-type-constraints/`：contexta 内容类型约束设计工作面，已归档。

## 当前入口

当前 active task：`16-signal-review-handoff/`。
