---
kind: skill-primitive
---

# lead-review

## Capability

把 candidate assertion、semantic-lint signal、workflow correction、theory update 或 skill/materialization 变更组织成最小可审核的 `lead + backing`。

Pressure Scenarios:

- agent 收到用户纠正后，直接改长期 theory，却没有先给出最小可审核 commitment。
- review material 混入历史、方案、证据、实现细节和路由，导致用户只能审核整包文本。
- semantic-lint signal 被当成 judgment，而不是进入 review 后再确认。
- skill 或 contexta materialization 反向定义 semantic source，没有先检查 lead 是否符合 framework boundary。

## Trigger

Description: 用于把 theory update、candidate assertion、semantic-lint signal、workflow correction 或 skill/materialization 变更组织成最小可审核的 lead + backing；不用于直接执行 docwarden CLI、写 docs、替代 deterministic validation，或生成普通长篇 review report。

Triggers:

- 用户要求进入定义、review、gate 或 lead 组织环节。
- correction 需要变成可审核 semantic update。
- semantic-lint result 需要给用户看。
- skill primitive、contexta skill 或 runtime export 需要确认是否忠实于语义 source。
- promote、pick 或 lane transfer 前需要拆出最小用户判断。

Exclusions:

- 用户只要求运行 deterministic command。
- 用户明确要求直接编辑某个具体文件且不涉及 review organization。
- material 只是 task log，不形成 candidate assertion。
- 请求是 generic code review，不涉及 semantic framework 或 docwarden workflow。

## Soft Boundary

- 判断 candidate 是否已形成 assertion 或 assertion set。
- 判断 lead 是否最小到可被单独接受、拒绝、修正或改路由。
- 判断 backing 是否支持 lead，而不是替代 lead。
- 判断 correction 应更新 framework vocabulary、usage contract、skill primitive、contexta materialization，还是只进入 task log。
- 判断 route 是 accepted、rejected、revise、promote、pick、log-only、continue-task 或 transfer-lane。
- 判断 semantic-lint signal 是否足够 review-ready。

## Hard Boundary

- docwarden CLI 负责 task、review、promote、pick 和 cleanup 的 deterministic state change。
- isomorph CLI 负责 primitive validation 与 semantic-lint hard check。
- contexta CLI 负责 Codex-supported runtime materialization。
- lead-review skill 不写 `docs/`，除非用户明确要求具体 docs edit。
- lead-review skill 不把 signal 直接判定为 accepted truth。

## Workflow

- 先识别 candidate target：concept、policy、relation、assertion、signal、usage contract、skill primitive 或 materialization rule。
- 产出一个 lead，只表达一个 user-reviewable commitment。
- 将 source correction、basis、boundary、locator、evidence、expected future behavior 和 affected files 放入 backing。
- 如果 lead 包含多个 commitment，拆成多个 lead。
- 如果 backing 不能支撑 lead，降级为 open question 或继续收集 evidence。
- 用户确认 lead 后，再执行对应 CLI hard gate 或文件实现。
- 实现后报告 validation，不把 validation log 改写成新的 lead。

## Export Shape

- Export draft 的 `skillName` 是 `lead-review`；Codex runtime materialization 由 contexta 加 namespace。
- SKILL.md frontmatter `description` 必须包含 theory update、candidate assertion、semantic-lint signal、workflow correction、skill/materialization 和关键 exclusions。
- SKILL.md body 必须保留 lead/backing definition、workflow、soft boundary、hard boundary、review gates 和 validation。
- skill 不应 bundle scripts；hard checks 由 docwarden、isomorph 或 contexta CLI 承担。

## Semantic Basis

- [[loop/lead-review/concept|lead-review]]
- [[loop/lead-review/policy/boundary|lead-review-boundary]]
- [[language/primitive/concept/assertion|assertion]]
- [[language/semantic-lint/concept/signal|signal]]
- [[contract/skill-primitive/concept|skill-primitive]]
- [[contract/primitive-creator/concept|primitive-creator]]
- [[framework/policy/boundary|semantic-framework-boundary]]

## Validation

- 运行 `apps/isomorph/dist/index.js primitive skill .contexta/packs/isomorph-authoring/skills/lead-review/skill-primitive.md --json`，要求 `status: ready`。
- materialize skill 后运行 `python3 .contexta/packs/isomorph-authoring/skills/skill-creator/scripts/quick_validate.py .contexta/packs/isomorph-authoring/skills/lead-review`。
- 使用 realistic correction 做 forward-test，要求先输出一个最小 lead 和 backing，再提出写入动作。
