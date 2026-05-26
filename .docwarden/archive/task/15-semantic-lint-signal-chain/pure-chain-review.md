---
status: accepted
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# pure chain review

## Review Lead

semantic-lint 的最简链路是：

```text
formatted md -> semantic-lint -> signal -> review
```

semantic-lint 产生 signal。signal 进入 review。review 后才形成判断。

## Layer Split

### Core Chain

- formatted md：semantic-lint 的输入。
- semantic-lint：检测机制。
- signal：被检测出的语义偏移提示。
- review：对 signal 的判断环节。

### Implementation Detail

- candidate：疑似 signal，通常缺少稳定 assertion locator。
- instance：一次已定位 signal 命中，通常带有 assertion locator。
- evidence：支持 signal 的检测材料。

这些不作为 contexta 核心对象。

### Review Judgment

- final judgment 属于 review 后判断。
- policy violation 是 review 后可能形成的判断。
- 它们不是 semantic-lint 的直接产物。

## Accepted Result

- 不新增 semantic-output registry。
- 不新增 CLI schema。
- 不扩 signal definition。
- 先稳定 pure chain，再讨论 signal 的其他设计。
