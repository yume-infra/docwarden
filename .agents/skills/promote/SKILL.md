---
name: promote
description: Use when promoting reviewed document-maintenance task material into
  spec, guide, or wiki through the CLI after user review. Use for mainline project
  baseline changes and stable execution rules. Do not use for side-signal picks,
  raw task logging, direct docs edits, or unresolved review material.
---

# Promote

Use promote for reviewed mainline material that should change the project baseline. The skill decides whether a stable write is justified; the CLI performs the write and enforces destination rules.

## Drift Pressure

Agents tend to promote raw task summaries, write to a vague spec file, or treat every completed task as requiring stable material. Promote should happen only when there is a precise stable delta and a clear landing.

## Workflow

1. Read the task, latest task review surface, current stable target, and user context before judging.
2. Name the proposed stable delta in one sentence.
3. Route before writing:
   - promote: project baseline, execution rule, spec assertion, guide path, or wiki node changes;
   - pick: reusable side signal hidden by the mainline;
   - log-only: useful task history but no stable delta;
   - no-op: no new durable material;
   - continue-task: source, boundary, or landing is still unclear.
4. For spec, choose a concrete `<asset-group>/<module>` target such as `harness/review-surface`, `harness/promote-to-spec`, or `apps/docwarden`.
5. Ask the user only when the stable assertion or landing is uncertain.
6. Run the CLI only after review exists and the route is promote.
7. Report the artifact path, target layer, review gate, and any remaining side material.

## Judgment Surface

Use skill judgment for:

- whether the change is mainline stable material rather than side knowledge;
- which stable layer should receive it: spec, guide, or wiki;
- the smallest assertion or user-facing concept worth preserving;
- whether no stable write is the correct reviewed outcome;
- whether a contexta/isomorph boundary issue should be recorded instead of promoted by docwarden.

## Deterministic Boundary

Use CLI for hard constraints and writes:

```bash
rtk pnpm exec docwarden --root "$WORKSPACE_ROOT" review --task "$TASK_ID" --json
rtk pnpm exec docwarden --root "$WORKSPACE_ROOT" promote --task "$TASK_ID" --to spec --target "$SPEC_TARGET" --kind "$SPEC_KIND" --json
rtk pnpm exec docwarden --root "$WORKSPACE_ROOT" promote --task "$TASK_ID" --to guide --json
rtk pnpm exec docwarden --root "$WORKSPACE_ROOT" promote --task "$TASK_ID" --to wiki --json
```

`promote --to spec` requires `--target <asset-group>/<module>`. Use `--kind` only when creating a missing module.

Do not use promote for side signals; use `$pick`.

Do not edit `docs/` unless the user explicitly asks for a concrete docs file edit after the docs authority rule is known.

## Validation

Before treating this skill as usable, run:

```bash
rtk python3 .agents/skills/iso-skill-creator/scripts/quick_validate.py .agents/skills/promote
rtk pnpm exec docwarden --help
```
