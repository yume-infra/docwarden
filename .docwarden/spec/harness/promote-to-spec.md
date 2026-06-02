---
kind: pipeline
---

# promote-to-spec

## Input

- reviewed task material
- candidate assertion
- existing `.docwarden/spec/<target>.md` modules
- optional `--kind` for creating a missing module

## Transform

- Identify whether the candidate belongs in spec rather than guide/wiki/task.
- Resolve the concrete workspace asset module target path.
- Resolve the intended section, list item, or future locator position.
- If the module exists, produce a patch against that module.
- If the module does not exist, create a minimal module when `--kind` is provided.
- If the target cannot be resolved, stop before writing stable spec.

## Output

- updated spec module, or
- created spec module, or
- rejected / deferred material with reason.
