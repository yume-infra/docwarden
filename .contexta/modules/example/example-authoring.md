---
kind: example
---

# example-authoring

## 语境

agent 正在修订 contexta module 的 `## Examples`。旧写法把 example 写成抽象对照列表，用户指出这不能训练 agent 判断。

## Scenario

agent 新建一个约束 template 职责边界的 policy module。

## Judgment Material

- `.contexta/modules/policy/template-boundary-policy.md`
- `.contexta/modules/policy/template-must-not-own-lifecycle.md`

## Positive

```md
正确命名：

- `.contexta/modules/policy/template-boundary.md`

正确判断：

目录和 frontmatter 已经表达 kind，文件名不应重复 `policy`。文件名也不应直接写成单条规则；它要表达稳定约束主题。
```

这个 example 有真实写作压力、具体错误文本、正确文本和判断理由。

## Negative

```md
### Positive

template-boundary
semantic-granularity

### Negative

good-rules
misc
```

这个写法只列名字。agent 看不出用户请求是什么、错误会发生在哪里、为什么某个名称有效，也就很难迁移到下一个文件。

## Borderline

占位：需要补一个边界 example，用来说明“有具体文本但缺少判断场景”的写法如何修正。
