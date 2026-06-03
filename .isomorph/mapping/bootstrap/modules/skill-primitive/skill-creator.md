---
kind: skill-primitive
---

# skill-creator

## Drift Pressure

Agents often turn skill creation into generic scaffolding, broad capability prose, or CLI wrapping before proving which repeatable behavior drift the skill corrects.

Pressure Scenarios:

- A user asks to create or update a skill and the agent starts by generating files instead of naming the agent failure the skill should prevent.
- A user distinguishes hard constraints from soft workflow judgment and the agent encodes both as prose instructions.
- A user asks for a skill family from theory and the agent mirrors CLI commands, directory structure, or internal workflow nodes.
- A skill draft passes structural validation but still lacks a trigger boundary, review gate, pressure scenario, or forward-test surface.

## Intervention

Force skill creation to start from agent behavior correction, then materialize only the artifact surface that preserves that correction.

- Name the drift pressure before naming the skill capability.
- Separate skill-guided judgment from deterministic CLI or script guardrails.
- Treat frontmatter description as the activation surface, not a summary.
- Preserve only every-use instructions in SKILL.md and move conditional details into one-level references.
- Use deterministic scripts for scaffolding, UI metadata, placeholder blocking, and quick validation.
- Review the smallest uncertain semantic unit before writing long-term skill material.

## Activation

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

## Judgment Surface

- Decide whether a reusable skill is justified by repeated agent drift rather than a one-off instruction.
- Decide whether the requested artifact belongs in skill, docs, prompt, CLI, script, reference, or asset.
- Decide the positive and negative activation boundary for the future skill description.
- Decide which instructions are every-use material for SKILL.md and which are conditional reference material.
- Decide where user review is required and keep that review unit small.
- Decide whether generated material is too generic, too verbose, or too implementation-shaped.

## Deterministic Boundary

- Use `scripts/init_skill.py` for repeatable skill folder scaffolding.
- Use `scripts/generate_openai_yaml.py` for `agents/openai.yaml` instead of hand-rolling UI metadata.
- Use `scripts/quick_validate.py` for SKILL.md frontmatter, name, description, and placeholder validation.
- Use `isomorph primitive skill` to validate skill-primitive material before treating it as exportable.
- Run or smoke-test bundled scripts when a skill adds or changes deterministic tooling.

## Review Gate

- If drift pressure is not explicit or safely inferable, ask the user to confirm that first.
- If activation boundary is ambiguous, ask the user to confirm trigger and exclusion examples before materialization.
- If skill-vs-CLI responsibility is ambiguous, ask the user to confirm the boundary before writing long-term instructions.
- If the user has already confirmed the direction, proceed with a reversible baseline and report validation.

## Export Shape

- SKILL.md frontmatter `name` should be `skill-creator` unless the user explicitly wants a different skill identity.
- SKILL.md frontmatter `description` must preserve activation triggers and exclusions in user-facing terms.
- SKILL.md body must preserve drift pressure, intervention, judgment surface, deterministic boundary, review gate, resource rules, and validation.
- `references/openai_yaml.md` remains conditional reference material for UI metadata fields.
- `scripts/init_skill.py`, `scripts/generate_openai_yaml.py`, and `scripts/quick_validate.py` remain deterministic guardrails.
- The skill directory must not gain README, changelog, installation guide, or process-history files.

## References

- `skills/primitive/write-skill/references/openai_yaml.md`

## Scripts

- `skills/primitive/write-skill/scripts/init_skill.py`
- `skills/primitive/write-skill/scripts/generate_openai_yaml.py`
- `skills/primitive/write-skill/scripts/quick_validate.py`

## Semantic Basis

- [[mapping/bootstrap/modules/concept/skill-primitive|skill-primitive]]
- [[mapping/bootstrap/modules/concept/primitive-creator|primitive-creator]]

## Validation

- Run `apps/isomorph/dist/index.js primitive skill .isomorph/mapping/bootstrap/modules/skill-primitive/skill-creator.md --json` and require `status: ready`.
- Run `python3 skills/primitive/write-skill/scripts/quick_validate.py skills/primitive/write-skill` after materializing the skill.
- For nontrivial changes, forward-test with a realistic skill creation request that does not include the intended answer.
