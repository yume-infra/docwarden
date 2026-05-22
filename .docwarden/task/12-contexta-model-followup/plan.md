---
status: draft
created: 2026-05-20
updated: 2026-05-22
owner: sayori
---

# contexta model followup 计划

本任务承接 task 11 归档后仍需推进的 contexta 模型问题。

## Loop 1：composition 与 module / assertion 落地

状态：accepted。

目标：重新整理 module / assertion 的定义和关系，避免把 file scope、semantic unit、composition 和 review locator 混在一起。

当前基线：

- composition = whole / part / stable semantic boundary。
- composition 是 structure 的一种。
- composition 定义当前 module 和 assertion 的关系。
- module = md file scope。
- 当前所有 md 描述文件都属于 module。
- assertion = module 内部最小可审查语义判断。
- assertion 需要保留后续成为 locator target 的能力。
- assertion 不默认独立成文件。
- module 不是 `kind: module`。

需要 review：

- module 是否应直接定义为 md file scope。
- assertion 是否应定义为 module 内部最小可审查语义判断。
- composition 是否应作为 structure subtype 定义 module / assertion 的 part-whole 关系，而不定义 module 的成立条件。
- assertion 如何保留 locator 能力，而不被写成文件、独立资产、frontmatter、全局 ID 或完整 locator 机制。

可能产物：

- `composition-module-assertion-landing.md`
- 修订 `.contexta/mapping/bootstrap/modules/concept/module.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/assertion.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/composition.md`。
- 同步 `.contexta/mapping/bootstrap/modules/concept/concept.md`、`.contexta/mapping/bootstrap/modules/concept/example.md`、`.contexta/mapping/bootstrap/modules/concept/structure.md` 中对 module 的旧描述。
- 修订或替代 archived task 11 中 `module-assertion-landing.md` 的旧口径。

当前结果：

- 已通过 sayori 审核。
- 已落地 `.contexta/mapping/bootstrap/modules/concept/module.md`。
- 已落地 `.contexta/mapping/bootstrap/modules/concept/assertion.md`。
- 已落地 `.contexta/mapping/bootstrap/modules/concept/composition.md`。
- 已同步当前层中对 module 的旧描述。
- 暂不新增 assertion 文件、独立资产、ID、frontmatter 或完整 locator 机制。
- 下一步进入 Loop 2：kind 与 metadata 边界。

## Loop 2：kind 与 metadata 边界

状态：accepted。

目标：区分 contexta 内容类型字段与 docwarden 操作元数据。

当前基线：

- `kind: user-context` 是内容类型字段。
- `status / created / updated / owner` 是 docwarden workflow 维护状态字段。
- 不应把两类字段统称为同一种 metadata。

需要 review：

- `kind` 是否只表达内容类型。
- contexta 侧应承接哪些内容格式字段。
- docwarden 侧应承接哪些 workflow 维护状态字段。
- 如何避免 `example`、`module`、`role` 等伪 kind。

可能产物：

- 新增 frontmatter / metadata boundary working note。
- 修订 `.contexta/mapping/bootstrap/templates/` 的 frontmatter 口径。

当前产物：

- `kind-metadata-boundary.md`
- `relation-delimitation-boundary.md`

当前结果：

- 已通过 sayori 审核。
- 已落地 `.contexta/mapping/bootstrap/modules/concept/kind.md`。
- 已落地 `.contexta/mapping/bootstrap/modules/policy/kind-boundary.md`。
- 已落地 `.contexta/mapping/bootstrap/modules/concept/relation.md`。
- 已落地 `.contexta/mapping/bootstrap/modules/policy/relation.md`。
- 已移除 concept template 和当前 concept modules 中默认的 `Concept Relations` 章节。
- 已确认 Delimitation 只维护关键边界压力，relation 维护 concept network 稳定位置。
- template 中的 `kind` 暂时理解为对复制后目标 module kind 的指向，留到 Loop 3 继续处理。

## Loop 3：template 骨架审查

状态：accepted。

目标：审查当前 template 是否只服务已成立的内容语言骨架。

当前基线：

- template 只负责复制后的内容骨架。
- template 不负责来源、review、pick、更新、写入、生命周期。
- `.contexta/mapping/bootstrap/templates/example.md` 已移除。

需要 review：

- concept / policy / pipeline / workflow / architecture / branch / composition 的 template 是否成立。
- 是否存在 template 反向制造伪 kind。
- 是否存在 template 混入 policy、workflow 或 docwarden 生命周期。

可能产物：

- 修订 `.contexta/mapping/bootstrap/templates/*.md`。
- 修订 `.contexta/mapping/bootstrap/modules/policy/template-boundary.md`。

当前产物：

- `template-skeleton-review.md`

当前进展：

- 已整理 template 的成立条件候选。
- 已整理当前 `.contexta` template inventory。
- 已将 `target_kind` 是否需要引入留作本轮 review 问题，不直接修改 frontmatter。

当前结果：

- 已通过 sayori 审核。
- 已落地 `.contexta/mapping/bootstrap/modules/concept/template.md` 的 template 成立条件。
- 已落地 `.contexta/mapping/bootstrap/modules/policy/template-boundary.md` 的 template 反向制造 kind 约束。
- 已新增 `.contexta/mapping/docwarden/modules/concept/user-context.md`。
- 暂不修改 `.contexta/mapping/*/templates/*.md` 的 frontmatter。
- 暂不新增 `target_kind`。

## Loop 4：mapping layer

状态：accepted。

目标：定义 contexta 如何用目录结构说明理论到实体的 mapping 关系。

当前基线：

- contexta 本身就是理论到实体的映射。
- 当前 `.contexta` 中混有两类内容：contexta 的 bootstrap 内容，以及 contexta 到 docwarden 的映射内容。
- 目录结构应表征这两类 mapping 关系。
- bootstrap layer 使用英文目录名 `bootstrap`。

当前产物：

- `mapping-layer-review.md`

当前结果：

- 已通过 sayori 审核。
- 已新增 `.contexta/mapping/bootstrap/modules/concept/mapping.md`。
- 已新增 `.contexta/mapping/bootstrap/modules/policy/mapping-boundary.md`。
- 已将 contexta 的 bootstrap concept / policy / template 迁移到 `.contexta/mapping/bootstrap/`。
- 已将 `user-context` concept / template 迁移到 `.contexta/mapping/docwarden/`。
- `.docwarden/user/profile.md` 保持为 docwarden 长期资产，不移动到 `.contexta`。
- format、locator、semantic lint 留给后续 loop。

## Loop 5：semantic lint 误用信号

状态：pending。

目标：从当前已暴露的问题中整理第一批 semantic lint 可识别信号。

当前候选信号：

- concept 被写成 policy。
- workflow 被写成 policy。
- architecture 被写成工程职责卡片。
- template 承接来源、review、pick、更新、写入或生命周期。
- example 被写成 kind、role、template kind 或 directory kind。
- composition 被写成普通列表、policy 规则或 architecture 层级。

需要 review：

- 哪些信号已经足够稳定，可以先落地为 policy 或 lint note。
- 哪些信号仍需等待更多真实材料。

## Loop 6：example quality 未来抽象

状态：deferred。

目标：在真实使用和调优中补充 example，并重新抽象 example quality。

当前基线：

- example 是样本语言。
- 当前 example 不够好，但这是承认且可接受的局限。
- `example-quality` 当前只是临时质量提示，不是成熟质量抽象。

暂不推进原因：

- 缺少足够真实场景。
- 当前不应过早建立新结构承接 sample set / contrast set。
- 后续从实际写作反馈中补充 Positive / Negative / Borderline 的高质量样本。

## 本轮不做

- 修改 `docs/`。
- 重新打开 task 11 已归档判断。
- 把 example 恢复为 kind、role、template kind 或 directory kind。
- 建立 `structure_type` metadata 分类树。
- 把 docwarden workflow 生命周期放进 contexta template。
