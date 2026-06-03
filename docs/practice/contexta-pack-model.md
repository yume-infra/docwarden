# Contexta Pack Model

## Position

`.contexta` 采用 pack-first，而不是全局 type-first。

pack 是一组共同服务某个能力、工作流或产品语境的上下文资产。asset kind 是 pack 内的展开方式。

`namespace`、`pack`、`asset kind` 为正交维度：

- namespace：`dw`、`iso`、`ym` 等资产 id 前缀；
- pack：共同分发边界（例如 `docwarden`）；
- asset kind：同一个 pack 内的资产类型（skill / prompt / agent / hook / workflow / profile / reference）。

本轮不保留 compatibility 中间态，也不再使用 `families/` / `contexta/distribution/` 的兼容路径。

## Concepts

```text
pack
  一组共同演进、共同分发的 context assets

asset kind
  skill / prompt / agent / hook / workflow / profile / reference

namespace
  dw / iso / ym 这类资产 id 前缀

target
  codex 这类 runtime 输出目标
```

## Source Layout

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
```

`contexta.yaml` 描述 pack 身份、namespace、资产清单、依赖和目标用途，并应包含目标运行目标（当前为 `codex`）。

示例身份：

```text
pack: docwarden
namespace: dw
target: codex
```

由此产生的资产 id 可以是：

```text
pack: docwarden
namespace: dw
asset kind: skill
id: review-doc
asset id: skill:dw/review-doc
```

## No Middle State

本轮目标是直接落到终态架构，不允许保留旧目录到新目录的桥接模式。  
新增能力只走 `pack` + `asset kind` + `namespace`，不新增历史兼容文件分组作为主路径。

## Why Pack-First

真实 workflow 系统通常不是单个 skill。它会一起需要 skill、prompt、agent、hook、workflow、reference 和 profile。

如果源目录按全局 asset kind 摊平，真实耦合会被藏进 manifest，后续容易 drift。

pack-first 让共同演进关系留在物理结构里；type-first 只作为生成 catalog 的检索视图存在。

## Generated Views

`.contexta/catalog/**` 是生成视图，不是主要维护入口。

可生成：

```text
generated-packs.json
generated-assets.json
```

工具可以通过 catalog 快速查：

```text
skill:dw/review-doc -> packs/docwarden/skills/review-doc
prompt:dw/review-lead -> packs/docwarden/prompts/review-lead
```

但人维护源资产时，应进入 pack。

## Rejected Shape

不采用：

```text
.contexta/assets/skills/dw/
.contexta/assets/prompts/dw/
.contexta/assets/agents/dw/
```

这是素材库结构，不适合作为 workflow / context system 的主源结构。

不采用：

```text
.contexta/families/dw/
```

`dw` 是 namespace，不是 family 层。可分发组合由 pack 和 export selection 表达。
