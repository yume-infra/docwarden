---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# contexta runtime first implementation boundary

1. contexta runtime 第一版应围绕真实可执行 CLI 展开，而不是继续停留在纯理论描述。
2. `contexta init` 只 materialize 本地 `.contexta` instance，不创建根部 `contexta.md`，不修改外部资产。
3. `.contexta` 是 runtime 实际读取的 local effective contexta instance。
4. vendor contexta 是远端概念层、pinned baseline 和 upgrade diff 来源，不是 runtime 平时读取的 source。
5. upgrade 是核心语义；runtime 必须为 vendor baseline 与 local effective instance 的后续 diff / migration 留出模型位置。
6. mapping 表达 contexta 内容如何展开到 target，不是 transform engine。
7. recognition 是核心 primitive，用于解释任意 md target 如何进入 contexta runtime。
8. lint 是 runtime 的核心；lint 之前必须先完成 target recognition。
9. lint 输出 signal，不直接输出最终语义 judgment。
10. primitive-creator 是 contexta 扩展自身语言体系的核心能力。
11. primitive-creator 的第一版落地对象是 skill primitive。
12. primitive 的最终字段结构不在本轮预设，应等待 Effect 代码解析真实 md surface 后反推。
13. contexta runtime 自包含但不自广告；外部发现由 host integration、agent instruction 或显式 CLI 调用承接。
14. skill primitive 必须保留导出为 agent 可消费 skill artifact 的模型位置，但第一版不要求完成 `SKILL.md` compiler。

## Review

本 lead 等待 sayori review。
