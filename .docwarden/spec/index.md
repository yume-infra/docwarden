# spec index

`.docwarden/spec/` 是描述当前仓库稳定现状的 md module 集合。

本层不保存 task summary，不保存 review surface，也不替代 `docs/`。

## Model

```text
.docwarden/spec/
  workspace/
  apps/
  packages/
  harness/
    <module>.md
```

- 目录名表达当前 monorepo 的真实资产分组。
- 每个 `.md` 文件天然是一个 module。
- module frontmatter 只保留 `kind`。
- module 正文承载可被 review / promote / lint 的 assertion。

## Current Workspace Assets

- `workspace/package-topology.md`：pnpm workspace package topology。
- `workspace/verification-pipeline.md`：root turbo verification pipeline。
- `workspace/docs-authority.md`：`docs/` human-maintained source boundary。
- `workspace/effect-source-reference.md`：pinned Effect source reference boundary。
- `apps/docwarden.md`：docwarden CLI package contract。
- `apps/contexta.md`：contexta CLI package contract。
- `apps/isomorph.md`：isomorph CLI package contract。
- `packages/tsconfig.md`：shared TypeScript config package。
- `packages/tsdown-config.md`：shared CLI build config package。
- `packages/vitest-config.md`：shared test config package。
- `harness/docwarden-harness.md`：`.docwarden` repository maintenance harness。
- `harness/spec-entry-boundary.md`：stable spec write boundary。
- `harness/review-workflow.md`：review workflow materialization boundary。
- `harness/review-surface.md`：review surface composition boundary。
- `harness/promote-to-spec.md`：reviewed material to stable spec pipeline。

## Entry Rule

进入 spec 的内容必须能定位到：

```text
.docwarden/spec/<target>.md
```

无法定位到具体 module 的内容不能直接进入 stable spec。

## Structure Mapping

当前层级的结构映射定义在：

```text
.isomorph/mapping/docwarden/modules/structure/stable-spec-hierarchy.md
```
