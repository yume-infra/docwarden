---
kind: policy
---

# template-boundary

## Intent

定义 contexta template 的职责边界。

本 policy 用于避免 template 承接规则本体、内容本体或 docwarden 生命周期。

## Scope

Applies to:

- [[template]]
- [[module]]
- [[assertion]]

适用条件：

- contexta 需要创建或修改 template。
- contexta 需要判断某个内容应进入 template、module 还是 policy。
- contexta 需要在 template 中提供 assertion 或 module 的书写槽位。

不适用条件：

- 需要定义某个 concept 的含义。
- 需要定义某条 policy 的规则本体。
- 需要处理 docwarden 的 task、review、promote、pick 或 cleanup。

## Rules

- template MUST 只负责复制后的内容骨架。
- template MUST NOT 承接来源、review、pick、更新、写入或生命周期。
- template MUST NOT 作为规则本体的长期落点。
- template MUST NOT 作为 concept 定义的长期落点。
- template MAY 提供 assertion 的书写槽位。
- template MAY 提供 module 的默认章节结构。
- template 中的占位内容 MUST 被视为写作提示，而不是已接受的 assertion。

## Rationale

template 的价值是降低新建内容时的结构偏移。

如果 template 同时承接规则本体、概念定义或生命周期，contexta 会把内容格式协议和 docwarden 操作流程混在一起。

规则本体应进入 policy module，概念定义应进入 concept module，生命周期应由 docwarden workflow 处理。

## Examples

合理的 template 内容：

```md
## Rules

- <主体> <MUST|MUST NOT|SHOULD|SHOULD NOT|MAY> <动作> <对象/范围/条件>。
```

这是规则书写槽位，不是规则本体。

不合理的 template 内容：

```md
- template MUST NOT 承接来源、review、pick、更新、写入或生命周期。
```

这是真实规则，应进入 policy module。
