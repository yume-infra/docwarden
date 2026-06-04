---
kind: locator
---

# rule

## Marker

`rule-*`

`rule-*` 是 rule locator prefix，只提供稳定地址。

## Surface

`## Rules`

## Applies To

- policy module 中可单独 review、引用、lint 或迁移的规范性规则。
- 需要被外部 signal、review、trace 或迁移长期回指的 rule assertion。

## Boundary

`rule-*` 不用于 example 中展示的规则片段、code fence 中的规则样例、signal trigger 条件或非 normative checklist。

`rule-*` 不判断规则强度，也不替代 RFC2119 magic word。

`MUST`、`SHOULD`、`MAY` 等 magic word 负责表达规则强度；`rule-*` 只负责给具体 rule assertion 提供稳定地址。
