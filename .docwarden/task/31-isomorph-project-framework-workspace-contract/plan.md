# 31-isomorph-project-framework-workspace-contract plan

Task title: isomorph project framework workspace contract
Created: 2026-06-05T00:00:00.000Z

## Accepted Direction

Use repo dogfood as acceptance:

1. `isomorph init` creates a clean user `.isomorph` with pin and seed.
2. A user-owned framework is overlaid under `.isomorph/framework/<framework-id>/`.
3. The framework defines vocabulary terms and local semantic-lint signals.
4. `recognize` proves target frontmatter can resolve against vocabulary terms.
5. `lint` proves the link vocabulary signal catches bad OFM link usage and ignores good usage.

## Workspace Contract

Minimal user-owned shape:

```text
.isomorph/
  framework/
    <framework-id>/
      framework.md
      vocabulary.md
      signal/
        <signal-id>.md
```

`framework.md` uses `kind: semantic-framework`.

`vocabulary.md` uses `kind: vocabulary` and exposes terms through a `## Terms` section.

`signal/*.md` uses `kind: signal` and is consumed by existing semantic-lint.

This shape is user/project material. It is not package source and is not contexta export material.

## Implementation Steps

- [x] Add framework summary model and `isomorph framework list`.
- [x] Parse local vocabulary terms into recognition authority.
- [x] Add OFM link trigger support needed by link vocabulary dogfood.
- [x] Add `examples/isomorph-link-vocabulary`.
- [x] Add tests that initialize a temp workspace, overlay the example framework, and validate recognize/lint behavior.
- [x] Validate with typecheck, build, test, and stale-link scans.

## Validation

- `rtk pnpm typecheck` in `apps/isomorph`
- `rtk pnpm build` in `apps/isomorph`
- `rtk pnpm test` in `apps/isomorph`
- stale link scan for old `primitives/`, `grammars/`, `basis/`, and `bootstrap/` paths
- manual dogfood through `examples/isomorph-link-vocabulary`

## Example Intent

The example models OFM link vocabulary:

- `link-example` is a local vocabulary term and can be recognized as a role.
- `short-ofm-link` is a local signal.
- A target containing `[[link-resolution]]` is linted.
- A target containing `[[language/grammar/policy/link-resolution|link-resolution]]` is accepted.
