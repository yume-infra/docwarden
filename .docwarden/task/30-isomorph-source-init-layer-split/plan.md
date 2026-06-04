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
- [ ] Step 7: Implement only the accepted smallest baseline

## Confirmed Starting Point

当前判断：

- task 29 是止血，不是最终层级。
- `.isomorph` 需要大重构。
- 现在的 `primitives`、`grammars`、`exports` 层级没有设计好。
- 必须区分“在哪里都要带到的理论 primitive 层”和“只服务于本理论自举的 vocabulary”。
- 必须区分 repo source 中的 isomorph 自身资产，和 `isomorph init` 后出现在用户 codebase 里的 `.isomorph`。

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

## Review Questions

- Portable theory primitives 是复制到用户 repo，还是作为 package 内置 basis 被用户 repo 引用？
- 用户 init 后的 `.isomorph` 是否应该为空 framework skeleton，还是带一组 core primitive material？
- isomorph bootstrap vocabulary 应作为 optional pack、authoring profile，还是保留在 repo source-only path？
- `.isomorph/exports/**` 应整体迁走、重命名为 dogfood/projection samples，还是拆成 template 与 generated material 两层？
- `skill-primitive` 应不应该进入 base init；如果不进入，它属于哪个 optional capability？

## Implementation Guard

进入实现前必须先得到一个 accepted lead：

```text
lead: 用户项目 init 后的 .isomorph 不等于 isomorph source .isomorph。
backing: primitives/grammars/exports 当前混层；portable primitive 与 bootstrap vocabulary 需要拆分；projection/export 不反向定义 source theory。
```

实现第一步只允许选择一个最小 baseline，例如：

- 新增 layer taxonomy module。
- 新增 init contract fixture。
- 移动/重命名 `.isomorph/exports/**` 的一小部分。
- 拆出 bootstrap vocabulary path。

不要一次性重排所有目录。
