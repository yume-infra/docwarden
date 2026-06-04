# Spec File Structure Model v0

## Accepted Correction

`.docwarden` 是维护当前整个 monorepo 仓库的 harness 资产。

`.docwarden/spec/` 不是 docwarden 产品自己的局部 spec，也不是抽象 `repo/` 或 `monorepo/` 层。

`.docwarden/spec/` 必须根据当前 monorepo 的真实资产生成稳定 spec 层级。

稳定结构如何映射，由 `.isomorph/mapping/docwarden` 负责定义。

## Reused Concepts

本版直接复用 isomorph 已有概念：

- `kind`：md module 的内容语言入口。
- `module`：md file scope。
- `assertion`：module 内部最小可 review 的 semantic commitment。
- `locator`：后续用于稳定指向 module、heading 或 assertion 的定位机制。

## Core Model

```text
.docwarden/spec/
  workspace/
  apps/
  packages/
  harness/
    <module>.md
```

目录名表达当前 monorepo 的真实资产分组。

每个 `.md` 文件天然是一个 module。

module 内部的正文承载 assertion。

## Current Asset Groups

`workspace/` 承接根 workspace 资产：

- package topology
- root verification pipeline
- docs authority
- pinned Effect source reference

`apps/` 承接 first-party CLI app packages：

- `apps/docwarden`
- `apps/contexta`
- `apps/isomorph`

`packages/` 承接 shared workspace config packages：

- `packages/tsconfig`
- `packages/tsdown-config`
- `packages/vitest-config`

`harness/` 承接 `.docwarden` repository maintenance harness：

- task / review / spec / guide / wiki / archive runtime surfaces
- spec entry boundary
- review workflow materialization
- review surface composition
- promote-to-spec pipeline

## Frontmatter

spec module v0 只保留内容读取需要的 `kind`：

```yaml
---
kind: policy
---
```

不写：

- `mapping`
- `status`

原因：

- `mapping` 由 `.isomorph/mapping/docwarden` 的稳定结构映射表达，不污染 materialized spec module。
- `status` 属于 docwarden workflow / operation metadata，不属于 spec module 的 content language。

## Mapping Owner

稳定结构映射落在：

```text
.isomorph/mapping/docwarden/modules/structure/stable-spec-hierarchy.md
```

`.docwarden/spec/` 保存的是该结构映射的 materialized stable modules。

## Template Role

v0 不在 `.docwarden` 中维护 template 层。

原因：

- template / mapping rule 的语义更接近 isomorph mapping。
- contexta 后续可以负责分发、安装或同步这些模板能力。
- docwarden 当前只需要稳定运行产物和最小 spec 写入能力。

因此 `docwarden init` 不创建 `.docwarden/template/`。

新建缺失 spec module 时，`docwarden promote --to spec` 只使用内置最小骨架：

```yaml
---
kind: <kind>
---

# <module>
```

## Landed Structure

stable spec：

```text
.docwarden/spec/
  workspace/package-topology.md
  workspace/verification-pipeline.md
  workspace/docs-authority.md
  workspace/effect-source-reference.md
  apps/docwarden.md
  apps/contexta.md
  apps/isomorph.md
  packages/tsconfig.md
  packages/tsdown-config.md
  packages/vitest-config.md
  harness/docwarden-harness.md
  harness/spec-entry-boundary.md
  harness/review-workflow.md
  harness/review-surface.md
  harness/promote-to-spec.md
```

isomorph mapping：

```text
.isomorph/mapping/docwarden/modules/concept/spec.md
.isomorph/mapping/docwarden/modules/structure/stable-spec-hierarchy.md
```

旧的 task-summary style spec 产物已移出 stable spec 层，保留到：

```text
.docwarden/archive/spec/2026-06-01/
```

`docwarden promote --to spec` 现在必须显式指定：

```text
--target <asset-group>/<module>
```

否则不能写入 stable spec。

当目标 module 已存在时，`--kind` 可以省略。

当目标 module 不存在时，`--kind` 必须提供目标 module 的 content kind。

## Prototype Reference

本 task 的原型目录：

```text
.docwarden/task/27-docwarden-spec-layer-definition/prototype-spec-tree/
.docwarden/task/27-docwarden-spec-layer-definition/prototype-isomorph-mapping/docwarden/modules/concept/spec.md
```

这些文件用于验证结构，不直接视为 stable spec。
