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
- task 29 已经完成止血基线：concrete skill-primitive material 不再以 root `.isomorph/primitives/skill-primitive/**` 作为 canonical source，`lead-review` 被上提为 bootstrap review theory，contexta 承接 canonical skill asset 与分发。
- 但 task 29 没有解决核心层级问题：当前 `.isomorph/primitives`、`.isomorph/grammars`、`.isomorph/exports` 仍然混合了 isomorph source asset、自举 vocabulary、用户 init 后应出现的 project semantic framework material，以及 downstream projection/export material。
- 用户明确要求区分：
  - “在哪里都要带到的理论 primitive 层”。
  - “只服务于 isomorph 本理论自举的一些 vocabulary”。
  - “isomorph init 后需要出现在用户 codebase 里的 `.isomorph`”。

## Objective
- 设计并实现 isomorph package source 与用户项目 init 后 `.isomorph` 的层级分裂。
- 明确 current `primitives / grammars / exports` 中哪些属于 portable theory primitives，哪些属于 isomorph bootstrap vocabulary，哪些属于 generated/project instance material，哪些只是 projection/export/dogfood。
- 产出一个可 review 的重构模型和迁移计划，再进入文件迁移或 CLI init 实现。

## Boundary
- 本 task 不直接修改 `docs/`。
- 本 task 已进入 breaking implementation；大规模目录迁移必须保持一次到位。
- 本 task 不把 `.isomorph/exports/**` 继续当作稳定 root layer 扩张。
- 本 task 不把 isomorph 自举 vocabulary 默认带入所有用户项目。
- 本 task 不让 contexta/plugin/runtime material 反向定义 isomorph bootstrap language。
- 本 task 的核心验收不是文件移动数量，而是 source asset 与 initialized project asset 的职责分界是否清楚。
- 本轮 implementation 是 breaking change；进入执行后必须一次做到位，不能留下双轨 source、兼容旧层级、半迁移目录或需要后续再清理的中间态。

## Next Entry
- plan.md
