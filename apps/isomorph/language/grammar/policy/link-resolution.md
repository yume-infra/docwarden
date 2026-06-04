---
kind: policy
---

# link-resolution

## Intent

定义 isomorph 内部 link 的稳定落点规则。

本 policy 用于让 OFM wikilink 同时满足 Obsidian 可读性和 agent 可定位性，避免短 link 在后续同名文件或 locator 需求中反复改写。

## Scope

Applies to:

- [[primitives/concept/format|format]]
- [[primitives/concept/locator|locator]]
- [[primitives/concept/naming|naming]]
- [[language/primitive/concept/relation|relation]]
- [[primitives/concept/module|module]]

适用条件：

- isomorph module 需要引用另一个 isomorph module。
- isomorph relation file 需要表达 From、To 或 Read next。
- isomorph policy、concept、template 或 relation 需要指向稳定落点。
- isomorph 需要指向某个 module 内的稳定 heading。

不适用条件：

- 需要定义 assertion locator 的语义边界。
- 需要引用 isomorph 外部资料。

## Rules

- isomorph internal link MUST use OFM wiki link syntax.
- isomorph internal link MUST use path alias.
- isomorph internal link MUST NOT 使用 Markdown link syntax 作为第一内部表达。
- isomorph internal link MUST NOT use short wikilink.
- isomorph section link MUST include both target path and display alias.
- relation file From / To / Read next MUST use path alias.
- block reference MUST NOT be used as a general internal link form.
- 当 locator 需要 assertion-level reference 时，block reference MAY 作为 locator marker target。

## Rationale

OFM wikilink 是 isomorph 的内部连接语言。

短 link 在当前可能可读，但 basename 唯一不代表未来唯一。isomorph 已经同时存在 concept、policy、template 和 relation 等多类 md module，同名文件会持续出现。

path alias 让 target 和 display 同时成立：target 保持稳定落点，display 保持 Obsidian 阅读干净。

section link 可以稳定指向 Definition、Delimitation 或其他 heading，但不等于 assertion locator。

assertion locator 可以使用 block reference target，但它的用途是定位 assertion，不是替代普通 module / section link。

## Examples

### Scenario

relation file 需要指向 concept pipeline。

### Judgment Material

目标落点是 `primitives/concept/structure/pipeline.md`。

### Positive

```md
[[primitives/concept/structure/pipeline|pipeline]]
```

这个 link 同时给出稳定 target 和可读 display。

### Negative

```text
只写 display，不写 target path。
```

这会依赖 basename 解析，后续一旦出现同名文件就需要迁移。

### Borderline

```md
[[primitives/concept/structure/pipeline#Definition|pipeline#Definition]]
```

这是 section link，可以用于 Read next。它稳定到 heading，但还不是 assertion locator。

```md
[[primitives/concept/locator#^def-1|locator definition]]
```

这是 assertion-level reference。只有当目标位置存在 locator marker 时才成立。
