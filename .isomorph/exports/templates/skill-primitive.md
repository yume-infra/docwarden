---
kind: skill-primitive
---

# <skill-primitive-id>

## Drift Pressure

<Name the repeated agent failure, default drift, or behavior loss this future skill exists to correct.>

Pressure Scenarios:

- <Describe a concrete user request or working situation where the agent drifts without the skill.>

## Intervention

<Describe how the future skill changes agent behavior once it activates.>

- <Describe the first behavior move the skill should force.>
- <Describe the handoff, review, or validation move the skill should force.>

## Activation

Description: <Write the future skill description trigger in user-facing terms.>

Triggers:

- <Describe a concrete phrase, task, or request shape that should activate the skill.>

Exclusions:

- <Describe a nearby request shape that should not activate the skill.>

## Judgment Surface

- <Describe judgment, routing, review, or writing behavior the future skill should guide.>

## Deterministic Boundary

- <Describe validation, path, script, CLI, or filesystem constraints the future skill must defer to deterministic tooling.>

## Review Gate

- <Describe the smallest user-reviewable decision or artifact before materialization.>

## Export Shape

- <Describe what future SKILL.md description/body/references/scripts/assets export must preserve.>

## Semantic Basis

- [[primitives/modules/concept/skill-primitive|skill-primitive]]
- [[primitives/modules/concept/primitive-creator|primitive-creator]]

## Validation

- <Describe the forward-test, script check, or review condition required before materializing a skill.>

## Diagnostics

<Record open modeling questions or surface gaps.>
