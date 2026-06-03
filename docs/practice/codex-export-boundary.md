# Codex Export Boundary

## Position

Codex 是本轮唯一 runtime target。

`contexta export codex` 是 CLI surface；真正层级是 projection / export materializer。

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
output = codex runtime artifacts
```

## Input

Codex exporter 只读取 `.contexta/packs/**` 和 `.contexta/targets/codex.yaml`。

它不直接读取旧 `skills/primitive/**` 作为 canonical source。旧内容若要进入 contexta，应迁入某个 pack。

## Output

Codex exporter 生成 runtime artifacts，例如：

```text
.codex/skills/<name>/SKILL.md
.codex/agents/<name>.toml
.codex/hooks.json
```

用户级目标需要显式指定，才写入：

```text
${CODEX_HOME:-~/.codex}/skills/
${CODEX_HOME:-~/.codex}/agents/
```

## Boundary

`contexta` 负责选择 source asset 和调用 exporter。

`apps/contexta/src/exporters/codex/` 负责 Codex 文件格式、路径、覆盖策略和 validation。

`.contexta/targets/codex.yaml` 记录 Codex target 配置，不成为 source asset 本身。

## 禁止兼容中间态

本轮不再保留 `contexta capability / catalog / install / activation / asset` 迁移入口。  
`contexta` 只通过 `assets` 与 `export codex` 表达目标资产分发口径。
