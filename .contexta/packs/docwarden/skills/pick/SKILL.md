---
name: pick
description: Use when deciding, preparing, reviewing, or executing docwarden dw:pick after review/promote, especially to preserve user-level assets such as corrections, preferences, ADRs, terminology, project-history judgments, or reusable side knowledge that promote would hide. Do not use for mainline spec/guide/wiki promotion, raw task logging, docs edits, or deterministic CLI validation alone.
---

# DW Pick

Use pick as post-promote information-loss control. It preserves compoundable user-level assets that would otherwise disappear when task material is compressed, promoted, and cleaned up.

Pick is not a second mainline promotion path, a harvest of interesting task notes, or a wrapper around the CLI.

## Drift Pressure

Agents tend to either drop reusable side signals as disposable conversation, or over-promote user preferences and correction patterns into project rules. `dw:pick` keeps that material in the user-level asset lane.

## Workflow

1. Read the relevant task, review, promote result, current conversation, and user context before judging.
2. Name what promote absorbed, abstracted, or hid.
3. Route the remaining material before writing:
   - promote: changes project baseline or stable execution rules.
   - pick: does not change mainline, but is a compoundable user-level asset.
   - log-only: transient discussion, failed draft, or corrected content with no reusable value.
   - continue-task: source or boundary is too unclear for review.
4. For pick, reduce the candidate to the smallest reviewable unit:
   - signal;
   - reusable pattern;
   - applicability boundary;
   - proposed asset type and landing.
5. Ask the user to confirm only asset nature or landing when that unit is uncertain.
6. Run the deterministic CLI only when the reviewed candidate is task-sourced and the landing is the current CLI-supported wiki path.
7. If the candidate comes from current conversation or needs user-context/profile landing, stop with a review-gated handoff instead of using the wiki CLI as a substitute.
8. Report the artifact path, blocked landing, and any unresolved promote/pick/log split.

## Judgment Surface

Use skill judgment for:

- whether a signal is a user-level asset rather than project mainline delta;
- whether repeated user correction, agent error, ADR, terminology, or project-history context has reusable value;
- what part of the source was hidden by promote;
- whether the candidate belongs in wiki, user-context/profile, a future asset layer, or a blocked note;
- whether the candidate is too weak and should remain a signal until repeated evidence appears;
- whether to stop and route back to promote review.

## Deterministic Boundary

Use CLI for hard constraints and writes:

```bash
rtk apps/docwarden/dist/index.js --root "$WORKSPACE_ROOT" review --task "$TASK_ID" --json
rtk apps/docwarden/dist/index.js --root "$WORKSPACE_ROOT" promote --task "$TASK_ID" --to spec --target "$SPEC_TARGET" --kind "$SPEC_KIND" --json
rtk apps/docwarden/dist/index.js --root "$WORKSPACE_ROOT" pick --task "$TASK_ID" --to wiki --json
```

The current CLI pick path only materializes task-sourced wiki picks. It owns required `--task`, destination constraints, artifact paths, and task log updates. If the dist binary may be stale, rebuild or run the package-local test loop before treating output as valid.

Do not manually write `.docwarden/wiki` pick artifacts when the CLI path is available. Do not edit `docs/` unless the user explicitly asks for a concrete docs file edit.

Do not use `docwarden pick --to wiki` as a substitute for a conversation-sourced user-context/profile landing. Keep that as reviewed handoff material until a deterministic entity path exists.

## Review Gate

Stop pick and route back to promote if the candidate changes project baseline, stable execution rules, docs authority, review artifact schema, cleanup config, or mainline spec/guide/wiki content.

If source, reusable value, applicability, or landing is unclear, ask for that one decision only. Do not ask for broad workflow confirmation after the user has already confirmed the direction.

If the signal is only one weak correction, present it as a pick signal and keep the next action explicit; do not turn it into a long-term default without repeated evidence or user confirmation.

## Validation

Before treating this skill as usable, run:

```bash
rtk apps/isomorph/dist/index.js primitive skill .contexta/packs/docwarden/skills/pick/skill-primitive.md --json
rtk python3 .contexta/packs/isomorph-authoring/skills/skill-creator/scripts/quick_validate.py .contexta/packs/docwarden/skills/pick
```

Forward-test with a real correction signal. The skill must produce a route decision before any CLI command.
