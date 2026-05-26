---
status: accepted
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 6
---

# relation content model review

本文件是 task 12 Loop 6 的最小 review 单元。

目标是设计 contexta bootstrap relation layer 中具体 relation 内容应该如何建模。

## 当前已有设计

已确认：

- Delimitation 只处理局部边界压力。
- relation 处理 concept network 中的稳定连接。
- contexta 自己的 relation 应放在 bootstrap mapping 下的独立 relation layer。
- relation concept / policy 只定义 relation 语言和边界，不承载具体 relation network。

当前层级应区分：

```text
.contexta/mapping/bootstrap/modules/concept/relation.md
  定义 relation 是什么。

.contexta/mapping/bootstrap/modules/policy/relation.md
  约束 relation 如何使用。

.contexta/mapping/bootstrap/relations/*.md
  承载具体 contexta bootstrap concept network。
```

## 当前缺口

如果直接创建 `.contexta/mapping/bootstrap/relations/`，但把 relation 文件写成自足说明文档，会出现两个问题：

- relation 会重复定义 concept、policy、example、Delimitation 已经负责的内容。
- relation 会削弱 md 文档互联能力，把本来应该通过 link 拉进来的职责重新写一遍。

因此，relation 内容不应追求自足，而应收窄为连接语言。

relation 只说明连接本身；被连接对象是什么、边界怎么守、样本怎么读，应回到对应 md。

## 候选模型

### 1. relation file

relation layer 中的每个 md 文件是一个 relation file。

它仍然是 md file scope 下的 module，但这里不使用 `module` 作为建模重点，避免再次把 relation 写成自足内容单元。

relation file 不按单个 concept 拆分，而按一个稳定 network topic 拆分。

例如：

```text
.contexta/mapping/bootstrap/relations/structure-language.md
.contexta/mapping/bootstrap/relations/mapping-layer.md
.contexta/mapping/bootstrap/relations/module-assertion.md
```

原因：

- 按 concept 拆分容易退回每个 concept 都维护自己的 relation。
- 按 network topic 拆分能让同一组连接在一个地方被审查。
- relation 的重点不是“某个 concept 相关什么”，而是“这一组连接如何让 agent 沿 md 网络读取”。

### 2. relation block

relation file 中的最小单元是 relation block。

一条 relation block 至少包含：

- Heading：连接名称，使用 heading 形成可引用锚点。
- From：连接起点，使用 OFM wikilink。
- To：连接终点，使用 OFM wikilink。
- Reading：最小读取提示，只说明如何沿连接读取，不重复定义两端对象。
- Read next：通过 OFM section link 拉入已有职责位置。

不再使用表格作为第一表达。

原因：

- OFM 的核心能力是 wikilink、heading anchor 和 section link。
- 表格适合机器整理，但不适合作为 relation 的 human-facing 第一形态。
- `Effect` 容易诱导 relation 重新解释落点、边界和规则。
- `Reading` 只负责连接语言自身的读取方向。
- 具体定义回到 `From / To` 指向的 concept。
- 具体约束回到 relation policy 或相关 policy。
- 局部消歧回到 concept module 的 Delimitation。
- 样本教学回到 example。

最小表达：

```md
## `structure-language-of`

From:

- [[mapping/bootstrap/modules/concept/structure/workflow|workflow]]

To:

- [[mapping/bootstrap/modules/concept/structure|structure]]

Reading:

沿 `structure-language-of` 读取时，[[mapping/bootstrap/modules/concept/structure/workflow|workflow]] 进入 [[mapping/bootstrap/modules/concept/structure|structure]] 的 structure language 位置。

Read next:

- Definition: [[mapping/bootstrap/modules/concept/structure/workflow#Definition|workflow#Definition]], [[mapping/bootstrap/modules/concept/structure#Definition|structure#Definition]]
- Constraint: [[mapping/bootstrap/modules/concept/relation|relation]]
- Boundary: [[mapping/bootstrap/modules/concept/structure/workflow#Delimitation|workflow#Delimitation]]
```

### 3. link pull-in

relation file 通过 `Read next` 拉入已有 md，但只放 link，不重复解释。

可拉入：

- Definition：概念定义来源。
- Constraint：约束来源。
- Boundary：局部消歧来源。
- Teaching：样本来源。

这些不是 relation 自己的新职责，只是让 agent 知道应沿哪些 md 继续读。

### 4. relation file skeleton

候选正文结构：

````md
---
kind: relation
---

# <relation-topic-id>

## Network

<一句话说明这个 relation file 维护哪一组连接。>

## `<relation-name>`

From:

- [[path/to/source|source]]

To:

- [[path/to/target|target]]

Reading:

<说明如何沿连接读取，不重复定义 source / target。>

Read next:

- Definition: [[path/to/source#Definition|source#Definition]], [[path/to/target#Definition|target#Definition]]
- Constraint: [[mapping/bootstrap/modules/concept/relation|relation]]
- Boundary: [[path/to/source#Delimitation|source#Delimitation]], [[path/to/target#Delimitation|target#Delimitation]]
````

### 5. 第一个 relation file 候选

第一批最适合落地的是：

```text
.contexta/mapping/bootstrap/relations/structure-language.md
```

原因：

- 这是当前已经多轮确认的稳定关系。
- 它刚刚从 Delimitation 中被移出。
- 它会影响 `workflow / pipeline / architecture / branch / composition` 的读取路径。
- 它必须避免退回 `kind: structure` + `sub_type` 的 frontmatter subtype 模型。
- 它可以充分利用已有 concept / policy / Delimitation，而不是在 relation file 中重复定义。

候选 relation block：

```md
## `structure-language-of`

From:

- [[mapping/bootstrap/modules/concept/structure/pipeline|pipeline]]
- [[mapping/bootstrap/modules/concept/structure/workflow|workflow]]
- [[mapping/bootstrap/modules/concept/structure/architecture|architecture]]
- [[mapping/bootstrap/modules/concept/structure/branch|branch]]
- [[mapping/bootstrap/modules/concept/structure/composition|composition]]

To:

- [[mapping/bootstrap/modules/concept/structure|structure]]

Reading:

沿 `structure-language-of` 读取时，From 中的 concept 进入 [[mapping/bootstrap/modules/concept/structure|structure]] 的 structure language 位置。

Read next:

- Definition: [[mapping/bootstrap/modules/concept/structure#Definition|structure#Definition]], [[mapping/bootstrap/modules/concept/structure/pipeline#Definition|pipeline#Definition]], [[mapping/bootstrap/modules/concept/structure/workflow#Definition|workflow#Definition]], [[mapping/bootstrap/modules/concept/structure/architecture#Definition|architecture#Definition]], [[mapping/bootstrap/modules/concept/structure/branch#Definition|branch#Definition]], [[mapping/bootstrap/modules/concept/structure/composition#Definition|composition#Definition]]
- Constraint: [[mapping/bootstrap/modules/concept/relation|relation]], [[mapping/bootstrap/modules/policy/kind-boundary|kind-boundary]]
- Boundary: [[mapping/bootstrap/modules/concept/structure/pipeline#Delimitation|pipeline#Delimitation]], [[mapping/bootstrap/modules/concept/structure/workflow#Delimitation|workflow#Delimitation]], [[mapping/bootstrap/modules/concept/structure/architecture#Delimitation|architecture#Delimitation]], [[mapping/bootstrap/modules/concept/structure/branch#Delimitation|branch#Delimitation]], [[mapping/bootstrap/modules/concept/structure/composition#Delimitation|composition#Delimitation]]
```

## 待审核问题

1. 是否同意：relation layer 中的文件按 network topic 拆分，而不是按单个 concept 拆分？
2. 是否同意：relation block 的最小结构改为 heading / From / To / Reading / Read next？
3. 是否同意：relation file 只说明连接语言，定义、约束、边界和样本都通过 link 拉入已有 md？
4. 是否同意：第一批落地 `structure-language.md`，先承接 structure 与五个 structure language 的稳定连接？
5. 是否同意：relation file 使用 `kind: relation`，因为它进入的是 relation 内容语言？
