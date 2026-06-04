# User Position

> 记录来源：2026-06-03 与 sayori 关于 isomorph、contexta、docwarden、skill-primitive 和分层架构的讨论。
> 2026-06-04 补充：isomorph 的 root primitives 被重新确认为 bootstrap primitives；用户或项目自己的体系命名为 semantic framework。
>
> 本文记录用户最终口径（不保留兼容迁移层，不保留中间状态口径）。

## Goal

用户希望定义一套属于自己的语言体系。

与 agent 交流时，目标是从原本的：

```text
语言 -> agent
```

转变为：

```text
语言 -> DSL -> agent
```

后续交流中，如果 agent 命中用户的 magic word，或通过 skill 建设加载相关语义，agent 应更稳定地理解用户真实意思。

## Isomorph

`isomorph` 是 bootstrap semantic authority。

它的目标不是预先定义某个项目的全部语义，而是提供建构 semantic framework 所需的最小元语言和 agent-use 能力。

root primitives 是 isomorph 的自举层。它们始终成立，因为它们描述的是语义对象、命名、关系、basis、grammar、signal、loss 和 export shape 如何成立，而不是 docwarden 或其他项目的领域词。

用户或项目自己的体系应命名为 `semantic framework`。`vocabulary` 是 semantic framework 的命名表面；领域可以通过 vocabulary、magic word 和 trigger phrase 让 agent 更稳定地理解 intent 与 failure mode。

`skill-primitive` 属于 `isomorph` 语境。它更像写 skill 时可复用的理论词表，不是模板库。

当前需要反思 `mapping` 设计。`mapping` 原来的问题是因果倒置：不是在 `isomorph` 里定义 docwarden，而是 docwarden 需要建构自己的 semantic framework，然后借用 `isomorph` 的能力。`isomorph` 可以定义 `mapping` 作为 semantic relation，但不应承担 docwarden、contexta 或 runtime artifact 的 mapping authority。

## Contexta

`contexta` 的目标是统一管理用户自己的 agent context。

用户希望维护一套自己的 skill 和 workflow，但范围不止 skill，还包括：

- user 画像
- prompt
- agents
- hooks
- workflow
- 其他 agent 可消费上下文资产

用户不希望这些资产散落在全局目录下，而是放在一个统一位置。

`contexta` 应实现分发能力的 CLI，用于管理和分发这些 agent context 资产。

`contexta` 这个名字来自对 agent 上下文的统一管理与分发需求。

`contexta` 与 `isomorph` 的关系是：`isomorph` 可以提供 `skill-primitive` 能力，为 contexta 中的 skill / prompt / workflow 等上下文资产提供语义帮助，让这些上下文承接已定义的语义。

后续讨论确认：`contexta` 的 source asset 应放在 `.contexta/`。它不采用全局 type-first 的纯分散结构，也不采用含义混杂的 `families/` 结构，而采用 pack-first。

pack 表示一组共同服务某个能力、工作流或产品语境的上下文资产；pack 内再展开 skills、prompts、agents、hooks、workflows、profiles 和 references。

`dw`、`iso`、`ym` 这类标识是 namespace，不是 family 层。

## Docwarden

`docwarden` 是 `docs/` 中文档体系理论的实现。

用户期望 `docwarden` 是一个和具体 workflow 无关的文档管理机制。实现后，它应可以被引入任何项目，利用项目已有资产，维护出属于该项目自己的文档体系。

`docwarden` 应拥有自己的 semantic framework。它与 `isomorph` 的关系来自文档维护过程中会遇到语义识别和 semantic-lint 问题。`isomorph` 提供 bootstrap、recognition、lint 和 export shape 能力，`docwarden` 可以借用这些能力定义并检查自己的文档语义。

`docwarden` 与 `contexta` 的关系相对较弱，但仍然存在。`docwarden` 后续也会设计成一套 skill 模式 + CLI。对 `dw:` skill 族来说，`contexta` 最好可以作为分发引擎，负责分发 docwarden 相关 skill 资产。

后续讨论确认：当前不需要引入 `docwarden/adoption/bindings/` 作为外层目录。`docwarden` 在本轮架构中应作为拥有自己 semantic framework 的 consumer：借用 `isomorph` 的能力，必要时通过 `contexta` 分发自己的 context pack。

## Resolved Decisions

- `mapping` 不继续作为 `.isomorph` 的主目录职责。
- `semantic framework` 是用户或项目自定义语义体系的正式命名。
- root primitives 是 isomorph bootstrap primitives，不是 docwarden 或其他项目的领域词表。
- docwarden 应拥有自己的 semantic framework，而不是被 root `.isomorph` 定义。
- `.isomorph/mapping/**` 应迁移为 primitives、grammars、lint、exports 等更明确的语义目录。
- `contexta` 的资产源是 `.contexta/`。
- `.contexta` 采用 pack-first，而不是全局 type-first 或 `families/`。
- 原有 `contexta capability`、`contexta catalog`、`contexta install`、`contexta activation`、`contexta asset` 命令应移除，不保留 alias。
- 当前不创建 `docwarden/adoption/bindings/`。
- `contexta` asset 的组织采用三层语义：`namespace`（`dw`、`iso`、`ym`）+ `pack`（业务语境）+ `asset kind`（skill / prompt / agent / hook / workflow / profile / reference）。
- `Codex` 是本轮唯一 runtime 目标，projection/export 只实现 `contexta export codex` 与其 materialization 逻辑，不做其他兼容桥接。
- 本轮明确不保留 compatibility mode，不保留旧架构映射的 shadow behavior。
- 当前 agent-use contract 可暂定为 `recognize -> basis -> loss -> export shape`，但该层是 working contract，后续允许重新设计。

## Current Carryover

- `.isomorph/mapping/**` 的 canonical 归属已由本轮迁移实施移入 `.isomorph/primitives`、`.isomorph/grammars`、`.isomorph/lint`、`.isomorph/exports`。
- `.contexta/packs/**/contexta.yaml`、`contexta export codex` 覆盖范围、`docwarden` 对 isomorph/contexta 的消费边界，均按对应 practice 文档的最终验收清单落地并在 merge 时复核。
- docwarden semantic framework 的 canonical source 尚未在本文件中定稿；当前只确认它不应由 root `.isomorph` 反向定义。
- agent-use 层当前只保留 working contract，后续会重新设计。
