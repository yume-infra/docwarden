---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# next goal handoff

本文件给后续 CLI runtime implementation goal 使用。

## Goal Shape

实现 contexta CLI runtime 第一版。

这个 goal 应产出真实可执行 CLI，而不是继续停留在理论草案。

## Required Theory

执行 agent 必须先读取本 task 的 core theory docs：

- `index.md`
- `lead.md`
- `sup-01-runtime-boundary.md`
- `sup-02-recognition-pipeline.md`
- `sup-03-primitive-creator.md`
- `sup-04-init-upgrade-model.md`
- `sup-05-next-goal-handoff.md`
- `sup-06-v0-executable-contract.md`
- `log.md`

如果实现中不理解 contexta 的业务边界，应回到这些材料，而不是现场重新发明模型。

## Implementation Direction

第一版 runtime 应优先覆盖：

1. `init`
   - materialize vendor snapshot into local `.contexta`
   - record enough pin metadata for future upgrade
   - avoid root `contexta.md`
   - avoid external asset writes

2. recognition pipeline
   - parse arbitrary md target into md surface
   - build recognition result from local contexta model
   - use mapping as an important input, not as the whole recognition model
   - do not hardcode the final primitive schema too early

3. lint core
   - run after recognition
   - select applicable signal definitions
   - emit signal, not final judgment

4. primitive-creator first pass
   - model skill primitive as the first primitive-creator target
   - do not reduce it to file scaffold only

5. upgrade model skeleton
   - represent pinned vendor baseline
   - leave a clear path for future diff / migration material

## Acceptance Direction

The next goal should be considered successful only if the CLI can run locally and demonstrate the runtime shape.

Minimum acceptable demonstration:

```text
contexta init
contexta lint <some-md-target>
contexta primitive skill <some-skill-primitive-target>
```

The exact command surface may evolve during implementation, but it must preserve the model in this task.

The `init` demonstration must be non-destructive and should run against a temporary fixture when `.contexta` already exists.

## Non Goals

- Do not implement a complete upgrade merge engine in the first pass.
- Do not create a root `contexta.md`.
- Do not modify external assets during init.
- Do not hardcode recognition as a fixed list detached from local contexta.
- Do not turn primitive-creator into a generic scaffold generator.
