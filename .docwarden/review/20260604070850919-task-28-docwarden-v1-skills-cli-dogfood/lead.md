# Review Lead

Task: Docwarden V1 Skills CLI Dogfood (28-docwarden-v1-skills-cli-dogfood)

## Decision
- 本轮需要判断：哪些 task material 已经可以进入 spec / guide / wiki，哪些只能作为 side material 或继续留在 task。
- 推荐路径：promote or pick after user review

## Mainline Candidate
- Docwarden v1 repo-local workflow skills are the user-facing actions `review`, `promote`, and `pick`; contexta owns later namespace/plugin naming, and the `docwarden` CLI remains the hard-constraint writer.

## Recommended Spec Target
- `harness/review-surface`：review lead / backing / review state 的质量边界。
- `harness/promote-to-spec`：promote / pick 写入稳定层前的 gate 与 target 规则。
- `apps/docwarden`：CLI 可执行行为与 contract tests。

## Side Material Candidate
- 当前 docwarden v0 已经具备最小 CLI workflow：
- init -> task create -> review --task -> promote / pick
- 但 docs 理论与实践文档指出，docwarden 难以继续 dogfood 的关键缺口不是更细的 review state machine，而是 docwarden 第一批可运行 skills / prompts / agent context 尚未以 Codex 可用形态稳定出现。
- 本 task 不接管 contexta 的完整 catalog / install / activation，也不展开 isomorph 语义引擎。当前目标是尽快让 docwarden v1 具备 repo-local Codex skills + CLI 的可运行形态，使后续任务能用这套流程 dogfood。

## Missing Context
- 未发现阻塞性缺口。

## Review Options
- promote: 目标、边界和执行规则已经足够稳定。
- pick: 出现了可复用判断、协作偏好或 side knowledge，但不属于主线规范。
- continue-task: 目标或边界仍缺失，需要继续补 task material。
- no-op: 本轮没有值得沉淀的新增内容。
