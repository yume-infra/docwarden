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

## [2026-05-22] loop-5-landed | 收窄 Delimitation

sayori 确认 Delimitation 的核心是区分边界，而不是承接 relation network。

已落地：

- 收窄当前 concept modules 的 Delimitation。
- 删除只表示普通相关、承载、使用、上位关系的 Delimitation 项。
- 保留容易导致错误落点、错误书写或错误判断的边界项。
- 新增 `delimitation-narrowing-review.md`。

当前口径：

- Delimitation = 局部边界压力。
- relation = concept network 中的稳定连接。
- 属于 contexta 自己的 relation 应放在 bootstrap mapping 下的独立 relation layer。
- 当前不新增 `.contexta/mapping/bootstrap/relations/`，等待 relation entry 格式 review。

## [2026-05-22] loop-6-started | 进入 relation content 建模

进入 Loop 6。

初始最小 review 单元：

- relation layer 中的文件如何拆分。
- relation assertion 的最小结构。
- relation module 是否使用 `kind: relation`。
- 第一批 relation module 是否从 `structure-language` 开始。

已生成：

- `relation-content-model-review.md`

## [2026-05-22] loop-6-correction | relation 收窄为连接语言

sayori 纠正：

- md 文档是互联的。
- relation 不应重复定义 concept、policy、example 或 Delimitation 已经负责的内容。
- relation 只说明自己的连接语言。
- 其他方面应通过 link 拉入已有 md。

已修正：

- 将 `relation assertion` 改为 `relation record`。
- 将最小结构从 Source / Predicate / Target / Effect 改为 Source / Relation / Target / Reading。
- 移除 relation file skeleton 中自足的 Boundaries 和 Examples 章节。
- 增加 link pull-in 思路，而不是重复说明。
- 保留按 network topic 拆分 relation file 的候选方案。

## [2026-05-22] loop-6-ofm | 改为 OFM relation block

sayori 确认 OFM 是 Obsidian Favored Markdown，并指出表格可以表达连接，但不够适合作为第一阅读形态。

已修正：

- 将 relation record 改为 relation block。
- 将第一表达从表格改为 heading / From / To / Reading / Read next。
- 使用 heading anchor 表达 relation name。
- 使用 wikilink 表达 From / To。
- 使用 section link 在 Read next 中拉入 definition、constraint 和 boundary。
- 新增 `.contexta/mapping/bootstrap/relations/structure-language.md` 展示实际效果。

## [2026-05-22] loop-7-started | 进入 OFM link resolution

sayori 确认下一个 loop 先处理 link resolution / locator，并明确偏好使用 OFM 的 wiki link 语法。

本轮最小 review 单元：

- contexta 内部连接是否以 OFM wiki link 为第一表达。
- 稳定连接是否只使用 path alias。
- 短 link 是否完全排除出 contexta 内部连接规范。
- section link 如何指向具体职责位置。
- block reference 是否留到 assertion locator。

已生成：

- `ofm-link-resolution-review.md`

## [2026-05-22] loop-7-correction | 排除短 link

sayori 明确：

- 只使用 OFM wiki link。
- 短 link 直接不要，避免后续来回改。

已修正：

- Loop 7 口径改为 contexta 内部连接只使用 path alias。
- 删除 basename 唯一时可用短 link 的例外。
- 将 `.contexta/mapping/bootstrap/relations/structure-language.md` 改为 path alias。
- 同步 relation content review 中的 relation block 示例。

## [2026-05-22] loop-7-landed | 落地 OFM path alias

sayori 审核通过 Loop 7。

已落地：

- 新增 `.contexta/mapping/bootstrap/modules/policy/link-resolution.md`。
- 将 `.contexta/mapping/bootstrap/relations/structure-language.md` 改为 path alias。
- 将 `.contexta/mapping/**/*.md` 中已有短 link 迁移为 path alias。
- 将 `ofm-link-resolution-review.md` 标记为 accepted。
- 将 `relation-content-model-review.md` 标记为 accepted。

当前口径：

- contexta 内部连接只使用 OFM wiki link。
- contexta 内部连接只使用 path alias。
- contexta 内部连接不使用短 link。
- section link 可以用于 heading 级职责位置。
- block reference 留给 assertion locator loop。

## [2026-05-22] loop-8-started | 进入 semantic lint 误用信号

进入 Loop 8。

本轮最小 review 单元：

- semantic lint 当前阶段是否先做 warning signal。
- semantic lint 未来是否进入独立 lint layer 和 CLI lint step。
- semantic lint signal 的最小结构。
- 第一批信号是否只来自当前已暴露误用。
- 是否暂不设计 severity。
- 是否暂不设计完整 assertion locator，但明确 locator 是未来脚本级 lint 的必要承接。

已生成：

- `semantic-lint-signal-review.md`

## [2026-05-22] loop-8-correction | 明确未来 lint layer

sayori 纠正：

- semantic lint 后续肯定会做成 CLI 中的一步。
- semantic lint 后续会做成 lint 引擎。
- 当前初步阶段不需要设计得太死。
- 但需要明确未来会有独立 lint layer。
- 未来需要 locator 辅助脚本级 lint。

已修正：

- Loop 8 改为“当前 warning signal，未来独立 lint layer / CLI lint step”。
- 保留当前不设计完整 lint engine、severity 和 assertion locator。
- 明确 locator 是未来脚本级 lint 的必要承接。

## [2026-05-22] loop-8-subagent-review | 审查 signal / trigger / assertion / locator

sayori 要求使用 subagents 从不同方面审查 signal、trigger、assertion、locator 的架构关系。

审查结论：

- 关系成立：trigger 发现可观察现象，signal 命名语义风险，locator 指向审查位置，assertion 是被审查语义内容。
- 需要区分 signal definition 和 signal instance。
- Trigger 必须尽量是脚本可观察条件，不能写成人工语义结论。
- locator 当前可先支持 module / heading，未来再扩展到 assertion。
- `Review` 字段容易混淆 docwarden review surface，应改为 `Inspection`。
- semantic lint 长期应进入独立 lint layer，不应把具体 signals 放进 concept、policy 或 relation。

已修正：

- `semantic-lint-signal-review.md` 增加关系模型。
- 增加 Signal Definition / Signal Instance 区分。
- 将 signal definition 字段改为 Signal / Trigger / Why / Source / Inspection。
- 增加 signal instance 字段 Signal / Locator / Trigger / Evidence / Inspection。
- 将候选信号的 Trigger 改成更可脚本化的观察条件。
- 增加后续落点判断：concept 定义名字，policy 约束边界，lint layer 承载具体 signal definitions。

## [2026-05-22] loop-8-landed | 落地 semantic lint 初步层

sayori 确认 Loop 8 修订方向正确，并要求组织落地。

已落地：

- `.contexta/mapping/bootstrap/modules/concept/semantic-lint.md`
- `.contexta/mapping/bootstrap/modules/concept/signal.md`
- `.contexta/mapping/bootstrap/modules/concept/trigger.md`
- `.contexta/mapping/bootstrap/modules/concept/locator.md`
- `.contexta/mapping/bootstrap/modules/policy/semantic-lint-boundary.md`
- `.contexta/mapping/bootstrap/lint/semantic-signals.md`

当前口径：

- semantic lint 是语义偏移检测语言。
- signal 是 semantic-lint 中被命名的 warning。
- trigger 是可观察、可脚本化的触发条件。
- locator 是稳定指向 module、heading 或未来 assertion 的地址机制。
- 具体 signal definitions 放在独立 lint layer。
- 当前不设计完整 CLI lint engine。
- 当前不设计完整 assertion locator。

## [2026-05-22] loop-9-started | 进入 semantic lint instance dry run

sayori 指出当前还没有落地具体实例，要求展开。

本轮最小 review 单元：

- 用当前 `.contexta` 内容手动验证 signal definitions。
- 区分 raw hit、candidate 和 signal instance。
- 用 locator / evidence / inspection 组织具体命中。
- 判断当前是否存在 accepted signal instance。
- 暂不设计完整 CLI lint engine。

已生成：

- `semantic-lint-instance-dry-run.md`

当前候选判断：

- raw hit 不能直接等于 signal instance。
- 当前 `.contexta/mapping/**/*.md` 中没有确认的 accepted signal instance。
- 当前主要命中来自 Examples、code fence、template skeleton 和 signal definition 自身描述。
- 后续 lint layer 需要 target scope 和 code fence exclusion。

## [2026-05-22] loop-9-accepted | 收口 semantic lint instance dry run

sayori 确认本轮方向基本成立，并补充：

- 当前不需要奢求一次做好。
- 先稳定 concept / signal / trigger / locator / assertion 等基础概念。
- 后续落实到 CLI lint engine 时，本轮 dry run 可以作为具体参照物。

已同步：

- `semantic-lint-instance-dry-run.md` 标记为 accepted。
- `plan.md` 将 Loop 9 标记为 accepted。
- `index.md` 将下一步改为继续稳定 contexta 基础概念，不直接进入 CLI 实现。

## [2026-05-22] example-table-format | 修复 example Delimitation 表格

发现 `.contexta/mapping/bootstrap/modules/concept/example.md` 的 Delimitation 表格被 formatter 拆坏，OFM wikilink alias 中的 `|` 被错误识别为表格分隔。

处理结果：

- 已将该 Delimitation 改为列表表达。
- 保留 OFM path alias。
- 该问题后续可回到 link / Delimitation 表达方式设计中继续收敛。

## [2026-05-22] loop-10-started | 进入 theory / practice / implementation 边界整理

sayori 确认先修复 example 表格，再进入整体阶段与理论实践边界整理。

本轮最小 review 单元：

- contexta 当前处于什么阶段。
- theory、practice reference、task material、implementation 各自负责什么。
- `.contexta` 与 `.docwarden/task` 的长期边界。
- CLI lint engine 何时进入 implementation 层。

已生成：

- `theory-practice-implementation-boundary.md`

## [2026-05-22] loop-10-accepted | 收口理论实践实现边界

sayori 确认下一步方向正确：先收口 Loop 10，再进入 format / locator 基础层。

当前确认：

- contexta 当前阶段是 `theory stabilization -> practice reference -> future implementation`。
- `.contexta` 承接已 review、需要长期稳定读取的 theory 与 practice reference。
- `.docwarden/task` 承接 loop、纠偏、candidate 和 review outcome。
- CLI lint engine 留到 implementation 层。
- `docs/文档体系建设/理念-v3.md` 已在用户明确要求下记录 v3 breaking changes。

## [2026-05-22] loop-12-started | 进入 format / locator 基础层

当前进入 Loop 12。

本轮最小 review 单元：

- format 是否可以定义为 contexta module 的稳定可读形状。
- locator 是否可以定义为指向 contexta 可读表面的地址表达。
- locator 第一版是否只支持 module / section / relation block。
- assertion locator 是否继续保留为后续 loop，不提前引入 block reference 或 assertion ID。

已生成：

- `format-locator-foundation-review.md`

## [2026-05-22] loop-12-correction | 修正 locator 定义

sayori 审核反馈：

- 接受 `format = 可读表面`。
- 接受 format 作为 contexta 基础 concept。
- locator 第一版应尽可能从简。
- 原先把 locator 定义为“指向可读表面的地址表达”不准确。
- locator 应服务 assertion，即用特殊符号或 magic word 让需要被审核的 assertion 被定位到。

已修正：

- 将 locator 从泛化地址机制改为 assertion 审核定位机制。
- 将 module / section / relation block 降级为定位上下文或宿主表面。
- 将本轮重点改为 assertion marker 的最小形态。
- 增加特殊符号、magic word、二者组合三种候选方向。

## [2026-05-22] loop-12-land-third-candidate | 落地第三种 locator 候选

sayori 要求落地第三种候选查看效果。

已落地：

- 新增 `.contexta/mapping/bootstrap/modules/concept/format.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/locator.md`。
- 修订 `.contexta/mapping/bootstrap/modules/policy/link-resolution.md`。

初始落地效果：

- assertion marker 使用 `^assertion-*`。
- OFM path alias link 使用 `[[path#^assertion-id|display]]` 引用 marker。
- module path / heading 只提供上下文，不替代 assertion locator。
- block reference 只允许作为 assertion marker target，不泛化为普通 link。

## [2026-05-22] loop-12-marker-shortening | 缩短 assertion marker

sayori 在 Obsidian 中查看效果后指出 locator marker 太长。

已修正：

- 将 visible marker 从 `^assertion-*` 收短为 `^a-*`。
- `a-` 作为 assertion marker 的 magic prefix。
- marker 只需要在当前 module 内稳定；跨 module 语义由 OFM path alias 和 display alias 承担。
- 当前示例使用 `^a-def`。

## [2026-05-22] loop-12-accepted | 收口 format / locator 基础层

sayori 确认短 marker 版本阅读效果更清爽，并要求收口本轮 loop。

当前结论：

- format 是 contexta module 的稳定可读形状。
- locator 服务 assertion 审核定位，不是泛化 link 地址。
- module path、heading 和 relation block heading 只提供定位上下文或宿主表面。
- assertion marker 第一版采用 `^a-*` 短 marker。
- block reference 只允许作为 assertion marker target，不泛化为普通 link。
- 当前不进入 CLI parser、format validator、全局 assertion ID 或全量 assertion marker。
