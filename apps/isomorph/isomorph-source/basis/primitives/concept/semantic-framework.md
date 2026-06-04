---
kind: concept
---

# semantic-framework

## Designation

Canonical: `semantic-framework`

Aliases:

- semantic framework
- 语义框架

## Naming Need

isomorph 需要一个名字表示用户或项目为某个领域建构的语义体系。

这个名字用于阻止 root primitives 被误读成所有领域术语的总表，也用于阻止 docwarden、contexta 或 runtime mapping 被反向塞回 `.isomorph`。

## Definition

semantic-framework 是由用户或项目定义的 domain semantic system。

它命名稳定对象、relation、basis、boundary、loss model 和 agent-use surface。

root `.isomorph` 不拥有具体项目的 semantic framework。root primitives 只提供 bootstrap language，让 framework 可以被建构、识别、lint，并在需要时形成 export shape。

正确方向是：

```text
isomorph bootstrap primitives
  -> user/project semantic framework
  -> agent-use contract
  -> downstream materialization
```

`vocabulary` 是 semantic framework 的 naming surface。
