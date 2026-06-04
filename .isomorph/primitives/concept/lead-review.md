---
kind: concept
---

# lead-review

## Designation

Canonical: `lead-review`

Aliases:

- lead review
- review gate
- review-ready lead

Avoid:

- docwarden review gate

## Naming Need

isomorph 需要一个名字表示用户偏好的最小审核组织方式。

这个名字用于避免把 `lead + backing` 误读成 docwarden CLI schema、临时 review surface、semantic-lint 输出格式或某个具体 runtime skill。

## Definition

lead-review 是把 candidate assertion、signal、correction 或 candidate update 组织成 `lead + backing` 的 agent-use review theory。

`lead` 是最小 user-reviewable commitment。它只承载用户本轮需要接受、拒绝、修正或改路由的核心判断。

`backing` 是支撑 lead 的材料层。它可以包含 source correction、相关 module、signal、trigger hit、locator、boundary、reason、expected behavior 或验证证据。

lead-review 不拥有 docwarden workflow，也不替代 semantic-lint。semantic-lint 可以尽量产出 review-ready lint result；docwarden review 可以 dogfood lead-review；contexta 可以把 lead-review materialize 成 Codex skill。

正确方向是：

```text
candidate assertion / signal / correction
  -> lead-review
  -> lead + backing
  -> user review
  -> accepted / rejected / revise / route
```
