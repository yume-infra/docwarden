---
name: iso-skill-creator
description: Use when creating or updating Codex skills, converting isomorph
  skill-primitive material into a skill, or fixing a skill that is drifting into
  generic scaffolding, CLI wrapping, bloated docs, unclear triggers, missing
  review gates, or unvalidated SKILL.md/resources.
---

# Skill Creator

Create or update Codex native skills as agent behavior interventions. A skill exists to correct repeatable agent drift; deterministic hard constraints belong in CLI or scripts.

## Drift Pressure

Do not start from folder shape, generic capability prose, or a command wrapper. First name the agent failure the skill prevents.

Common pressure scenarios:

- The agent generates skill files before proving why the skill should exist.
- The agent starts from Codex runtime folders, plugin export shape, or generic scaffolding instead of first taking over the isomorph primitive material that should drive the skill.
- The agent puts hard constraints into prose instead of deterministic scripts.
- The agent mirrors CLI commands, directories, or internal workflow nodes instead of user-facing behavior.
- A skill passes structural validation but lacks trigger boundary, review gate, pressure scenario, or forward-test surface.

## Workflow

1. If isomorph primitive material exists or the user is building from theory, take over that primitive first and treat it as the semantic source.
2. Use the primitive as the basic derivation unit before materializing `SKILL.md`, repo-skill output, or plugin-distributed skill output.
3. Read any existing skill resources before editing.
4. State the drift pressure in one concrete sentence.
5. Decide whether the request needs a skill, docs, prompt, CLI, script, reference, or asset.
6. Define activation: user phrases that should trigger the skill and nearby requests that should not.
7. Separate judgment surface from deterministic boundary.
8. Choose the smallest review gate if the drift, trigger, or skill-vs-CLI boundary is uncertain.
9. Materialize `SKILL.md` and only the bundled resources that directly support the skill.
10. Run deterministic validation before treating the skill as usable.

If the user already confirmed the direction or the source material makes it clear, proceed with a reversible baseline and report validation instead of asking broad permission questions.

## Judgment Surface

Use skill instructions for soft agent judgment:

- whether repeated drift justifies a reusable skill;
- which workflow decisions the agent must make while using the skill;
- trigger and exclusion boundaries for frontmatter `description`;
- what belongs in `SKILL.md` versus `references/`;
- where user review should happen and what the minimal review unit is;
- whether the draft is too generic, too verbose, or too implementation-shaped.

## Deterministic Boundary

Use scripts or CLI for hard constraints:

```bash
python3 scripts/init_skill.py "$SKILL_NAME" --path "$OUTPUT_DIR" --resources scripts,references
python3 scripts/generate_openai_yaml.py "$SKILL_DIR" --interface key=value
python3 scripts/quick_validate.py "$SKILL_DIR"
```

Use `init_skill.py` for repeatable scaffolding, `generate_openai_yaml.py` for `agents/openai.yaml`, and `quick_validate.py` for SKILL.md frontmatter, name, description, and placeholder checks.

If the skill adds or changes scripts, run or smoke-test those scripts directly. If the skill is derived from isomorph material, run `isomorph primitive skill` on the primitive file before export.

## Writing Rules

Frontmatter:

- `name` is the stable skill identity, in hyphen-case.
- `description` is the activation surface, not a summary.
- Include trigger scenarios and important exclusions in `description`.
- Keep unsupported metadata out unless the platform explicitly supports it.
- Keep description under 1024 characters and free of angle-bracket placeholders.

Body:

- Write for a future Codex instance that does not share this conversation.
- Keep only every-use instructions in `SKILL.md`.
- Prefer concrete examples and decision points over explanation.
- Do not include README, changelog, installation guide, process notes, or extra docs inside the skill.
- Use `references/` for conditional detail and link each reference from `SKILL.md` with when to read it.
- Keep references one level deep.
- Use `scripts/` only for deterministic, fragile, or repeatedly rewritten operations.
- Use `assets/` only for files used in final outputs.

Read `references/openai_yaml.md` before adding optional UI metadata fields.

## Review Gates

Ask the user to confirm only the smallest uncertain unit:

- drift pressure, if the skill's reason to exist is unclear;
- activation boundary, if trigger or exclusion examples are ambiguous;
- skill-vs-CLI boundary, if hard and soft constraints are mixed;
- export shape, if the skill identity or resource layout is uncertain.

Do not ask for broad confirmation when the user has already confirmed the direction.

## Validation

Always run:

```bash
python3 scripts/quick_validate.py "$SKILL_DIR"
```

Regenerate `agents/openai.yaml` when frontmatter name, description, display name, short description, or default prompt changes.

For nontrivial skills, forward-test with a clean realistic request:

```text
Use $generated-skill at $SKILL_DIR to handle: turn a repo-specific review workflow into a concise Codex skill.
```

Do not include the intended answer, suspected bug, or prior conclusions in the forward-test prompt unless the test explicitly requires them.
