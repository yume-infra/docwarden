---
status: accepted
created: 2026-05-12
updated: 2026-05-13
owner: sayori
---

# AI 基建最小 schema 日志

## [2026-05-12] setup | 创建 working task

创建 `03-ai-infra-min-schema` working task。

初始判断：

- 延后 `00-custom-skill-creator`，等本 schema 可以反哺 skill 设计后再推进。
- 将 `01-contexta-positioning` 视为基本完成的 working material。
- 每个环节使用慢推进循环：agent 提问，sayori 回答，agent 起草，sayori review。

## [2026-05-12] loop-1 | 起草范围边界

sayori 明确产品边界：

- 操作流程协议属于 `docwarden`。
- 文档内容格式协议属于 `contexta`。

起草 `schema-scope.md`，当时曾将 Loop 4 从完整 assertion schema 收窄为 `docwarden` pick note；该理解后来在 Loop 4 被修正。

## [2026-05-12] loop-1 | 收窄范围词表

sayori 要求沿着已有理论小步推进。

更新 Loop 1 草案：

- 等待 review 的材料仍然只是 `working` material。
- 当时曾使用 pick note 的说法替代更宽泛的早期表述；该理解后来在 Loop 4 被修正。

## [2026-05-12] format | 改为中文正文

sayori 要求当前 working 任务全部先改成中文。

已将 `roadmap.md`、`plan.md`、`schema-scope.md` 和 `log.md` 的正文改成中文。保留 frontmatter key、状态值、文件名和必要技术名词。

## [2026-05-12] loop-1 | 回答范围问题

sayori 确认：

- `docwarden` 的最小 schema 只负责 agent 如何维护文档流程，不负责文档内容应该怎么写。
- `stable` 不完全等价于当前 `docs/`。当前 `docs/` 是可信理论源，因为它完全由 sayori 编写和 review；但它更偏向 user 理论描述，不是经过 agent 表达优化的 stable baseline。
- 当前 workflow 只应该在自己的 workspace 下做事。对本任务而言，working material 只放在 `.docwarden/working/`。

已据此更新 `schema-scope.md` 和 Loop 2 问题。

## [2026-05-12] loop-1 | 暂时接受工作定义

sayori 指出当前词表理解仍有问题，但当前可以容忍，后续再慢慢对齐。

已在 `schema-scope.md` 标注：Loop 1 只是暂时可用的工作定义，不是稳定理论定义。

## [2026-05-12] loop-2 | 目录命名与 lead file 初步确认

sayori 对 Loop 2 给出初步方向：

- 工作面命名采用“编号 + 短语义 slug + `roadmap.md` 查询增强”的方案。
- 命名规则可以派生为一条 policy，并允许 subagent 起草。
- `roadmap.md` 是每个工作面的 lead file，是该工作面的唯一震源；核心描述、规约和目录散发关系以它为准。
- `log.md` 只负责按时间记录事件。
- working 状态建模还需要继续讨论，尤其是是否通过扩展文件结构或引入必要状态来解决。

## [2026-05-12] loop-2 | 状态建模 review 通过

sayori 选择 C 方案：文件 frontmatter 带最小状态，`roadmap.md` 维护文件索引。

状态模型收敛为：

- 工作面状态：`active`、`paused`、`closed`
- 文件状态：`draft`、`reviewing`、`accepted`

暂不引入工作面或文件级 `superseded`。替代关系先通过 `roadmap.md` 和 `log.md` 的自然语言记录。

已创建 `directory-semantics.md`，并将 Loop 1 / Loop 2 相关文件标记为 accepted。

## [2026-05-12] loop-3 | 操作规则边界确认

sayori 确认：

- 整个 `.docwarden` 都是 agent 的工作区，agent 不但可以在这里创建和修改 working material，而且就应该在这里工作。
- 当前项目里，`docs/` 默认只读。agent 只有在 sayori 明确授权具体 `docs/` 文件编辑时才可以修改。
- 本轮流程不维护任何 docs 修改建议。涉及 `docs/` 的内容只作为对 sayori 的回答或普通建议，由 sayori 自己决定是否维护。

已据此移除早期“docs 修改建议”表述，并创建 `operation-rules.md` 草案。

## [2026-05-12] loop-3 | 操作规则 review 通过

sayori 接受 Loop 3 操作规则。

已将 `operation-rules.md` 标记为 accepted，并更新 `roadmap.md` 与 `plan.md`。

下一步进入 Loop 4。由于 Loop 3 已明确不维护 docs 修改建议流，Loop 4 需要重新确认 working material 后续产物边界。

## [2026-05-12] loop-4 | 修正 pick 语义

sayori 指出此前对 Loop 4 的理解有误。

正确语义：

- `promote` 是正常的 working -> stable 主路径，基于 working 产生稳定的 stable 文档，用于服务 agent 编码。
- `pick` 是 promote 的 side 产物机制，基于 working 产生 promote 不关注但仍有价值的内容，例如 ADR、纠错经验、可学习内容、更多了解用户的 side 内容，用于服务其他内容建设。

已更新 `schema-scope.md` 和 `plan.md`，将 Loop 4 从 `pick note` 重置为 `promote 与 pick 边界`。

已继续清理残留表述：stable 影响应通过 promote，而不是 pick。

## [2026-05-12] loop-4 | 边界继续收窄

sayori 进一步确认：

- promote 产物是面向 agent 的 stable 文档。
- pick 产物后续需要规划长期文件夹结构，不能放在 `.docwarden/working/` 中作为长期材料，因为 working 的设计是短命的。
- pick 和 promote 的触发涉及工作流编排，当前不开展。

已创建 `promote-pick-boundary.md`，只记录边界，不定义触发和编排。

## [2026-05-12] loop-4 | promote / pick 边界 review 通过

sayori 接受 Loop 4 边界。

已将 `promote-pick-boundary.md` 标记为 accepted，并更新 `roadmap.md` 与 `plan.md`。

下一步进入 Loop 5。由于 promote/pick 编排当前不开展，Loop 5 的 dry run 只验证当前最小 schema 是否能支撑 working 任务推进，不模拟完整 promote/pick。

## [2026-05-12] loop-5 | 起草两层 dry run

sayori 接受 dry run 分成两层：

- 脚本结构检查：只检查可机械判断的规则。
- 人工 / agent 语义检查：检查 schema 是否真的可用。

已创建：

- `scripts/check-working-schema.mjs`
- `acceptance.md`

当前 `acceptance.md` 仍是 draft，等待脚本运行结果和 sayori review。

## [2026-05-12] loop-5 | 结构 dry run 通过

运行：

```bash
rtk node .docwarden/working/03-ai-infra-min-schema/scripts/check-working-schema.mjs .docwarden/working/03-ai-infra-min-schema
```

结果：

```text
note: checked 9 markdown files in /Users/sayori/Desktop/docwarden/.docwarden/working/03-ai-infra-min-schema
pass: working schema structure check passed
```

已将结果写入 `acceptance.md`。

## [2026-05-13] loop-5 | dry run review 通过

sayori 确认 Loop 5 基本正确。

已将 `acceptance.md` 标记为 accepted，并将 `roadmap.md` 的 `workspace_status` 更新为 `closed`。

本轮 `03-ai-infra-min-schema` 最小 schema 工作面完成。
