---
kind: concept
---

# recognition-primitive

## Designation

Canonical: `recognition-primitive`

## Naming Need

isomorph 需要一个名字表示本地材料如何把可观察的 markdown surface 解释成候选角色。

这个名字用于避免 runtime 直接把 `frontmatter.kind`、路径或 heading 当成识别权威。

## Definition

recognition-primitive 是本地 isomorph 材料，用于把可观察的 markdown surface 解释成 candidate role。

frontmatter、path、heading、section、link 和 locator marker 都只是 feature。它们不能单独成为 recognition authority。

recognition authority 必须来自本地 `.isomorph` 中显式存在的 recognition material。
