---
status: accepted
workspace_status: closed
created: 2026-05-12
updated: 2026-05-13
owner: sayori
---

# AI 基建最小 schema 路线图

本 working 目录用于起草 `docwarden` 项目内 AI 基建的最小 schema。

## 边界

- 本目录是对话产生的 working material。
- agent 可以维护本目录中的 capture、plan、draft 和 review notes。
- agent 不能在没有 sayori 明确授权具体 `docs/` 文件编辑的情况下，把本目录内容移动到 `docs/`。
- 本任务只关注最小 schema 闭环，不能实现 CLI、不能设计 custom skill creator、不能大范围改写 docs。

## 来源基线

- `docs/ai基建建设/理念-v1.md`
- `docs/ai基建建设/llm-wiki-pick.md`
- `docs/文档体系建设/理念-v1.md`
- `docs/文档体系建设/v1与扩展.md`
- `docs/文档体系建设/实践-v1/实践之前.md`
- `.docwarden/task/01-contexta-positioning/`

## 当前判断

- `00-custom-skill-creator` 应该延后，等本 schema 足够稳定后再反哺 skill 设计。
- `01-contexta-positioning` 作为 working material 基本完成，剩余动作是未来由 sayori 决定是否继续 review，并按 promote 或 pick 的方向处理。
- `03-ai-infra-min-schema` 已完成本轮最小 schema 闭环，当前工作面关闭。

## 推进规则

本任务每一个实质环节都必须使用慢推进循环：

1. agent 先问少量具体问题。
2. sayori 回答。
3. agent 在本 working 目录生成 draft。
4. sayori review，选择接受、拒绝或要求修改。
5. 当前环节被接受或明确暂停后，agent 才能进入下一环节。

agent 每轮最多问三个问题，能问一个问题时优先只问一个。

## 内容

- `plan.md`：本轮的小循环列表。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `schema-scope.md`：Loop 1 范围与词表草案。
- `naming-policy.md`：Loop 2 工作面命名 policy。
- `directory-semantics.md`：Loop 2 目录与状态语义。
- `operation-rules.md`：Loop 3 文档操作规则。
- `promote-pick-boundary.md`：Loop 4 promote 与 pick 边界。
- `acceptance.md`：Loop 5 验收与 dry run。
- `scripts/check-working-schema.mjs`：Loop 5 最小结构检查脚本。

## 文件索引

- `index.md`：工作面 lead file，状态：accepted；同时通过 `workspace_status: closed` 表示本轮工作面已完成。
- `plan.md`：本轮 loop 计划，状态：accepted。
- `log.md`：时间线记录，状态：accepted；后续可继续追加。
- `schema-scope.md`：Loop 1 范围与词表，状态：accepted；只是当前可容忍的工作定义，不是稳定理论定义。
- `naming-policy.md`：Loop 2 命名 policy，状态：accepted。
- `directory-semantics.md`：Loop 2 目录与状态语义，状态：accepted。
- `operation-rules.md`：Loop 3 文档操作规则，状态：accepted。
- `promote-pick-boundary.md`：Loop 4 promote 与 pick 边界，状态：accepted。
- `acceptance.md`：Loop 5 验收与 dry run，状态：accepted。

## 下一步

本轮最小 schema 工作面已完成。

后续可以基于本工作面继续推进：

- 重新评估 `00-custom-skill-creator` 是否可以恢复。
- 规划 agent-oriented stable 层。
- 规划 pick 产物的长期目录结构。
- 将结构检查脚本沉淀为后续 `docwarden` tooling。
