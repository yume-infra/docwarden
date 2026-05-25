---
status: accepted
created: 2026-05-23
updated: 2026-05-25
owner: sayori
loop: 14
---

# naming magic word consumption review

## Purpose

本轮设计 semantic-lint 如何直接消费 formatted md 中的稳定名称。

Loop 13 已确认：

- format 是 1->2、2->3 持续编辑中的 md 形态保持契约。
- semantic-lint 直接消费 formatted md。
- 不新增 reading / facts layer。
- signal instance 的 locator 指向 `^a-*` assertion marker。

因此下一步需要明确：

```text
哪些 md 中的词可以被 semantic-lint 当作稳定 token 消费？
```

## Current Baseline

当前已成立：

- concept 是命名语言。
- naming 让名称成为语义定位入口。
- naming policy 已规定 filename、H1、canonical designation 的一致性。
- kind 是 frontmatter 中的 content language entry。
- format 保持 path、frontmatter、H1、heading、section、OFM link、marker 等 md 形态。
- semantic-lint 直接检查 formatted md。

当前缺口：

- `Canonical` / `Aliases` / `Avoid` 的 lint 消费方式尚未明确。
- filename stem、H1、frontmatter.kind、path segment、heading 是否都叫 magic word 尚未区分。
- semantic-lint 可以使用哪些稳定 token，哪些只能作为上下文或 trigger surface，尚未定义。

## First Principle

本轮初稿认为不应新增独立 `magic-word` concept。

sayori 纠正：

- md 单一职责优先于不要提前抽象。

修正后判断：

- magic-word 需要作为独立 concept 存在。
- 它不是新本体层级，而是把 token consumption 角色从 naming / semantic-lint signals 中抽出来。
- naming 保持名称形成与稳定的单一职责。
- magic-word 负责 primary magic word、fallback token、negative token 和 control magic word 的分层。

因此本轮设计的是：

```text
naming -> stable names
magic-word -> consumable token roles
semantic-lint -> consumes formatted md
```

## Candidate Model

### Consumable Token

consumable token 是 semantic-lint 可以在 formatted md 中直接识别的稳定词或稳定结构值。

它不是中间 facts。

它仍然存在于 md 文档本身。

semantic-lint 直接消费它。

### Primary Magic Word

primary magic word 是由 contexta 稳定命名、可被 semantic-lint 直接消费的控制性英文锚点。

concept naming 中，第一版只把以下内容视为 primary magic word：

- concept `Canonical`

例如：

```md
Canonical: `locator`
```

`locator` 是 primary magic word。

### Fallback Token

`Aliases` 是 fallback token，不是 primary magic word。

它可以辅助识别，但置信度低于 `Canonical`，且需要上下文支持。

例如：

```md
Canonical: `locator`

Aliases:

- semantic locator
```

`semantic locator` 可以作为 fallback token。它能帮助识别 `locator`，但不能像 `locator` 一样单独成为强判断锚点。

### Negative Token

`Avoid` 不是 alias，也不是 magic word。

它是容易误导的命名项，可以作为 lint trigger 的观察对象。

例如：

```md
Avoid:

- style
- label
- decoration
```

这些词出现时不应被当作 `naming` 的同义词，只能作为“可能误称”的 trigger pressure。

### Naming Surface

filename stem、H1、concept Canonical 应保持一致。

它们是 naming surface。

例如：

```text
path: mapping/bootstrap/modules/concept/locator.md
H1: locator
Canonical: locator
```

semantic-lint 可以检查这些 surface 是否一致。

这不是因为 path / H1 自己创造语义，而是因为 naming policy 已经赋予它们语义定位职责。

### Format-Maintained Surface

frontmatter、heading、section、OFM link、assertion marker 是 format 保持的 md 形态。

它们不全是 magic word。

例如：

- `kind` 是 frontmatter field。
- `Definition` 是稳定 heading。
- `^a-def` 是 assertion marker。
- `[[path|alias]]` 是 OFM path alias link。

semantic-lint 可以消费这些稳定形态，但不应把它们都归类为 concept magic word。

### Other Control Magic Words

除了 concept naming 的 primary magic word，contexta 中还有其他强控制性 magic words。

它们不是 concept `Canonical` 产生的 magic word，但同样会改变读取方式、判断方式或定位方式：

- confirmed `kind` value，例如 `concept`、`policy`、`semantic-lint`。
- semantic-lint signal id，例如 `concept-as-policy`。
- policy modal operator，例如 `MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY`。
- locator marker prefix，例如 `a-` in `^a-def`。

这些词应被 semantic-lint 直接消费，但需要按各自来源解释，不能全部归到 concept naming。

## Consumption Rules Candidate

第一版可以这样读：

- concept `Canonical` MUST be the primary magic word.
- concept `Aliases` MAY be fallback tokens when they can reasonably point to the same concept.
- alias hit MUST have lower confidence than canonical hit.
- `Avoid` MUST NOT be treated as magic word.
- `Avoid` MAY be consumed as negative token.
- confirmed `kind` value MAY be consumed as content language control word.
- semantic-lint signal id MAY be consumed as lint control word.
- policy modal operator MAY be consumed as policy control word.
- locator marker prefix `a-` MAY be consumed as locator control word.
- filename stem / H1 / Canonical SHOULD remain aligned for concept modules.
- frontmatter `kind` value SHOULD be checked against known content language entries.
- stable headings MAY be consumed as format-maintained surfaces.
- assertion marker `^a-*` MAY be consumed as locator target marker.
- path segment MAY provide context, but SHOULD NOT create new concept meaning by itself.

## Example

### Raw Material

```md
---
kind: concept
---

# locator

## Designation

Canonical: `locator`

Aliases:

- semantic locator

## Definition

locator 是服务 assertion 审核的定位机制。 ^a-def
```

### Consumption

```text
primary magic word:
- locator

fallback token:
- semantic locator

naming surface:
- path stem: locator
- H1: locator
- Canonical: locator

format-maintained surface:
- frontmatter.kind
- heading: Designation
- heading: Definition
- assertion marker: ^a-def

other control magic words:
- kind value: concept
- locator prefix: a-
```

### Candidate Signal

如果文件名是 `semantic-location.md`，H1 是 `locator`，Canonical 是 `locator`：

```text
signal candidate: naming-surface-drift
context: mapping/bootstrap/modules/concept/semantic-location.md#Designation
trigger: filename stem != H1 or Canonical
```

如果该 assertion 有 marker，才升级为 signal instance。

## Boundary

### magic word vs concept

magic word 不是 concept。

concept 定义 semantic object。

primary magic word 是 concept canonical naming 在 semantic-lint 消费中的稳定 token。

alias 只是 fallback token。

### magic word vs format

format 保持 md 形态。

magic word 是其中一种可被 semantic-lint 识别的命名 token。

format 还保持 frontmatter、heading、link 和 marker；这些不都叫 magic word。

### magic word vs kind

`kind` 是 frontmatter field。

`kind` value 可以被 semantic-lint 检查是否指向已知 content language entry。

但 `kind` field 本身不是 concept magic word。

### alias vs avoid

alias 可以合理指向同一个 concept，但只是 fallback token。

avoid 记录容易误导的 designation。

semantic-lint 可以消费 avoid 作为 warning trigger，但不能把 avoid 当作同义词。

### concept magic word vs control magic word

concept `Canonical` 产生 concept-level primary magic word。

`kind` value、signal id、policy modal 和 locator prefix 是各自机制中的 control magic words。

它们都可以被 semantic-lint 直接消费，但来源不同，不能合并成同一种命名规则。

## Accepted Landing

本轮已落地：

- 新增 `.contexta/mapping/bootstrap/modules/concept/magic-word.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/naming.md`。
- 修订 `.contexta/mapping/bootstrap/modules/policy/naming.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/concept.md`。
- 修订 `.contexta/mapping/bootstrap/modules/signal/*.md` 的说明层。

当前不落地：

- 独立 glossary / lexicon 文件。
- 自动生成词表。
- CLI parser。
- 全量扫描所有 concept 的 naming 一致性。
- `naming-surface-drift` signal definition。

## Review Questions

- 已接受：magic-word 作为独立 concept 存在，以维护 md 单一职责。
- 已接受：concept `Canonical` 是 primary magic word。
- 已接受：`Aliases` 只是 fallback token，置信度低于 canonical。
- 已接受：`Avoid` 是 negative token，只能触发 warning pressure，不能当 alias。
- 已接受：`kind` value、signal id、policy modal、locator prefix 是其他机制中的 control magic words。
- 已接受：filename stem / H1 / Canonical 是 naming surface，而 frontmatter / heading / link / marker 是 format-maintained surface。
- 本轮暂不新增 `naming-surface-drift` signal definition。
