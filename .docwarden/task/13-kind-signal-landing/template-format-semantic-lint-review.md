---
status: accepted
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# template format semantic-lint review

## Review Lead

`template / format / semantic-lint` 不应被建模成同一个 pipeline。

它们更适合作为 relation：`template` 提供 0->1 的初始骨架，`format` 保持 1->2 时不改坏 md 形态，`semantic-lint` 消费 formatted md 产生 warning signal。

## Current Baseline

- [[mapping/bootstrap/modules/concept/template|template]] 是内容复制骨架，用于给已确认内容语言的 module 提供初始章节和占位提示。
- [[mapping/bootstrap/modules/concept/format|format]] 是 md module 在持续编辑中的形态保持契约。
- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]] 是语义偏移检测语言，直接消费 formatted md。
- [[mapping/bootstrap/structures/pipeline/semantic-lint|semantic-lint pipeline]] 已表达 lint step 如何从 formatted md 转换出 signal candidate / signal instance。
- [[mapping/bootstrap/modules/policy/template-boundary|template-boundary]] 已约束 template 不承接来源、review、pick、更新、写入或生命周期。
- [[mapping/bootstrap/modules/policy/semantic-lint-boundary|semantic-lint-boundary]] 已约束 semantic-lint 不替代 policy、concept、relation 或 workflow。

## Gap

当前缺的不是新 concept，也不是新 pipeline，而是三者之间的稳定读取关系。

如果不显式建模，后续 agent 容易产生三类偏移：

- 把 `format` 写回 `template`，让 template 负责长期维护。
- 把 `semantic-lint` 写成 policy violation，而不是 warning signal。
- 把 `template -> format -> semantic-lint` 当成完整 CLI pipeline，提前固定实现细节。

## Candidate Decision

新增一个 relation file：

```text
.contexta/mapping/bootstrap/relations/template-format-semantic-lint.md
```

它只表达关系，不重新定义三个 concept。

候选 relation：

```text
template initializes module
format preserves module
semantic-lint consumes formatted md
semantic-lint emits warning signal
```

其中：

- `initializes` 说明 template 只负责 0->1。
- `preserves` 说明 format 只负责 1->2 时保持 md 可消费形态。
- `consumes` 说明 semantic-lint 的输入来自 formatted md。
- `emits` 说明 semantic-lint 的结果是 warning signal，不是 final judgment。

`0->1` 和 `1->2` 在这里是 transition magic words，不新增 `phase` concept。

transition magic words 应进入 `modules/magic-word/transition.md` registry，不继续堆进 `concept/magic-word.md`。

## Layer Split

### Relation

表达稳定连接：

- `template -> format`
- `format -> semantic-lint`
- `semantic-lint -> warning signal`

### Policy

继续表达约束：

- template 不能承接生命周期。
- template 中的占位内容不是已接受 assertion。
- semantic-lint 不能替代 policy。
- trigger 必须直接检查 formatted md。

### Pipeline

只保留真正的执行转换：

- semantic-lint pipeline 从 formatted md 转换出 signal candidate / signal instance。

`template / format / semantic-lint` 本身不是一个 pipeline，因为它混合了初始生成、形态保持和检测消费三个不同职责。

### Example

当前不新增抽象 example。

真实案例出现后，再用具体误写片段补充。

## Proposed Next Change

本轮通过后，落地最小改动：

1. 新增 `template-format-semantic-lint` relation file。
2. 在 `semantic-lint-chain` 的 Read next 中补充该 relation，避免重复定义 lint pipeline。
3. 在 `modules/magic-word/transition.md` registry 中记录 `0->1` / `1->2` 的 token 角色。
4. 在 task 13 记录本轮决策。

本轮不做：

- 不新增 concept。
- 不新增 pipeline。
- 不扩 CLI spec。
- 不新增抽象 example。
- 不修改 `docs/`。
