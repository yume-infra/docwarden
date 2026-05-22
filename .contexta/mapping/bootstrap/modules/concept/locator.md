---
kind: concept
---

# locator

## Designation

Canonical: `locator`

Aliases:

- semantic locator

## Naming Need

contexta 需要一个名字表示让 assertion 可以被稳定定位的机制。

这个名字用于让 semantic-lint、review、trace 和未来 CLI 能把判断指回具体可审查的 assertion，而不是只指向整篇 module 或某个 heading。

## Definition

locator 是服务 assertion 审核的定位机制。 ^a-def

locator 通过 assertion marker 让需要被审核、引用、迁移或 lint 命中的 assertion 可以被稳定找到。

module path、heading 和 relation block heading 可以提供定位上下文，但不是 locator 的核心定义。

locator 只负责让 assertion 可定位，不判断 assertion 是否正确。

## Delimitation

- [[mapping/bootstrap/modules/concept/assertion|assertion]]：assertion 是被审查的语义判断；locator 让 assertion 可以被稳定定位。
- [[mapping/bootstrap/modules/concept/format|format]]：format 保持 md 形态；locator 依附这个形态定位 assertion。
- [[mapping/bootstrap/modules/policy/link-resolution|link-resolution]]：link-resolution 约束 OFM link 写法；locator 定义 assertion marker 的定位用途。
- [[mapping/bootstrap/modules/concept/signal|signal]]：signal 命名语义偏移 warning；locator 指向 warning 命中的 assertion。
- docwarden asset landing：docwarden asset landing 处理资产落点；locator 只处理 assertion 在内容内部的定位。

## Examples

### Scenario

CLI lint step 命中 concept Definition 中的一条可疑 assertion。

### Judgment Material

```text
mapping/bootstrap/modules/concept/example.md
heading: Definition
marker: ^a-def
```

### Positive

```md
example 是样本语言。 ^a-def

[[mapping/bootstrap/modules/concept/example#^a-def|example definition]]
```

这个 locator 同时包含 assertion marker 和 OFM path alias link。

marker 让 assertion 可以被定位；link 让其他 module 可以稳定引用它。

marker 使用短格式，因为 path 和 alias 已经提供了跨 module 语义；block id 只需要在当前文件内稳定。

### Negative

```text
example
```

这只是显示名，不是 locator。

```md
[[mapping/bootstrap/modules/concept/example#Definition|example#Definition]]
```

这只是 section context，不能精确定位具体 assertion。

### Borderline

```md
example 是样本语言。 ^definition
```

这能形成 block reference，但没有使用 `a-` magic prefix，后续不利于脚本区分普通 block 与 assertion marker。
