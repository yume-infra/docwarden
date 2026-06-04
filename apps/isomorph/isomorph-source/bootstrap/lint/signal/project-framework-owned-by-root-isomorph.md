---
kind: signal
---

# project-framework-owned-by-root-isomorph

## Definition

`project-framework-owned-by-root-isomorph` 表示 root `.isomorph` material 可能正在把某个项目的 semantic framework 当成自己的 canonical source。

## Loss Model

这个 signal 保护 bootstrap 与 domain framework 的方向：isomorph 提供建构能力，user/project semantic framework 拥有领域语义。若 root `.isomorph` 直接拥有 docwarden framework，后续 agent 会把 dogfood sample 误读成 isomorph authority。

## Trigger

- `path contains bootstrap/docwarden/`

## Basis

- [[basis/primitives/concept/semantic-framework|semantic-framework]]
- [[basis/primitives/concept/vocabulary|vocabulary]]
- [[basis/grammars/policy/semantic-framework-boundary|semantic-framework-boundary]]
- [[basis/grammars/policy/signal-boundary|signal-boundary]]
