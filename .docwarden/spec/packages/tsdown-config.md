---
kind: policy
---

# tsdown-config

## Scope

Applies to `packages/tsdown-config`.

## Role

`@docwarden/tsdown-config` provides shared CLI build configuration.

## Stable Surface

- `./cli`

## Assertions

- CLI packages SHOULD build through the shared tsdown CLI config unless they need a package-specific exception.
- Built CLI outputs MUST keep executable entrypoints usable for `smoke:bin`.
