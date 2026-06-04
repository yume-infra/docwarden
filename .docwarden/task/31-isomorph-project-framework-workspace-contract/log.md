---
status: implemented
created: 2026-06-05T00:00:00.000Z
updated: 2026-06-05T01:26:00.000Z
title: isomorph project framework workspace contract
id: 31-isomorph-project-framework-workspace-contract
---

# Log

- [20260605000000] task created from user acceptance: proceed with project framework workspace contract and dogfood it through a repo example using the previously discussed link vocabulary direction.
- [20260605012600] implemented minimal user-owned `.isomorph/framework/<framework-id>/` contract: framework summary model, vocabulary term recognition authority, `isomorph framework list`, OFM link target triggers, and link vocabulary example.
- [20260605012600] dogfood result: temp workspace ran `isomorph init`, overlaid `examples/isomorph-link-vocabulary/.isomorph/framework`, recognized `link-example`, reported `short-ofm-link` for `[[link-resolution]]`, and accepted `[[language/grammar/policy/link-resolution|link-resolution]]`.
- [20260605012600] validation passed: `rtk pnpm typecheck`, `rtk pnpm build`, `rtk pnpm test`, and stale source-link scan for old `primitives/`, `grammars/`, `basis/`, `bootstrap/` paths.
