# Existing Theory Alignment

Status: working

## Purpose

本文件记录 task 29 的实现原则：后续机制必须贴合已有 isomorph 内部理论，而不是重新发明一套平行层级。

## Reuse Map

### Concept and Vocabulary

`concept` 已经负责稳定命名和定义语义对象。

`vocabulary` 应继续作为 `semantic-framework` 的 naming surface，而不是 root primitive catalog。

用户 import vocabulary 后，系统不应只保存词表，而应让这些 term / alias / intent / failure mode 进入 recognition、magic-word、semantic-lint、review 和 usage contract。

### Policy and Boundary

`policy` 已经负责约束语言。

framework vocabulary 的使用边界、agent 行为约束、materialization 禁止项，优先写成 framework-owned policy，而不是写进 template 或 generated skill。

### Relation

`relation` 已经负责 concept network 连接。

framework 内的 term relation、semantic dependency、reading path，应优先由 relation material 承接，而不是散落到每个 concept module 或 frontmatter subtype。

### Module and Assertion

`module` 已经负责 md file scope。

`assertion` 已经负责最小可审查 semantic commitment。

因此 `candidate update` 先按待 review assertion / assertion set 理解，不新增独立 primitive。

### Signal and Semantic-Lint

`signal / trigger / semantic-lint` 已经形成偏移检测链：

```text
formatted md -> semantic-lint -> signal -> review
```

framework vocabulary 的误用、边界漂移、usage contract 激活错误，优先通过 signal definition 和 semantic-lint pipeline 进入 review。

### Lead and Backing

已有 docwarden review theory 里，`lead` 是最小 user-reviewable commitment，`backing` 是支撑 / 展开 / 校验材料。

task 29 已把这套上提为统一 `lead-review theory`：root `.isomorph` 定义 concept/policy，contexta materialize 成 skill，docwarden review surface 作为 dogfood projection。

### Template and Example

`template` 只负责复制骨架，不拥有 lifecycle、review、policy 或 source authority。

`example` 用来教 agent 如何判断和落笔。

framework vocabulary 的 concrete examples / counterexamples 应作为 framework-owned example material，而不是靠 template 表示理论本体。

### Structure

`architecture` 已经表达 layer、relation、boundary。

`workflow` 已经表达 state、move、transition。

feedback loop 应优先建模为 workflow / pipeline structure，而不是新增一个平行机制层。

## Implementation Consequence

下一阶段进入 `feat/isomorph-primitives` 时，优先做：

1. 用现有 `concept / policy / relation / assertion / signal / workflow` 重新表达 framework vocabulary 与 feedback loop。
2. 保持 concrete skill material 在 contexta canonical skill source 中，不再放回 `.isomorph/primitives/skill-primitive/*.md`。
3. 把 `lead-review theory` 建模为可 export 的 agent-use contract。
4. 让 contexta 承接 `skill-creator` 与未来 `lead-review` canonical skill asset。

不要做：

- 不把 Animation / docwarden / skill authoring domain term 加进 root primitives。
- 不把 `candidate update` 立即做成新 root primitive。
- 不把 `review gate` 降级成 docwarden CLI gate。
- 不把 template 当作理论源头。
- 不让 projection/materialization 反向定义 isomorph core。
