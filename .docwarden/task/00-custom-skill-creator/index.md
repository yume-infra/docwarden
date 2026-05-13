---
status: working
updated: 2026-05-09
owner: sayori
---

# Custom Skill Creator Index

This working folder drafts a Sayori/docwarden-tailored replacement for the upstream `skill-creator`.

## Contents

- `skill-creator/`: upstream reference copy. Keep unchanged except for generated-cache cleanup.
- `custom-skill-creator/`: first tailored skill draft.

## Source Baseline

- `docs/ai基建建设/理念-v1.md`
- `docs/文档体系建设/理念-v1.md`
- `docs/文档体系建设/v1与扩展.md`

## Review Points

- Confirm whether `custom-skill-creator` is the final skill name.
- Confirm whether the skill should be installed under `${CODEX_HOME:-$HOME/.codex}/skills` after review.
- Review semantic choices in `custom-skill-creator/SKILL.md`, especially the task/stable boundary and source-trace requirements.
