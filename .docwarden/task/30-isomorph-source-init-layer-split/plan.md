# 30-isomorph-source-init-layer-split plan

Task title: isomorph source init layer split
Created: 2026-06-04T09:28:42.615Z

## Objective
- 建立 `.isomorph` 大重构的 reviewable model：区分 isomorph 自身资产、portable theory primitive、isomorph bootstrap vocabulary、用户项目 init 后 `.isomorph`、以及 projection/export material。

## Steps
- [x] Step 0: 捕获用户纠偏与任务入口
- [ ] Step 1: Freeze current layer inventory
- [ ] Step 2: Define target layer taxonomy
- [ ] Step 3: Classify existing `primitives / grammars / exports`
- [ ] Step 4: Define init contract
- [ ] Step 5: Design migration route
- [ ] Step 6: Review with user before implementation
- [ ] Step 7: Implement accepted breaking migration in one pass

## Confirmed Starting Point

当前判断：

- task 29 是止血，不是最终层级。
- `.isomorph` 需要大重构。
- 现在的 `primitives`、`grammars`、`exports` 层级没有设计好。
- 必须区分“在哪里都要带到的理论 primitive 层”和“只服务于本理论自举的 vocabulary”。
- 必须区分 repo source 中的 isomorph 自身资产，和 `isomorph init` 后出现在用户 codebase 里的 `.isomorph`。
- 用户讨厌中间态；本轮是 breaking change，要求一次做到位。

## Target Taxonomy Draft

### Layer A: isomorph source assets

位置：当前 docwarden repo 内的 isomorph implementation/source。

拥有：

- CLI/analyzer/compiler/runtime source。
- tests and fixtures。
- init templates。
- migration tools。
- source-only dogfood material。

不得承担：

- 不应假装自己就是用户项目 init 后的 `.isomorph`。
- 不应把所有领域 vocabulary 都收进 root primitive catalog。

### Layer B: portable theory primitives

定义：任何用户项目使用 isomorph 都需要的最小语义语言。

候选：

- `concept`
- `policy`
- `relation`
- `module`
- `assertion`
- `metadata/kind`
- `locator`
- `confidence`
- `signal`
- `trigger`
- `semantic-lint`
- `template`
- `example`
- `structure / architecture / workflow / pipeline / branch / composition`
- `semantic-framework`
- `vocabulary`
- `lead-review`

判断标准：

- 是否用于建构任意 semantic framework。
- 是否不依赖 docwarden/contexta/skill authoring 这些具体领域。
- 是否应该随 init 出现在用户 codebase，或以 package 内置 basis 被用户项目读取。

### Layer C: isomorph bootstrap vocabulary

定义：为了自举 isomorph 自己这套理论、工具、primitive authoring、compiler/export 能力而存在的 vocabulary。

候选：

- `skill-primitive`
- `primitive-creator`
- primitive authoring surface。
- export draft vocabulary。
- analyzer/compiler-specific concept。

判断标准：

- 是否主要用于 isomorph 自己解释、验证或生成 isomorph material。
- 是否不应该默认污染用户项目的 domain semantic framework。
- 是否应作为 optional authoring pack，而不是 base init material。

### Layer D: initialized project `.isomorph`

定义：用户在自己的 codebase 运行 `isomorph init` 后得到并持续维护的 project semantic framework workspace。

拥有：

- 用户/项目 vocabulary。
- domain concepts/policies/relations/examples/signals。
- project-specific semantic framework boundary。
- imported basis references。
- local usage contract。

不得承担：

- 不应包含 isomorph source-only dogfood。
- 不应默认拥有 isomorph bootstrap vocabulary，除非用户选择 authoring mode。
- 不应包含 contexta/plugin runtime output 作为 semantic source。

### Layer E: projection/export/materialization

定义：从 semantic material 派生出的 downstream artifact。

包括：

- contexta pack assets。
- Codex skill/repo-skill/plugin output。
- generated catalogs。
- dogfood projection samples。

不得承担：

- 不反向定义 portable theory primitives。
- 不作为用户 project semantic framework 的 canonical source。
- 不输出 Codex 官方不支持的 runtime surface。

## Inventory Questions

需要逐个分类：

- `.isomorph/primitives/concept/**`
- `.isomorph/grammars/policy/**`
- `.isomorph/grammars/relations/**`
- `.isomorph/grammars/structures/**`
- `.isomorph/lint/signal/**`
- `.isomorph/exports/**`
- `.contexta/packs/**`
- `.agents/skills/**`
- `plugins/**`

## Current Surface Classification Plan

这一轮不是问“这些文件能不能跑”，而是问“它们应该属于哪一层”。

### `.isomorph/primitives/concept/**`

必须逐个分成：

- Portable theory primitive：任何 semantic framework 都需要的基础语言。
- Isomorph bootstrap vocabulary：只服务 isomorph 自举、authoring、compiler/analyzer 的 vocabulary。
- Project/domain vocabulary：不应留在 source root，应该只出现在 project framework 或 dogfood sample。

初始判断：

- `concept / policy / relation / module / assertion / signal / trigger / semantic-lint / template / example / structure / semantic-framework / vocabulary / lead-review` 倾向 portable。
- `skill-primitive / primitive-creator` 倾向 bootstrap vocabulary，不应默认进入用户 init 后 `.isomorph`。

### `.isomorph/grammars/**`

必须按承载对象拆：

- Portable grammar：约束/组织 portable theory primitive 的语法。
- Bootstrap grammar：约束 isomorph 自举 vocabulary、primitive authoring、export draft、analyzer shape。
- Dogfood/project grammar：只说明某个 project framework 的使用方式。

判断标准：

- 如果 grammar 的 subject 是 portable primitive，它可以进入 portable basis。
- 如果 grammar 的 subject 是 skill authoring、compiler/export、isomorph authoring，它属于 bootstrap。
- 如果 grammar 的 subject 是 docwarden/contexta/plugin/runtime，它不能进入 portable basis。

### `.isomorph/lint/signal/**`

必须拆成：

- Portable semantic-lint signals：保护任意 framework 的基础语义边界。
- Bootstrap/self-dogfood signals：保护 isomorph 自己不要写坏自举材料。
- Migration-only signals：只用于 breaking migration 阶段，不能长期留作 runtime fallback。

`concrete-skill-primitive-under-root` 当前属于 bootstrap/self-dogfood signal，用来阻止 concrete skill material 回流 root。

### `.isomorph/exports/**`

当前不接受继续作为 stable root layer。

它必须被拆成：

- `template`：如果只是 copy skeleton，归 template/basis。
- `projection sample`：如果只是 dogfood sample，归 source-only dogfood。
- `generated material`：如果是生成结果，移出 source authority。
- `contexta/runtime export`：归 contexta/plugin/runtime materialization。

验收标准：

- `.isomorph/exports/**` 不再被任何实现当作 root canonical source。
- 如果保留该目录名，它只能是过渡期被删除或迁移前的 rejected surface；不能在 breaking implementation 后继续存在为稳定层。

### `.contexta/packs/**`

归 projection/materialization source。

允许拥有：

- contexta canonical skill asset。
- pack-level distribution source。
- Codex-supported runtime materialization input。

不允许拥有：

- portable theory primitive 的 source of truth。
- 用户 project semantic framework 的 canonical source。

### `.agents/skills/**` and `plugins/**`

归 generated/dogfood runtime output。

它们可以用于本 repo dogfood，但不能成为 source theory。

breaking migration 后，所有 repo-skill/plugin output 必须由 contexta export 再生成，不能手写成第二 source。

## Candidate Target Shape

最终命名可以 review 后再定，但职责必须清楚。

候选结构：

```text
isomorph source repository
  source implementation
    apps/isomorph/src/**
    apps/isomorph/tests/**
  portable basis source
    portable theory primitives
    portable grammar
    portable lint signals
    init skeleton material
  bootstrap authoring source
    isomorph self-bootstrap vocabulary
    primitive authoring vocabulary
    analyzer/compiler/export draft vocabulary
    source-only dogfood signals
  project init template
    empty or minimal project .isomorph skeleton
    import/reference contract for portable basis
  projection/materialization
    contexta packs
    generated catalogs
    repo-skill/plugin dogfood output
```

用户 codebase after `isomorph init`：

```text
.isomorph
  framework identity / metadata
  project vocabulary
  project concepts
  project policies
  project relations
  project examples
  project signals
  local usage contract
  basis import/reference marker
```

用户 init 后默认不应出现：

- isomorph source-only dogfood。
- skill authoring vocabulary。
- contexta pack source。
- Codex plugin/repo-skill output。
- `.isomorph/exports/**` as canonical layer。

## Init Contract Plan

需要明确 `isomorph init` 的输出 contract：

- init 后 `.isomorph` 是 project semantic framework workspace，不是 isomorph source mirror。
- portable basis either:
  - copied as explicit baseline material, or
  - referenced as package-provided basis with stable import marker。
- bootstrap vocabulary only appears when user opts into authoring mode.
- project framework starts with user-owned vocabulary/examples/policies placeholders or empty skeleton, not isomorph self-theory.
- generated/runtime outputs are never created under project `.isomorph` by init.

必须验证：

- temp project init 后的 file tree。
- init 后 analyzer 能找到 portable basis。
- init 后不会读取 source-only bootstrap vocabulary as project domain material。
- init 后 semantic-lint 能区分 local framework material 与 package basis。

## One-Pass Breaking Migration Scope

Implementation 必须在同一轮完成以下范围，不能拆成长期中间态：

1. Move or rename source tree material into accepted target categories.
2. Update all path constants, CLI commands, fixtures and tests.
3. Update `isomorph init` behavior and expected initialized tree.
4. Update primitive analyzer source-material discovery so portable basis and bootstrap vocabulary are distinct.
5. Update semantic-lint discovery so bootstrap/self-dogfood signals do not leak into user project lint by default.
6. Update contexta export references after source path changes.
7. Regenerate repo-skill/plugin dogfood output from contexta, not by manual edits.
8. Remove old canonical paths and tests that assume old layout.

Explicitly forbidden:

- Keeping old `primitives / grammars / exports` as compatibility aliases.
- Leaving both old and new path as valid source of truth.
- Marking old path deprecated but still consumed by CLI.
- Shipping a migration where init output and source tree disagree.
- Passing tests only because fixtures still point to old source tree.

## Review Questions

- Portable theory primitives 是复制到用户 repo，还是作为 package 内置 basis 被用户 repo 引用？
- 用户 init 后的 `.isomorph` 是否应该为空 framework skeleton，还是带一组 core primitive material？
- isomorph bootstrap vocabulary 应作为 optional pack、authoring profile，还是保留在 repo source-only path？
- `.isomorph/exports/**` 应整体迁走、重命名为 dogfood/projection samples，还是拆成 template 与 generated material 两层？
- `skill-primitive` 应不应该进入 base init；如果不进入，它属于哪个 optional capability？
- portable grammar 和 portable lint signal 是否跟 primitive 一起进入 basis，还是拆成 basis packages？
- authoring mode 如何显式启用，避免 bootstrap vocabulary 默认进入用户 project。
- contexta dogfood output 是否继续保留在 repo root，还是只在 test/export fixture 中生成。

## Implementation Guard

定义阶段可以慢，但实现阶段不能慢慢迁。

进入实现前必须先得到一个 accepted lead：

```text
lead: 用户项目 init 后的 .isomorph 不等于 isomorph source .isomorph。
backing: primitives/grammars/exports 当前混层；portable primitive 与 bootstrap vocabulary 需要拆分；projection/export 不反向定义 source theory。
```

一旦进入 implementation，必须满足：

- 一次性完成 accepted target tree。
- 一次性更新 CLI/init contract、fixtures、tests、catalog/export paths 和 dogfood references。
- 删除或迁移旧 canonical path，不能留下旧层级作为 fallback source。
- 不保留双 source of truth。
- 不新增 compatibility shim，除非它在同一次 commit 中只用于 migration command 并且不会成为长期 runtime path。
- 验证必须覆盖 init 后用户 `.isomorph` 的最终形态，而不只是 repo source tree。

如果无法一次做到位，就停在 design/review 阶段，不进入 implementation。

## Breaking Change Acceptance

本轮验收需要同时成立：

- Source `.isomorph` 和 initialized project `.isomorph` 的职责分界在文件树和 CLI 行为上都成立。
- Portable theory primitives 与 isomorph bootstrap vocabulary 不再共享一个模糊 root category。
- `.isomorph/exports/**` 不再作为 root stable layer 或 project framework canonical source。
- 用户 init 后不会得到 isomorph source-only dogfood、plugin output、contexta runtime output 或 authoring-only vocabulary。
- Existing tests 更新到新 contract；旧路径失败是预期 breaking behavior，而不是 fallback。

## Validation Matrix

必须至少覆盖：

- `isomorph init` 在临时目录生成最终用户 `.isomorph` tree。
- primitive analyzer 在 source repo 中能读取 portable basis。
- primitive analyzer 在 initialized project 中不会把 bootstrap vocabulary 当作 user framework material。
- semantic-lint 在 source repo 与 initialized project 中使用不同 discovery scope。
- contexta asset discovery/export 在新路径下通过。
- repo-skill/plugin dogfood output 能由 contexta 重新生成。
- 旧 `.isomorph/primitives` / `.isomorph/grammars` / `.isomorph/exports` canonical path 不能再作为 CLI source 成功通过。

候选命令：

```bash
rtk pnpm --dir apps/isomorph typecheck
rtk pnpm --dir apps/isomorph test
rtk pnpm --dir apps/contexta typecheck
rtk pnpm --dir apps/contexta test
rtk apps/contexta/dist/index.js assets --json
rtk apps/contexta/dist/index.js export codex isomorph-authoring --target-dir <tmp> --dry-run --json
```

需要新增或更新的验证：

- init contract fixture。
- source-vs-project discovery tests。
- old-path failure tests。
- bootstrap authoring mode opt-in tests。
