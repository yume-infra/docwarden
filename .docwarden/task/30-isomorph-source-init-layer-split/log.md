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
- [20260604113130] user rejected the `basis/bootstrap/init` implementation model and accepted a new top-level ability-loop structure for isomorph theory material: `language / framework / contract / loop`; recorded in `accepted-structure-definition.md`. The previous `apps/isomorph/isomorph-source/{basis,bootstrap,init}` landing is now treated as failed implementation state, not future source of truth.
- [20260604113344] user accepted the first `language` capability split (`primitive / grammar / recognition / semantic-lint / structure`) but clarified that the actual md content must be reorganized by responsibility; existing mixed-duty md files cannot be mechanically moved.
- [20260604163548] user clarified that many existing md modules already have single-responsibility shape; the main issue is wrong classification, not indiscriminate file splitting. Migration acceptance should check responsibility-to-layer fit.
- [20260604164620] user confirmed the unifying classification rule after md sampling: path expresses ability ownership, while `kind` expresses content language. The apparent two systems must be unified by keeping both dimensions distinct rather than flattening them into one directory tree.
- [20260605000000] implemented accepted breaking landing: replaced `apps/isomorph/isomorph-source/{basis,bootstrap,init}` with direct `apps/isomorph/{language,framework,contract,loop}` source abilities; removed docwarden/contexta/init mixed material from isomorph package authority; converted init output to CLI-owned seed material; updated runtime loading, doctor repair, source list, primitive skill contract paths, package files, tests, and contexta skill primitive semantic basis links.
