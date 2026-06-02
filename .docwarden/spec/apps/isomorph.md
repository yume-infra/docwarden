---
kind: policy
---

# isomorph

## Scope

Applies to `apps/isomorph` and `.isomorph/`.

## Role

`apps/isomorph` owns the semantic primitive engine and local mapping inspection.

## Stable Surface

- `isomorph init`
- `isomorph recognize`
- `isomorph lint`
- `isomorph primitive`
- `isomorph mapping`
- `isomorph upgrade`
- `isomorph doctor`

## Assertions

- isomorph owns concept, assertion, module, locator, mapping, template, recognition, and semantic-lint semantics.
- `.isomorph/mapping/docwarden` owns the stable structure mapping for the `.docwarden` harness.
- isomorph MUST NOT own docwarden runtime task/review/promote state.
