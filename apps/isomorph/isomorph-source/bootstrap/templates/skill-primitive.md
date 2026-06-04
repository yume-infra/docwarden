---
kind: skill-primitive
---

# <skill-primitive-id>

## Capability

<命名这个 future skill 给 agent 的 behavior intervention。>

This template describes a skill-primitive export draft. It is not a final Codex runtime artifact and does not make root `.isomorph` the canonical source for a concrete skill.

Pressure Scenarios:

- <描述一个没有此 skill 时 agent 会 drift 的具体用户请求或工作场景。>

## Trigger

Description: <用 user-facing terms 写出 future skill description trigger。>

Triggers:

- <描述一个应该 activate skill 的具体 phrase、task 或 request shape。>

Exclusions:

- <描述一个相邻但不应 activate skill 的 request shape。>

## Soft Boundary

- <描述 future skill 应该引导的 judgment、routing、review 或 writing behavior。>

## Hard Boundary

- <描述 future skill 必须交给 deterministic tooling 的 validation、path、script、CLI 或 filesystem constraints。>

## Workflow

- <描述 skill 应强制触发的第一个 behavior move。>
- <描述 materialization 前最小的 user-reviewable decision 或 artifact。>
- <描述 skill 应强制触发的 handoff 或 validation move。>

## Export Shape

- <描述 future SKILL.md description/body/references/scripts/assets export 必须保留的语义。>

## Semantic Basis

- [[bootstrap/primitives/concept/skill-primitive|skill-primitive]]
- [[bootstrap/primitives/concept/primitive-creator|primitive-creator]]

## Validation

- <描述 materialize skill 前必须满足的 forward-test、script check 或 review condition。>

## Diagnostics

<Record open modeling questions or surface gaps.>
