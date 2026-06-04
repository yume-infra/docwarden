---
name: review
description: Use when reviewing project document maintenance material, including
  task material, review surfaces, or proposed docs/spec/wiki changes. Use before
  promote/pick to reduce material to the smallest user-review unit. Do not use
  for generic code review, direct docs edits, or deterministic CLI validation
  alone.
---

# Review

Use this skill to keep docwarden review from becoming a broad summary or an unauthorized docs edit. The skill owns review judgment; the CLI owns hard constraints and artifact writes.

## Drift Pressure

Agents tend to either edit `docs/` directly, summarize too much task material, or blur docwarden workflow with contexta/isomorph architecture. Review must instead produce the smallest decision surface the user can actually approve or correct.

## Workflow

1. Read the requested source, current `.docwarden` task/review material, user context, and the relevant docs theory/practice files before judging.
2. Classify the layer being touched:
   - `docs/`: human-maintained source layer, edit only when explicitly requested;
   - `.docwarden/task`: short-lived working material;
   - `.docwarden/review`: temporary user review surface;
   - `.docwarden/spec|guide|wiki`: reviewed stable material;
   - `apps/docwarden`: deterministic workflow CLI;
   - `contexta` / `isomorph`: neighboring layers, not docwarden-owned.
3. Reduce the source to one review unit:
   - mainline candidate;
   - side material candidate;
   - missing context;
   - recommended stable landing, if one is clear;
   - next route: promote, pick, log-only, no-op, or continue-task.
4. If the source is task material and a review artifact is needed, run the CLI:

```bash
rtk pnpm exec docwarden --root "$WORKSPACE_ROOT" review --task "$TASK_ID" --json
```

5. If the source is a target file, run:

```bash
rtk pnpm exec docwarden --root "$WORKSPACE_ROOT" review --target "$TARGET_PATH" --json
```

6. Report the review artifact path and the exact user decision needed. Ask only for the smallest uncertain unit.

## Judgment Surface

Use skill judgment for:

- what the user must review;
- whether material belongs to mainline stable docs, side knowledge, or task-only history;
- whether docs theory, `.docwarden` spec, contexta, or isomorph owns the change;
- whether the review lead is too large, too vague, or too implementation-shaped;
- whether the correct outcome is no stable write.

## Deterministic Boundary

Use the CLI for hard constraints and writes. Do not manually create review directories when `docwarden review` can do it.

Do not edit `docs/` unless the user explicitly asks for a concrete docs file edit after the docs authority rule is known.

Do not route contexta catalog/export or isomorph primitive work into docwarden. Record the boundary gap and hand it back to the owning lane.

## Validation

Before treating this skill as usable, run:

```bash
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .agents/skills/review
rtk pnpm exec docwarden --help
```
