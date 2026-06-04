---
status: active
workspace_status: validating
created: 2026-06-04T09:28:42.615Z
updated: 2026-06-04T09:28:42.615Z
title: isomorph source init layer split
id: 30-isomorph-source-init-layer-split
---

# isomorph source init layer split

## Context
- task 29 是止血，不是最终层级。
- 用户已拒绝 `apps/isomorph/isomorph-source/{basis,bootstrap,init}`。
- 当前 accepted model 是 `language / framework / contract / loop`。
- 统一规则是 `path = ability ownership`，`kind = content language`。
- 本轮已经进入 breaking implementation，不保留旧 source layer 兼容。

## Objective
- 设计并实现 isomorph package source 与用户项目 init 后 `.isomorph` 的层级分裂。
- 让 package source 直接按 `language / framework / contract / loop` 组织。
- 让 `isomorph init` 只输出用户 `.isomorph` seed 与 pin，不复制 package authority source。
- 删除旧 `basis/bootstrap/init/isomorph-source` 中间态。

## Boundary
- 本 task 不直接修改 `docs/`。
- 本 task 已进入 breaking implementation；大规模目录迁移必须保持一次到位。
- 本 task 不把 `.isomorph/exports/**` 继续当作稳定 root layer 扩张。
- 本 task 不把 isomorph 自举 vocabulary 默认带入所有用户项目。
- 本 task 不让 contexta/plugin/runtime material 反向定义 isomorph language。
- 本 task 的核心验收不是文件移动数量，而是 source asset 与 initialized project asset 的职责分界是否清楚。
- 本轮 implementation 是 breaking change；进入执行后必须一次做到位，不能留下双轨 source、兼容旧层级、半迁移目录或需要后续再清理的中间态。

## Next Entry
- accepted-structure-definition.md
