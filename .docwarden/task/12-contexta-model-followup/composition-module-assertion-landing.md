---
status: accepted
created: 2026-05-21
updated: 2026-05-22
owner: sayori
loop: 1
---

# composition / module / assertion landing

本文件是 task 12 Loop 1 的最小 review 单元，已通过审核并落地到 `.contexta`。

本版修正前一版错误：不再把 module 理解成“只有由多条 assertion 组合出来的语义对象”，也不再把 assertion 误写成文件、独立资产或完整 locator 机制。

## 当前纠正

sayori 明确纠正：

- module 实际上就是 file scope。
- 只要是一个 md，在当前 contexta / docwarden 描述系统里都属于 module。
- 当前描述文件都以 md 形式存在，因此它们都天然是 module。
- assertion 需要保留可定位性，但当前不应被写成文件、独立资产或完整 locator 机制。
- 后续可以通过更多标识让 assertion 成为稳定 locator。
- composition 是 structure 的一种，用来定义当前 module 和 assertion 的关系。

上一版错误：

- 把 module 过度抽象成需要由 composition 解释后才成立的组合对象。
- 把 composition 是否成为每个 module 的显式外壳当成候选判断；这个问题不是当前理论里自然出现的点。
- 把 assertion 写成 `module path + heading path + assertion text` 的完整 review identity；这过早混入了 docwarden review / locator 机制。

## 当前已有设计

已确认：

- `module` 是 md file scope。
- 当前所有 `.md` 描述文件都可视为 module。
- `assertion` 是 module 内部的最小可审查语义单元。
- `composition` 是由 whole / part / stable semantic boundary 三个位置共同成立的组合表达。
- `composition` 是 structure 的一种。
- 当前 module / assertion 的关系由 composition 定义。
- `module` 不是 `kind: module`。
- `assertion` 不默认独立成文件。
- template 不管理 assertion 生命周期。

当前 `.contexta` 已有：

- `.contexta/mapping/bootstrap/modules/concept/structure/composition.md`
- `.contexta/mapping/bootstrap/modules/concept/module.md`
- `.contexta/mapping/bootstrap/modules/concept/assertion.md`
- `.contexta/mapping/bootstrap/templates/composition.md`

## 当前真正缺口

当前缺口不是 module 是否有长期落点。

module 的落点已经由 md 文件天然给出：

```text
<some-file>.md
```

当前真正缺口是：

- 如何把 module 定义为 file scope，而不是只定义为抽象语义组合单元。
- 如何说明 assertion 是 file scope 内部的最小语义判断，而不是独立资产。
- 如何说明 composition 作为 structure subtype 定义 module / assertion 的关系。
- 如何保留 assertion 的可定位性，而不把 assertion 写成文件、独立资产或完整 locator 机制。

## 修正后的候选判断

### 1. module 是 md file scope

module 应先定义为 file scope。

在当前系统中，只要一个描述对象以 md 文件存在，它就是一个 module。

因此：

- `.contexta/mapping/bootstrap/modules/concept/module.md` 是 module。
- `.contexta/mapping/bootstrap/modules/policy/semantic-granularity.md` 是 module。
- `.docwarden/task/12-contexta-model-followup/plan.md` 也是 task material layer 里的 module。

这里的 module 不等于 `kind: module`。

`kind` 表达该 md module 的内容类型或内容语言，例如：

- concept
- policy
- pipeline
- workflow

`module` 表达它作为 md 文件范围的内容单元。

### 2. assertion 是 module 内的最小可审查语义单元

assertion 不是文件，不是 frontmatter，不是全局 ID，也不是 locator。

assertion 是 module 内部能被单独接受、拒绝、修改、引用、检查或迁移的最小语义判断。

assertion 可以出现在：

- 一条 rule 中。
- 一段 definition 中。
- 一个 delimitation 单元中。
- 一个 example 的判断说明中。

assertion 的核心不是它的文本形态，而是它是否表达了一个可单独审查的语义判断。

### 3. composition 定义 module / assertion 的关系，但不定义 module 的成立条件

composition 是 structure 的一种。

在当前问题里，composition 用来定义 module 和 assertion 的关系：

- module 作为 whole。
- assertion 作为 part。
- stable semantic boundary 判断哪些 assertion 应共同归入同一个 module。

但 module 不需要先被 composition 证明才成立。

module 的第一性定义是 md file scope。

composition 定义的是 module / assertion 的 part-whole 关系，不是把 module 改造成 `kind: composition` 的文件实例。

### 4. assertion 应保留 locator 能力，但不等于 locator 机制

上一版写的：

```text
module path + heading path + assertion text
```

不应作为 assertion 当前的完整定义。

但 assertion 的设计应该保留可定位性。

原因是 assertion 既然是最小可审查语义单元，后续 review、trace、lint、引用或迁移都需要能够定位到它。

当前判断：

- assertion 不是文件。
- assertion 不是独立资产。
- assertion 不是 frontmatter。
- assertion 不是全局 ID。
- assertion 当前也不是完整 locator 机制。
- assertion 是未来应该能够被 locator 指向的语义单位。

在 contexta 里，assertion 只需要说明：

- 它是 module 内的最小可审查语义单元。
- 它具有后续成为 locator target 的需求。
- 它不默认独立成文件。
- 它不默认拥有独立 lifecycle。
- 它不等同于句子、列表项或 heading。

后续如果定位稳定性不足，可以在 locator / identifier 设计中为 assertion 增加更多标识。

## 候选落地改动

本轮已落地的最小改动：

- 修订 `.contexta/mapping/bootstrap/modules/concept/module.md`：把 module 明确为 md file scope。
- 修订 `.contexta/mapping/bootstrap/modules/concept/assertion.md`：强调 assertion 是 module 内部最小语义判断，并保留后续成为 locator target 的需求。
- 修订 `.contexta/mapping/bootstrap/modules/concept/structure/composition.md`：说明 composition 是 structure subtype，并定义 module / assertion 的 part-whole 关系，但不定义 module 的成立条件。
- 同步 `.contexta/mapping/bootstrap/modules/concept/concept.md`、`.contexta/mapping/bootstrap/modules/concept/example.md`、`.contexta/mapping/bootstrap/modules/concept/structure.md` 中对 module 的旧描述。
- 暂不新增 assertion 文件、独立资产、ID、frontmatter 或完整 locator 机制。
- 暂不修改 `.contexta/mapping/bootstrap/templates/` 的 `kind` 设计，留给 Loop 2 / Loop 3。

## 待审核点

需要 sayori 审核：

1. module 是否应直接定义为 md file scope。
2. 是否应明确“当前所有 md 描述文件都是 module”。
3. assertion 是否应定义为 module 内部最小可审查语义判断，并保留后续成为 locator target 的需求。
4. assertion 当前是否不应被写成文件、独立资产、frontmatter、全局 ID 或完整 locator 机制。
5. composition 是否应作为 structure subtype 定义 module / assertion 的 part-whole 关系，但不作为 module 的成立前提。
