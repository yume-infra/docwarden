---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 4
---

# dry run conclusion

本文件记录 `08-promote-pick-dry-run` 的结论。

## 跑通的部分

### 1. promote 前需要 review artifact

主流程 promote 不能直接从 task material 生成。

本次 dry run 跑通了：

```text
task material + current agent context
  -> .docwarden/review/docwarden-review-workflow/
  -> lead.md + backing.md
  -> promote candidates
```

### 2. review artifact 需要模块拆分

当前可用结构是：

```text
review artifact/
  index.md
  lead.md
  backing.md
```

其中：

- `index.md` 负责入口和交接。
- `lead.md` 只放待审核内容本体。
- `backing.md` 承载来源、上下文、边界和校验材料。

### 3. promote 可以做职责投影

本次 dry run 能把同一个 lead 投影为：

- spec candidate。
- guide candidate。
- wiki candidate。

但当前只能验证方向，不能稳定 apply。

### 4. pick 也需要 review surface

pick 不能由 agent 直接生成长期化候选。

本次 dry run 跑通了：

```text
conversation correction + review artifact + task log
  -> .docwarden/review/review-lead-minimality/
  -> lead.md + backing.md
```

### 5. pick source 包括对话上下文

pick source 不只包括 task material 或 promote residue。

它还包括：

- current conversation context。
- user 纠偏。
- agent 错误模式。

## 暴露的缺口

### 1. spec / guide / wiki 缺少最小产物模板

当前长期层只有入口文件。

因此 promote candidates 不能真实 apply。

需要后续设计：

- spec module 最小模板。
- guide page 最小模板。
- wiki node 最小模板。

### 2. review artifact schema 还没有固化

本次跑出了可用结构：

```text
index.md / lead.md / backing.md
```

但它还没有进入 docwarden 主线规则。

这应该另走 promote review。

### 3. 用户层资产承接层未定

pick 已确认目标是 user-level asset。

但最终承接层还未确定。

当前不能假设一定进入 wiki。

这不表示 pick 到此为止。

未来必须存在用户层资产承接内容，用于保存 accepted pick。

本次 dry run 已产生两个用户层资产候选：

- `.docwarden/review/review-lead-minimality/`
- `.docwarden/review/sayori-working-profile/`

### 4. cleanup config 还没有设计

当前只确认：

```text
after_promote_pick: delete | archive
default: delete
```

还没有定义 config 文件位置、字段归属和执行时机。

### 5. review/pick 的真实 apply 编排未设计

当前 dry run 只验证候选生成。

还没定义：

- review artifact 如何创建。
- accepted review 如何触发 promote。
- accepted pick 如何进入用户层资产。
- promote / pick 后如何 cleanup task。

## 下一步建议

下一步不应继续扩展 dry run。

更合适的是开新 task，设计：

```text
spec / guide / wiki 最小产物模板
```

原因：

- promote candidates 已经暴露它是当前 apply 的 blocker。
- 没有长期层模板，就无法判断 promote 是否真的能写入。
- review artifact schema 和 cleanup config 可以随后进入主线规则设计。
