---
status: accepted
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# signal review handoff boundary

## Review Lead

signal 本身不直接成为 lead。

semantic-lint 的结果应尽可能贴近 docwarden review surface 处理后的 `lead + backing`，成为一个好的 review material。

如果 lint result 已经能表达 `lead + backing`，docwarden review surface 应走短路径，而不是引入新的 handoff schema。

## Why

contexta 已经负责：

- formatted md。
- semantic-lint。
- signal definition。
- locator / confidence 等定位和识别辅助。

docwarden 已经负责：

- review input。
- review surface。
- lead + backing。
- review judgment。

如果 signal definition 直接生成 lead，contexta 就会越界替 docwarden 定义 review surface。

但 semantic-lint 的具体结果可以复用已有 review frame，把本次命中组织成接近 `lead + backing` 的 review material。

## Handoff Boundary

signal handoff 不是新的长期 schema。

它只是说明 semantic-lint 产生的结果如何复用已有 review surface。

最小 review-ready lint result：

- lead：围绕一次 signal 命中组织的最小审核问题。
- backing：承载 signal name、locator/context、trigger hit、confidence 和可回读依据。

其中：

- signal name 指向 signal definition。
- locator 优先；没有 locator 时只能提供 module path / heading 等 context。
- trigger hit / confidence 是 backing material，不作 judgment。

不携带：

- final judgment。
- policy violation 结论。
- 修复动作。
- signal definition 的 Basis 复制件。
- 完整 CLI output schema。

## Basis Reading

Basis 不需要在 lint result 中重复。

review surface 可以通过 signal name 回读 signal definition，再从 signal definition 的 `Basis` 读取判断依据。

这保持了单一职责：

- lint result 只组织本次命中的 review material。
- signal definition 维护 warning name 的长期含义。
- review surface 可以直接采用已经足够好的 lead + backing，或在不足时重新生成。

## Review Surface Shape

lint result 进入 docwarden 后，应回到已接受的 review surface 规则：

```text
material + current agent context
  -> lead + backing
```

如果 lint result 已经足够好，它可以直接作为短路径 review frame。

一个可能的 lead：

```text
是否接受 signal `concept-as-policy` 对指定 assertion 的命中？
```

backing 应承载：

- signal name。
- locator 或 context。
- trigger hit。
- signal definition link。
- Basis 链接。
- 影响本轮判断的 current agent context。

## Boundary

本轮只确认交接边界。

不确认：

- CLI 输出字段。
- review artifact 文件结构。
- signal 修复流程。
- accepted signal 后的 promote / pick / cleanup。

## Acceptance Questions

1. 是否接受：signal 本身不直接成为 lead？
2. 是否接受：lint result 应尽可能组织成 review-ready lead + backing？
3. 是否接受：Basis 通过 signal definition 回读，不在 lint result 中重复？
4. 是否接受：trigger hit / confidence 先作为可选材料，不上升为必填 schema？

## Review Status

sayori 已接受原 4 点，并进一步纠偏：

- lint result 应尽可能贴近 review surface 处理后的 `lead + backing`。
- 这里应最大限度复用已有 review surface，而不是新增 handoff relation、review material reading rule 或 judgment return boundary。
