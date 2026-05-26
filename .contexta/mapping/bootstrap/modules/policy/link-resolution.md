---
kind: policy
---

# link-resolution

## Intent

定义 contexta 内部 link 的稳定落点规则。

本 policy 用于让 OFM wikilink 同时满足 Obsidian 可读性和 agent 可定位性，避免短 link 在后续同名文件或 locator 需求中反复改写。

## Scope

Applies to:

- [[mapping/bootstrap/modules/concept/format|format]]
- [[mapping/bootstrap/modules/concept/locator|locator]]
- [[mapping/bootstrap/modules/concept/naming|naming]]
- [[mapping/bootstrap/modules/concept/relation|relation]]
- [[mapping/bootstrap/modules/concept/module|module]]

适用条件：

- contexta module 需要引用另一个 contexta module。
- contexta relation file 需要表达 From、To 或 Read next。
- contexta policy、concept、template 或 relation 需要指向稳定落点。
- contexta 需要指向某个 module 内的稳定 heading。

不适用条件：

- 需要定义 assertion locator 的语义边界。
- 需要引用 contexta 外部资料。

## Rules

- contexta internal link MUST use OFM wiki link syntax.
- contexta internal link MUST use path alias.
- contexta internal link MUST NOT use Markdown link syntax as the first internal expression.
- contexta internal link MUST NOT use short wikilink.
- contexta section link MUST include both target path and display alias.
- relation file From / To / Read next MUST use path alias.
- block reference MUST NOT be used as a general internal link form.
- block reference MAY be used as a locator marker target when locator requires assertion-level reference.

## Rationale

OFM wikilink 是 contexta 的内部连接语言。

短 link 在当前可能可读，但 basename 唯一不代表未来唯一。contexta 已经同时存在 concept、policy、template 和 relation 等多类 md module，同名文件会持续出现。

path alias 让 target 和 display 同时成立：target 保持稳定落点，display 保持 Obsidian 阅读干净。

section link 可以稳定指向 Definition、Delimitation 或其他 heading，但不等于 assertion locator。

assertion locator 可以使用 block reference target，但它的用途是定位 assertion，不是替代普通 module / section link。

## Examples

### Scenario

relation file 需要指向 concept pipeline。

### Judgment Material

目标落点是 `mapping/bootstrap/modules/concept/structure/pipeline.md`。

### Positive

```md
[[mapping/bootstrap/modules/concept/structure/pipeline|pipeline]]
```

这个 link 同时给出稳定 target 和可读 display。

### Negative

```text
只写 display，不写 target path。
```

这会依赖 basename 解析，后续一旦出现同名文件就需要迁移。

### Borderline

```md
[[mapping/bootstrap/modules/concept/structure/pipeline#Definition|pipeline#Definition]]
```

这是 section link，可以用于 Read next。它稳定到 heading，但还不是 assertion locator。

```md
[[mapping/bootstrap/modules/concept/locator#^def-1|locator definition]]
```

这是 assertion-level reference。只有当目标位置存在 locator marker 时才成立。
