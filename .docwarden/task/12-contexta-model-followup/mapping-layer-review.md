---
status: accepted
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 4
---

# mapping layer review

本文件是 task 12 Loop 4 的最小 review 单元，已通过审核并落地到 `.contexta`。

目标是定义 contexta 如何用目录结构说明理论到实体的映射关系。

## 当前已有设计

已确认：

- contexta 本身就是理论到实体的映射。
- 当前 `.contexta` 中混有两类内容：contexta 的 bootstrap 内容，以及 contexta 到 docwarden 的映射内容。
- 目录结构应表征这两类 mapping 关系。
- bootstrap layer 使用英文目录名 `bootstrap`。
- `.docwarden/user/profile.md` 是 docwarden 长期资产，不移动到 `.contexta`。

## 当前缺口

旧目录结构是：

```text
.contexta/
  modules/
    concept/
    policy/
  templates/
```

这个结构只能表达 content kind。

它不能表达：

- 哪些内容是 contexta 用来定义自己的 bootstrap 实体。
- 哪些内容是 contexta 面向 docwarden 资产的内容语言定义。
- 为什么 `user-context` 不应和 `kind`、`relation`、`template` 放在同一组 bootstrap concept 中。

## 已通过判断

### 1. mapping 是上位关系

mapping 是理论到实体的映射关系。

它回答：

```text
这个理论对象被映射成哪一类 md 实体？
```

contexta 当前至少需要两类 mapping：

- bootstrap mapping：contexta 用自己的内容语言定义 contexta 自己。
- docwarden mapping：contexta 定义的内容语言被 docwarden workflow 用来生成和维护具体长期资产。

### 2. 目录第一层表达 mapping 关系

新的目录结构是：

```text
.contexta/
  mapping/
    bootstrap/
      modules/
        concept/
        policy/
      templates/
    docwarden/
      modules/
        concept/
      templates/
```

这表示先判断理论映射到哪里的实体，再判断实体使用哪种内容语言。

### 3. bootstrap mapping

bootstrap mapping 承接 contexta 自己定义自己的内容。

例如：

- `.contexta/mapping/bootstrap/modules/concept/metadata/kind.md`
- `.contexta/mapping/bootstrap/modules/concept/relation.md`
- `.contexta/mapping/bootstrap/modules/concept/template.md`
- `.contexta/mapping/bootstrap/modules/policy/template-boundary.md`
- `.contexta/mapping/bootstrap/templates/concept.md`

### 4. docwarden mapping

docwarden mapping 承接 contexta 面向 docwarden 资产的内容语言定义和复制骨架。

例如：

- `.contexta/mapping/docwarden/modules/concept/user-context.md`
- `.contexta/mapping/docwarden/templates/user-context.md`

docwarden 具体长期资产仍留在 `.docwarden`：

- `.docwarden/user/profile.md`

### 5. 后续需求位置

format、locator 和 semantic lint 都是后续需求。

它们应建立在 mapping 关系已经稳定之后：

- format 后续定义某类 mapping entity 的正文形状。
- locator 后续定义如何稳定指向 mapping entity 内部的位置。
- semantic lint 后续检查 mapping entity 是否出现语义偏移。

## 已落地范围

本轮长期层落地：

- 新增 `.contexta/mapping/bootstrap/modules/concept/mapping.md`。
- 新增 `.contexta/mapping/bootstrap/modules/policy/mapping-boundary.md`。
- 将 contexta 的 bootstrap concept / policy / template 迁移到 `.contexta/mapping/bootstrap/`。
- 将 `user-context` concept / template 迁移到 `.contexta/mapping/docwarden/`。
- 同步 `.contexta` 和 task 12 中的路径引用。

本轮不做：

- 不移动 `.docwarden/user/profile.md`。
- 不设计 format。
- 不设计 locator。
- 不进入 semantic lint 信号整理。

## 审核结果

sayori 已确认：

- 当前缺口是 contexta 的 bootstrap 内容与 contexta 到 docwarden 的映射内容混在一起。
- contexta 应定义清楚这个 mapping 关系。
- 文件夹结构应表征相关关系。
- bootstrap layer 使用英文目录名 `bootstrap`。
