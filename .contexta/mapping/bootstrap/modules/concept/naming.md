---
kind: concept
---

# naming

## Designation

Canonical: `naming`

Aliases:

- semantic naming

Avoid:

- style
- label
- decoration

## Naming Need

contexta 需要一个名字表示内容系统中的语义定位机制。

这个名字用于避免把命名误解为表面风格。对 agent 而言，目录名、文件名、标题名和 concept 名都是搜索入口和语义落点。

## Definition

语义定位机制，用于让名称稳定指向内容对象、内容类型、概念关系或规则主题。

naming 的核心是让 agent 能通过名称找到正确内容，并避免把相邻语义对象混淆。

naming 为 semantic-lint 提供可消费的命名来源，但不定义完整 token 分层。

primary magic word、fallback token 和 negative token 的消费角色由 [[mapping/bootstrap/modules/concept/magic-word|magic-word]] 定义。
