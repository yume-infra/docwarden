---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
loop: 3
---

# review frame

本文件记录 Loop 3，用于定义 review frame。

## 纠偏

此前草案把 review frame 设计成：

```text
lead
backing
generation_notes
```

这个设计不对。

原因是：

- 它把 review frame 变成了一个新的 schema 层。
- 它把 surface generation 的过程说明单独做成必备块。
- 它容易把 trace / provenance 的职责提前塞进 surface。
- 它偏离了前面已经确认的核心链路。

前面已经确认的关系是：

```text
review input = material + current agent context

review surface(input) => lead + backing

renderer(config) presents lead + backing as md/html

user reviews lead and inspects backing when needed
```

因此 review frame 不应该额外发明第三块，也不应该被理解为独立流程阶段。

## 定位

review frame 是 review surface 输出结构的名称。

它不是独立流程节点。

它不是 HTML。

它也不是 Markdown。

HTML / Markdown 是 renderer 对同一个 surface 输出结构的呈现方式。

review frame 的职责是保持 renderer 前的语义稳定，让不同 renderer 呈现同一个 review 对象。

## 核心结构

review frame 的核心结构就是：

```text
lead + backing
```

## lead

`lead` 是最小 user 可审核单元。

它承载 user 本轮真正要审核的内容。

lead 可以是：

- 一个主问题。
- 一个主判断。
- 一个最小待确认命题。
- 一个天然已经具备主审查能力的文件或段落。

lead 必须让 user 能判断：

- 是否接受。
- 是否拒绝。
- 是否需要修改。
- 是否需要拆分。

## backing

`backing` 是被 lead 统摄的承载层。

它用于支撑 / 展开 / 校验 lead。

backing 可以承载：

- lead 从哪些 material 中提炼出来。
- lead 覆盖了哪些原始内容。
- lead 的依据是什么。
- lead 的边界是什么。
- current agent context 中哪些判断影响了 lead。
- user 对 lead 有疑问时应该回看什么。

backing 不是“辅助理解材料”。

backing 也不是完整 material 列表。

只有参与支撑 / 展开 / 校验 lead 的内容，才应该进入 backing。

## current agent context 的位置

current agent context 不应该作为 review frame 的独立顶级块。

它如果影响本轮 review，应该被 surface 显式化到 lead 或 backing 中。

例如：

- 作为 lead 的前提。
- 作为 backing 的上下文依据。
- 作为 lead 边界的一部分。
- 作为需要 user 核查的假设。

不能让未显式化的 agent context 隐形影响 user review。

## generation 信息的位置

surface 如何生成 lead / backing 的信息，不应该默认成为 review frame 的第三个必备块。

如果某些生成信息对 user 审核 lead 有必要，它应该进入 backing。

如果某些生成信息只用于记录过程或追溯，则应该留到 decision trace / provenance 设计中处理。

## renderer 边界

renderer 只负责呈现 review frame。

renderer 不属于 review 理论主流程。

renderer 不应该改变 review frame 的语义。

后续可以通过 config 选择：

```text
renderer: md | html
```

但 config 后续单独设计，并统一收拢所有 surface 决策点。

当前只记录原则：

- Markdown renderer 和 HTML renderer 应呈现同一个 review frame。
- HTML 可以提供更好的折叠、固定 lead、展开 backing 和风险标注。
- HTML 不应产生另一套 review 逻辑。

## 当前结论

review frame 是 surface 输出结构的名称，不是独立业务阶段。

它的核心结构是：

```text
lead + backing
```

它不额外引入 `generation_notes` 作为必备块。

## Review 状态

sayori 已确认：

- `review input`、`review frame`、`renderer` 不应作为同一条主流程里的独立业务阶段。
- `review input` 是输入集合的命名。
- `review frame` 是 surface 输出结构。
- `renderer` 是呈现实现，由后续 config 控制。
- surface 的核心仍是从 `material + current agent context` 生成 `lead + backing`。
