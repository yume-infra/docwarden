---
kind: concept
---

# locator

## Designation

Canonical: `locator`

Aliases:

- semantic locator

## Naming Need

contexta 需要一个名字表示稳定指向 module、heading 或 assertion 的地址机制。

这个名字用于让 semantic-lint、review、trace 和未来 CLI 能把判断指回可审查位置。

## Definition

locator 是稳定指向 contexta 内容位置的地址机制。

当前阶段 locator 至少需要支持 module 和 heading。

未来 assertion locator 会支持指向 module 内部的具体 assertion。

locator 只负责定位，不判断内容是否正确。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/policy/link-resolution|link-resolution]] | link-resolution 约束 OFM link 写法；locator 是定位机制。 |
| [[mapping/bootstrap/modules/concept/assertion|assertion]] | assertion 是被审查的语义判断；locator 指向 assertion 或其所在位置。 |
| [[mapping/bootstrap/modules/concept/signal|signal]] | signal 命名语义偏移 warning；locator 指向 warning 命中的位置。 |
| docwarden asset landing | docwarden asset landing 处理资产落点；locator 只处理内容位置。 |

## Examples

### Scenario

CLI lint step 命中 concept Definition 中的可疑内容。

### Judgment Material

```text
mapping/bootstrap/modules/concept/example.md
heading: Definition
```

### Positive

```md
[[mapping/bootstrap/modules/concept/example#Definition|example#Definition]]
```

这个 locator 可以稳定指向 module heading。

### Negative

```text
example
```

这只是显示名，不是稳定 locator。

### Borderline

```md
[[mapping/bootstrap/modules/concept/example#^block-id|example assertion]]
```

这是未来 assertion locator 可能使用的 block reference。本轮不引入该机制。
