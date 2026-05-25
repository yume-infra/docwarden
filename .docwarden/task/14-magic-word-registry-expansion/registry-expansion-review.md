---
status: accepted
created: 2026-05-25
updated: 2026-05-25
owner: sayori
---

# registry expansion review

## Review Lead

现在应该进入 magic-word registry 扩充，但不能直接把所有稳定英文词都塞进 registry。

magic-word 的准入标准应是：这个 token 或短表达会影响读取方式、判断方式、定位方式，或未来 semantic-lint 的消费方式。

## Current Baseline

- [[mapping/bootstrap/modules/concept/magic-word|magic-word]] 负责定义 magic-word 和准入边界。
- [[mapping/bootstrap/modules/magic-word/transition|transition]] 已作为第一份 registry，维护 `0->1` 和 `1->2`。
- `kind: magic-word` 已表示 magic-word registry language。
- magic-word 不创建新的语义对象，只记录已有命名和控制词的消费角色。

## Candidate Families

### `constraint-strength`

候选 token：

- `MUST`
- `MUST NOT`
- `SHOULD`
- `SHOULD NOT`
- `MAY`

为什么成立：

- 它们直接影响 policy assertion 的 constraint strength。
- 它们已经由 [[mapping/bootstrap/modules/policy/language|language]] policy 稳定。
- 它们适合 semantic-lint 识别 policy language、concept-as-policy 等偏移。

建议：优先落地。

### `designation-role`

候选 token：

- `Canonical`
- `Aliases`
- `Avoid`

为什么成立：

- 它们直接影响 naming token 的置信度角色。
- `Canonical` 是 primary magic word 来源。
- `Aliases` 是 fallback token 来源。
- `Avoid` 是 negative token 来源。

建议：优先落地。

### `locator-marker`

候选 token：

- `^a-*`

为什么成立：

- 它直接影响 assertion locator 是否成立。
- 它是 signal instance 从 candidate context 指向 assertion 的关键标记。
- 它已经由 [[mapping/bootstrap/modules/policy/link-resolution|link-resolution]] 和 semantic-lint 相关 policy 使用。

建议：优先落地。

分层判断：

- `locator` 是定位机制。
- `locator-marker` 是该机制里可被读取和消费的 magic-word family。
- `^a-*` 不进入 locator concept 定义主体，也不新增 `marker` concept。

### `kind-value`

候选 token：

- confirmed `kind` values。

为什么成立：

- `kind` value 影响 module 的内容语言读取方式。

为什么延后：

- 当前 confirmed kind values 已经可以从 frontmatter 和目录结构读取。
- 手工维护完整 kind value registry 可能和已有 source 重复。
- 更适合等 `kind / module / content language` loop 后再决定是否建立 registry。

建议：延后。

### `signal-id`

候选 token：

- 当前 `modules/signal/*.md` 的 filename stem。

为什么成立：

- signal id 会影响 warning signal 的识别。

为什么延后：

- signal module 本身已经是 source registry。
- 现在再建一份 signal-id registry 可能重复。
- 更适合等 CLI 输出 schema 出现后再判断是否需要索引层。

建议：延后。

### `relation-verb`

候选 token：

- `part-of`
- `whole-of`
- `realized-as`
- `initializes`
- `preserves`
- `consumes`
- `emits`

为什么成立：

- relation verb 影响 relation block 的读取方式。

为什么延后：

- relation verb vocabulary 还在快速变化。
- 现在过早建 registry 会冻结未稳定的连接语言。

建议：延后。

## Proposed First Expansion

第一批只落地三份 registry：

```text
.contexta/mapping/bootstrap/modules/magic-word/constraint-strength.md
.contexta/mapping/bootstrap/modules/magic-word/designation-role.md
.contexta/mapping/bootstrap/modules/magic-word/locator-marker.md
```

暂不落地：

```text
kind-value.md
signal-id.md
relation-verb.md
```

## Acceptance Questions

1. 是否接受现在进入 magic-word registry 扩充？
2. 是否接受第一批只落地 `constraint-strength`、`designation-role`、`locator-marker`？
3. 是否接受 `kind-value`、`signal-id`、`relation-verb` 延后？
4. 是否接受 registry module 使用 module-level `Consumer` / `Source`，并在每个 token heading 下直接写作用说明？

## Accepted Result

- 已接受进入 magic-word registry 扩充。
- 已接受第一批只落地 `constraint-strength`、`designation-role`、`locator-marker`。
- 已接受 `kind-value`、`signal-id`、`relation-verb` 延后。
- 已接受 locator / locator-marker 的机制与 marker 分层。

## Correction

- `Consumer` 和 `Source` 是 registry module 级别字段，不在每个 token 下重复。
- `Registry` 不作为二级标题。
- `policy-modal` 重命名为 `constraint-strength`。

## Token Body Correction

- 每个 token heading 下直接写作用说明。
- 不再保留 `Role`、`Reading Role` 或 `Confidence Role` 字段标签。
- confidence 属于后续 semantic-lint / confidence 层，不在 magic-word registry 中提前建模。
