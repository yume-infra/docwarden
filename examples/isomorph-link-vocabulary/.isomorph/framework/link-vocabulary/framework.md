---
kind: semantic-framework
---

# link-vocabulary

## Domain

OFM link authoring inside isomorph-style markdown.

## Semantic Objects

- `link-example`: a markdown target whose link surface should be checked by this vocabulary.
- `short-ofm-link`: an OFM wikilink whose target depends on basename resolution.
- `ofm-path-alias`: an OFM wikilink whose target preserves the explicit source path and display label.

## Agent-Use Surface

Agents importing this framework should prefer path + alias links when the target belongs to an authored semantic source tree.

## Basis

- [[framework/link-vocabulary/vocabulary|link vocabulary]]
- [[language/grammar/policy/link-resolution|link-resolution]]

