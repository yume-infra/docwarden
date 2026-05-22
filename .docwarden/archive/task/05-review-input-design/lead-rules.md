---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
loop: 3
---

# lead rules

本文件记录 Loop 3 草案，用于定义 review input readiness 的实际判断点：lead 规则。

## 纠偏

Loop 3 不应该问“material 进入 review input 前是否必须已经有明确 review 目标”。

原因是当前链路已经确定：

```text
review input = material + current agent context
review surface -> lead + backing
```

如果要求 material 在进入 input 前已经有明确 lead，就等于把 review surface 的职责提前塞回 input。

因此，input readiness 不应该被设计成“material 已经整理成 lead 才能进入 review”。

真正需要定义的是 lead rules：

```text
surface 什么情况下能从 input 中提炼 lead？
什么情况下不能提炼，应当拆分、补充 material 或回到 user 处确认？
```

## lead 的职责

lead 是最小 user 可审核单元。

lead 的作用不是概括全部材料，而是把 user 的审核动作压缩到一个明确判断上。

user review 的主要动作应该是：

- 判断 lead 是否成立。
- 判断 lead 是否清晰。
- 判断 lead 是否过大，需要拆分。
- 判断 lead 是否遗漏关键 backing。
- 判断 agent 是否带入了错误 context。

## lead 的来源

lead 可以有两种来源：

1. material 中天然存在 lead。
2. surface 从 material + current agent context 中提炼临时 lead。

天然 lead 可以是：

- 一个明确草案文件。
- 一个明确命题。
- 一个当前 task 的核心入口段落。
- 一个 user 明确要求 review 的对象。

临时 lead 是 surface 为本轮 review 生成的 lead。

临时 lead 可以是：

- 本轮主问题。
- 本轮主判断。
- 本轮最小待确认命题。
- 一段组织 user review 的 lead section。

## lead 必须满足的条件

一个 lead 至少需要满足：

1. 可审核。
2. 可回答。
3. 可被 backing 承载。
4. 可拆分。

## 1. 可审核

lead 必须能被 user 判断。

错误例子：

```text
整理一下这些材料。
```

这不是 lead，因为 user 无法直接判断它是否成立。

更好的形式：

```text
本轮是否接受 review input = material + current agent context？
```

## 2. 可回答

lead 应该能导向明确 review 结果。

review 结果可以是：

- 接受。
- 拒绝。
- 修改后接受。
- 拆分。
- 延后。

如果 lead 只能引导开放讨论，而不能形成判断，它就不适合作为本轮最小 user-review 单元。

## 3. 可被 backing 承载

lead 不能是悬空判断。

surface 必须能为 lead 组织 backing。

backing 用于支撑 / 展开 / 校验 lead。

如果 material + current agent context 无法提供 backing，说明当前 input 不足，surface 不应强行生成 lead。

## 4. 可拆分

lead 可以被 user 判断为过大。

如果 lead 包含多个互相独立的问题，surface 应该提示拆分。

拆分不是失败，而是 review system 正确识别了最小 user-review 单元边界。

## 无法生成 lead 的情况

如果 surface 无法生成 lead，通常说明：

- material 过散。
- material 范围过大。
- material 之间没有共同 review 问题。
- current agent context 不足。
- user 目标不清楚。

此时 agent 不能把 materials 原样交给 user。

agent 应该按失败处理链处理。

## 失败处理链

如果 surface 无法生成 lead，说明当前这次 review 不能继续进入 user review。

不能做的是：把 materials 原样交给 user，让 user 自己组织判断链。

应该按顺序处理：

1. 判断是否 input 过大。
2. 判断是否 input 不足。
3. 判断是否目标不清。
4. 仍不成立则延后 review。

## 1. input 过大

如果 material 太多、覆盖多个独立问题，agent 应该缩小 material 或拆分 review。

```text
一个 review -> 多个 review
```

## 2. input 不足

如果 material 不够支撑判断，例如缺少来源、前置结论或 user 刚确认的上下文，agent 应该补充 material，或把必要的 current agent context 显式表达出来。

```text
补 material / 补 context -> 再生成 surface
```

## 3. 目标不清

如果 agent 不知道本轮到底要审什么，应该回问 user 确认 review 目标。

```text
回问 user -> 重新 selection
```

## 4. 延后 review

如果当前无法缩小、无法补充，也无法通过一个问题澄清，就延后本轮 review，不生成 surface。

## fallback 约束

任何 fallback 都不能跳过 lead。

也就是说，即使是失败处理，最终也必须回到：

```text
material + context -> surface -> lead + backing
```

如果回不来，就不进入 user review。

## backing 不是辅助理解材料

backing 是 lead 的承载层。

它负责支撑 / 展开 / 校验 lead。

backing 可以承载：

- lead 从哪些 material 中提炼出来。
- lead 覆盖了哪些原始内容。
- lead 的依据是什么。
- lead 的边界是什么。
- lead 相关的可展开细节是什么。
- user 对 lead 有疑问时应该回看什么。

降低 user review 成本的是 lead。

backing 不承担主要审核心智，但它保证 lead 可追溯、可展开、可校验。

## 当前结论

input readiness 的关键不是 material 是否已经有 lead。

input readiness 的关键是：

```text
material + current agent context 是否足以让 surface 生成一个可审核、可回答、可被 backing 承载、可拆分的 lead。
```

如果可以，input ready。

如果不可以，agent 应该缩小、补充、拆分或回问 user。

## Review 问题

这组 lead rules 是否可以作为 Loop 3 的 working 定义？

## Review 状态

sayori 已确认这组 lead rules 与无法生成 lead 时的失败处理链。
