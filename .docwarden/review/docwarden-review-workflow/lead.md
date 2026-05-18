---
status: draft
created: 2026-05-18
updated: 2026-05-19
owner: sayori
source_task: 08-promote-pick-dry-run
---

# docwarden review workflow

```text
task
  -> surface for promote
  -> user review
  -> promote mainline delta
  -> pick user-level compoundable assets
  -> delete/archive working
```

1. `task` 是短命任务过程层，不是长期知识入口。
2. `surface for promote` 发生在 promote 之前，用于生成 `lead + backing`。
3. `user review` 一次只审一个 lead；多 lead 必须上收或拆分。
4. `promote` 处理项目主线基线 delta，不搬运 raw material 或完整 review surface。
5. `pick` 发生在 promote 之后，捞可复利的用户层级资产；最终承接层暂不锁死。
6. `cleanup` 默认 delete，可通过 config 选择 archive。
