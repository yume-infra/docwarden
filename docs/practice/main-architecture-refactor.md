# Main Architecture Refactor

## Status

Current branch: `refactor/layers`

Current worktree:

```text
/Users/sayori/.codex/worktrees/1c84/docwarden
```

## Merge Acceptance (Final)

合并到主干前，lead 应逐项核对：

- `concept` 与 `practice` 文档是否一致覆盖：
  - `.isomorph` 只描述 `primitives/`、`grammars/`、`lint/`、`exports/`；
  - root `.isomorph` 是 bootstrap semantic authority，不替 docwarden 或其他项目拥有领域 framework；
  - `.contexta` 强制 pack-first；
  - projection/export 仅描述 Codex 目标；
  - 不出现 `contexta/distribution/`、`families/`、`docwarden/adoption/bindings/`；
  - 不再描述 compatibility bridge。
- `contexta` 命令口径是否统一为 `contexta assets` + `contexta export codex`，且未保留旧命令别名。
- `Codex exporter` 是否定位在 materializer 边界：`apps/contexta/src/exporters/codex/`。
- `docwarden` 文档层是否仍为拥有自己 semantic framework 的 consumer，不反向吸收 context 分发职责，也不被 root `.isomorph` 反向定义。

本分支负责 `isomorph`、`contexta`、projection/export、runtime artifacts 和 `docwarden` consumption 的主架构重构。

## External Moving Work

`/Users/sayori/Desktop/docwarden` 正在推进 docwarden v1 和 primitive work。

已观察到的移动区域包括：

- `apps/isomorph/src/**`
- `apps/isomorph/tests/**`
- `.isomorph/primitives/concept/primitive-creator.md`
- `.isomorph/primitives/concept/skill-primitive.md`
- `.isomorph/grammars/policy/skill-primitive-boundary.md`
- `.isomorph/exports/templates/skill-primitive.md`
- `.contexta/packs/isomorph-authoring/skills/skill-creator/SKILL.md`

架构迁移需要时，本分支可以触及重叠路径。责任边界不是文件禁区，而是 merge judgment。

后续出现冲突时，先按语义分类：

- architecture boundary / directory responsibility：保留本分支的干净形状，并把实现改动适配进去；
- docwarden v1 implementation / primitive runtime implementation / concrete skill-primitive content：优先尊重对应实现线，再适配到新形状。

## Scope

This branch owns:

- clarifying the outer layers
- recording the user position behind the layers
- naming `semantic framework` as the user/project-defined semantic system
- keeping root `.isomorph` as bootstrap semantic authority
- physically removing `mapping` as the top-level `.isomorph` organizing idea
- defining `.contexta` as the source asset root for contexta
- defining pack-first context asset organization
- defining what `projection / export` owns for Codex-only runtime materialization
- defining how `docwarden` consumes `isomorph` and `contexta` without becoming either of them
- recording that docwarden owns its semantic framework instead of being defined by root `.isomorph`
- deleting old `contexta capability/install` command contracts instead of preserving aliases
- organizing the migration into reviewable practice documents

This branch does not own:

- docwarden v1 implementation
- isomorph primitive runtime implementation
- skill-primitive content design
- designing final production-quality `SKILL.md` bodies
- expanding beyond Codex as the first runtime target
- making docwarden own general context distribution

## Current Inputs

- [[docs/concept/user|user]]
- [[docs/concept/layers|layers]]
- [[docs/文档体系建设/理念-v4|文档体系理论 v4]]
- [[docs/ai基建建设/理念-v1|ai 基建理念 v1]]

## Work Plan

### Step 1: Stabilize Architecture Vocabulary

Deliverables:

- `docs/concept/user.md`
- `docs/concept/layers.md`

Exit condition:

- The docs record `.isomorph`, `.contexta`, projection / export, runtime artifacts, and docwarden consumer responsibilities.
- The docs record `semantic framework` as the name for user/project-defined domain semantics.
- The docs describe root `.isomorph` as bootstrap semantic authority.
- The docs no longer describe `families/`, `contexta/distribution/`, or `docwarden/adoption/bindings/` as target architecture.

### Step 2: Migrate Existing Isomorph Mapping

Goal: physically migrate `.isomorph/mapping/**` material out of `mapping`.

Classify each material into one of:

- semantic primitive / authority
- grammar / format rule
- semantic-lint / recognition material
- projection / export / binding material
- obsolete or historical material

Target shape:

```text
.isomorph/
  primitives/
  grammars/
  lint/
  exports/
```

Deliverables:

- `docs/practice/isomorph-mapping-audit.md`
- moved `.isomorph/**` files
- updated isomorph runtime and tests

Exit condition:

- No runtime path depends on `.isomorph/mapping/**` as the canonical source.
- Any remaining mention of mapping is a concept, relation, or migration note, not the organizing directory.

### Step 3: Propose Target Architecture

Goal: define and implement the clean directory responsibility model.

Target shape:

```text
.isomorph/
  primitives/
  grammars/
  lint/
  exports/

.contexta/
  packs/
    <pack>/
      contexta.yaml
      skills/
      prompts/
      agents/
      hooks/
      workflows/
      profiles/
      references/
  targets/
    codex.yaml
  catalog/
    generated-assets.json
    generated-packs.json

apps/contexta/
  src/assets/
  src/exporters/codex/

.agents/
  skills/
  plugins/

plugins/
  <runtime-plugin-name>/
    .codex-plugin/
    skills/
```

Deliverable:

- `docs/practice/target-layer-shape.md`

Exit condition:

- Source assets live under `.isomorph` or `.contexta`.
- Tool implementation lives under `apps/*`.
- Runtime artifacts are generated into official Codex target locations, not treated as source assets.

### Step 4: Implement Contexta Pack Model

Goal: make `.contexta/packs/**` the source model for agent context assets.

Pack definition:

```text
pack = a context system for an ability context, workflow, or product area
asset kind = skill / prompt / agent / hook / workflow / profile / reference
namespace = dw / iso / ym style asset id prefix
target = runtime export destination
```

Asset kinds:

- skill
- prompt
- agent
- hook
- workflow
- profile
- reference

Deliverable:

- `docs/practice/contexta-pack-model.md`
- `.contexta/packs/**` first pack material
- contexta asset catalog code and tests

Exit condition:

- The model can explain what contexta owns without mentioning Codex file paths.
- The model does not use `families/`.
- Type-first views are generated catalog views, not the maintained source structure.

### Step 5: Implement Codex Export Boundary

Goal: implement the first runtime materialization adapter for Codex only.

CLI target:

```text
contexta assets
contexta export codex <asset-or-pack-id>
contexta export codex --all
```

Old command contracts are deleted:

```text
contexta capability
contexta catalog
contexta install
contexta activation
contexta asset
```

Deliverable:

- `docs/practice/codex-export-boundary.md`
- contexta CLI/runtime/tests updated to new commands

Exit condition:

- `contexta export codex` reads `.contexta/packs/**` and writes only upstream-confirmed Codex surfaces.
- Codex-specific file format logic is isolated under `apps/contexta/src/exporters/codex/`.

### Step 6: Define Docwarden Consumption

Goal: define how docwarden consumes the other layers while owning its own semantic framework.

Docwarden should consume:

- `isomorph` bootstrap、recognition、semantic-lint 和 export shape ability
- `contexta` distribution for the docwarden context pack
- Codex artifacts produced by projection / export

Docwarden should not own:

- general context distribution
- semantic primitive authority
- Codex runtime export rules
- a new top-level `docwarden/adoption/bindings/` directory
- canonical docwarden semantic framework under root `.isomorph`

Deliverable:

- `docs/practice/docwarden-consumption-boundary.md`

Exit condition:

- docwarden can be described as a portable document management mechanism with its own semantic framework, not as the owner of every supporting layer and not as a framework defined by root `.isomorph`.

### Step 7: Define Validation Harness

Goal: define validation as a cross-cutting layer.

Validation targets:

- `isomorph`: primitive, recognition, semantic-lint correctness
- `contexta`: catalog and dependency closure
- `projection / export`: Codex artifact loadability
- runtime artifacts: agent trigger and behavior
- `docwarden`: document maintenance quality

Deliverable:

- `docs/practice/architecture-validation.md`

Exit condition:

- Harness is not modeled as a fifth main business layer.

## Merge Strategy

When `/Users/sayori/Desktop/docwarden` main work is ready:

1. Merge or rebase `refactor/layers` against updated main.
2. Re-check conflicts under `.isomorph/**`, `.contexta/**`, `apps/isomorph/**`, `apps/contexta/**`, and `skills/primitive/**`.
3. Keep this branch's clean architecture shape when conflicts concern layer boundaries or directory ownership.
4. Prefer main worktree implementation changes when conflicts concern docwarden v1, primitive runtime internals, or concrete skill-primitive content.
5. Adapt main implementation work into the new architecture instead of preserving old `mapping` or `capability/install` surfaces.

## Done Criteria

This branch is ready when:

- layer vocabulary is recorded
- user position is recorded
- `semantic framework` is recorded as the name for user/project-defined domain semantics
- root `.isomorph` is recorded as bootstrap semantic authority
- `.isomorph/mapping/**` is no longer the canonical source shape
- apps/isomorph does not maintain TypeScript-embedded baseline material; local instances pin to the current `.isomorph` baseline digest
- `.contexta/packs/**` is the canonical contexta source shape
- contexta uses `assets` and `export codex` commands, not legacy `capability/install/activation/catalog/asset`
- docwarden remains a consumer of isomorph/contexta capabilities, owns its semantic framework, and is not defined by root `.isomorph`
- tests prove the new architecture paths and commands
