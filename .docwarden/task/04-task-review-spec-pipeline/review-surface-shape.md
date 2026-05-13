---
status: accepted
created: 2026-05-13
updated: 2026-05-13
owner: sayori
loop: 4
review: accepted
---

# review surface 最小形态

本文件记录 Loop 4 已通过 review 的 working 定义，用于定义 review surface 的最小形态。

## 核心判断

review system 是一个大体系，当前理论层还不够处理完整设计。

本轮不展开 review system 的详细结构，也不定义 HTML review artifact 的完整格式。

当前只确认 review 的生命周期和职责边界。

## 一轮审查

review 应当只做一轮。

user 在这一轮中解决需要解决的问题，确认关注点，并纠正模型偏移。

一轮 review 后，模型应该自己提炼内容，并分发到：

- `spec`
- `guide`
- `wiki`

如果 user 觉得结果不对，可以再去相关目录下 review 更多内容，而不是让 review 层长期承载所有理解。

## 短命与留痕

review surface 本体应该短命。

例如：

- HTML review 页面
- 临时对比界面
- 临时 review data
- 其他为降低 user review 成本生成的界面材料

这些不是长期知识层，也不是最终展示层。

review 结果需要留下可追溯痕迹。

可追溯痕迹可以包括：

- 哪些问题被 user 确认过
- 哪些关注点被确定
- 为什么某些内容进入 spec / guide / wiki
- 哪些内容被放弃或延后

## 结果去向

review 不负责长期保存整个审查界面。

review 的长期价值应该通过后续产物表达：

- `spec`：agent-facing 执行规范
- `guide`：user-facing 叙事理解
- `wiki`：长期知识网络

review 只保留足够的 decision trace。

decision trace 的具体落点暂不定义。

可能落点包括：

- 对应 task 的 `log.md`
- 后续目标文件的 source / provenance
- wiki 中的 ADR / decision 页面，如果它本身有长期价值

## 当前不做

本轮不定义：

- review artifact 的最终目录结构
- HTML review 页面格式
- `data.json` schema
- review result 文件格式
- review system 的完整编排

## 当前结论

- review surface 是短命界面。
- review decision / trace 需要可追溯。
- review 不作为长期知识入口。
- 一轮 review 后，由模型分发到 spec / guide / wiki。
- review system 后续需要单独设计。

## Review 状态

sayori 已接受本轮定义。
