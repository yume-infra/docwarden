---
kind: policy
---

# contexta

## Scope

Applies to `apps/contexta`.

## Role

`apps/contexta` owns context infrastructure for capability, catalog, install, activation, and asset lookup surfaces.

## Stable Surface

- `contexta capability`
- `contexta catalog`
- `contexta install`
- `contexta activation`
- `contexta asset`

## Assertions

- contexta MUST NOT own docwarden's workflow execution.
- contexta MAY distribute or activate skills, prompts, agents, mappings, and other capability assets.
- docwarden may consume contexta distribution capability, but docwarden workflow rules remain owned by the `.docwarden` harness and its mapped structures.
