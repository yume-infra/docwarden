---
status: accepted
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# mechanism completion notes

## Correction

本文件原先倾向新增 handoff relation、review material reading rule 和 judgment return boundary。

这个方向不够简洁。

sayori 纠偏后，当前方向改为最大限度复用已有 review surface。

## Current Split

职责拆分后的链路是：

```text
contexta semantic-lint
  -> review-ready lint result
  -> docwarden review surface short path
  -> lead + backing
  -> review judgment
```

## Key Insight

signal handoff 不应该生成 lead。

signal definition 不应该生成 lead。

但 semantic-lint 的具体结果应尽可能组织成好的 review material，也就是接近 review surface 处理后的 `lead + backing`。

## Mechanism To Reuse

当前更需要复用已有 review surface，而不是新增 handoff relation 或 handoff schema。

如果 lint result 已经能表达：

```text
lead + backing
```

docwarden review surface 应走短路径。

## Review-ready Lint Result

一个好的 lint result 应包含：

- lead：围绕一次 signal 命中的最小审核问题。
- backing：支撑 user 判断 lead 的材料。

示意：

```text
lead:
  是否接受 signal `concept-as-policy` 对指定 assertion 的命中？

backing:
  - signal name
  - locator 或 context
  - trigger hit
  - confidence
  - signal definition link
  - Basis links
  - current agent context
```

## Responsibility Split

contexta 负责：

- signal definition。
- trigger。
- locator / confidence 等可被 lint 使用的定位与识别辅助。
- 让 lint result 能够接近 review-ready material。

docwarden 负责：

- review surface。
- 判断 lint result 是否足够成为 lead + backing。
- 必要时重组 lead + backing。
- review judgment。

## Still Missing

当前已落地的更小表达：

- semantic-lint pipeline 的 Output 描述 `review-ready lint result`。
- 现有 `semantic-lint-chain` relation 说明 review surface short path。

## Current Non-goals

- 不定义完整 CLI output schema。
- 不定义 review artifact 文件结构。
- 不把 signal definition 扩成 review guide。
- 不新增 handoff relation。
