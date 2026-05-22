---
status: accepted
created: 2026-05-22
updated: 2026-05-23
owner: sayori
loop: 13
---

# semantic lint locator alignment review

## Purpose

本轮把 semantic-lint 的 signal instance 模型和修正后的 format / locator 口径对齐。

Loop 12 已确认：

- format 是 md module 在持续编辑中的形态保持契约。
- template 负责 0->1 的初始骨架；format 负责 1->2、2->3 的持续编辑不改坏 md 形态。
- locator 服务 assertion 审核定位。
- assertion marker 第一版采用 `^a-*` 短 marker。
- module path、heading 和 relation block heading 只是定位上下文或宿主表面。

因此 semantic-lint 不能继续把 locator 理解成泛化的 module / heading 地址，也不应等待某个额外 reading / facts layer 才能读取文档。

## Current Friction

当前 `.contexta` 中仍有旧口径痕迹：

- semantic-lint concept 里说 locator 指向位置。
- signal / trigger examples 中的 signal instance 仍写成 `path#Definition`。
- trigger concept 中说 trigger 在 locator 指向的位置观察文本、结构、frontmatter、path、heading 或 link。
- `semantic-signals.md` 的 signal definitions 还没有说明命中后如何落到 assertion marker。

这些内容在 Loop 8 / 9 当时成立，因为 locator 尚未完成。

Loop 13 初稿曾把问题写成“format surface 被读成 facts，再给 semantic-lint 消费”。这个方向不准确。

正确关系应是：

```text
template 生成 0->1
format 维持 1->2 / 2->3 的 md 形态
semantic-lint 直接消费 formatted md
locator 把 signal instance 指回 assertion marker
```

## Accepted Model

### Format Position

format 不是额外 facts layer。

format 也不是第一性语义来源。

format 也不是 template 的延伸。

template 负责新建 md module 时的 0->1 骨架。

format 负责 md module 已经生成之后，继续修改、扩写和维护时，保持文档形态不被改坏。

concept、policy、template、structure、relation、locator 已经定义了文档应该如何命名、约束、生成、组织、连接和定位。

format 的作用是形态保持：确保这些上层设计在持续编辑后，仍然呈现为 semantic-lint 可以直接消费的 formatted md。

因此 semantic-lint 消费的是 formatted md 本身，而不是 format 产出的中间 facts。

### Signal Definition

signal definition 仍然描述抽象 warning。

它不需要绑定某个具体 locator。

最小结构继续保持：

- Signal
- Trigger
- Why
- Source
- Inspection

但 Trigger 的含义需要更新：

- Trigger 直接检查 formatted md 中的稳定表面。
- Trigger 不等于 locator。
- Trigger 不能假设每个命中位置天然有 assertion marker。
- Trigger 可以使用 concept 定义的 magic words、frontmatter、path、H1、heading、section、OFM link 和 marker 等稳定形状。

### Signal Candidate

signal candidate 是 raw hit 之后、signal instance 之前的中间状态。

它表示：

- formatted md 中出现了可疑触发现象。
- 该现象可能对应某条 assertion。
- 但尚未确认能定位到具体 assertion marker。

signal candidate 可以使用 module path + heading 描述上下文，但这还不是最终 locator。

### Signal Instance

signal instance 是可以进入 review 或后续 CLI 输出的具体 warning。

第一版至少需要：

- Signal
- Locator
- Trigger
- Evidence
- Inspection

其中 Locator 应指向 assertion marker：

```md
Locator: [[mapping/bootstrap/modules/concept/locator#^a-def|locator definition]]
```

如果只能定位到 heading，而没有 assertion marker，它最多是 candidate，不应直接升级成 signal instance。

## Consumption Model

当前关系应读成：

```text
template -> md module
format -> maintained md shape
semantic-lint -> trigger -> signal candidate -> assertion marker -> signal instance
```

具体含义：

- concept / policy / template / structure / relation / locator 共同定义文档应如何成立。
- template 生成初始 md 骨架。
- format 在持续编辑中保持 md 形态。
- semantic-lint 直接消费 formatted md。
- trigger 在 formatted md 中检查可疑现象。
- signal candidate 记录“可能有语义偏移”。
- assertion marker 让目标 assertion 可定位。
- signal instance 使用 locator 指向 assertion marker。

## Example

### Raw Material

```md
## Definition

concept MUST define workflow behavior. ^a-def
```

### Candidate

```text
signal: concept-as-policy
context: mapping/bootstrap/modules/concept/concept.md#Definition
trigger: section contains MUST
evidence: concept MUST define workflow behavior.
```

这是 candidate，因为它说明了可疑上下文和触发现象。

### Instance

```text
signal: concept-as-policy
locator: [[mapping/bootstrap/modules/concept/concept#^a-def|concept definition]]
trigger: section contains MUST
evidence: concept MUST define workflow behavior.
inspection: 检查 Definition 是否仍在命名和界定。
```

这是 signal instance，因为 locator 指向了 assertion marker。

## Boundary

### semantic-lint vs locator

semantic-lint 命名和组织 warning。

locator 不判断 warning 是否成立，只让被检查的 assertion 可以被定位。

### trigger vs locator

trigger 直接检查 formatted md。

locator 指向 assertion marker。

trigger 可以在 section 中发现 raw hit，但不能把 section 当作 assertion locator。

### format vs semantic-lint

format 在持续编辑中保持 md 形态，使 md 能被 semantic-lint 直接消费。

semantic-lint 消费 formatted md，产生 warning。

format 不产出中间 facts，也不替 semantic-lint 判断语义偏移。

### format vs template

template 负责 0->1 的初始骨架。

format 负责 1->2、2->3 的持续编辑不改坏 md 形态。

format 不是另一个 template。

### candidate vs instance

candidate 是可疑命中。

instance 是已经拥有 assertion locator 的具体 warning。

第一版不要求所有 raw hit 都能变成 instance。

### locator missing

如果 candidate 找不到 assertion marker，当前不自动发明 marker。

它应该保留为 candidate，或者进入人工 review 后再决定是否加 marker。

## Accepted Landing

本轮已落地：

- 修订 `.contexta/mapping/bootstrap/modules/concept/format.md`，将 format 定义为持续编辑中的形态保持契约。
- 修订 `.contexta/mapping/bootstrap/modules/concept/semantic-lint.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/signal.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/trigger.md`。
- 修订 `.contexta/mapping/bootstrap/lint/semantic-signals.md` 的说明层，不改造成 CLI spec。
- 修订 `semantic-lint-instance-dry-run.md`，把 heading locator 改成 candidate context，把 assertion marker locator 作为 instance 条件。

当前不落地：

- CLI parser。
- 自动补 marker。
- severity。
- 全量 signal instance fixture。
- 对所有现有 assertion 加 `^a-*`。
- 新增 reading / facts layer。

## Review Questions

- 已接受：format 是 1->2、2->3 持续编辑中的形态保持契约。
- 已接受：semantic-lint 直接消费 formatted md。
- 已接受：不新增 reading / facts layer。
- 已接受：trigger 检查 formatted md，locator 指向 assertion marker。
- 已接受：signal candidate 与 signal instance 的差别继续保留。
- 已接受：没有 assertion marker 的命中只能是 candidate，不能直接成为 instance。
- 已接受：本轮只修正相关文档口径，不进入 CLI 实现。
