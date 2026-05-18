---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
loop: 2
---

# surface generation rules

本文件记录 Loop 2 草案，用于定义 review surface 如何从 input 生成 `lead + backing`。

## 纠偏

Loop 2 不应该定义 UI 内容块。

错误方向是把 surface 过早拆成：

```text
Lead block
Backing block
Agent context block
User action block
```

这个方向的问题是：

- 它把 surface 当成页面布局。
- 它把 agent context 单独 UI 化，但 context 本来是 input 的一部分。
- 它把 user action 提前带入 surface，而 action / trace 应该后续单独设计。
- 它没有回答 surface 的核心问题：如何从 input 生成 `lead + backing`。

因此 Loop 2 改为定义 surface generation rules。

## 核心职责

review surface 的职责是把：

```text
material + current agent context
```

处理成：

```text
lead + backing
```

surface 不是材料展示层。

surface 是最小 user-review 单元的生成层。

## surface 的两条路径

surface 有两条路径：

1. 短路径：material 已经表达了 lead + backing。
2. 生成路径：surface 从 material + current agent context 中生成 lead + backing。

## 短路径

如果 material 本身已经清楚表达了：

- 本轮 user 要审核什么。
- 哪些材料承载这个判断。
- 这个判断的依据、边界和可校验细节。

那么 surface 可以直接采用这组关系。

这通常发生在 user 已经提供了高度结构化的 review input，或者某个文件天然就是本轮 lead。

短路径不是主路径。

因为如果 user 已经能提供这组关系，通常说明 user 已经完成了相当一部分 review。

## 生成路径

更常见的是 user 只给出一个需求、一个 task、一个草案，或者没有显式指定 input。

此时 surface 必须执行生成路径：

```text
material + current agent context
  -> 提炼 lead
  -> 组织 backing
  -> 校验 lead/backing
  -> 产出 lead + backing
```

## 1. 提炼 lead

surface 首先要提炼 lead。

lead 是最小 user 可审核单元。

lead 不能只是材料摘要。

lead 应该是：

- 一个可判断的问题。
- 一个可确认的判断。
- 一个最小待确认命题。
- 一个天然具备主审查能力的文件或段落。

lead 必须满足 05 中已经接受的 lead rules：

- 可审核。
- 可回答。
- 可被 backing 承载。
- 可拆分。

如果无法提炼 lead，surface 不能进入 user review。

## 2. 组织 backing

surface 在 lead 之后组织 backing。

backing 是被 lead 统摄、用于支撑 / 展开 / 校验 lead 的材料层。

backing 不是材料列表，也不是理解辅助。

backing 应围绕 lead 回答：

- lead 从哪些 material 中提炼出来。
- lead 覆盖了哪些原始内容。
- lead 的依据是什么。
- lead 的边界是什么。
- lead 相关的可展开细节是什么。
- user 对 lead 有疑问时应该回看什么。

backing 不要求完整展示所有 material。

如果某个 material 没有参与 lead 的支撑、展开或校验，它不应该因为“存在于 input”就进入 backing。

## 3. 处理 current agent context

current agent context 不作为单独 UI 块预设。

它参与 lead / backing 的生成。

如果 surface 使用了 current agent context 中尚未落盘的判断，它必须把这些判断显式化到 lead 或 backing 中。

常见形式：

- 作为 lead 的前提。
- 作为 backing 的上下文依据。
- 作为待 user 核查的假设。
- 作为 lead 边界的一部分。

不能让未显式化的 agent context 隐形影响 user review。

## 4. 校验 lead/backing

surface 生成 lead + backing 后，必须自检。

至少检查：

- lead 是否可审核。
- lead 是否可回答。
- backing 是否足以承载 lead。
- backing 是否过散，导致 user 仍要自行组织判断链。
- lead 是否过大，需要拆分。
- 是否有未显式化的 current agent context 影响判断。

如果校验不通过，surface 不应该进入 user review。

## 失败处理

如果 surface 无法生成 lead + backing，应该回到 05 的失败处理链：

1. 判断 input 是否过大。
2. 判断 input 是否不足。
3. 判断目标是否不清。
4. 仍不成立则延后 review。

任何 fallback 都不能跳过 lead。

如果无法回到：

```text
material + context -> surface -> lead + backing
```

就不进入 user review。

## surface 输出

surface 的最小输出不是 UI block。

surface 的最小输出是 `lead + backing`。也可以把这个结构称为 review frame：

```text
lead
backing
```

其中：

- `lead`：最小 user 可审核单元。
- `backing`：lead 的承载层。

surface 如何生成 lead / backing 的说明不应该默认成为第三个必备块。

如果这类说明对 user 审核 lead 有必要，它应该进入 backing。

如果这类说明只用于追溯过程，应该留到 decision trace / provenance 设计中处理。

## HTML 的位置

HTML 后续可以承载这个 `lead + backing` 结构。

HTML 的价值不是定义 surface 结构，而是提供更好的展开、折叠、固定 lead、查看 backing 和标注风险的交互方式。

因此：

- surface generation rules 先于 HTML 形态。
- HTML 不能倒推 surface 结构。
- HTML 只实现或增强 `lead + backing` 的 review 体验。

## 当前结论

review surface 的最小问题不是“有哪些 UI 块”。

review surface 的最小问题是：

```text
如何从 material + current agent context 生成 lead + backing？
```

当前规则是：

```text
material + current agent context
  -> 提炼 lead
  -> 组织 backing
  -> 显式化参与判断的 agent context
  -> 校验 lead/backing
  -> 产出 lead + backing
```

## Review 问题

这组 surface generation rules 是否可以作为 Loop 2 的 working 定义？

## Review 状态

sayori 已确认：

- surface 职责层已经基本闭合。
- `md/html` 应作为 renderer config，不改变 surface 职责。
- surface generation rules 先于 HTML 形态。
- 下一环应设计 review frame。
