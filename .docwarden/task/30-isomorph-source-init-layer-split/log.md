---
status: active
created: 2026-06-04T09:28:42.615Z
updated: 2026-06-04T19:59:00.000Z
title: isomorph source init layer split
id: 30-isomorph-source-init-layer-split
---

# Log

- [20260604092842615] task created: isomorph source init layer split (30-isomorph-source-init-layer-split)
- [20260604172842] captured user correction: current `primitives`, `grammars`, and `exports` hierarchy is still wrong; the next model must distinguish portable theory primitives from isomorph self-bootstrap vocabulary and from the `.isomorph` that appears in a user codebase after init.
- [20260604172842] drafted target taxonomy: isomorph source assets, portable theory primitives, isomorph bootstrap vocabulary, initialized project `.isomorph`, and projection/export/materialization.
- [20260604173000] captured implementation preference: user dislikes intermediate states; this round is a breaking change and must be implemented in one pass after review, with no dual source of truth, fallback old hierarchy, or half-migrated directory state.
- [20260604174147] completed scope-limited inventory for `.contexta/.agents/plugins/apps/contexta/tests`: no direct `.isomorph/(primitives|grammars|exports)` path references found in these ownership paths; only task documentation contains taxonomy text references.
- [20260604174147] updated contexta test contract to tolerate additional dogfood/runtime assets while asserting required canonical IDs and blocking legacy `.isomorph/{primitives,grammars,exports}` source paths.
- [20260604195900] updated implementation split: moved isomorph runtime/config paths to basis/bootstrap/init layers, updated init output to init-only, and rewrote doctor/local-model/primitive-skill/tests/contracts accordingly; removed old `.isomorph/{primitives,grammars,exports}` behavior assumptions from tests.
- [20260604181200] corrected implementation landing: package-owned isomorph source now lives under `apps/isomorph/isomorph-source/{basis,bootstrap,init}`; root `.isomorph` is no longer source authority and contains only init-visible `README.md` plus `.isomorph-pin.json`.
- [20260604181200] removed migration-only `legacy-*` signals and stale `skill-primitive.md` files from `.agents`/plugin distributed skill outputs; canonical skill primitive material remains in `.contexta` only.
