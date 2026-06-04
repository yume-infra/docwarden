---
kind: skill-primitive
---

# skill-creator

## Capability

Create or update Codex native skills as behavior interventions, requiring the agent to prove repeatable drift before materializing files.

Pressure Scenarios:

- A user asks to create or update a skill and the agent starts by generating files instead of naming the agent failure the skill should prevent.
- A user expects skill work to start from isomorph primitive material, and the agent instead starts from Codex runtime folders, plugin export shape, or generic skill scaffolding.
- A user distinguishes hard constraints from soft workflow judgment and the agent encodes both as prose instructions.
- A user asks for a skill family from theory and the agent mirrors CLI commands, directory structure, or internal workflow nodes.
- A skill draft passes structural validation but still lacks a trigger boundary, workflow review move, pressure scenario, or forward-test surface.

## Trigger

Description: Use when creating or updating Codex skills, converting isomorph skill-primitive material into a skill, or fixing a skill that is drifting into generic scaffolding, CLI wrapping, bloated docs, unclear triggers, missing review gates, or unvalidated SKILL.md/resources.

Triggers:

- create a skill
- update an existing skill
- turn this workflow or primitive into a skill
- design a skill family from theory
- distinguish skill behavior from CLI/script constraints
- fix a skill that is too generic, too broad, or mechanically valid but behaviorally weak

Exclusions:

- install an existing skill without changing its behavior.
- only run an existing validation script or metadata generator.
- write project docs, task notes, or prompts without creating a reusable agent skill.

## Soft Boundary

- Decide whether a reusable skill is justified by repeated agent drift rather than a one-off instruction.
- Decide whether the requested artifact belongs in skill, docs, prompt, CLI, script, reference, or asset.
- Decide the positive and negative trigger boundary for the future skill description.
- Decide which instructions are every-use material for SKILL.md and which are conditional reference material.
- Decide where user review is required and keep that review unit small.
- Decide whether generated material is too generic, too verbose, or too implementation-shaped.

## Hard Boundary

- Use `scripts/init_skill.py` for repeatable skill folder scaffolding.
- Use `scripts/generate_openai_yaml.py` for `agents/openai.yaml` instead of hand-rolling UI metadata.
- Use `scripts/quick_validate.py` for SKILL.md frontmatter, name, description, and placeholder validation.
- Use `isomorph primitive skill` to validate skill-primitive material before treating it as exportable.
- Run or smoke-test bundled scripts when a skill adds or changes deterministic tooling.

## Workflow

- Take over the relevant isomorph skill-primitive material first; treat it as the semantic source for the future skill.
- Use the primitive as the basic derivation unit before materializing `SKILL.md`, repo-skill output, or plugin-distributed skill output.
- Name the pressure scenario before naming the skill capability.
- Separate skill-guided judgment from deterministic CLI or script guardrails.
- Treat frontmatter description as the trigger surface, not a summary.
- Preserve only every-use instructions in SKILL.md and move conditional details into one-level references.
- Use deterministic scripts for scaffolding, UI metadata, placeholder blocking, and quick validation.
- Review the smallest uncertain semantic unit before writing long-term skill material.
- If the pressure scenario is not explicit or safely inferable, ask the user to confirm that first.
- If trigger boundary is ambiguous, ask the user to confirm trigger and exclusion examples before materialization.
- If skill-vs-CLI responsibility is ambiguous, ask the user to confirm the boundary before writing long-term instructions.
- If the user has already confirmed the direction, proceed with a reversible baseline and report validation.

## Export Shape

- Export draft `skillName` is `skill-creator`; runtime naming belongs to contexta/export materialization.
- SKILL.md frontmatter `description` must preserve trigger examples and exclusions in user-facing terms.
- SKILL.md body must preserve capability, trigger, soft boundary, hard boundary, workflow, resource rules, and validation.
- `references/openai_yaml.md` remains conditional reference material for UI metadata fields.
- `scripts/init_skill.py`, `scripts/generate_openai_yaml.py`, and `scripts/quick_validate.py` remain deterministic guardrails.
- The skill directory must not gain README, changelog, installation guide, or process-history files.

## References

- `.contexta/packs/isomorph-authoring/skills/skill-creator/references/openai_yaml.md`

## Scripts

- `.contexta/packs/isomorph-authoring/skills/skill-creator/scripts/init_skill.py`
- `.contexta/packs/isomorph-authoring/skills/skill-creator/scripts/generate_openai_yaml.py`
- `.contexta/packs/isomorph-authoring/skills/skill-creator/scripts/quick_validate.py`

## Semantic Basis

- [[primitives/modules/concept/skill-primitive|skill-primitive]]
- [[primitives/modules/concept/primitive-creator|primitive-creator]]

## Validation

- Run `apps/isomorph/dist/index.js primitive skill .isomorph/primitives/modules/skill-primitive/skill-creator.md --json` and require `status: ready`.
- Run `python3 .contexta/packs/isomorph-authoring/skills/skill-creator/scripts/quick_validate.py .contexta/packs/isomorph-authoring/skills/skill-creator` after materializing the skill.
- For nontrivial changes, forward-test with a realistic skill creation request that does not include the intended answer.
