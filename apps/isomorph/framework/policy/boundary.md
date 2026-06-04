---
kind: policy
---

# semantic-framework-boundary

## Intent

保护 isomorph package source 的 framework-facing position，避免它替用户或项目拥有 domain semantic framework。

## Scope

Applies to:

- [[framework/concept/semantic-framework|semantic-framework]]
- [[framework/concept/vocabulary|vocabulary]]
- [[framework/concept/mapping|mapping]]
- [[framework/policy/source-ownership|source-ownership]]

适用条件：

- isomorph package source material 开始描述 docwarden、animation 或其他项目的领域对象。
- export shape 看起来正在变成某个项目 framework 的 canonical source。
- vocabulary 或 domain term 被加入 `language/primitive`。

不适用条件：

- language / framework material 只是定义建构 framework 所需的元语义。
- project framework 作为外部 target 被读取、lint 或导出。
- downstream exporter materialize agent runtime artifact。

## Rules

- isomorph package source MUST remain framework construction authority, not project framework authority。
- user/project semantic framework MUST own its domain terms, relations, boundaries and loss models。
- `language/primitive` MUST NOT become a catalog of project/domain terms。
- vocabulary MUST belong to a semantic framework unless it is defining the concept `vocabulary` itself。
- docwarden MUST define its own semantic framework before claiming canonical docwarden semantics。
- agent-use contract MAY consume semantic framework material, but MUST NOT redefine `language/primitive`。

## Rationale

isomorph 的目标是让用户或项目可以建构自己的 semantic framework，而不是让 package source 预先拥有所有领域。

如果 `language/primitive` 直接吸收 docwarden、animation 或其他项目术语，framework construction 会退化成中心词库维护，agent 也无法区分 isomorph language 与 domain framework。

## Examples

### Positive

```text
semantic-framework
vocabulary
mapping
signal
loss
export shape
```

这些是建构 framework 的 language / framework 能力。

### Negative

```text
docwarden task
docwarden review
animation stagger
animation spring
```

这些属于具体 semantic framework，不应作为 `language/primitive` 的默认内容。

### Borderline

```text
docwarden-owned semantic framework material
```

可以作为外部 dogfood target 被读取；不能作为 docwarden semantic framework 的 canonical source 留在 isomorph package source。
