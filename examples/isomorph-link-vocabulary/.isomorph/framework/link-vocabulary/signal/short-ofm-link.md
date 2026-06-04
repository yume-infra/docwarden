---
kind: signal
---

# short-ofm-link

## Definition

Short OFM links hide the source path and make semantic references depend on basename uniqueness.

## Loss Model

When a source tree has multiple conceptual layers, `[[name]]` can resolve to the wrong file after reorganization or import. The semantic relation should preserve its path while allowing a readable label.

## Trigger

- `frontmatter.kind == link-example`
- `ofm link target is short`

## Basis

- [[framework/link-vocabulary/vocabulary|link vocabulary]]
- [[language/grammar/policy/link-resolution|link-resolution]]

