---
kind: concept
---

# magic-word

## Designation

Canonical: `magic-word`

Aliases:

- control token

Avoid:

- glossary
- keyword

## Naming Need

contexta 需要一个名字表示 formatted md 中可被 semantic-lint 直接消费的控制性英文锚点。

这个名字用于避免把 naming、kind、signal、policy modal 和 locator marker 的消费规则塞回各自 concept，导致单个 md module 承担过多职责。

## Definition

magic-word 是 formatted md 中由 contexta 稳定、能影响读取方式、判断方式或定位方式的控制性英文 token。 ^a-def

concept `Canonical` 是 primary magic word。

`Aliases` 是 fallback token，置信度低于 canonical。

`Avoid` 是 negative token，不是 alias，也不是 magic word。

confirmed `kind` value、semantic-lint signal id、policy modal operator 和 locator marker prefix 是各自机制中的 control magic words。

magic-word 不创建新的语义对象。它只定义已有命名和控制词在 semantic-lint 消费中的 token 角色。

## Delimitation

- [[mapping/bootstrap/modules/concept/naming|naming]]：naming 负责名称形成和保持可定位；magic-word 负责这些名称被 semantic-lint 消费时的 token 角色。
- [[mapping/bootstrap/modules/concept/concept|concept]]：concept 稳定 semantic object；magic-word 不定义 semantic object，只定义控制性 token。
- [[mapping/bootstrap/modules/concept/format|format]]：format 保持 md 形态；magic-word 是 formatted md 中可被消费的一类 token。
- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]：semantic-lint 直接消费 formatted md；magic-word 定义其中的控制性 token 分层。
- [[mapping/bootstrap/modules/concept/confidence|confidence]]：confidence 表达 token 命中后的识别强度；magic-word 提供 token 角色来源。
- glossary：glossary 偏词表；magic-word 只处理会影响读取、判断或定位的控制性 token。

## Examples

### Scenario

semantic-lint 需要判断 `locator`、`semantic locator`、`location` 在命名消费中的差异。

### Judgment Material

```md
Canonical: `locator`

Aliases:

- semantic locator

Avoid:

- location
```

### Positive

```text
primary magic word: locator
fallback token: semantic locator
negative token: location
```

这个 example 展示 magic-word 的职责：它不重新定义 locator，而是定义这些英文 token 在 semantic-lint 消费时的角色和置信度。

### Negative

```text
magic words:
- locator
- semantic locator
- location
```

这把 canonical、alias 和 avoid 混成同一种 token，会让 semantic-lint 无法区分强锚点、弱辅助和误称压力。

### Borderline

```text
kind: concept
signal: concept-as-policy
modal: MUST
marker-prefix: a-
```

这些也是 control magic words，但来源分别是 kind、signal、policy 和 locator。它们可以被 semantic-lint 消费，但不能归入 concept naming 的 primary magic word。
