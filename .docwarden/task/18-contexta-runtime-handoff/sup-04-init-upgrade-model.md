---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# init upgrade model

本文件说明 init、vendor snapshot 和 upgrade 的模型。

## Init

`contexta init` materializes vendor snapshot into local `.contexta`。

第一版 init 只创建项目本地 `.contexta` instance。

它不创建根部 `contexta.md`。

它不修改外部资产。

它不生成 target。

init 必须 non-destructive。

当目标目录已经存在 `.contexta` 时，默认行为应拒绝覆盖或进入只读检查路径；演示和测试应使用临时 fixture，除非用户显式要求 force。

## Vendor Snapshot

vendor snapshot 是远端概念层。

它需要被 pin。

v0 implementation 可以随 CLI package 携带一个 materialized seed snapshot。这个 seed 是远端 vendor baseline 的打包副本，不是 runtime 平时读取的 source。

pin 的目的不是让 runtime 每次读取 vendor，而是让未来 upgrade 可以知道：

```text
local `.contexta` 最初来自哪个 vendor baseline？
```

v0 pin metadata 至少应记录：

```text
vendor
ref
digest
createdAt
schemaVersion
```

## Local Ownership

init 后，runtime 读取 local `.contexta`。

用户可以修改 local `.contexta`。

local `.contexta` 是项目实际使用的 contexta instance。

## Upgrade

upgrade 是核心语义，不是后续附属功能。

upgrade 至少需要比较：

```text
pinned vendor baseline
new vendor baseline
local effective `.contexta`
```

upgrade 的输出应是可审核的 diff / migration material。

第一版可以先保留 upgrade 模型和 pin 数据，不必完成完整 merge engine。

第一版 upgrade skeleton 至少应能读取 pin metadata，并输出当前 pinned baseline 状态。

## Boundary

- init 不是一次性复制脚本。
- upgrade 不应覆盖用户 local customization。
- runtime 普通执行不应依赖远端 vendor 可用。
- local `.contexta` 不应被视为只读 vendor cache。
