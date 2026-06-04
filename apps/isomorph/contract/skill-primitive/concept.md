---
kind: concept
---

# skill-primitive

## Designation

Canonical: `skill-primitive`

Aliases:

- skill primitive

## Definition

skill-primitive 是 agent-use contract shape，用来把一个 future skill 建模成 agent behavior intervention。

它从 capability 开始：先说明这个 future skill 要给 agent 的行为干预能力，并用 repeated pressure scenario 证明这个能力确实需要存在。

随后它继续表达 trigger、soft boundary、hard boundary、workflow、semantic basis、export shape 和 validation。

isomorph package source 只拥有 `skill-primitive` 这个 contract concept 和 boundary，不拥有具体 skill 的 canonical material。

具体 skill primitive material 应属于对应 semantic framework 或 contexta pack。contexta 可以把确认后的 skill primitive material materialize 成 Codex `SKILL.md`、repo-skill 或 plugin-distributed skill。

primitive analysis 可以从 semantic material 产出 `codex-skill` export draft，但不把 root `.isomorph` primitive catalog 当作最终 `SKILL.md` artifact 或具体 skill source。
