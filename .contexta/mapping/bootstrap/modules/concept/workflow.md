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
| docwarden workflow | docwarden workflow 是 docwarden 操作流程实例；contexta workflow concept 只命名和界定 workflow 这种表达。 |

## Examples

### Scenario

pick 后的候选内容需要进入 review surface，让用户确认资产性质和具体资产落点。

### Judgment Material

state: pick candidate is ready
move: organize minimal review surface
transition: candidate enters user review

### Positive

```md
这是 workflow。它关注当前可行动处境如何通过一个行动进入下一个可行动处境。
```

这个 example 给出真实推进场景，agent 能区分“进入 review”与“生成 review 文本”。

### Negative

```text
input: pick 后内容
transform: 生成 lead + backing
output: review surface 文本
```

这表达 input 经 transform 形成 output，因此是 pipeline，不是 workflow。

### Borderline

```text
review surface generation
```

这个短语本身不能判断为 workflow。若它表达从 state 进入 next state，是 workflow；若它表达材料到文本的转换，是 pipeline。
