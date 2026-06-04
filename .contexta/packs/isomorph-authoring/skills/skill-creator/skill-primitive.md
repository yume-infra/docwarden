---
kind: skill-primitive
---

# skill-creator

## Capability

创建或更新 Codex native skill，并把 future skill 明确建模成 agent behavior intervention。

这个 contexta-owned skill primitive 要求 agent 在 materialize `SKILL.md`、repo-skill 或 plugin-distributed skill 前，先证明 repeatable drift、trigger boundary、soft/hard boundary、lead-review route、export shape 与 validation surface 都已经成立。

Pressure Scenarios:

- 用户要求 create / update skill，agent 先生成文件，却没有命名这个 skill 要防止的 agent failure。
- 用户要求从 skill-primitive material 派生 skill，agent 却从 Codex runtime folders、plugin export shape 或 generic scaffolding 反推。
- 用户已经区分 hard constraints 与 soft workflow judgment，agent 仍把两者都写成 prose instructions。
- 用户要求从 theory 派生 skill family，agent 却照抄 CLI commands、directory structure 或内部 workflow nodes。
- skill draft 通过结构校验，但仍缺少 trigger boundary、lead-review route、pressure scenario 或 forward-test surface。

## Trigger

Description: 用于创建或更新 Codex skill、把 skill-primitive material 派生成 SKILL.md / repo-skill / plugin skill，或修正正在漂移成 generic scaffolding、CLI wrapper、膨胀 docs、trigger 不清、缺少 lead-review gate、未验证 artifact 的 skill。

Triggers:

- create a skill
- update an existing skill
- turn this workflow or primitive into a skill
- design a skill family from theory
- distinguish skill behavior from CLI/script constraints
- 修正过于 generic、过宽、结构有效但行为弱的 skill

Exclusions:

- 只安装 existing skill，不改变其 behavior。
- 只运行 existing validation script 或 metadata generator。
- 只写 project docs、task notes 或 prompt，不创建 reusable agent skill。
- 只调整 runtime export / plugin packaging，不改变 skill 的 semantic source。

## Soft Boundary

- 判断 repeated agent drift 是否足以支撑 reusable skill，而不是只需要 one-off instruction。
- 判断请求的 artifact 应进入 skill、docs、prompt、CLI、script、reference 还是 source asset。
- 判断 future skill description 的 positive / negative trigger boundary。
- 判断哪些 instruction 是 SKILL.md every-use material，哪些应作为 conditional reference material。
- 判断哪里需要 lead-review，并把 review unit 保持到最小 semantic unit。
- 判断生成内容是否过于 generic、verbose、implementation-shaped 或 runtime-shaped。
- 判断 primitive material 与 materialized skill 之间是否保持同一个 behavior intervention。

## Hard Boundary

- `scripts/init_skill.py` 负责 repeatable skill folder scaffolding。
- `scripts/generate_openai_yaml.py` 负责 `agents/openai.yaml`，不要手写 UI metadata。
- `scripts/quick_validate.py` 负责 SKILL.md frontmatter、name、description 和 placeholder validation。
- `isomorph primitive skill` 负责在 exportable 前验证 contexta-owned skill primitive material。
- skill 新增或修改 deterministic tooling 时，必须 run 或 smoke-test bundled scripts。
- projection/export 只输出 Codex 官方支持的 runtime surface；不支持的 semantic field 不映射到 runtime artifact。

## Workflow

- 先接管 relevant skill-primitive material，并把它作为 semantic source；具体 skill primitive material 通常位于 owning contexta pack 或 semantic framework。
- 以 primitive 为 derivation unit，再 materialize `SKILL.md`、repo-skill output 或 plugin-distributed skill output。
- 先命名 pressure scenario，再命名 skill capability。
- 读取 existing skill resources，再决定是否编辑。
- 分离 skill-guided judgment 与 deterministic CLI/script guardrails。
- 把 frontmatter description 当作 trigger surface，不当作摘要。
- SKILL.md 只保留 every-use instructions，conditional details 移入一层 references。
- scaffolding、UI metadata、placeholder blocking 和 quick validation 交给 deterministic scripts。
- 写入 long-term skill material 前，先用 lead-review 组织最小不确定 semantic unit。
- pressure scenario 不明确且无法安全推断时，先请用户确认。
- trigger boundary 不明确时，先请用户确认 trigger 与 exclusion examples。
- skill-vs-CLI responsibility 不明确时，先请用户确认边界。
- 用户已确认方向时，推进 reversible baseline 并报告 validation。

## Export Shape

- Export draft 的 `skillName` 是 `skill-creator`；runtime naming 属于 contexta/export materialization。
- SKILL.md frontmatter `description` 必须用 user-facing terms 保留 trigger examples 与 exclusions。
- SKILL.md body 必须保留 capability、trigger、soft boundary、hard boundary、workflow、resource rules、lead-review gates 与 validation。
- `references/openai_yaml.md` 仍是 UI metadata fields 的 conditional reference material。
- `scripts/init_skill.py`、`scripts/generate_openai_yaml.py`、`scripts/quick_validate.py` 仍是 deterministic guardrails。
- skill directory 不应新增 README、changelog、installation guide 或 process-history files。
- repo-skill 与 plugin-distributed skill 可以改名为 runtime-facing identity，但必须保留这个 primitive 的 semantic basis。

## References

- `.contexta/packs/isomorph-authoring/skills/skill-creator/references/openai_yaml.md`

## Scripts

- `.contexta/packs/isomorph-authoring/skills/skill-creator/scripts/init_skill.py`
- `.contexta/packs/isomorph-authoring/skills/skill-creator/scripts/generate_openai_yaml.py`
- `.contexta/packs/isomorph-authoring/skills/skill-creator/scripts/quick_validate.py`

## Semantic Basis

- [[bootstrap/primitives/concept/skill-primitive|skill-primitive]]
- [[basis/primitives/concept/lead-review|lead-review]]
- [[bootstrap/primitives/concept/primitive-creator|primitive-creator]]
- [[bootstrap/grammars/policy/skill-primitive-boundary|skill-primitive-boundary]]
- [[basis/grammars/policy/lead-review-boundary|lead-review-boundary]]
- [[basis/grammars/policy/semantic-framework-boundary|semantic-framework-boundary]]

## Validation

- 运行 `apps/isomorph/dist/index.js primitive skill .contexta/packs/isomorph-authoring/skills/skill-creator/skill-primitive.md --json`，要求 `status: ready`。
- materialize skill 后运行 `python3 .contexta/packs/isomorph-authoring/skills/skill-creator/scripts/quick_validate.py .contexta/packs/isomorph-authoring/skills/skill-creator`。
- 对 repo-skill / plugin-distributed skill 同步运行对应 `quick_validate.py`。
- 非平凡变更需要 forward-test：使用一个不包含预设答案的 realistic skill creation request。
