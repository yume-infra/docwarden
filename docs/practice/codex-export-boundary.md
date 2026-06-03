# Codex Export Boundary

## Position

Codex 是本轮唯一 runtime target。

`contexta export codex` 是 CLI surface；真正层级是 projection / export materializer。

Codex exporter 必须尊重上游 runtime surface，不允许把 `.contexta` 的 asset kind 直接猜成 `.codex/<kind>s/` 目录。

上游不支持的 surface 永远不导出。
如果 source asset 无法变成 Codex 可用的 skill、plugin、hook 或 config artifact，exporter 必须拒绝，而不是生成一个看似规整但 runtime 不会加载的文件。

本轮不提供 compatibility bridge，不保留 alias/兼容 flag；任何 `contexta` 资产写入都必须经过 `export` 入口。

## Command Surface

新命令：

```text
contexta assets
contexta export codex <asset-or-pack-id>
contexta export codex --all
```

删除旧命令契约：

```text
contexta capability
contexta catalog
contexta install
contexta activation
contexta asset
```

不保留 alias。

数据边界：

```text
input  = .contexta/packs/** + .contexta/targets/codex.yaml
output = official Codex surfaces
```

## Input

Codex exporter 只读取 `.contexta/packs/**` 和 `.contexta/targets/codex.yaml`。

它不直接读取旧 `skills/primitive/**` 作为 canonical source。旧内容若要进入 contexta，应迁入某个 pack。

## Output

Codex exporter 只生成上游确认的 Codex surfaces。

### V1 Export Targets

```text
codex.repo-skill
  output: .agents/skills/<runtime-skill-name>/SKILL.md
  use: immediate repo-local dogfood and skill authoring

codex.plugin
  output: plugins/<runtime-plugin-name>/.codex-plugin/plugin.json
          plugins/<runtime-plugin-name>/skills/**/SKILL.md
          .agents/plugins/marketplace.json
  use: pack-level installable distribution

codex.project-hooks
  output: .codex/hooks.json
  use: trusted project lifecycle hooks

codex.project-config
  output: .codex/config.toml
  use: trusted project config such as MCP or hook tables
```

`codex.repo-skill` 是第一版 dogfood target。它能让当前 repo 立刻使用选中的 skills，同时不需要把 pack 全量安装成插件。

`codex.repo-skill` 的成功条件不是写出 markdown，而是写出 Codex 可发现、可调用的 `SKILL.md` 目录。
runtime skill name 必须携带 contexta namespace，例如 `skill:dw/review-doc -> dw-review-doc`。

`codex.plugin` 是 pack 分发 target。它保留 pack 边界，并让 Codex 用 plugin name / marketplace identity 表达 runtime namespace。
runtime plugin name 必须和 plugin folder / manifest name / marketplace entry name 一致，例如 `dw-docwarden`。

`codex.project-hooks` 与 `codex.project-config` 只用于真正有 Codex runtime 对应面的 asset，不作为普通 context 文件落盘位置。

### Forbidden Default Outputs

不再作为默认输出：

```text
.codex/skills/**
.codex/prompts/**
.codex/agents/**
.codex/workflows/**
.codex/profiles/**
.codex/references/**
```

原因：

- repo skills 的上游扫描面是 `.agents/skills`；
- custom prompts 已 deprecated，且属于个人 `~/.codex/prompts`；
- agents / workflows / profiles / references 没有确认的 Codex 裸目录 runtime surface；
- prompt / profile / reference asset 应作为 skill 或 plugin 内部 material 被引用，而不是直接落到未知 runtime 目录。

用户级目标必须显式指定，并且只能写官方确认的用户层面：

```text
$HOME/.agents/skills/
~/.agents/plugins/marketplace.json
~/.codex/hooks.json
~/.codex/config.toml
```

默认不写用户层目标。

## Boundary

`contexta` 负责选择 source asset 和调用 exporter。

`apps/contexta/src/exporters/codex/` 负责 Codex 文件格式、路径、覆盖策略和 validation。

`.contexta/targets/codex.yaml` 记录 Codex target 配置，不成为 source asset 本身。

validation 必须先于写入发生：

```text
unsupported target surface -> reject
missing SKILL.md frontmatter -> reject
unusable skill name/description -> reject
placeholder-heavy runtime output -> reject
non-Codex hook JSON -> reject
```

`apps/contexta/src/exporters/codex/` 必须把 asset kind 和 runtime target 分开处理：

```text
skill asset      -> repo-skill or plugin skill
prompt asset     -> skill/plugin reference material, not bare prompt file
agent asset      -> future Codex subagent/config/plugin path only after upstream shape is confirmed
hook asset       -> project-hooks only when it is a valid Codex hooks.json payload
workflow asset   -> skill/plugin reference material, not bare workflow file
profile asset    -> AGENTS/config/skill reference only after explicit target selection
reference asset  -> skill/plugin references
```

## 禁止兼容中间态

本轮不再保留 `contexta capability / catalog / install / activation / asset` 迁移入口。  
`contexta` 只通过 `assets` 与 `export codex` 表达目标资产分发口径。
