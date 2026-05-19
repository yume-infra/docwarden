---
status: draft
created: 2026-05-19
updated: 2026-05-19
owner: sayori
---

# frontmatter field boundary

本文件记录当前已暴露但暂不展开的 frontmatter 字段边界。

## 当前判断

`.docwarden/user/profile.md` 与 `.contexta/templates/user-context.md` 的闭环已经成立。

当前不需要修改：

- `.docwarden/user/profile.md`
- `.contexta/templates/user-context.md`

但不能因此不记录字段边界。

## 字段边界

`kind: user-context` 是内容类型字段。

它属于 contexta 的内容格式协议范围。

`status / created / updated / owner` 是实体管理和操作状态字段。

它属于 docwarden 的实体管理范围。

## 不能混淆

不应把这两类字段统称为同一种 metadata。

更准确的拆法是：

- contexta 承接内容格式字段。
- docwarden 承接实体管理和操作状态字段。

## 后续承接

如果后续设计 frontmatter 协议：

- contexta 侧处理内容类型、内容结构和语义字段。
- docwarden 侧处理实体状态、维护信息和操作流程字段。

当前只记录边界，不设计完整 frontmatter 协议。
