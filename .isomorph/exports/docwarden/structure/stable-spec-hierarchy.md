---
kind: structure
id: dw:stable-spec-hierarchy
---

# stable-spec-hierarchy

## Definition

`stable-spec-hierarchy` 描述当前 monorepo 的 stable spec hierarchy，是 docwarden 可消费的 semantic shape。

## Structure

```text
.docwarden/spec/
  workspace/
    package-topology.md
    verification-pipeline.md
    docs-authority.md
    effect-source-reference.md
  apps/
    docwarden.md
    contexta.md
    isomorph.md
  packages/
    tsconfig.md
    tsdown-config.md
    vitest-config.md
  harness/
    docwarden-harness.md
    spec-entry-boundary.md
    review-workflow.md
    review-surface.md
    promote-to-spec.md
```

## Structure Rule

- `workspace/` 组织 root workspace configuration、root verification、source authority 和 vendor source constraints。
- `apps/` 组织 `apps/*` 下的 first-party CLI app packages。
- `packages/` 组织 shared workspace config packages。
- `harness/` 组织维护整个 repository 的 `.docwarden` harness assets。

## Boundary

这个 structure 属于 `.isomorph/exports/docwarden`，因为它保留 docwarden 组织 stable spec modules 时需要消费的 semantic shape。

`.docwarden/spec` 承载 materialized stable modules 及其 current state。本文件不是 docwarden runtime config，不是 generated spec module，也不是 Codex runtime artifact。
