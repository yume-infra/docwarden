---
status: accepted
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 7
---

# OFM link resolution review

本文件是 task 12 Loop 7 的最小 review 单元。

目标是定义 contexta 在 Obsidian Favored Markdown 中如何稳定表达 link。

## 已确认偏好

sayori 明确偏好：

- 使用 OFM 的 wiki link 语法。
- 不使用 Markdown link 作为 contexta 内部连接的第一表达。
- 不使用短 link，避免后续因同名或 locator 需求反复改写。

因此，contexta 内部连接只使用：

```md
[[path/to/target|display]]
[[path/to/target#Heading|display]]
```

## 当前问题

当前 `structure-language` relation file 已经能在 Obsidian 中预览连接，但仍存在稳定性问题。

以 `pipeline` 为例，短 link 在人工阅读上很干净，但 `.contexta` 中已经同时存在：

- `mapping/bootstrap/modules/concept/pipeline.md`
- `mapping/bootstrap/templates/pipeline.md`

如果 relation、semantic lint 或 locator 后续需要稳定指向 concept pipeline，短 link 不够可靠。

因此本轮直接排除短 link，不做“唯一时可用”的例外规则。

## 候选模型

### 1. link 同时包含 target 和 display

contexta 的 link 应区分：

- target：真实落点。
- display：Obsidian 中显示给人的名字。

使用 OFM alias 让两者同时成立：

```md
[[mapping/bootstrap/modules/concept/pipeline|pipeline]]
```

读取效果：

- Obsidian 显示 `pipeline`。
- 实际落点是 concept pipeline。

### 2. short wikilink 不进入规范

短 link 不作为 contexta 内部连接写法。

原因：

- 当前 basename 唯一不代表未来唯一。
- relation / policy / lint / locator 都需要稳定落点。
- 短 link 会制造后续批量迁移成本。
- path alias 已经能同时保留可读显示和稳定 target。

### 3. path alias 是稳定连接的默认写法

contexta 内部连接应使用 path alias：

```md
[[mapping/bootstrap/modules/concept/workflow|workflow]]
[[mapping/bootstrap/modules/policy/kind-boundary|kind-boundary]]
[[mapping/bootstrap/relations/structure-language|structure-language]]
```

这样可以保持 Obsidian 阅读干净，同时让 agent 和后续 lint 能稳定定位。

### 4. section link 用于读取具体职责位置

当 link 需要指向 concept module 内的具体职责区域时，使用 section link：

```md
[[mapping/bootstrap/modules/concept/structure#Definition|structure#Definition]]
[[mapping/bootstrap/modules/concept/workflow#Delimitation|workflow#Delimitation]]
```

这适合 relation file 的 `Read next`。

### 5. block reference 暂不进入本轮

OFM 支持 block reference，但本轮不引入：

```md
[[path/to/file#^block-id|display]]
```

原因：

- block reference 更接近 assertion locator。
- assertion locator 尚未进入本轮。
- 当前先用 file path + heading 稳定到 module section。

## 对 relation file 的影响

`structure-language.md` 的 From 应写为：

```md
- [[mapping/bootstrap/modules/concept/pipeline|pipeline]]
- [[mapping/bootstrap/modules/concept/workflow|workflow]]
- [[mapping/bootstrap/modules/concept/architecture|architecture]]
- [[mapping/bootstrap/modules/concept/branch|branch]]
- [[mapping/bootstrap/modules/concept/composition|composition]]
```

`Read next` 应写为：

```md
- Definition: [[mapping/bootstrap/modules/concept/structure#Definition|structure#Definition]], [[mapping/bootstrap/modules/concept/pipeline#Definition|pipeline#Definition]]
```

## 已落地

- 新增 `.contexta/mapping/bootstrap/modules/policy/link-resolution.md`。
- 将 `.contexta/mapping/bootstrap/relations/structure-language.md` 改为 path alias。
- 将 `.contexta/mapping/**/*.md` 中已有短 link 迁移为 path alias。
- 暂不引入 block reference。
- 暂不设计完整 assertion locator。

## 待审核问题

1. 是否同意：contexta 内部连接只使用 OFM wiki link，不使用 Markdown link？
2. 是否同意：contexta 内部连接只使用 path alias，即 `[[path|display]]`？
3. 是否同意：短 link 不进入规范，不设置 basename 唯一时可用的例外？
4. 是否同意：relation file 的 From / To / Read next 必须使用 path alias？
5. 是否同意：block reference 留到 assertion locator loop，不在本轮引入？
