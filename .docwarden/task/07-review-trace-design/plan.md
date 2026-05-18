---
status: draft
created: 2026-05-18
updated: 2026-05-18
owner: sayori
---

# review 后分流设计计划

本轮目标是定义 user review 之后的 promote / pick / log 最小分流规则。

本任务只在 `.docwarden/task/07-review-trace-design/` 中推进，不直接修改 `docs/`，不重新设计 review input / review surface，不实现 renderer config，不引入独立 review result / decision ledger。

## Loop 1：promote / pick / log 边界

状态：accepted。

目标：确认 user review 结束后，哪些内容进入 promote，哪些内容进入 pick，哪些内容只留在 task log。

草案产物：

- 待定。

review 门槛：

- sayori 确认 review 后分流不需要独立 `review result` 或 `decision ledger`。
- sayori 确认 promote + pick 完成后默认 delete task working materials，并可通过 config 选择 archive。

## Loop 2：promote 规则

状态：accepted。

目标：定义哪些 review 后内容可以进入主产物稳定化路径。

草案产物：

- 待定。

review 门槛：

- sayori 确认 promote 只处理主线稳定内容。
- sayori 确认 promote 的核心是主线基线 delta。
- sayori 确认主流程 review surface 建设发生在 promote 之前。

## Loop 3：pick 规则

状态：accepted。

目标：定义哪些 review side 内容值得长期化，但不属于 promote 主线。

草案产物：

- 待定。

review 门槛：

- sayori 确认 pick 服务 adr、纠错经验、用户偏好、可学习内容或其他长期侧向材料。
- sayori 确认 pick 是 promote 之后的信息损失控制。
- sayori 确认 pick 捞取的是可复利的用户层级资产。

## 本轮不做

- 修改 `docs/`。
- 设计 review input。
- 设计 review surface。
- 设计 md/html renderer config。
- 设计独立 review result。
- 设计独立 decision ledger。
- 实现真实分流工具。
