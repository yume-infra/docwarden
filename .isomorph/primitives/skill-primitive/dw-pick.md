---
kind: skill-primitive
---

# dw-pick

## Capability

把 review/promote 之后留下的 side signal 保存成 reusable user-level asset，同时避免把它们过度 promote 成 project mainline rules。

Pressure Scenarios:

- 一个 task 已经 review 并 promote，但有价值的 residue 是 user preference、correction pattern、ADR、terminology note 或 project-history judgment，mainline artifact 有意压缩掉了它。
- 用户在 workflow 中反复纠正 agent，agent 却把 correction 当成一次性 conversation，而不是 candidate user-level asset。
- 一个 side signal 看起来有价值，agent 却把它写成 spec 或 docs material，尽管它不改变 project baseline。
- agent 在判断 candidate 应该 pick、promote、log-only 还是 continue-task 之前，机械运行 `docwarden pick`。

## Trigger

Description: 用于 review/promote 之后判断、准备、review 或执行 docwarden dw:pick，尤其是保存 corrections、preferences、ADR、terminology、project-history judgments 或 promote 会隐藏的 reusable side knowledge。不要用于 mainline spec/guide/wiki promotion、raw task logging、docs edits，或只做 deterministic CLI validation。

Triggers:

- 判断 review residue 是否应该 pick。
- 从 task material、review backing 或当前 conversation corrections 准备 dw:pick candidate。
- promote 后保存 repeated user preference、correction、agent error pattern、ADR 或 terminology understanding。
- pick candidate 已 review 或已明确 implied 后，运行 `docwarden pick --task ... --to wiki`。
- cleanup 前区分 pick material 与 promote material。

Exclusions:

- material 改变 project baseline、stable execution rules、docs authority、review artifact schema、cleanup config 或 spec/guide/wiki mainline content。
- 用户只要求运行已知 CLI command 或验证 existing output，不需要 route judgment。
- 请求是直接编辑 `docs/`。
- signal 只是 transient process noise、failed draft text 或没有 reusable value 的 one-off correction。

## Soft Boundary

- 判断 signal 是 compoundable user-level asset，还是 project mainline delta。
- 判断 promote 吸收或隐藏了什么，以及 remaining residue 是否仍有 long-term value。
- 判断 source 是 task material、review material、promote residue、current conversation context、user correction 还是 agent error pattern。
- materialization 前确定最小 reviewable candidate shape。
- 判断 proposed landing 应是 wiki、user-context/profile、future asset layer，还是 blocked/gap note。
- 判断何时只向用户确认 asset nature 与 landing。

## Hard Boundary

- `docwarden review` 负责 review surface creation；skill 不发明 persistent review artifacts。
- `docwarden promote` 负责 project mainline changes；skill 不手写 spec、guide、wiki mainline deltas。
- `docwarden pick --task "$TASK_ID" --to wiki --json` 只用于当前 task-sourced wiki pick write path。
- required `--task`、`--to wiki`、artifact path generation 和 task log updates 由 CLI 负责。
- conversation-sourced 或 user-context/profile landings 在 deterministic CLI/entity path 存在前，只能作为 review-gated handoff material。
- hard checks 使用 repository validation commands；skill 只选择 route 与 candidate semantics。

## Workflow

- 命名 pick candidate 前，先识别 promote 吸收、抽象或隐藏了什么。
- 写入任何内容前，先把 material route 成 promote、pick、log-only 或 continue-task。
- conversation corrections、user feedback、task residue 和 agent error patterns 都可以成为 valid pick sources。
- pick candidate 必须足够小，便于 user review：signal、reusable pattern、applicability boundary、proposed asset landing。
- filesystem writes、destination constraints、path generation 和 task log updates 交给 docwarden CLI。
- candidate 可能改变 project baseline 时，停止 pick，回到 promote review。
- candidate 只是 single weak signal 时，只呈现为 pick signal；没有 repeated evidence 或 user confirmation 时，不 promote 成 long-term default。
- source、reusable value、applicability 或 landing 不清楚时，只请求用户确认最小单元。
- 用户已确认 task-sourced candidate 且 destination 是当前 CLI 支持的 wiki path 时，运行 deterministic pick command 并报告 artifact path。
- candidate 来自 current conversation 或需要 user-context/profile landing 时，不用 wiki CLI 替代缺失的 entity path。

## Export Shape

- Export draft 的 `skillName` 是 `dw-pick`；runtime naming 属于 contexta/export materialization。
- SKILL.md frontmatter `description` 必须提到 `dw:pick`、post-review/promote、user-level assets，以及与 promote、raw logging、docs edits、CLI-only validation 的关键 exclusions。
- SKILL.md body 必须保留 capability、trigger、route decision、pick candidate shape、hard CLI boundary、workflow review gates 与 validation。
- 除非 `docwarden pick` 不再提供 hard write path，否则 skill 不应 bundle scripts。
- skill 不应创建 README、changelog、installation guide 或 process-history files。

## Semantic Basis

- [[primitives/concept/skill-primitive|skill-primitive]]
- [[primitives/concept/primitive-creator|primitive-creator]]

## Validation

- 运行 `apps/isomorph/dist/index.js primitive skill .isomorph/primitives/skill-primitive/dw-pick.md --json`，要求 `status: ready`。
- materialize skill 后运行 `python3 .contexta/packs/isomorph-authoring/skills/skill-creator/scripts/quick_validate.py .contexta/packs/docwarden/skills/pick`。
- 使用 realistic correction signal 做 forward-test，并要求 skill 在任何 CLI command 前先产出 route decision。

## Diagnostics

- 当前 CLI pick destination 仍受限于 wiki；accepted theory 认为 pick target 是 user-level assets，最终 asset layer 尚未完全设计。
- 这个 first draft 有意把 task-sourced wiki 当作当前 deterministic write path，把 user-context/profile 当作 review-gated landing decision，而不是 automatic write。
