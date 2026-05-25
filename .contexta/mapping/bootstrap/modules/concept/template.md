---
kind: concept
---

# template

## Designation

Canonical: `template`

## Naming Need

contexta 需要一个名字表示复制后的内容骨架。

这个名字用于避免把内容骨架与规则本体、实际 module 内容或 workflow 过程混在一起。

## Definition

template 是内容复制骨架，用于给已确认内容语言的 module 提供初始章节和占位提示。

template 的语义重点是生成初始形状，而不是承接内容本体、证明 kind 成立或表达操作流程。

一个 template 可以存在，需要目标内容语言已经确认、正文骨架稳定，并且新建同类 module 时有复制需求。

## Delimitation

| Neighbor | Difference |
| --- | --- |
| [[mapping/bootstrap/modules/concept/module|module]] | module 是实际语义组合单位；template 是创建 module 时可复制的骨架。 |
| [[mapping/bootstrap/modules/concept/policy|policy]] | policy 承载规则本体；template 只提供结构槽位。 |
| [[mapping/bootstrap/modules/concept/metadata/kind|kind]] | kind 是内容语言入口；template 文件中的 kind 指向复制后目标 module 的内容语言。 |
| docwarden workflow | docwarden workflow 处理操作流程；template 不表达流程过程。 |

## Examples

### Scenario

agent 看到 `relation` 已经有 concept module，准备新增 `.contexta/mapping/bootstrap/templates/relation.md`。

### Judgment Material

```yaml
kind: relation
```

### Positive

```md
不要仅因为 `relation` 是 concept 就创建 relation template。

当前 relation 还没有独立、稳定、可复制的目标 module 骨架需求；它的定义和约束已经分别由 concept / policy module 承接。
```

这个 example 让 agent 看到 template 的成立条件：已确认内容语言、稳定正文骨架和复制需求必须同时存在。

### Negative

```md
新增 `.contexta/mapping/bootstrap/templates/relation.md`，因为 relation 已经是 concept，所以它也应该成为 kind。
```

这把 template 当成证明 kind 成立的手段，反向制造了内容语言。

### Borderline

```md
.contexta/mapping/docwarden/templates/user-context.md
```

这可以保留，因为 user-context 已被确认为内容语言，并且有稳定正文骨架：Context / Boundary / Assertions / Notes。
