---
kind: skill-primitive
---

# <skill-primitive-id>

## Capability

<Name the behavior intervention this future skill gives an agent.>

Pressure Scenarios:

- <Describe a concrete user request or working situation where the agent drifts without the skill.>

## Trigger

Description: <Write the future skill description trigger in user-facing terms.>

Triggers:

- <Describe a concrete phrase, task, or request shape that should activate the skill.>

Exclusions:

- <Describe a nearby request shape that should not activate the skill.>

## Soft Boundary

- <Describe judgment, routing, review, or writing behavior the future skill should guide.>

## Hard Boundary

- <Describe validation, path, script, CLI, or filesystem constraints the future skill must defer to deterministic tooling.>

## Workflow

- <Describe the first behavior move the skill should force.>
- <Describe the smallest user-reviewable decision or artifact before materialization.>
- <Describe the handoff or validation move the skill should force.>

## Export Shape

- <Describe what future SKILL.md description/body/references/scripts/assets export must preserve.>

## Semantic Basis

- [[primitives/modules/concept/skill-primitive|skill-primitive]]
- [[primitives/modules/concept/primitive-creator|primitive-creator]]

## Validation

- <Describe the forward-test, script check, or review condition required before materializing a skill.>

## Diagnostics

<Record open modeling questions or surface gaps.>
