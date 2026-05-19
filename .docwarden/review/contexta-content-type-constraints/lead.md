---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
source_task: 11-contexta-content-type-constraints
---

# contexta content type constraints boundary

1. contexta 约束设计的对象是内容类型，不是 docwarden workflow 编排。
2. policy 和 workflow / architecture 是不同内容类型。
3. workflow / architecture 不应套用 policy 的 `Intent / Scope / Rules / Failure Handling` 结构。
4. contexta 应提供约束，帮助 agent 识别内容类型并选择正确骨架。
5. semantic lint 应能识别“workflow 被写成 policy”的错误。
6. 本轮先设计内容类型约束，不直接修改 `.contexta/templates/`。
7. 本轮不重新设计 docwarden 的 review / promote / pick / cleanup 流程。

## Review

sayori 要求继续推进设计。
