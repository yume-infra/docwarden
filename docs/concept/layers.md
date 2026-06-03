# Layers

> 当前口径：本文记录 isomorph、contexta、projection、runtime 和 docwarden 的外层分层。
>
> 本文服务外层分层口径。具体迁移计划记录在 `docs/practice/`。

## First Principles

真实 agent 使用场景里至少存在四类不可混淆的对象：

```text
语义如何成立
上下文资产如何组织
上下文资产如何变成某个 agent runtime 能加载的格式
agent runtime 实际读到什么
```

因此，`contexta` 不能同时承担资产系统和所有 runtime 格式适配；`isomorph` 也不能因为定义 `mapping` 概念，就承担所有 mapping 实例职责。  
本轮为激进迁移，禁止 compatibility / middle state，不保留旧命令到新架构的过渡桥接。

## Terminology

```text
namespace
  资产命名空间标识（如 dw / iso / ym）

pack
  一组共同服务某个能力、工作流或产品语境的上下文资产集合

asset kind
  skill / prompt / agent / hook / workflow / profile / reference
```

关系边界：

- namespace 是 asset id 的前缀域（如 `skill:dw/review`）；
- pack 是分发集合边界；
- asset kind 是同一个 pack 中的资源类型维度。

## Layer Map

```text
isomorph
  semantic authority

contexta
  agent context asset system

projection / export
  runtime materialization adapter

runtime artifacts
  files actually loaded by the target agent runtime

docwarden
  document management consumer / application
```

`harness / validation` 是横切验证层，不是主业务层。

## Isomorph

`isomorph` 是语义机制层。

它负责定义用户自己的 DSL 和语义本体，包括：

- primitive
- concept
- policy
- structure
- relation
- module
- assertion
- magic word
- recognition primitive
- semantic-lint signal
- grammar / format 约束

`isomorph` 可以定义 `mapping` 是什么，但不应默认管理所有 contexta、docwarden 或 runtime artifact 的 mapping 实例。

### Not Responsible For

- agent context asset distribution
- Codex / Claude / Cursor / OpenCode runtime 文件格式适配
- docwarden 文档管理流程
- contexta pack catalog / export

## Contexta

`contexta` 是 agent context 资产系统。

它负责统一管理和分发用户自己的 agent context 资产。source asset 放在 `.contexta/`。

`.contexta` 采用 pack-first 结构。pack 是一组共同服务某个能力、工作流或产品语境的上下文资产；pack 内再按 asset kind 展开。

示例：

```text
.contexta/
  packs/
    docwarden/
      contexta.yaml
      skills/
      prompts/
      agents/
      hooks/
      workflows/
      profiles/
      references/

    isomorph-authoring/
      contexta.yaml
      skills/
      prompts/
      workflows/
      references/

  targets/
    codex.yaml

  catalog/
    generated-assets.json
    generated-packs.json
```

pack 内可包含：

- skills
- prompts
- agents
- hooks
- workflows
- user profiles
- context files
- references

`contexta` 不是 CLI 本身。CLI 是操作入口；`contexta` 是被 CLI 操作的资产系统。

`family` 不作为一级架构概念。`dw`、`iso`、`ym` 这类标识是 namespace；一组共同分发的资产是 pack；`skill`、`prompt`、`agent` 等是 asset kind。

### Responsibilities

- 维护 `.contexta/packs/**` 作为 agent context 的统一来源。
- 维护由 pack 生成的资产 catalog。
- 表达资产 namespace、kind、来源、依赖和目标用途。
- 调用 projection / export 层，把资产 materialize 到目标 runtime。
- 作为 `docwarden`、`isomorph authoring` 等 context pack 的分发引擎。

### Not Responsible For

- semantic primitive engine
- semantic-lint authority
- 具体 runtime 的文件格式细节
- docwarden 的文档管理机制本身

## Projection / Export

`projection / export` 是 runtime materialization 层。

它负责把 `contexta` 管理的 source asset 转换成某个 agent runtime 能实际加载的 artifact。

当前最小目标只适配 Codex：

```text
contexta asset -> Codex upstream surface
```

示例：

```text
.contexta skill asset -> .agents/skills/<runtime-skill-name>/SKILL.md
.contexta pack -> plugins/<runtime-plugin-name>/.codex-plugin/plugin.json
.contexta hook asset -> .codex/hooks.json
.contexta config asset -> .codex/config.toml
```

runtime skill / plugin name 由 contexta namespace 参与 materialize，例如 `skill:dw/review-doc -> dw-review-doc`、`pack: docwarden + namespace: dw -> dw-docwarden`。

prompt / profile / reference / workflow 这类 source asset 不默认生成裸 Codex 目录。它们应作为 skill / plugin 的 references、AGENTS projection 或 config projection 被明确投影。

若上游 runtime 不支持某个 surface，projection / export 不得为它发明输出路径。不能生成可用 skill、plugin、hook 或 config 的资产，应停留在 source layer。

这一层可以先通过 `contexta` CLI 暴露，例如：

```text
contexta export codex
```

但 CLI 命令不是层级本身。层级本身是 export adapter / materializer。

实现边界：

```text
contexta CLI surface -> 选择 source asset + 触发 materialization
apps/contexta/src/exporters/codex/ -> Codex adapter
runtime artifact -> Codex 可加载文件
```

本轮只实现 Codex materializer，不允许同时保留其他 runtime 的兼容适配层。

Codex materializer 必须以官方 runtime surface 为准；`.codex/skills`、`.codex/prompts`、`.codex/agents`、`.codex/workflows`、`.codex/profiles`、`.codex/references` 不作为 v1 默认输出。

### Not Responsible For

- 定义 skill-primitive 语义。
- 决定哪些资产应该存在。
- 维护文档体系。
- 判断 agent 行为是否真的改善。

## Runtime Artifacts

`runtime artifacts` 是目标 agent 实际加载的文件。

对当前阶段来说，目标 runtime 是 Codex。

这一层的验收标准不是“文件已生成”，而是 Codex 能实际发现、加载、触发或执行。skill artifact 必须是可用的 `SKILL.md` 目录。

这一层只表示 materialization 结果，例如：

- Codex skill directory
- Codex plugin directory
- Codex project hooks / config
- 项目级 agent instruction 文件
- 后续确认的 Codex plugin / app artifact

runtime artifact 不承担语义 authority。它只是 agent 实际消费的结果。

## Docwarden

`docwarden` 是文档管理机制层。

它是 `docs/` 中文档体系理论的实现，目标是可引入任意项目，利用项目已有资产维护项目自己的文档体系。

`docwarden` 可以消费：

- `isomorph` 的 semantic authority 和 semantic-lint 能力。
- `contexta` 分发的 docwarden context pack。
- projection / export 生成的 Codex runtime artifacts。

`docwarden` 不应承担通用 agent context 分发职责。

当前不引入 `docwarden/adoption/bindings/` 作为顶层目录。若后续 docwarden 需要消费层实现，应优先放在 `apps/docwarden/src/integrations/*`；若需要项目本地状态，再进入 `.docwarden/`。

## Harness / Validation

`harness / validation` 是横切层。

它验证各层是否真的成立：

- `isomorph`：primitive、recognition 和 semantic-lint 是否识别正确。
- `contexta`：catalog、依赖和分发闭包是否正确。
- `projection / export`：Codex artifact 是否能被 runtime 加载。
- `runtime artifacts`：agent 是否按预期触发和执行。
- `docwarden`：文档维护行为是否真的改善。

因此，harness 不应被设计成第五个主业务层。

## Boundary Summary

```text
isomorph defines semantics.
contexta manages agent context assets.
projection exports assets to runtime artifacts.
runtime artifacts are loaded by Codex.
docwarden consumes these capabilities to maintain project docs.
harness validates the chain.
```
