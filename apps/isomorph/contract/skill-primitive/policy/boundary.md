---
kind: policy
---

# skill-primitive-boundary

## Context

This policy keeps skill primitive as an agent-use contract shape, distinct from language primitives and final runtime artifacts.

## Policy

- skill primitive MUST keep semantic basis visible.
- skill primitive MUST 使用 `Capability / Trigger / Soft Boundary / Hard Boundary / Workflow / Export Shape / Semantic Basis / Validation` surface。
- skill primitive MUST 从 capability as behavior intervention 开始，而不是 folder shape、runtime path 或 CLI wrapper。
- skill primitive MUST keep pressure scenarios under Capability.
- skill primitive MUST 区分 soft agent judgment 与 hard deterministic constraints。
- skill primitive MUST model review gates as Workflow moves, and SHOULD use [[loop/lead-review/concept|lead-review]] when user review is needed.
- skill primitive MUST keep export shape and validation material visible.
- skill primitive MAY produce a codex-skill export draft.
- concrete skill primitive material MUST belong to the owning semantic framework or contexta pack.
- `language/primitive` MUST NOT become canonical storage for concrete skill contracts.
- contexta MAY materialize confirmed skill primitive material into Codex `SKILL.md`, repo-skill or plugin-distributed skill.
- runtime export MUST only expose Codex-supported skill surface.
- skill primitive MUST NOT directly materialize final SKILL.md artifacts from package contract material.
- skill primitive MUST NOT treat non-canonical headings as exportable surface.
