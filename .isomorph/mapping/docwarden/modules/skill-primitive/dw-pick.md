---
kind: skill-primitive
---

# dw-pick

## Drift Pressure

Agents either lose reusable side signals after task cleanup, or over-promote conversation corrections and user preferences into project mainline rules.

Pressure Scenarios:

- A task has been reviewed and promoted, but the useful residue is a user preference, correction pattern, ADR, terminology note, or project-history judgment that the mainline artifact intentionally compressed away.
- A user corrects the agent repeatedly during a workflow and the agent treats the correction as disposable conversation instead of a candidate user-level asset.
- A side signal looks valuable, and the agent writes it as spec or docs material even though it does not change the project baseline.
- The agent runs `docwarden pick` mechanically before deciding whether the candidate is pick, promote, log-only, or continue-task material.

## Intervention

Force pick work to behave as post-promote information-loss control for compoundable user-level assets.

- Identify what promote absorbed, abstracted, or hid before naming the pick candidate.
- Route material as promote, pick, log-only, or continue-task before writing anything.
- Treat conversation corrections, user feedback, task residue, and agent error patterns as valid pick sources.
- Keep the pick candidate small enough for user review: signal, reusable pattern, applicability boundary, and proposed asset landing.
- Defer filesystem writes, destination constraints, path generation, and task log updates to the docwarden CLI.

## Activation

Description: Use when deciding, preparing, reviewing, or executing docwarden dw:pick after review/promote, especially to preserve user-level assets such as corrections, preferences, ADRs, terminology, project-history judgments, or reusable side knowledge that promote would hide. Do not use for mainline spec/guide/wiki promotion, raw task logging, docs edits, or deterministic CLI validation alone.

Triggers:

- decide whether this review residue should be picked.
- prepare a dw:pick candidate from task material, review backing, or current conversation corrections.
- preserve a repeated user preference, correction, agent error pattern, ADR, or terminology understanding after promote.
- run `docwarden pick --task ... --to wiki` after the pick candidate is already reviewed or clearly implied.
- separate pick material from promote material before cleanup.

Exclusions:

- The material changes project baseline, stable execution rules, docs authority, review artifact schema, cleanup config, or spec/guide/wiki mainline content.
- The user only asks to run a known CLI command or validate existing output without route judgment.
- The request is to edit `docs/` directly.
- The signal is only transient process noise, failed draft text, or a one-off correction with no reusable value.

## Judgment Surface

- Decide whether a signal is a compoundable user-level asset rather than project mainline delta.
- Decide what promote absorbed or hid, and whether the remaining residue still has long-term value.
- Decide whether the source is task material, review material, promote residue, current conversation context, user correction, or agent error pattern.
- Decide the smallest reviewable candidate shape before materialization.
- Decide whether proposed landing should be wiki, user-context/profile, a future asset layer, or a blocked/gap note.
- Decide when to ask the user for only asset nature and landing confirmation.

## Deterministic Boundary

- Use `docwarden review` for review surface creation; the skill does not invent persistent review artifacts.
- Use `docwarden promote` for project mainline changes; the skill does not write spec, guide, wiki mainline deltas by hand.
- Use `docwarden pick --task "$TASK_ID" --to wiki --json` only for the current task-sourced wiki pick write path.
- Rely on the CLI for required `--task`, `--to wiki`, artifact path generation, and task log updates.
- Treat conversation-sourced or user-context/profile landings as review-gated handoff material until a deterministic CLI/entity path exists.
- Use repository validation commands for hard checks; the skill only chooses route and candidate semantics.

## Review Gate

- If the candidate may change the project baseline, stop pick and route back to promote review.
- If the candidate is only a single weak signal, present it as a pick signal and do not promote it to a long-term default without repeated evidence or user confirmation.
- If source, reusable value, applicability, or landing is unclear, ask the user to confirm only that smallest unit.
- If the user has already confirmed a task-sourced candidate and the destination is the current CLI-supported wiki path, run the deterministic pick command and report the artifact path.
- If the candidate comes from current conversation or needs user-context/profile landing, do not run the wiki CLI as a substitute for the missing entity path.

## Export Shape

- SKILL.md frontmatter `name` must be `dw-pick`.
- SKILL.md frontmatter `description` must mention `dw:pick`, post-review/promote use, user-level assets, and key exclusions from promote, raw logging, docs edits, and CLI-only validation.
- SKILL.md body must preserve drift pressure, route decision, pick candidate shape, deterministic CLI boundary, review gate, and validation.
- The skill should not bundle scripts unless `docwarden pick` stops providing the hard write path.
- The skill should not create README, changelog, installation guide, or process-history files.

## Semantic Basis

- [[mapping/bootstrap/modules/concept/skill-primitive|skill-primitive]]
- [[mapping/bootstrap/modules/concept/primitive-creator|primitive-creator]]

## Validation

- Run `apps/isomorph/dist/index.js primitive skill .isomorph/mapping/docwarden/modules/skill-primitive/dw-pick.md --json` and require `status: ready`.
- Run `python3 skills/primitive/write-skill/scripts/quick_validate.py skills/docwarden/dw-pick` after materializing the skill.
- Forward-test with a realistic correction signal and require the skill to produce a route decision before any CLI command.

## Diagnostics

- Current CLI pick destination is constrained to wiki, while accepted theory says pick targets user-level assets and the final asset layer is not fully designed.
- This first draft intentionally treats task-sourced wiki as the current deterministic write path and user-context/profile as a review-gated landing decision, not an automatic write.
