---
kind: policy
---

# docwarden

## Scope

Applies to `apps/docwarden`.

## Role

`apps/docwarden` owns the document maintenance workflow CLI.

## Stable Surface

- `docwarden init` creates the `.docwarden` harness runtime skeleton.
- `docwarden task create` creates task working material.
- `docwarden review` creates review surfaces from task material or target files.
- `docwarden promote` writes reviewed task output to spec / guide / wiki.
- `docwarden pick` writes reusable picks to wiki.

## Assertions

- The CLI MUST treat `.docwarden` as a harness asset for the whole workspace, not as a product-local docwarden package workspace.
- The CLI MUST NOT create `.docwarden/template/` in v0.
- Missing spec modules MAY be created by the built-in minimal scaffold when `--kind` is provided.
