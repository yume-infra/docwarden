# Agent Instructions

@/Users/sayori/.codex/RTK.md

## User Context

Agents MUST load and apply the project user context when working in this repository:

@/Users/sayori/Desktop/docwarden/.docwarden/user/profile.md

The user context is not a project policy or workflow rule. Current user instructions and project rules take priority over it.

## AI Harness Dogfood Constraint

当当前任务属于 `ai-harness dogfood`、把 theory / scattered ideas 转成可执行工具、或维护 repo-local Codex skills / contexta export surface 时，Agents MUST 默认执行这五条约束：

1. `Question every requirement`：每个需求都要先问“今天证明它有用需要什么”。
2. `Delete any part or process you can`：优先删除不影响首个可用 baseline 的流程、schema、review、命名、polish。
3. `Simplify and optimize`：只保留一个 target surface、一个可回滚文件组、一个最快验证命令。
4. `Accelerate cycle time`：选择仓库已有的最短真实 feedback loop，先交付粗糙可用版本。
5. `Automate`：只自动化已经重复、易错、或会明显缩短下一轮迭代的步骤。

如果完整 theory 与可用 baseline 冲突，先落地可用 baseline，再用后续 slice 迭代质量。

对这类工作，默认使用中文写 skill 主体，只保留必要英文术语，例如 `skill`、`harness`、`workflow`、`baseline`、`slice`、`export`、`smoke`、`CLI`。

## Effect Reference

- Effect work in this repository uses the v4 beta toolchain, following the same baseline shape as `symphony-ts`.
- Active package baseline: `effect@4.0.0-beta.70`, `@effect/platform-node@4.0.0-beta.70`, `@effect/tsgo@0.11.0`, and `@typescript/native-preview@7.0.0-dev.20260526.1`.
- Upstream source reference: `repos/effect/`, a read-only squashed git subtree from `https://github.com/Effect-TS/effect-smol.git`.
- The subtree is pinned to commit `440505f845a7c207b8e98e3260f0bdf1690ac1c7`, the commit behind the `effect@4.0.0-beta.70` tag. The manifest lives at `repos/effect-source.json`, and `pnpm effect:source:verify` checks the subtree split, package versions, and import boundary.
- For Effect implementation work, start from `repos/effect/ai-docs/src/index.md` and the relevant examples under `repos/effect/ai-docs/src/**`. These AI docs are the first reference layer for current v4 usage patterns.
- If the AI docs are insufficient, inspect the real upstream source, tests, and examples under `repos/effect/packages/**`. Prefer this pinned source over memory or external docs.
- Application and tests MUST import Effect APIs from installed dependencies only. Never import from `repos/effect/`.
- Use `repos/effect/` for source, tests, examples, API design reference, and agent context discovery. Do not edit subtree files unless explicitly updating the upstream pin.
- Use `tsgo` diagnostics as the primary Effect feedback loop. `tsc` is only the conservative fallback check.
- When implementing Effect code, use the package-local `typecheck` script or an equivalent `tsgo -p ... --noEmit` check before treating the implementation as valid.

## Document Authority

- Agents MUST NOT directly edit files under `docs/`.
- `docs/` is the human-maintained source layer for project documents. Current maintainer: sayoriqwq.
- When a conversation produces information that may belong in `docs/`, agents MUST first capture it as working material, review notes, or a proposed patch outside `docs/`.
- Agents MAY edit `docs/` only when the user explicitly asks for a concrete `docs/` file edit after this rule is known.
