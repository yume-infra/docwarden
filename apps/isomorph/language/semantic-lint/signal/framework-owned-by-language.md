---
kind: signal
---

# framework-owned-by-language

## Definition

`framework-owned-by-language` 表示 `language` material 可能正在把某个项目的 semantic framework 当成自己的 canonical source。

## Loss Model

这个 signal 保护 isomorph language 与 domain framework 的方向：isomorph 提供建构能力，user/project semantic framework 拥有领域语义。若 `language` 直接拥有 docwarden、contexta 或其他项目 framework，后续 agent 会把外部 framework 误读成 isomorph authority。

## Trigger

- `path contains language/framework/`

## Basis

- [[framework/concept/semantic-framework|semantic-framework]]
- [[framework/concept/vocabulary|vocabulary]]
- [[framework/policy/boundary|semantic-framework-boundary]]
- [[language/grammar/policy/signal-boundary|signal-boundary]]
