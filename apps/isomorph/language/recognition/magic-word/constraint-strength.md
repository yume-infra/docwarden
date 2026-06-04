---
kind: magic-word
---

# constraint-strength

## Consumer

- [[language/primitive/concept/policy|policy]]
- [[language/grammar/policy/language|language]]
- [[language/semantic-lint/concept/semantic-lint|semantic-lint]]

## Source

- [[language/grammar/policy/language|language]]

## `MUST`

必须执行的规则强度。

## `MUST NOT`

禁止执行的规则强度。

## `SHOULD`

默认应执行，但允许明确例外的规则强度。

## `SHOULD NOT`

默认不应执行，但允许明确例外的规则强度。

## `MAY`

可选行为的规则强度。

## Boundary

constraint strength magic word 负责表达规则强度，不提供稳定地址。

需要长期回指具体 rule assertion 时，使用 locator marker，例如 `^rule-1`。
