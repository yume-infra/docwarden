import { createHash } from 'node:crypto'

export interface SeedFile {
  readonly path: string
  readonly content: string
}

export const seedVendor = 'isomorph'
export const seedRef = 'isomorph-seed-v0'
export const seedSchemaVersion = 1

export const seedFiles: readonly SeedFile[] = [
  {
    path: 'mapping/bootstrap/modules/concept/concept.md',
    content: `---
kind: concept
---

# concept

## Designation

Canonical: \`concept\`

## Definition

concept is a named semantic object in local isomorph. It defines what an object is and why the name is needed.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/policy.md',
    content: `---
kind: concept
---

# policy

## Designation

Canonical: \`policy\`

## Definition

policy is a normative boundary for a semantic object. It uses rule language only when the local model needs a constraint.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/template.md',
    content: `---
kind: concept
---

# template

## Designation

Canonical: \`template\`

## Definition

template is a formatted md surface used to materialize a semantic object. It does not own review, pick, update, write, or lifecycle authority.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/signal.md',
    content: `---
kind: concept
---

# signal

## Designation

Canonical: \`signal\`

Aliases:

- lint signal
- semantic signal

## Definition

signal is a semantic-lint warning emitted from observable md surface material.

signal definition is local isomorph material with \`kind: signal\`. It names a possible semantic drift, lists trigger surface, and points to basis material.

An emitted signal is not final review judgment.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/semantic-lint.md',
    content: `---
kind: concept
---

# semantic-lint

## Definition

semantic-lint is the runtime pass that runs after recognition and emits signals from local signal definitions.

semantic-lint produces review-ready material, not final semantic judgment.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/trigger.md',
    content: `---
kind: concept
---

# trigger

## Definition

trigger is observable formatted md surface used by a local signal definition.

Trigger material can inspect path, frontmatter, headings, sections, OFM links, locator markers, and magic words.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/confidence.md',
    content: `---
kind: concept
---

# confidence

## Definition

confidence is an implementation-side strength marker for recognition or signal applicability.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/locator.md',
    content: `---
kind: concept
---

# locator

## Definition

locator is a stable address for a concrete md assertion or section.

v0 locator marker form is \`^<prefix>-<number>\`.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/magic-word.md',
    content: `---
kind: concept
---

# magic-word

## Definition

magic-word is a token role that can be consumed by recognition or semantic-lint.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/mapping.md',
    content: `---
kind: concept
---

# mapping

## Definition

mapping describes how a theory object is materialized into readable md entities.

Mapping is an important input to recognition, but recognition is not only mapping lookup.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/recognition-primitive.md',
    content: `---
kind: concept
---

# recognition-primitive

## Designation

Canonical: \`recognition-primitive\`

## Definition

recognition-primitive is local isomorph material that interprets observable markdown surface into a candidate role.

frontmatter, path, headings, sections, links, and locator markers are features. They are not recognition authority by themselves.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/primitive-creator.md',
    content: `---
kind: concept
---

# primitive-creator

## Definition

primitive-creator is the local primitive that creates new isomorph language primitives from semantic model material.

It is not a generic scaffold generator. v0 first applies it to skill primitive material.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/skill-primitive.md',
    content: `---
kind: concept
---

# skill-primitive

## Designation

Canonical: \`skill-primitive\`

Aliases:

- skill primitive

## Definition

skill-primitive is a local isomorph primitive for modeling agent-consumable skill behavior before compiling a final SKILL.md artifact.

v0 keeps export position material visible but does not implement the final skill compiler.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/workflow.md',
    content: `---
kind: concept
---

# workflow

## Designation

Canonical: \`workflow\`

## Definition

workflow is structured material that describes state, moves, transitions, and execution responsibility.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/architecture.md',
    content: `---
kind: concept
---

# architecture

## Designation

Canonical: \`architecture\`

## Definition

architecture is structure material that describes layers, relations, boundaries, and responsibility distribution.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/example.md',
    content: `---
kind: concept
---

# example

## Designation

Canonical: \`example\`

## Definition

example is concrete sample material. It illustrates behavior or surface shape but does not prove a kind by itself.
`,
  },
  {
    path: 'mapping/bootstrap/modules/concept/composition.md',
    content: `---
kind: concept
---

# composition

## Designation

Canonical: \`composition\`

## Definition

composition is structure material that names a stable whole, its parts, and the semantic boundary between them.
`,
  },
  {
    path: 'mapping/bootstrap/modules/recognition/default.md',
    content: `---
kind: recognition-primitive
---

# default-recognition

## local-kind-frontmatter

Role: $frontmatter.kind
Confidence: 0.9

When:
- \`frontmatter.kind is local kind\`

Basis:
- [[mapping/bootstrap/modules/concept/recognition-primitive|recognition-primitive]]
- [[mapping/bootstrap/modules/concept/mapping|mapping]]
`,
  },
  {
    path: 'mapping/bootstrap/modules/magic-word/locator-marker.md',
    content: `---
kind: magic-word
---

# locator-marker

## Consumer

- [[mapping/bootstrap/modules/concept/locator|locator]]
- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]

## Token Role

locator marker is an address token, not a semantic classifier.

## \`^<prefix>-<number>\`

locator marker form for a stable assertion address.
`,
  },
  {
    path: 'mapping/bootstrap/modules/policy/signal-boundary.md',
    content: `---
kind: policy
---

# signal-boundary

## Context

This policy constrains signal and signal definition responsibility.

## Policy

- signal definition MUST name a semantic-lint warning.
- signal definition MUST use \`Definition / Trigger / Basis\` as its minimal surface.
- signal definition MUST NOT express review judgment.
- emitted signal SHOULD use locator when it points to a concrete assertion.
`,
  },
  {
    path: 'mapping/bootstrap/modules/policy/template-boundary.md',
    content: `---
kind: policy
---

# template-boundary

## Context

This policy keeps template modules from owning workflow lifecycle.

## Policy

- template module MUST describe formatted surface.
- template module MUST NOT own source, review, pick, update, write, or lifecycle decisions.
`,
  },
  {
    path: 'mapping/bootstrap/modules/policy/skill-primitive-boundary.md',
    content: `---
kind: policy
---

# skill-primitive-boundary

## Context

This policy keeps v0 skill primitive material distinct from final skill artifact generation.

## Policy

- skill primitive MUST keep semantic basis visible.
- skill primitive MUST keep export position visible.
- skill primitive MUST NOT pretend v0 has a complete SKILL.md compiler.
`,
  },
  {
    path: 'mapping/bootstrap/templates/concept.md',
    content: `---
kind: concept
---

# <concept-id>

## Designation

Canonical: \`<concept-id>\`

## Naming Need

<Explain why this semantic object needs a name.>

## Definition

<Define what this concept is.>
`,
  },
  {
    path: 'mapping/bootstrap/templates/policy.md',
    content: `---
kind: policy
---

# <policy-id>

## Intent

<Explain the boundary this policy protects.>

## Scope

<Describe where it applies and where it does not apply.>

## Rules

- <subject> <MUST|MUST NOT|SHOULD|SHOULD NOT|MAY> <action>.
`,
  },
  {
    path: 'mapping/bootstrap/templates/skill-primitive.md',
    content: `---
kind: skill-primitive
---

# <skill-primitive-id>

## Capability

<Name the agent behavior this skill primitive models.>

## Trigger

<Describe when the primitive should be considered.>

## Semantic Basis

- [[mapping/bootstrap/modules/concept/skill-primitive|skill-primitive]]
- [[mapping/bootstrap/modules/concept/primitive-creator|primitive-creator]]

## Export Position

<Describe what future SKILL.md export would need to preserve.>

## Diagnostics

<Record open modeling questions or surface gaps.>
`,
  },
  {
    path: 'mapping/bootstrap/modules/signal/concept-as-policy.md',
    content: `---
kind: signal
---

# concept-as-policy

## Definition

\`concept-as-policy\` means a concept module may be drifting into normative policy language.

## Loss Model

This signal protects the boundary between naming a semantic object and imposing normative policy constraints.

## Trigger

- \`recognized role == concept\`
- \`heading in [Definition, Naming Need]\`
- \`section contains MUST / SHOULD / MUST NOT\`

## Basis

- [[mapping/bootstrap/modules/concept/concept|concept]]
- [[mapping/bootstrap/modules/concept/policy|policy]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]
`,
  },
  {
    path: 'mapping/bootstrap/modules/signal/workflow-as-policy.md',
    content: `---
kind: signal
---

# workflow-as-policy

## Definition

\`workflow-as-policy\` means a workflow module may be drifting into policy constraint language.

## Loss Model

This signal protects workflow material from losing state, move, and transition structure by becoming policy prose.

## Trigger

- \`recognized role == workflow\`
- \`section contains MUST / SHOULD / MUST NOT\`
- \`body missing state / move / transition terms or sections\`

## Basis

- [[mapping/bootstrap/modules/concept/policy|policy]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]
`,
  },
  {
    path: 'mapping/bootstrap/modules/signal/template-owns-lifecycle.md',
    content: `---
kind: signal
---

# template-owns-lifecycle

## Definition

\`template-owns-lifecycle\` means a template module may be taking source, review, pick, update, write, or lifecycle responsibility.

## Loss Model

This signal protects the lifecycle authority boundary so templates stay formatted surfaces instead of owning workflow decisions.

## Trigger

- \`path matches mapping/*/templates/*.md\`
- \`section contains source / review / pick / update / write / lifecycle terms\`
- \`section contains MUST / SHOULD / MUST NOT with concrete subject\`

## Basis

- [[mapping/bootstrap/modules/concept/template|template]]
- [[mapping/bootstrap/modules/policy/template-boundary|template-boundary]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]
`,
  },
  {
    path: 'mapping/bootstrap/modules/signal/architecture-as-responsibility-card.md',
    content: `---
kind: signal
---

# architecture-as-responsibility-card

## Definition

\`architecture-as-responsibility-card\` means an architecture module may only describe responsibility and not composition or boundary.

## Loss Model

This signal protects architecture material from collapsing into an ownership card without layer, relation, or boundary structure.

## Trigger

- \`recognized role == architecture\`
- \`body contains responsibility / owner / function descriptions\`
- \`body missing layer / relation / boundary terms or sections\`

## Basis

- [[mapping/bootstrap/modules/concept/policy|policy]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]
`,
  },
  {
    path: 'mapping/bootstrap/modules/signal/example-as-kind.md',
    content: `---
kind: signal
---

# example-as-kind

## Definition

\`example-as-kind\` means example material may be used as proof of a kind instead of as a concrete sample.

## Loss Model

This signal protects the distinction between a concrete example and the semantic basis that defines a kind.

## Trigger

- \`recognized role == example\`
- \`text states example proves kind or content type\`

## Basis

- [[mapping/bootstrap/modules/concept/concept|concept]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]
`,
  },
  {
    path: 'mapping/bootstrap/modules/signal/composition-as-list.md',
    content: `---
kind: signal
---

# composition-as-list

## Definition

\`composition-as-list\` means a composition module may be only a plain list and not a stable whole / part boundary.

## Loss Model

This signal protects composition material from losing its stable whole / part boundary.

## Trigger

- \`recognized role == composition\`
- \`body contains list items\`
- \`body missing whole / part / stable semantic boundary terms or sections\`

## Basis

- [[mapping/bootstrap/modules/concept/policy|policy]]
- [[mapping/bootstrap/modules/policy/signal-boundary|signal-boundary]]
`,
  },
  {
    path: 'mapping/bootstrap/structures/pipeline/semantic-lint.md',
    content: `---
kind: pipeline
---

# semantic-lint

## Input

- formatted md surface
- local signal modules
- locator markers

## Transform

1. Parse md surface.
2. Run recognition from local isomorph material.
3. Select applicable local signal definitions.
4. Emit signals with evidence and basis.

## Output

Review-ready lint material organized around emitted signals.

The output is not final review judgment.
`,
  },
]

export function computeSeedDigest(): string {
  const hash = createHash('sha256')
  for (const file of [...seedFiles].sort((a, b) => a.path.localeCompare(b.path))) {
    hash.update(file.path)
    hash.update('\0')
    hash.update(file.content)
    hash.update('\0')
  }
  return `sha256:${hash.digest('hex')}`
}
