---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
source_task: 08-promote-pick-dry-run
---

# review lead minimality backing

本文件是 `lead.md` 的 backing。

## source context

本 pick 候选来自本轮 dry run 的对话纠偏，而不只来自 task material。

关键纠偏包括：

- lead 需要是可交接文档，但“可交接文档”不是核心。
- 给 user 看时，不能套 agent-facing 规范写法。
- 最小不是最少字，而是一个单一职责模块及其可审核断言。
- lead 中不应放“本轮不审”或 review 方式。
- lead 只放待审核内容本体。
- pick source 包括对话上下文，尤其是 user 反复纠正 agent 的错误模式。

## correction trace

| user 纠偏点 | agent 错误模式 | 可复利信息 |
| --- | --- | --- |
| lead 不能只是流程命题，后续要能交接 | 把 lead 写成一句 delta 或流程许可问题 | lead 必须是可交接的审核内容本体。 |
| review 文档位置和命名不对 | 把 review artifact 放在 task 目录，并让 `index.md` 承载 lead 正文 | review artifact 应放在 review 层；入口和 lead 应分工。 |
| lead 大致正确，但其他内容不对 | 把 lead、backing、readiness、review question 混成普通草案 | review surface 应保持 `lead + backing`，meta 不能污染 lead。 |
| 你理解文档模块和断言吗 | 在“一个文档”和“一条断言”之间摇摆 | lead 应是单一职责模块，内部暴露可审核断言。 |
| 给人看的应该怎么样 | 套用 agent-facing policy 和 RFC2119 写法 | user-facing lead 应采用人能直接判断的表达，不写成 agent 规范。 |
| 你这个 lead 最小在哪 | 把整条 workflow 当作未组织的散文 baseline | 最小不是字少，而是同一模块边界内的可审核断言。 |
| 不要那么多废话 | 在 lead 中加入解释、审核说明和流程话术 | lead 只放待审核内容本体。 |
| 不要在 lead 里放“本轮不审”和 review 方式 | 把边界说明和用户操作说明塞进 lead | 边界、来源、上下文、review 方式属于 index/backing，不属于 lead。 |
| pick source 不止原材料，对话上下文也是 | 只从 promote 未吸收的 task residue 里找 pick | 对话纠偏和 agent 错误模式也是 pick source。 |
| pick 也需要 review surface | 直接生成 pick candidates | 任何长期化前都必须经过 user 可审核 surface。 |

## supporting material

- `.docwarden/review/docwarden-review-workflow/lead.md`
- `.docwarden/review/docwarden-review-workflow/backing.md`
- `.docwarden/task/08-promote-pick-dry-run/log.md`

## why pick

这组内容不是本次 promote 的项目主线流程本体。

它更像 user 在后续使用 agent 生成 review 文档时，可复用的判断资产：

```text
如何识别一个 lead 是否被 agent 写膨胀了。
```

更具体地说，它帮助 user 识别这些偏移：

- agent 把审核内容写成流程许可。
- agent 把给 user 的内容写成 agent 规范。
- agent 把解释和来源塞进 lead。
- agent 用“本轮不审”“review 方式”教 user 怎么审。
- agent 忽略对话纠偏中的用户偏好。
- agent 在没有 review surface 的情况下直接生成长期化候选。

## not promote

以下内容如果要长期化，应另走 promote：

```text
review artifact 使用 index.md / lead.md / backing.md 三文件结构。
```

它改变的是 docwarden review artifact 的项目结构，不是纯用户层资产。
