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
| [[mapping]] | mapping 表达理论到实体的映射关系；pipeline 表达 input 到 output 的转换动作。 |
| [[policy]] | policy 表达约束强度；pipeline 表达转换。 |
| [[template]] | template 提供复制骨架；pipeline 是被骨架承载的转换表达。 |
| [[example]] | example 提供具体判断场景；pipeline 表达内容如何被转换。 |

## Examples

### Scenario

用户纠正 agent：进入 review surface 时，不是直接写 promote 后内容，而是先组织最小 review 单元。

### Judgment Material

input: pick 后内容 + 当前上下文
transform: 组织 review surface 的 lead 与 backing
output: 可供用户审核的最小 review 单元

### Positive

```md
这是 pipeline。它关注材料如何被转换成 review surface，不关注用户审核后进入哪个状态。
```

这个 example 给出具体转换压力，agent 能区分“生成审核材料”和“审核状态推进”。

### Negative

```text
user reviews lead and decides whether to promote
```

这句话关注用户确认和后续推进，不表达 input 经 transform 形成 output。

### Borderline

```text
reviewed delta -> spec / guide / wiki candidates
```

这个箭头有 output，但没有说明 transform。只有补出“如何从 reviewed delta 改写成候选内容”，才构成 pipeline。
