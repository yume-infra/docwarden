---
status: draft
created: 2026-05-31
updated: 2026-05-31
owner: sayori
---

# Review Mode Options

本文件记录 docwarden workflow config 中的 review 策略选项。

## 核心修正

`review` 不是固定成一种流程。

它应是 workflow config 中的一个 mode / option。

当前至少需要两种模式：

- `review-first`
- `review-later`

## review-first

`review-first` 是当前对话一直采用的小步推进理念。

含义：

- 任务小步推进。
- 尽可能多地让用户 review 关键判断。
- review 后再 promote / pick / cleanup。
- 用更多 review 换取生成后质量和口径稳定性。

用户体验：

```text
task execution
  -> review phase
  -> user review
  -> route / promote / pick / cleanup
```

适用场景：

- 理论边界仍在形成。
- 用户对命名、产品线和层级非常敏感。
- 文档要进入长期主线。
- 错误成本高。
- agent 容易自作主张。

## review-later

`review-later` 是另一条可配置路径。

含义：

- agent 先按自己的判断生成内容。
- 生成后的文档或实体带上待 review 标记。
- 用户最后集中走一遍 final review。
- final review 通过后清除待 review 标记。

用户体验：

```text
task execution
  -> generate judged content
  -> mark as pending review
  -> continue workflow
  -> final review
  -> clear pending review tags
```

适用场景：

- 用户希望先看完整产物。
- 批量生成比逐步审核更重要。
- 内容风险较低。
- 用户愿意在最后集中审查。
- 中间 review 会打断推进节奏。

## 待 review 标记

`review-later` 需要一个明确的 pending review 标记机制。

该标记表示：

- 内容已经生成。
- agent 认为内容可以暂时进入目标位置。
- 用户尚未最终确认。
- 后续 final review 必须处理它。

pending review 标记不能被误认为 accepted。

## workflow config 位置

review mode 应由 workflow config 维护，而不是写死在 `dw:review` skill 中。

最小配置应表达：

```text
review.mode = review-first | review-later
```

并影响：

- 是否在生成前要求 user review。
- 是否允许先写入带 pending review 标记的内容。
- final review 需要扫描哪些 pending 标记。
- cleanup 是否允许在 pending review 未清除时执行。

## contexta / workflow 边界

这里不需要为 workflow 再发明一个单独产品名，也不应该把 docwarden workflow 放到 contexta 下面。

workflow 的语义定义在 isomorph：它是 state / move / transition 共同成立的推进结构。

`dw:`、`ctx:`、`iso:` 或 `ym:` 的 capability 里可以出现 workflow structure instance，通常以 workflow config / workflow asset 的形式被维护。

但它的语义和编排归属由所在产品线决定。

例如：

- `dw:review` 属于 docwarden workflow。
- `ctx:*` 可以包含 contexta 自己的分发 workflow。
- `iso:*` 可以包含 isomorph 的语义检查 workflow。

contexta 可以映射 `dw:review` 相关的 skill / prompt / agent，也可以映射某个 workflow config 文件；但它不拥有 docwarden 的 review mode 或 promote / pick 编排。

关键不是给 workflow 另起一个大名字，而是明确：

- isomorph 定义 workflow 的结构语义。
- 所在产品线拥有 workflow instance 的业务语义和配置。
- runtime / agent 执行 workflow。
- contexta 只在需要时映射相关 capability。
