# Review Lead

Task: Docwarden Artifact Quality Loop (26-docwarden-artifact-quality-loop)

## Decision
- 本轮需要判断：哪些 task material 已经可以进入 spec / guide / wiki，哪些只能作为 side material 或继续留在 task。
- 推荐路径：promote or pick after user review

## Mainline Candidate
- 让 docwarden v0 的产物从“能生成”推进到“能被用户审、能进入稳定层、能支撑下一轮维护”。

## Side Material Candidate
- task25 已经让 docwarden v0 的主链路可执行：
- task create -> review --task -> promote / pick
- 但第一轮 dogfood 产物仍然明显机械：review lead 是泛化问题，spec/wiki 只是 task 片段搬运，还没有形成真正可维护文档体系。
- 本 task 承接下一步：不继续扩命令面，先修 `review -> promote/pick` 的产物质量和真实语义。

## Missing Context
- 未发现阻塞性缺口。

## Review Options
- promote: 目标、边界和执行规则已经足够稳定。
- pick: 出现了可复用判断、协作偏好或 side knowledge，但不属于主线规范。
- continue-task: 目标或边界仍缺失，需要继续补 task material。
- no-op: 本轮没有值得沉淀的新增内容。
