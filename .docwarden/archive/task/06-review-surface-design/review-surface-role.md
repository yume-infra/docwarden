---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
---

# review surface 职责

本文件记录从 05 讨论中迁移出的 surface 职责定义。

## 核心关系

当前不应把所有名词都写成一条线性流程。

更准确的关系是：

```text
review input = task material + current agent context

review surface(input) => lead + backing

renderer(config) presents lead + backing as md/html

user reviews lead and inspects backing when needed

accepted review result is distributed to spec / guide / wiki

decision trace records review decisions / provenance
```

其中 `review input` 是输入集合的命名，`lead + backing` 是 surface 的输出结构，`renderer` 是呈现实现，不是和 user review 平级的业务阶段。

## surface 的目的

review surface 的目的不是简单展示 input。

它的核心职责是把：

```text
material + current agent context
```

处理成：

```text
lead + backing
```

如果原始 material 已经清楚表达了 lead + backing 的关系，可以走短路径。否则 surface 必须完成这一步组织。

## lead

lead 是最小 user 可审核单元。

user review 的主要对象是 lead，而不是原始材料堆。

lead 可以是：

- 一个主问题。
- 一个主判断。
- 一个最小待确认命题。
- 一个天然已经具备主审查能力的文件或段落。

如果 surface 无法从 material + context 中提炼 lead，说明当前 review 范围过大或目标不清楚，应该拆分 review 或回到 user 处确认目标。

## backing

backing 是被 lead 统摄、用于支撑 / 展开 / 校验 lead 的材料层。

backing 不是“降低 lead 理解成本的辅助材料”。

降低 user review 成本的是 lead。

backing 的职责是让 lead 不是一句悬空结论，而是有可追溯、可展开、可校验的材料承载。

backing 可以承载：

- lead 从哪些 material 中提炼出来。
- lead 覆盖了哪些原始内容。
- lead 的依据是什么。
- lead 的边界是什么。
- lead 相关的可展开细节是什么。
- user 对 lead 有疑问时应该回看什么。

user 主要审核 lead；当 lead 不清晰、不可信或需要追溯时，再展开 backing。

## HTML 引入位置

HTML 应该引入在 review surface 这一层。

它不属于 review input，也不属于 decision trace。

HTML 适合承载：

- lead 固定展示。
- backing 折叠 / 展开。
- material 来源展示。
- agent context 中影响判断的假设展示。
- 风险、待确认点和拆分提示。

因此 HTML 更像短命的 review workbench。

HTML 本体不需要长期保存。

长期需要保存的是 review 后的 decision trace，以及后续进入 spec / guide / wiki 的内容。

## 当前结论

review surface 是将 input 转成最小 user-review 单元的处理层。

它接收：

```text
material + current agent context
```

产出：

```text
lead + backing
```

其中：

- lead 是最小 user 可审核单元。
- backing 是 lead 的承载层。
- HTML 可以作为 surface 的实现形态或候选形态。

## Review 状态

sayori 已确认：

- surface 的目的，是把 material + current agent context 处理成 lead + backing。
- lead 是最小 user 可审核单元。
- backing 是被 lead 统摄、用于支撑 / 展开 / 校验 lead 的材料层。
- HTML 应引入在 review surface 层。
