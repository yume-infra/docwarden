---
kind: concept
---

# pipeline

## Designation

Canonical: `pipeline`

## Naming Need

contexta 需要一个名字表示内容从输入经过转换形成输出。

这个名字用于避免把转换关系误写成 workflow 推进、列表枚举、policy 约束或 template 骨架。

## Definition

pipeline 是由 input、transform、output 三个位置共同成立的转换表达。

input 是被处理的内容。

transform 是对 input 执行的转换。

output 是 transform 产生的结果。

缺少 input、transform 或 output 中任一位置，都不构成完整 pipeline。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| workflow | workflow 关注推进、确认点和完成条件；pipeline 关注 input 如何经 transform 形成 output。 |
| list | list 只是并列枚举；pipeline 必须表达转换关系。 |
| mapping | mapping 表达对应关系；pipeline 必须表达转换动作。 |
| [[policy]] | policy 表达约束强度；pipeline 表达转换。 |
| [[template]] | template 提供复制骨架；pipeline 是被骨架承载的转换表达。 |
| [[example]] | example 提供样本；pipeline 表达样本或内容如何被转换。 |

## Concept Relations

- [[template]]：pipeline template 提供 pipeline 的复制骨架。
- [[module]]：pipeline 可以作为 module 承载具体转换内容。
- [[assertion]]：pipeline 的 input、transform 和 output 说明可以由 assertion 表达。
- [[naming]]：pipeline 名称应表达它处理的转换主题。
- [[example]]：example 可以示范 pipeline 如何书写。

## Examples

### Positive

```text
input: material + current agent context
transform: review surface generation
output: lead + backing
```

这个表达包含 input、transform 和 output，因此是 pipeline。

### Negative

```text
user reviews lead and decides whether to promote
```

这个表达关注用户确认和推进，不是 input 经 transform 形成 output。

### Borderline

```text
reviewed delta -> spec / guide / wiki candidates
```

这个箭头表达只有在 transform 可被明确说明时才构成 pipeline。否则它只是一个省略了转换动作的映射。
