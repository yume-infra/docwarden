# Codex Runtime Targets

## Position

`contexta` 的 source asset kind 不等于 Codex runtime path。

Codex target 必须先回答两个问题：

```text
这个 artifact 是否被 Codex 官方加载
这个 artifact 是 authoring / local discovery / installable distribution / lifecycle config 中哪一类
```

## Aggressive Runtime Rule

上游不支持的 surface，永远不要映射出去。

`contexta` 可以保存理论组织、pack、prompt、profile、reference、workflow 等 source assets，但 export 到 runtime 时只能生成 Codex 当前确认会加载的 artifact。

最终落到 runtime 的主产物必须是可用的 skill：

```text
usable skill
  has SKILL.md
  has valid name and description
  can be discovered by Codex
  can be explicitly invoked or intentionally kept explicit-only
  carries references/scripts/assets inside the skill or plugin boundary
```

任何不能变成可用 skill、plugin、hook 或 config 的 asset，都留在 `.contexta` source layer，不生成 runtime 文件。

## Upstream Surfaces

当前确认的 Codex surfaces：

```text
AGENTS.md
  durable project guidance

.agents/skills/<runtime-skill-name>/SKILL.md
  repo-local skill discovery and immediate dogfood

$HOME/.agents/skills/<runtime-skill-name>/SKILL.md
  personal skill discovery

.agents/plugins/marketplace.json
plugins/<runtime-plugin-name>/.codex-plugin/plugin.json
plugins/<runtime-plugin-name>/skills/**
  repo-scoped plugin marketplace and installable distribution

.codex/config.toml
  trusted project config

.codex/hooks.json
  trusted project hooks
```

User-level Codex config and plugins exist, but contexta must not write them by default.

## V1 Target Matrix

| Target | Output | Status | Use |
| --- | --- | --- | --- |
| `codex.repo-skill` | `.agents/skills/<runtime-skill-name>/SKILL.md` | v1 default dogfood target | Use selected skills immediately in this repo. |
| `codex.plugin` | `plugins/<runtime-plugin-name>/.codex-plugin/plugin.json` + `plugins/<runtime-plugin-name>/skills/**` + `.agents/plugins/marketplace.json` | v1 pack distribution target | Preserve pack boundary and install/toggle as a plugin. |
| `codex.project-hooks` | `.codex/hooks.json` | v1 limited target | Export hooks only when the source asset is a valid Codex `hooks.json` payload. |
| `codex.project-config` | `.codex/config.toml` | v1 limited target | Export MCP/config only when the source asset has a confirmed Codex config shape. |

## Immediate Dogfood

The immediate path is `codex.repo-skill`.

It exists for the narrow purpose of making a selected skill available in the current repo without waiting for plugin installation.

Rules:

- export selected assets, not `--all` by default;
- write only skill assets to `.agents/skills`;
- materialize names with namespace prefix, for example `skill:dw/review-doc -> dw-review-doc`;
- put rich prompt/profile/reference material under the exported skill as `references/`;
- use `agents/openai.yaml` when the skill should be explicit-only;
- never export unready primitives or placeholder-heavy skills.
- refuse export when the result is not a usable `SKILL.md` directory.

This target is an authoring and dogfood path, not the long-term distribution story.

## Pack Distribution

The pack-level path is `codex.plugin`.

Rules:

- one contexta pack can materialize into one plugin;
- plugin `name` is stable kebab-case and matches the generated plugin folder;
- plugin identity, marketplace source, and bundled skill names carry runtime namespace, for example `dw-docwarden` and `dw-review-doc`;
- generated plugin folders must include `.codex-plugin/plugin.json`;
- generated marketplace entries must point at plugin folders by relative path;
- hooks and MCP config enter the plugin only after the concrete plugin schema is verified.
- bundled context assets must resolve into usable skills or verified plugin-supported material.

This target is the right place for many related skills.

## Rejected Runtime Paths

Do not use these as v1 Codex output paths:

```text
.codex/skills/**
.codex/prompts/**
.codex/agents/**
.codex/workflows/**
.codex/profiles/**
.codex/references/**
```

They are not confirmed Codex runtime surfaces for repo-scoped context assets.

## Asset Mapping

```text
skill
  -> codex.repo-skill
  -> codex.plugin skills

prompt
  -> skill/plugin reference material
  -> not a bare Codex prompt target

reference
  -> skill/plugin reference material

workflow
  -> skill/plugin reference material

profile
  -> future AGENTS/config projection only with explicit target selection

hook
  -> .codex/hooks.json when the asset is a valid Codex hooks.json payload
  -> plugin bundled lifecycle config after schema verification

agent
  -> no v1 bare target
  -> future Codex subagent/config/plugin projection after upstream shape is confirmed
```

## Acceptance

- A selected contexta skill can be exported to `.agents/skills` and used by Codex in this repo.
- A contexta pack can be materialized as a plugin skeleton without flattening every asset into runtime root directories.
- The exporter refuses unknown Codex target paths by default.
- The exporter refuses any asset that cannot become a usable skill, plugin, hook, or config artifact.
- Documentation and tests distinguish source asset kind from runtime target.
