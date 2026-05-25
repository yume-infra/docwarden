---
status: draft
created: 2026-05-20
updated: 2026-05-25
owner: sayori
---

# contexta model followup

本 task 目录承接 task 11 归档后仍需继续推进的 contexta 模型缺口。

## 边界

- 本目录是对话产生的 task material。
- 本任务处理 contexta 模型后续补全，不处理 docwarden workflow 编排。
- 本任务可以在用户确认后修改 `.contexta/`。
- 本任务不写入 `.docwarden/spec/`、`.docwarden/guide/`、`.docwarden/wiki/`。
- 本任务不修改 `docs/`。

## 来源基线

- `.docwarden/archive/task/11-contexta-content-type-constraints/`
- `.docwarden/archive/task/11-contexta-content-type-constraints/contexta-architecture-baseline.md`
- `.docwarden/archive/task/09-promote-pick-entity-landing/frontmatter-field-boundary.md`
- `.contexta/mapping/bootstrap/modules/concept/structure/composition.md`
- `.contexta/mapping/bootstrap/templates/composition.md`

## 当前判断

- task 11 已归档，当前 active task 切换到本目录。
- composition 已作为 structure subtype 落地，且已用于定义当前 module / assertion 的 part-whole 关系。
- module 已明确为 md file scope。
- assertion 已明确为 module 内部最小可审查语义判断，并保留后续成为 locator target 的需求。
- `kind` 应表达内容类型；docwarden operation metadata 应表达 workflow 维护状态。
- template 只应服务已成立的内容语言骨架，不应制造伪 kind。
- contexta 目录第一层应表达 mapping 关系，区分 bootstrap mapping 和 docwarden mapping。
- Delimitation 只保留关键边界压力；contexta 自己的 relation 后续应进入 bootstrap mapping 下的独立 relation layer。
- contexta 内部连接只使用 OFM path alias，不使用短 link。
- semantic-lint 是检测语言；其当前执行链路已初步拆为 `structures/pipeline` 下的 pipeline structure。
- semantic lint instance 需要经过 `raw hit -> candidate -> signal instance`，不能把 raw scan 直接当成实例。
- semantic lint instance dry run 当前作为后续 CLI lint engine 的具体参照物，不追求一次完整。
- contexta 当前进入 theory stabilization 到 practice reference 的阶段，尚未进入 CLI implementation。
- contexta 需要补上 format / locator 基础层，作为后续 semantic lint CLI 的可寻址前提。
- format 当前已修正为 md module 在持续编辑中的形态保持契约。
- locator 当前修正为服务 assertion 审核的定位机制，而不是泛化 link 地址。
- module / section / relation block 是 locator 的上下文或宿主表面，不是 locator 的核心定义。
- assertion marker 当前采用 `^a-*` 短 block reference target + OFM path alias link 的组合候选。
- Loop 12 format / locator 基础层已收口，当前不进入 CLI parser 或全量 assertion marker。
- Loop 13 已完成 semantic-lint 与 format / locator 对齐：format 保持 1->2、2->3 的 md 形态，semantic-lint 直接消费 formatted md，signal instance locator 指向 assertion marker。
- Loop 14 已完成 naming / magic-word 消费口径：magic-word 作为独立 concept 维护 token consumption 分层；Canonical 是 primary magic word，Aliases 是 fallback token，Avoid 是 negative token。
- Loop 15 已初步拆出 semantic-lint pipeline structure：concept 留在 `modules/concept`，具体 signal definitions 进入 `modules/signal`，运行链路进入 `structures/pipeline`。
- example 已被修正为样本语言，不是 kind、role、template kind 或 directory kind。
- `example-quality` 当前只是临时质量提示，未来需要真实使用反馈再抽象。
- semantic lint 后续需要继续从实际误用中扩展可审查信号。

## 内容

- `plan.md`：本任务 loop 计划。
- `log.md`：任务建立和后续循环进展的时间线记录。
- `composition-module-assertion-landing.md`：Loop 1 composition / module / assertion 落地记录。
- `kind-metadata-boundary.md`：Loop 2 kind / metadata 边界落地记录。
- `relation-delimitation-boundary.md`：Loop 2 relation / delimitation 分工记录。
- `template-skeleton-review.md`：Loop 3 template 骨架审查落地记录。
- `mapping-layer-review.md`：Loop 4 mapping layer 落地记录。
- `delimitation-narrowing-review.md`：Loop 5 Delimitation 收窄记录。
- `relation-content-model-review.md`：Loop 6 relation content 建模审查材料。
- `ofm-link-resolution-review.md`：Loop 7 OFM link resolution 审查材料。
- `semantic-lint-signal-review.md`：Loop 8 semantic lint 误用信号审查材料。
- `semantic-lint-instance-dry-run.md`：Loop 9 semantic lint 实例干跑审查材料。
- `theory-practice-implementation-boundary.md`：Loop 10 theory / practice reference / implementation 边界审查材料。
- `format-locator-foundation-review.md`：Loop 12 format / locator 基础层审查材料。
- `semantic-lint-locator-alignment-review.md`：Loop 13 semantic lint / locator 对齐审查材料。
- `naming-magic-word-consumption-review.md`：Loop 14 naming / magic word 消费口径审查材料。
- `semantic-lint-pipeline-structure-review.md`：Loop 15 semantic-lint pipeline structure 拆分审查材料。

## 下一步

Loop 15 已落地初版：等待确认 `modules/signal` 与 `structures/pipeline` 拆分口径，并继续区分后续 structure instance。
