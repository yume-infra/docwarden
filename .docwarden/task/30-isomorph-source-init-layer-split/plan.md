# 30-isomorph-source-init-layer-split plan

Task title: isomorph source init layer split
Created: 2026-06-04T09:28:42.615Z
Updated: 2026-06-05T00:00:00.000Z

## Objective

Implement the accepted breaking migration for isomorph package source:

- package-owned theory material lives directly under `apps/isomorph/language`, `apps/isomorph/framework`, `apps/isomorph/contract`, and `apps/isomorph/loop`;
- user project `.isomorph` contains only init seed material plus user/project semantic framework material;
- no `apps/isomorph/isomorph-source`, `basis`, `bootstrap`, or `init` source layer remains;
- docwarden/contexta dogfood material does not remain in isomorph package authority;
- tests validate the new ability ownership model instead of preserving the rejected layer names.

## Accepted Model

Top-level source abilities:

```text
language
framework
contract
loop
```

Classification rule:

```text
path = ability ownership
kind = content language
```

`language` owns primitive, grammar, recognition, semantic-lint, and structure language material.

`framework` owns framework-facing definitions, templates, and ownership policy; it must not own a concrete project framework instance.

`contract` owns agent-use contract shapes, including `skill-primitive`.

`loop` owns correction, candidate assertion, lead-review, and accepted-update feedback mechanics.

## Implementation Steps

- [x] Replace `apps/isomorph/isomorph-source/{basis,bootstrap,init}` with `apps/isomorph/{language,framework,contract,loop}`.
- [x] Reclassify md modules by ability ownership rather than by old path or by `kind` alone.
- [x] Remove old docwarden/contexta mixed material from isomorph source authority.
- [x] Move `skill-primitive` concept, policy, and template under `contract`.
- [x] Move `lead-review` theory under `loop`.
- [x] Move semantic-lint signals and recognition rules under `language`.
- [x] Move semantic-framework/vocabulary/mapping ownership material under `framework`.
- [x] Convert init output into CLI-owned seed files, not an `init` source layer.
- [x] Update pinned baseline, local model loading, doctor repair, source list, primitive skill analysis, package files, and tests.
- [x] Update contexta-owned skill primitive semantic basis links to the new contract/loop/framework paths.
- [ ] Run typecheck, build, and tests.

## Validation Gates

- `rtk pnpm --filter isomorph typecheck`
- `rtk pnpm --filter isomorph build`
- `rtk pnpm --filter isomorph test`
- `rtk rg "basis/|bootstrap/|isomorph-source" apps/isomorph/src apps/isomorph/tests apps/isomorph/language apps/isomorph/framework apps/isomorph/contract apps/isomorph/loop .contexta/packs/isomorph-authoring/skills .contexta/packs/docwarden/skills -n`

## Non-Goals

- Do not edit `docs/`.
- Do not preserve rejected layer names as compatibility aliases.
- Do not keep migration-only signal names or old-path fixtures.
- Do not move docwarden/contexta concrete framework material into isomorph package source.
