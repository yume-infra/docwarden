---
kind: concept
---

# confidence

## Designation

Canonical: `confidence`

Aliases:

- lint confidence

Avoid:

- certainty
- truth

## Naming Need

contexta 需要一个名字表示 semantic-lint 对 signal candidate 的识别强度。

这个名字用于区分“检测命中有多可靠”和“这个判断是否最终正确”。

## Definition

confidence 是 semantic-lint 对 signal candidate 或 signal instance 的识别强度标记。

confidence 来自 trigger evidence、magic word 来源和 locator 是否成立。

canonical magic word 命中通常提供较高 confidence。

alias 命中只能作为 fallback，confidence 低于 canonical。

avoid 命中提供 negative pressure，不等于同义命中。

有 assertion locator 的 instance 比只有 module path / heading 上下文的 candidate 更稳定。

confidence 不判断 assertion 是否正确，也不替代用户 review。

## Delimitation

- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]：semantic-lint 产生 warning；confidence 标记 warning 的识别强度。
- [[mapping/bootstrap/modules/concept/magic-word|magic-word]]：magic-word 定义 token 角色；confidence 使用这些 token 角色区分强弱。
- [[mapping/bootstrap/modules/concept/locator|locator]]：locator 让 instance 可以指向 assertion；confidence 可以记录 locator 是否成立。
- certainty：certainty 表示确定无误；confidence 只是检测强度，不是最终真值。

## Examples

### Scenario

semantic-lint 需要判断 `locator`、`semantic locator`、`location` 三种命中强度。

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
locator -> higher confidence
semantic locator -> lower confidence fallback
location -> negative pressure
```

这个 example 展示 confidence 只表达识别强度，不把 alias 或 avoid 当成同一种命中。

### Negative

```text
locator / semantic locator / location -> same confidence
```

这会抹平 canonical、alias 和 avoid 的差异。

### Borderline

```text
concept-as-policy candidate without assertion marker -> lower confidence than located instance
```

candidate 可以被记录，但没有 assertion locator 时，不应被当成完整 signal instance。
