---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
source_task: 08-promote-pick-dry-run
---

# review lead minimality

1. 给 user 审核的 `lead` 只保留待审核内容本体。
2. 待审核内容本体是一个单一职责模块及其可审核断言。
3. `lead` 中的断言应足够直接，user 能逐条接受、修改、删除或要求拆分。
4. `lead` 中出现解释、来源、边界、上下文、review 方式或流程许可，都是膨胀信号。
5. 这些 meta 信息应进入 `index`、`backing` 或其他承载层。
6. 当 agent 把 user-facing lead 写成 agent policy、教程、候选报告或流程许可问题时，应要求重写。
7. 当 user 反复纠正“最小”“可审核”“给人看”“不要废话”时，应优先检查 lead 是否混入了非审核内容。
8. 对话纠偏本身可以作为 pick source；pick 不应只看 task material 或 promote residue。
