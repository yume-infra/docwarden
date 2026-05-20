---
kind: concept
---

# workflow

## Designation

Canonical: `workflow`

## Naming Need

contexta 需要一个名字表示协作或工作对象如何从一个可行动处境推进到下一个可行动处境。

这个名字用于避免把推进关系误写成 pipeline 转换、policy 约束、template 骨架或普通步骤列表。

## Definition

workflow 是由 state、move、transition 三个位置共同成立的推进表达。

state 是当前可行动处境。

move 是使协作、理解或材料状态继续推进的行动。

transition 是 move 如何使一个 state 进入下一个 state 的成立关系。

缺少 state、move 或 transition 中任一位置，都不构成完整 workflow。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| pipeline | pipeline 关注 input 如何经 transform 形成 output；workflow 关注 state 如何经 move 和 transition 进入 next state。 |
| state machine | state machine 关注状态转移的形式合法性；workflow 关注协作或工作推进为什么成立。 |
| task list | task list 只是列出待办项；workflow 必须表达当前处境、推进行动和状态承接。 |
| [[policy]] | policy 表达约束强度；workflow 表达推进结构。 |
| [[template]] | template 提供复制骨架；workflow 是被骨架承载的推进表达。 |
| docwarden workflow | docwarden workflow 是 docwarden 操作流程实例；contexta workflow concept 只命名和界定 workflow 这种表达。 |

## Concept Relations

- [[structure]]：workflow 是 structure subtype 的建模材料，但当前不反向重写 structure。
- [[pipeline]]：pipeline 可以出现在 workflow 的某个 move 内，但二者定义位置不同。
- [[template]]：workflow template 提供 workflow 的复制骨架。
- [[module]]：workflow 可以作为 module 承载具体推进内容。
- [[assertion]]：workflow 的 state、move 和 transition 说明可以由 assertion 表达。
- [[naming]]：workflow 名称应表达它推进的协作或工作对象。
- [[example]]：example 可以示范 workflow 如何书写。

## Examples

### Positive

```text
state: task material is ready
move: generate review surface
transition: enter user review
```

这个表达说明了当前可行动处境、推进行动和下一状态，因此是 workflow。

### Negative

```text
input: material + current agent context
transform: review surface generation
output: lead + backing
```

这个表达关注 input 经 transform 形成 output，因此是 pipeline。

### Borderline

```text
review surface generation
```

这个短语本身不能判断为 workflow。只有当它被表达为从某个 state 经某个 move 进入 next state 时，才构成 workflow；如果它表达的是 material 到 lead + backing 的转换，则是 pipeline。
