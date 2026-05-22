---
status: draft
created: 2026-05-20
updated: 2026-05-22
owner: sayori
---

# contexta model followup log

## [2026-05-20] setup | 建立 task 12

来源：

- task 11 已完成 sync loop 并归档。
- 后续仍需推进的模型问题不继续混入 task 11。

本任务承接：

- composition 与 module / assertion 的落地关系。
- `kind`、content type metadata 与 docwarden operation metadata 的边界。
- template 骨架审查。
- semantic lint 的第一批误用信号。
- example quality 的未来抽象。

当前入口：

- `plan.md`

## [2026-05-20] archive-previous-tasks | 移动历史 task

sayori 指令：

- 把前面的 task 都放到 `.docwarden/archive` 下。

已处理：

- 将 `00` 到 `11` 的历史 task 移动到 `.docwarden/archive/task/`。
- 保留当前 active task `12-contexta-model-followup/` 在 `.docwarden/task/`。
- 同步 `.docwarden/task/index.md` 的归档路径。
- 同步本 task 的来源基线路径。

## [2026-05-21] loop-1 | 建立 composition / module / assertion review 单元

当前进入 task 12 Loop 1。

已生成：

- `composition-module-assertion-landing.md`

当前候选判断：

- module / assertion 的关系应通过 composition 建模。
- module 是 whole。
- assertion 是 part。
- stable semantic boundary 是 assertion 属于同一 module 的依据。
- composition 不应成为每个 module 的显式文件外壳。
- assertion 第一版不独立落盘，不新增全局 ID、frontmatter 或 assertion database。
- `kind` 的精确定义留到 Loop 2 处理。

## [2026-05-21] loop-1-correction | 修正 module / assertion 理解

sayori 纠正：

- module 实际上就是 file scope。
- 只要是一个 md，当前都属于 module 定义。
- 当前描述文件都以 md 形式存在，因此它们都天然是 module。
- 上一版第 2 点是 agent 从 composition template 反推出来的防御性判断，不是 sayori 已确认的理论点。
- 上一版第 4 点把 assertion 误写成 review locator / 长期落点问题，混入了 docwarden 操作机制。

已修正 `composition-module-assertion-landing.md`：

- module 改为 md file scope。
- assertion 改为 module 内部最小可审查语义判断。
- composition 只用于解释 part-whole 关系，不定义 module 的成立条件。
- review locator 排除出 assertion 的 concept 定义。

## [2026-05-21] loop-1-locator | 修正 assertion locator 能力

sayori 进一步纠正：

- assertion 其实需要有 locator 能力。
- 后续可能要有更多标识让 assertion 能成为 locator。
- assertion 仍然不是文件、独立资产等。
- composition 是 structure 的一种，用来定义当前 module 和 assertion 的关系。

已修正 `composition-module-assertion-landing.md`：

- 不再把 locator 整体排除出 assertion 设计。
- assertion 被定义为未来应该能够成为 locator target 的最小语义单位。
- 当前不新增 assertion 文件、独立资产、frontmatter、全局 ID 或完整 locator 机制。
- composition 改为 structure subtype，负责定义 module / assertion 的 part-whole 关系。

## [2026-05-22] loop-1-landed | 落地 module / assertion / composition

sayori 审核通过 Loop 1 方案。

已落地：

- `.contexta/mapping/bootstrap/modules/concept/module.md`
- `.contexta/mapping/bootstrap/modules/concept/assertion.md`
- `.contexta/mapping/bootstrap/modules/concept/composition.md`

同步修正：

- `.contexta/mapping/bootstrap/modules/concept/concept.md`
- `.contexta/mapping/bootstrap/modules/concept/example.md`
- `.contexta/mapping/bootstrap/modules/concept/structure.md`

当前口径：

- module 是 md file scope。
- assertion 是 module 内部最小可审查语义判断。
- assertion 需要保留后续成为 locator target 的能力，但当前不新增完整 locator 机制。
- composition 是 structure subtype，用于定义 module / assertion 的 part-whole 关系。
- stable semantic boundary 是判断 assertion 是否应共同归入同一 module 的组织边界，不是 module 的成立前提。

下一步：

- 进入 Loop 2：kind 与 metadata 边界。

## [2026-05-22] loop-2 | 建立 kind / metadata review 单元

当前进入 task 12 Loop 2。

已生成：

- `kind-metadata-boundary.md`

当前候选判断：

- `kind` 是 md module 的内容语言选择器。
- `kind` 不表达 primitive 层级。
- pipeline / workflow / architecture / branch / composition 当前可直接作为 kind，不引入 `kind: structure` + subtype metadata。
- module / assertion / example 当前都不应成为 kind。
- template artifact 中的 `kind` 暂时记录为对复制后目标 module kind 的指向，留到 Loop 3 再处理。
- `status / created / updated / owner` 属于 docwarden operation metadata，不属于 contexta 内容字段。

## [2026-05-22] loop-2-relation | 确认 relation / delimitation 分工

sayori 确认：

- Delimitation 处理相邻概念的边界压力。
- relation 处理 concept network 中的稳定位置。
- 不应在每个 concept module 中都放 `Concept Relations`。
- relation 应作为独立 concept / policy 设计。
- 每个 concept module 的重点是维护正确、必要、简洁的 Delimitation。

已生成：

- `relation-delimitation-boundary.md`

同时澄清：

- `entity` 不是当前 contexta concept。
- 该词只是 agent 从早期 docwarden “具体实体落点”语境带入的工作词。
- 当前不新增 `entity` concept，也不把它作为 Delimitation neighbor。

## [2026-05-22] loop-2-landed | 落地 kind 与 relation

sayori 审核通过 Loop 2 口径。

已落地：

- `.contexta/mapping/bootstrap/modules/concept/kind.md`
- `.contexta/mapping/bootstrap/modules/policy/kind-boundary.md`
- `.contexta/mapping/bootstrap/modules/concept/relation.md`
- `.contexta/mapping/bootstrap/modules/policy/relation.md`
- `.contexta/mapping/bootstrap/templates/concept.md`

同步修正：

- 移除当前 concept modules 中默认的 `Concept Relations` 章节。
- 将 relation / delimitation 分工写入长期层。
- 将 `entity` 相关误导表述改成独立资产、docwarden workflow 对象或具体资产落点。

当前口径：

- kind 是 content language entry。
- relation 是 concept network 的稳定连接语言。
- Delimitation 只处理局部边界压力。
- protocol 不作为独立 concept 或 frontmatter 字段引入。
- template 下的 `kind` 暂时理解为对复制后目标 module kind 的指向，进入 Loop 3 继续审查。

## [2026-05-22] loop-3-started | 进入 template 骨架审查

进入 Loop 3。

本轮最小 review 单元：

- template 什么时候可以存在。
- template 文件中的 `kind` 是否继续表示复制后目标 module kind。
- 当前 `.contexta` template inventory 是否成立。
- 是否需要恢复 example template 或新增更多 concept template。

已生成：

- `template-skeleton-review.md`

## [2026-05-22] loop-3-landed | 落地 template 骨架边界

sayori 审核通过 Loop 3 口径，并要求本轮一并补 `user-context` concept。

已落地：

- `.contexta/mapping/bootstrap/modules/concept/template.md`
- `.contexta/mapping/bootstrap/modules/policy/template-boundary.md`
- `.contexta/mapping/docwarden/modules/concept/user-context.md`
- `template-skeleton-review.md`

当前口径：

- template 的成立条件是已确认内容语言、稳定正文骨架和复制需求。
- template 文件中的 `kind` 暂时继续表示复制后目标 module kind，不改成 `target_kind`。
- template 不能仅因为某个 concept 存在就被创建。
- template 不能反向证明一个 kind 成立。
- 当前全部 template 先保留；Loop 4 会进一步按 mapping 关系拆分目录。

## [2026-05-22] loop-4-landed | 落地 mapping layer

sayori 确认当前缺口是 contexta 的 bootstrap 内容与 contexta 到 docwarden 的映射内容混在一起。

已确认：

- contexta 本身就是理论到实体的映射。
- 一部分是 contexta 的 bootstrap mapping。
- 一部分是 contexta 到 docwarden 的 mapping。
- 文件夹结构应表征这两类关系。
- bootstrap layer 使用英文目录名 `bootstrap`。

已落地：

- `.contexta/mapping/bootstrap/modules/concept/mapping.md`
- `.contexta/mapping/bootstrap/modules/policy/mapping-boundary.md`
- `.contexta/mapping/bootstrap/modules/concept/`
- `.contexta/mapping/bootstrap/modules/policy/`
- `.contexta/mapping/bootstrap/templates/`
- `.contexta/mapping/docwarden/modules/concept/user-context.md`
- `.contexta/mapping/docwarden/templates/user-context.md`
- `mapping-layer-review.md`

当前口径：

- 目录第一层表达 mapping 关系。
- bootstrap mapping 表达 contexta 用自己的内容语言定义自己。
- docwarden mapping 表达 contexta 内容语言如何投射给 docwarden 资产使用。
- docwarden 具体长期资产仍留在 `.docwarden`。
- format、locator、semantic lint 后续再推进。
