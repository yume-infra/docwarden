---
kind: concept
---

# trigger

## Designation

Canonical: `trigger`

Aliases:

- lint trigger

## Naming Need

contexta 需要一个名字表示 semantic-lint 中可观察、可脚本化的触发条件。

这个名字用于避免把人工语义判断写成未来 CLI 无法实现的检测规则。

## Definition

trigger 是 semantic-lint 中可观察的触发条件。

trigger 直接检查 formatted md 中的文本、结构、frontmatter、path、heading、link 或 marker 等现象。

trigger 不等于 signal，不等于 assertion，也不等于最终判断。

trigger 不依赖 locator 才能观察。locator 用于 signal instance 指回 assertion marker。

## Delimitation

- [[mapping/bootstrap/modules/concept/signal|signal]]：trigger 是可观察条件；signal 是对 trigger 的语义风险命名。
- [[mapping/bootstrap/modules/concept/assertion|assertion]]：assertion 是被审查的语义判断；trigger 是检查条件。
- [[mapping/bootstrap/modules/concept/format|format]]：format 保持 md 可被直接消费的形态；trigger 检查这个 formatted md。
- [[mapping/bootstrap/modules/concept/locator|locator]]：locator 指向 assertion marker；trigger 不依赖 locator 才能观察。
- docwarden trigger：docwarden trigger 可启动流程；semantic-lint trigger 只触发 lint warning。

## Examples

### Scenario

semantic-lint 需要识别 concept 是否可能写成 policy。

### Judgment Material

```md
## Definition

agent MUST keep link stable.
```

### Positive

```text
frontmatter.kind == concept
heading in [Definition, Naming Need]
section contains MUST / SHOULD / MUST NOT
```

这些是可观察条件，可以作为 trigger。

### Negative

```text
concept 写成了 policy。
```

这是 signal 或 inspection judgment，不是 trigger。

### Borderline

```text
body missing state / move / transition terms or sections
```

这是可脚本化程度较低的 trigger。当前可作为 warning signal 的初步条件，后续 CLI 实现时需要收窄检测方式。
