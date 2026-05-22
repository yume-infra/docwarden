---
kind: concept
---

# branch

## Designation

Canonical: `branch`

Aliases:

- routing

## Naming Need

contexta 需要一个名字表示内容、判断或行动在条件成立时进入不同承接路径。

这个名字用于避免把条件分流误写成 workflow 推进、pipeline 转换、architecture 组成、policy 约束或 template 骨架。

## Definition

branch 是由 condition、route、target 三个位置共同成立的分流表达。

condition 是触发分流判断的条件。

route 是条件成立后选择的路径。

target 是该路径承接的落点或后续对象。

缺少 condition、route 或 target 中任一位置，都不构成完整 branch。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| workflow | workflow 关注 state 如何经 move 和 transition 推进；branch 关注 condition 如何选择 route 和 target。 |
| pipeline | pipeline 关注 input 如何经 transform 形成 output；branch 关注条件分流，不表达转换动作。 |
| architecture | architecture 关注 layer 的 relation 和 boundary；branch 关注内容或判断如何被路由到 target。 |

## Examples

### Scenario

pick 后的候选内容需要决定长期落点。

### Judgment Material

condition: pick candidate is user context
route: user context route
target: .docwarden/user/profile.md

### Positive

```md
这是 branch。它不是把内容改写成另一种内容，而是在条件成立时选择一条承接路径和具体落点。
```

这个 example 把 condition、route 和 target 放在同一个判断现场里，agent 能看出 branch 解决的是“去哪里”的问题。

### Negative

```text
input: reviewed material
transform: rewrite for guide
output: guide page candidate
```

这组内容表达转换，不表达条件分流。它更接近 pipeline。

### Borderline

```text
review 后进入 promote 或 pick。
```

这句话有分流意图，但缺少进入 promote 或 pick 的 condition，也没有说明各自 route 的 target。补足后才构成 branch。
