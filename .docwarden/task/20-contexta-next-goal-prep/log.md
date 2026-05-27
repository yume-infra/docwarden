---
status: accepted
created: 2026-05-27
updated: 2026-05-28
owner: sayori
---

# contexta next goal prep log

## [2026-05-27] task-started | next goal prep

sayori 要求基于重构后第二轮 subagent 审核结果，新建 task，并形成下一轮 goal 前的 lead 文档。

本 task 不修改 `docs/`。

本 task 不修改 `apps/contexta` 代码。

## [2026-05-27] review-source | second audit

本轮审核从六个方向进入：

- recognition authority
- Effect runtime shape
- CLI executable contract
- pin / upgrade model
- primitive-creator and semantic-lint
- architecture boundaries

共同结论：

当前实现已修复 task19 中的一批粗粒度问题，但暴露出更细的 v0 合同问题。

下一轮不应继续横向加功能。

优先顺序应为：

1. CLI contract bugs。
2. recognition / lint authority。
3. pin / upgrade baseline semantics。
4. diagnostics visibility。
5. architecture and public API boundary。

## [2026-05-27] verification | current implementation

主线程验证：

- `pnpm --filter contexta typecheck` 通过。
- `pnpm --filter contexta build` 通过。
- `pnpm test apps/contexta/tests` 通过，2 个 test files，31 个 tests。
- `pnpm lint apps/contexta/src apps/contexta/tests` 通过。
- `git status --short` 干净。

注：

`rtk pnpm --filter contexta typecheck` 被 RTK 的 pnpm filter 处理误判过一次，已用 `rtk proxy pnpm --filter contexta typecheck` 复跑通过。

## [2026-05-27] design-reference | software design philosophy

sayori 指出 `/Users/sayori/Desktop/software-design-philosophy-skill` 对下一轮架构设计有帮助。

已读取其中 `SKILL.md`。

本 task 将其作为架构审查参考模型，重点采用：

- complexity symptoms
- deep modules
- information hiding
- avoid temporal decomposition
- different layers, different abstractions
- pull complexity downward
- define errors out of existence
- design it twice

该模型不覆盖 contexta 理论，只用于下一轮实现组织和架构判断。

## [2026-05-27] decision | strict runtime and doctor repair

sayori 决定选择最严格语义：

- recognition fallback 不作为默认 runtime authority。
- missing / invalid local recognition authority 应直接失败。
- missing pin 不作为普通 `upgrade` success。
- 普通 runtime 不静默兼容 pre-v0 local instance。

如果 local instance 有问题，后续应修复该 instance，或通过新的 `contexta doctor` 工具诊断和 repair。

后续可以尝试使用 doctor repair 当前仓库自己的 pre-v0 `.contexta`。

## [2026-05-27] design | doctor issue repair

sayori 确认需要设计 issue / repair，并保证 doctor 可以正确修复。

已新增 `sup-01-doctor-issue-repair.md`。

核心设计：

- ordinary runtime strict failure。
- doctor inspect is read-only。
- repair plan default dry-run。
- apply 前检查 preconditions。
- 不覆盖 local material。
- 所有写入 staging 后提交。
- apply 后重新 doctor inspect，并运行相关 strict command 验证。
- self-repair 当前仓库 pre-v0 `.contexta` 是后续目标。

## [2026-05-27] review | lead accepted

sayori 确认 lead 按 review 通过口径收束。

已将 lead 从待决问题改为已确认执行口径：

- strict runtime。
- no default TS fallback。
- missing pin is failure。
- doctor issue / repair 进入下一轮 goal。
- doctor v0 必须支持当前仓库 pre-v0 `.contexta` 的最小 self-repair。

## [2026-05-28] execution | lead implemented

已按 `lead.md` 作为 goal 执行，并提交实现：

- `ae2fd7e feat(contexta): enforce strict runtime contracts`

实现范围：

- strict recognition authority：
  - 删除默认 fallback authority。
  - 缺 recognition primitive / recognition trigger 不可解析时失败。
  - `.contexta` 中任意 `kind: foo` 不会自动成为 target role authority。
- lint semantic closure：
  - signal applicability 消费 recognized role。
  - signal candidate 暴露 applicability basis。
  - missing loss model / unparsed trigger 进入 diagnostics。
- CLI executable contract：
  - missing target、target 不存在、outside root、invalid root 进入 `contexta ... error` 输出。
  - `init --root <workspace/.contexta>` 不再创建嵌套 `.contexta/.contexta`。
  - 成功路径 stderr 为空。
- pin / upgrade baseline：
  - missing / invalid / unknown pin 失败。
  - pin 必须匹配 packaged baseline `vendor/ref/digest`。
  - upgrade status 保持 read-only。
- doctor v0：
  - `doctor inspect` 输出 structured issues。
  - `doctor repair --plan adopt-packaged-baseline` 支持 pre-v0 local instance 最小 repair。
  - repair 不覆盖 existing local material。
- diagnostics and primitive：
  - signal diagnostics 在 JSON / human output 可见。
  - skill primitive Semantic Basis link 会解析到 local material。
- architecture boundary：
  - application 层拆出 recognize / lint / primitive skill。
  - `runtime.ts` 收为聚合层。
  - CLI 维护 error kind 到 exit code 的映射。
  - 新增 import boundary tests。

## [2026-05-28] verification | implemented goal

最终验证已通过：

- `pnpm build`
- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm knip`
- `pnpm effect:source:verify`

测试结果：

- `apps/contexta/tests`：3 test files，52 tests。

额外只读观察：

- `contexta doctor --root . --json` 对当前仓库 `.contexta` 仍报告 pre-v0 / missing pin / missing recognition authority 等 issues。
- 该观察未写入当前 `.contexta`；repair 需要后续显式执行。
