# docwarden

This repository is an early-stage pnpm monorepo for two co-evolving CLI product lines.

- `apps/docwarden` contains the `docwarden` CLI. It focuses on document systems, document-maintenance workflows, and the future CLI / plugin implementation for agent-era documentation.
- `apps/contexta` contains the `contexta` CLI. It focuses on skills, schema, workflows, and context maintenance. It is designed from the start as infrastructure that can expand to the user level, not only as project-local tooling.

They are split into packages, but they still develop through each other: `docwarden` protects and structures its own documents, while `contexta` supports the writing and iteration of `docwarden`.

The workspace follows the same broad shape as `create-yume`: a private root package owns pnpm workspace configuration, dependency catalogs, turbo orchestration, linting, and shared scripts; app packages own CLI entrypoints and package metadata.

## Scripts

```bash
pnpm install
pnpm build
pnpm smoke:bin
```

Each CLI builds to its own `dist/index.js`, with declarations at `dist/index.d.ts`.
Both CLIs currently own a minimal Effect v4 CLI entrypoint directly. Shared CLI runtime abstractions should be introduced later only when the real command design requires them.

## Effect Reference

Effect runtime work uses the latest v4 beta baseline currently pinned in this workspace:

- `effect@4.0.0-beta.70`
- `@effect/platform-node@4.0.0-beta.70`
- `@effect/tsgo@0.11.0`
- `@typescript/native-preview@7.0.0-dev.20260526.1`

The upstream Effect v4 source reference lives at `repos/effect` as a git submodule pointing to `Effect-TS/effect-smol` commit `440505f845a7c207b8e98e3260f0bdf1690ac1c7`, the commit behind the `effect@4.0.0-beta.70` tag.

Application code must import Effect APIs from package dependencies, never from the reference submodule.
