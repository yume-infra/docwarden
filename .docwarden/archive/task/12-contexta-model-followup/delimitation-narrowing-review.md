---
status: accepted
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 5
---

# delimitation narrowing review

本文件是 task 12 Loop 5 的最小 review 单元，已通过审核并落地到 `.contexta`。

目标是收窄当前 concept modules 中的 Delimitation，让它只保留关键边界压力。

## 当前已有设计

已确认：

- Delimitation 处理局部边界压力。
- relation 处理 concept network 中的稳定位置和连接。
- concept module 不应默认包含 `Concept Relations` 章节。
- Delimitation 不应承担全局 relation network。
- 不是“相关就列”，而是“会错才列”。

## 收窄原则

Delimitation 只保留：

- 容易混淆的相邻概念。
- 混淆后会导致错误落点、错误书写或错误判断的边界。
- 当前 concept 必须说明“为什么不是另一个”的最小差异。

Delimitation 不保留：

- 普通使用关系。
- 承载关系。
- 上位 / 下位关系。
- 普通链接关系。
- 全局 concept network。
- 后续机制关系，除非它当前已经造成概念误判。

## 已落地收窄

本轮已收窄：

- 删除只表示 template 承载、module 承载、policy 约束、example 示范等泛相关关系的 Delimitation 项。
- 保留 workflow / pipeline / architecture / branch / composition 之间容易互写错的结构边界。
- 保留 kind 与 module / relation / template / assertion / example / status 的边界，因为这些已经在当前设计中造成过实际误判。
- 保留 mapping 与 relation / kind / docwarden workflow 的边界，因为这些会影响 mapping layer 的落点判断。

## relation 层级判断

如果要建模属于 contexta 自己的 relation，不应放回各个 concept module 的 Delimitation。

合理层级是：

```text
.contexta/
  mapping/
    bootstrap/
      relations/
```

理由：

- 这是 contexta 自己的 concept network，属于 bootstrap mapping。
- 它不是 docwarden mapping，不应放在 `.contexta/mapping/docwarden/`。
- 它不是 concept definition，不应放在 `.contexta/mapping/bootstrap/modules/concept/`。
- 它不是 policy，不应放在 `.contexta/mapping/bootstrap/modules/policy/`。
- 它不是 template，不应放在 `.contexta/mapping/bootstrap/templates/`。

`relation` 的 concept / policy 继续留在 bootstrap modules 中，用于定义 relation 语言和边界：

- `.contexta/mapping/bootstrap/modules/concept/relation.md`
- `.contexta/mapping/bootstrap/modules/policy/relation.md`

具体 relation network 后续应作为 bootstrap mapping 下的独立 relation layer 设计。

当前不直接新增 `.contexta/mapping/bootstrap/relations/`，因为 relation entry 的最小格式还没有 review。

## 后续承接

下一步如果继续推进 relation，应单独 review：

- relation entry 是否需要 `kind: relation`。
- relation entry 的最小正文结构。
- relation entry 是否按单文件网络、按主题拆分，还是按 relation type 拆分。
- relation 与 Delimitation 的读取顺序。
- relation 与未来 semantic lint 的关系。
