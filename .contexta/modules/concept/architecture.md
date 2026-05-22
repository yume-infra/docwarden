---
kind: concept
---

# architecture

## Designation

Canonical: `architecture`

## Naming Need

contexta 需要一个名字表示一个整体中有哪些稳定层位，以及这些层位如何通过关系和边界共同成立。

这个名字用于避免把层级关系和边界误写成 workflow 推进、pipeline 转换、branch 分流、policy 约束或 template 骨架。

## Definition

architecture 是由 layer、relation、boundary 三个位置共同成立的层级表达。

layer 是整体中的稳定层位。

relation 是 layer 之间的相邻、依赖、承接或包含关系。

boundary 是 layer 之间不可混淆或不可跨越的边界。

缺少 layer、relation 或 boundary 中任一位置，都不构成完整 architecture。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| workflow | workflow 关注 state 如何经 move 和 transition 推进；architecture 关注 layer 如何通过 relation 和 boundary 共同成立。 |
| pipeline | pipeline 关注 input 如何经 transform 形成 output；architecture 关注层级、关系和边界。 |
| branch | branch 关注 condition 如何 route 到 target；architecture 关注 target 所在整体的层级位置和边界。 |
| [[policy]] | policy 表达约束强度；architecture 表达层级关系和边界。 |
| [[template]] | template 提供复制骨架；architecture 是被骨架承载的层级表达。 |

## Examples

### Scenario

用户要求 agent 判断 docwarden 和 contexta 的关系应写成 workflow、policy 还是 architecture。

### Judgment Material

- docwarden 负责 task / review / promote / pick / cleanup 和具体资产落点。
- contexta 负责 template / metadata / module / assertion / semantic lint。
- template 只提供复制后的内容骨架，不负责来源、review、pick、更新、写入或生命周期。

### Positive

```md
这是 architecture。它同时说明了 layer、relation 和 boundary：docwarden 与 contexta 是稳定层位；二者通过具体资产落点和内容格式协议相邻；template 的职责边界说明两层不能混写。
```

这个 example 给出了真实混淆压力：同一组内容可能被误写成 workflow 或 policy。正确判断必须同时看到层位、关系和边界。

### Negative

```text
docwarden / contexta
```

这只列出两个名字。agent 不能从中判断层位之间如何相邻、依赖或保持边界。

### Borderline

```text
占位：需要补一个非 docwarden / contexta 的 architecture 判断材料。
```

当前真实用例集中在 docwarden 和 contexta。后续应补一个外部或跨模块 architecture 场景，避免定义只适配当前项目。
