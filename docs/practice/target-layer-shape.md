# Target Layer Shape

## Position

本轮采用激进迁移策略：直接把源资产目录改成目标架构，不保留旧目录作为 runtime canonical path。

## Target Shape

```text
.isomorph/
  primitives/
  grammars/
  lint/
  exports/

.contexta/
  packs/
    <pack>/
      contexta.yaml
      skills/
      prompts/
      agents/
      hooks/
      workflows/
      profiles/
      references/
  targets/
    codex.yaml
  catalog/
    generated-assets.json
    generated-packs.json

apps/
  isomorph/
  contexta/
  docwarden/

.agents/
  skills/              # generated or curated repo-local Codex dogfood target
  plugins/             # repo marketplace metadata for generated plugins

plugins/
  <runtime-plugin-name>/ # generated Codex plugin target, for example dw-docwarden
    .codex-plugin/
    skills/

.codex/
  config.toml          # optional trusted project config target
  hooks.json           # optional trusted project hook target
```

## Meaning

`.isomorph` 是语义源资产。它回答语义如何成立。

`.contexta` 是 agent context 源资产。它回答用户有哪些上下文资产、这些资产如何组合、要分发到哪些 runtime。

`apps/contexta` 是工具实现。它读取 `.contexta`，生成 runtime artifact。

`apps/isomorph` 是语义 runtime 实现。它读取 `.isomorph`。

`apps/docwarden` 是文档管理机制实现。它消费 isomorph 和 contexta，不拥有它们的职责。

## Final Acceptance Gate

- 仅以下 source 目录被认为是当前架构 canonical：
  - `.isomorph/primitives/`
  - `.isomorph/grammars/`
  - `.isomorph/lint/`
  - `.isomorph/exports/`
  - `.contexta/packs/`
  - `.contexta/targets/`
  - `.contexta/catalog/`
- `.contexta` 仅保留 pack-first 组织；
- `docwarden/adoption/bindings/` 与 `contexta/distribution/`、`.contexta/families/` 均不存在于实施路径；
- `contexta` 到 Codex 的 materialization 只允许 `apps/contexta/src/exporters/codex/`，并必须写入官方确认的 Codex surfaces；
- `contexta` 仅保留 `assets` 与 `export codex` 的命令口径，不再保留 capability/catalog/install/activation/asset alias。

## Explicit Rejections

不采用：

```text
.isomorph/mapping/
```

作为主组织目录。

不采用：

```text
contexta/distribution/
```

作为裸顶层目录。contexta 源资产必须在 `.contexta/`。

不采用：

```text
.contexta/families/
```

`family` 混淆 namespace、asset kind 和 distribution set。

不采用：

```text
docwarden/adoption/bindings/
```

docwarden 本轮只是 consumer。后续实现接入优先进入 `apps/docwarden/src/integrations/*`；项目本地状态才进入 `.docwarden/`。

不采用：

```text
.codex/skills/
.codex/prompts/
.codex/agents/
.codex/workflows/
.codex/profiles/
.codex/references/
```

作为 v1 默认 Codex runtime target。Codex v1 输出必须先落到 `.agents/skills`、repo plugin marketplace / plugin folder、`.codex/hooks.json` 或 `.codex/config.toml` 这类确认 surface。
