# docwarden

This repository is an early-stage pnpm monorepo for two co-evolving CLI product lines.

- `apps/docwarden` contains the `docwarden` CLI. It focuses on document systems, document-maintenance workflows, and the future CLI / plugin implementation for agent-era documentation.
- `apps/contexta` contains the `contexta` CLI. It focuses on skills, schema, workflows, and context maintenance. It is designed from the start as infrastructure that can expand to the user level, not only as project-local tooling.
- `packages/cli-kit` contains shared Effect CLI runtime helpers and command scaffolding used by both CLIs.

They are split into packages, but they still develop through each other: `docwarden` protects and structures its own documents, while `contexta` supports the writing and iteration of `docwarden`.

The workspace follows the same broad shape as `create-yume`: a private root package owns pnpm workspace configuration, dependency catalogs, turbo orchestration, linting, and shared scripts; app packages own CLI entrypoints and package metadata.

## Scripts

```bash
pnpm install
pnpm build
pnpm smoke:bin
```

Each CLI builds to its own `dist/index.js`, with declarations at `dist/index.d.ts`.
Both CLIs share `@docwarden/cli-kit` for the current Effect CLI runtime setup.
