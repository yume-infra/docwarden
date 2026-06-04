---
status: accepted
created: 2026-06-04
source: user alignment loop
---

# Accepted Isomorph Structure Definition

## Lead

`apps/isomorph` 的理论材料应按 isomorph 的能力闭环组织，而不是按旧文件形态、runtime 行为、CLI 动作或当前目录残留分类。

已确认的顶层概念：

```text
language
framework
contract
loop
```

## First Principles

用户使用 isomorph 的根本目标不是获得一份中央词表，也不是安装一组固定 skill。

用户要在自己的 codebase 中定义、使用、检查、修正一套属于该项目或用户的 semantic framework，让这套语义体系持续影响 agent 的判断、生成、review 和后续 materialization。

因此，顶层结构必须先表达这条能力链：

```text
定义语义语言
  -> 建构用户 framework
  -> 进入 agent 使用面
  -> 通过持续反馈修正
```

## Concepts

### language

`language` 是 isomorph 的上级语义语言。

它负责建构、表达、识别和检查 semantic framework。

它不拥有具体领域理论，不拥有用户 vocabulary，不拥有 docwarden workflow vocabulary，不拥有 skill authoring concrete material。

它回答：

- 什么 semantic object 能成立。
- semantic object 如何表达、组合、识别和约束。
- 什么写法表示 relation、boundary、example、loss model 或 drift。
- recognition、semantic-lint、structure 等机制如何读取 semantic material。

已确认的组成能力：

```text
primitive
grammar
recognition
semantic-lint
structure
```

这些名字先表示 `language` 的组成能力，不直接承诺最终目录深度。

现有 md 内容不能按旧路径机械搬迁到这些名字下面。必须逐个按职责重新分类：

- 描述“什么语义对象能成立”的内容进入 `primitive`。
- 描述“对象如何被表达、组合、约束和判断”的内容进入 `grammar`。
- 描述“如何从 surface 识别 semantic role”的内容进入 `recognition`。
- 描述“如何检测 drift、生成 signal、进入 review”的内容进入 `semantic-lint`。
- 描述“多个语义位置如何共同成立”的内容进入 `structure`。

当前风险不是假设所有 md 都需要大量拆分。既有材料中很多 md 已经按单一职责写成 module。

本轮重点是分类归属必须正确：一个职责清楚的 md 如果落在错误能力层，仍然会让 isomorph 的能力模型失真。

只有当某个 md 实际同时承担 concept definition、policy、example、runtime note、dogfood history 或 projection 说明时，才需要拆分或重写。

### framework

`framework` 是用户或项目拥有的 semantic framework instance。

它承载 framework vocabulary，但不等同于 vocabulary。

它回答：

- 用户在这个 framework 中关心哪些 term。
- 这些 term、alias、intent、failure mode 如何进入 recognition、magic-word、semantic-lint、review 和 usage contract。
- framework 内部有哪些 relation、boundary、loss model、example、counterexample 和 quality signal。
- 哪些用法会造成语义漂移。

`vocabulary` 是 `framework` 的 naming surface，不是 `apps/isomorph` 的顶层目录。

### contract

`contract` 是 semantic framework 进入 agent 工作流的 usage contract。

它回答：

- 什么时候激活某个 framework。
- agent 读到什么时应该使用它。
- 生成内容时要遵守什么。
- review 时要检查什么。
- 不确定时要问什么。
- framework 如何暴露为 agent-facing shape。

`skill-primitive` 属于这里：它是 usage contract 的一种 agent-facing / exportable 形态，不是 isomorph core 的中心，也不拥有 concrete skill material。

### loop

`loop` 是让 semantic framework 持续使用、检查和修正的 feedback loop。

它回答：

- agent 如何使用 framework。
- 用户纠正、semantic-lint signal、recognition mismatch 或 dogfood failure 如何进入系统。
- correction 如何 route 成 signal、candidate assertion、framework update、contract update 或 materialization fix。
- candidate update 如何被组织成 lead + backing。
- 用户确认后如何写回 framework 或 contract。
- 下一次 agent 使用时如何生效。

## Path And Kind

已确认有两套体系需要同时保留，但不能混成同一个目录层级：

```text
path = ability ownership
kind = content language
```

路径表达这个 md 服务 isomorph 能力闭环中的哪个能力位置：

```text
language
framework
contract
loop
```

`kind` 表达这个 md 的正文按哪种内容语言读取：

```text
concept
policy
relation
pipeline
workflow
signal
template
```

因此，分类时不能只看 `kind`，也不能只看旧路径。

Examples:

- `kind: concept` 的 `concept` 定义属于 `language/primitive`。
- `kind: concept` 的 `vocabulary` 定义也可以属于 `language/primitive`，但具体 vocabulary instance 属于 `framework`。
- `kind: pipeline` 的 semantic-lint pipeline 属于 `language/semantic-lint`，不是 generic grammar bucket。
- `kind: signal` 的 `concept-as-policy` 属于 `language/semantic-lint/signal`。
- `kind: policy` 的 `skill-primitive-boundary` 属于 `contract`，不是 `language/grammar`。
- `kind: skill-primitive` 的 skill-primitive template 属于 `contract`，不是 root language。
- `kind: workflow` 的 docwarden review workflow 不属于 isomorph 自身，后续应回到 docwarden-owned framework / usage layer。
- `kind: concept` 的 user-context 不属于 isomorph 自身，后续应回到 contexta-owned layer。

This resolves the apparent two-system conflict: ability paths answer ownership and capability; `kind` answers markdown reading protocol.

## Naming Rules

目录层级表达 scope。已经位于 `apps/isomorph` 下时，不再使用 `isomorph-source` 这种重复 scope 名。

目录名必须直接使用当前体系中的概念名。不要用 `core` 这类泛名替代 `primitive`、`language`、`framework` 等已确认概念。

如果一个结构出现 `primitive/primitives`、`vocabulary` 顶层又在内部出现 vocabulary 这类重复，说明层级错误，应全量调整，而不是局部改名。

## Rejected Previous Landing

当前 `apps/isomorph/isomorph-source/{basis,bootstrap,init}` 是失败落地，不作为后续实现依据。

拒绝原因：

- `isomorph-source` 重复了 `apps/isomorph` 的 scope。
- `basis` 不是用户认可的体系概念，且遮蔽了 `language / primitive / grammar` 的真实关系。
- 新层级下没有 `bootstrap`；原 bootstrap 把 isomorph 自身实践、下游 framework、authoring surface 和 dogfood material 混成垃圾桶。
- `init` 是 CLI 动作，不是用户 `.isomorph` 的概念本体。
- `project` 只是发生地点，不是用户获得的语义能力。
- `vocabulary` 不应成为顶层；它是 semantic framework 的 naming surface。

## Implementation Guard

后续实现必须从这四个顶层概念重新推导目录和 runtime model。

不要围绕旧 `basis/bootstrap/init` 结构做兼容、迁移垫片或局部修补。

不要为了旧测试保留错误模型。测试应改为验证：

- `language` 不拥有用户 domain framework。
- `framework` 承载用户 semantic framework instance。
- `contract` 承接 agent-use surface。
- `loop` 承接 correction -> candidate assertion -> lead-review -> accepted update。

迁移验收不是保留旧 md 数量，也不是追求无差别拆文件；迁移验收是每个长期 md 的职责与所属能力层一致。

Nested directories are not accepted in this file. They must be derived in the next alignment pass from the four accepted top-level concepts.

## Implementation Landing

Accepted implementation landing:

```text
apps/isomorph/language
apps/isomorph/framework
apps/isomorph/contract
apps/isomorph/loop
```

`apps/isomorph/isomorph-source/{basis,bootstrap,init}` has been removed from the implementation model.

`isomorph init` does not read an `init` source layer. It writes CLI-owned seed material into user `.isomorph` and pins package authority separately.

The pinned package authority is loaded from the four accepted source abilities. Local user material may override matching package paths, but rejected ability names are not compatibility aliases.

Removed from isomorph package source authority:

- old docwarden semantic framework samples;
- old contexta user-context samples;
- old `init/README.md` layer;
- old `concrete-skill-primitive-under-root` and `project-framework-owned-by-root-isomorph` signal identities.

Permanent replacement signal identities:

- `concrete-skill-contract-under-language`
- `framework-owned-by-language`
