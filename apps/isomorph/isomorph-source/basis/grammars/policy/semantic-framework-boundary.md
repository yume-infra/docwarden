---
kind: policy
---

# semantic-framework-boundary

## Intent

保护 isomorph package source 的 bootstrap position，避免它替用户或项目拥有 domain semantic framework。

## Scope

Applies to:

- [[basis/primitives/concept/semantic-framework|semantic-framework]]
- [[basis/primitives/concept/vocabulary|vocabulary]]
- [[basis/primitives/concept/mapping|mapping]]
- [[basis/grammars/policy/mapping-boundary|mapping-boundary]]

适用条件：

- isomorph package source material 开始描述 docwarden、animation 或其他项目的领域对象。
- export shape 看起来正在变成某个项目 framework 的 canonical source。
- vocabulary 或 domain term 被加入 root primitives。

不适用条件：

- bootstrap primitive 只是定义建构 framework 所需的元语义。
- project framework 作为 dogfood target 被读取、lint 或导出。
- downstream exporter materialize agent runtime artifact。

## Rules

- isomorph package source MUST remain bootstrap semantic authority。
- user/project semantic framework MUST own its domain terms, relations, boundaries and loss models。
- bootstrap primitives MUST NOT become a catalog of project/domain terms。
- vocabulary MUST belong to a semantic framework unless it is defining the bootstrap concept `vocabulary` itself。
- docwarden MUST define its own semantic framework before claiming canonical docwarden semantics。
- `apps/isomorph/isomorph-source/bootstrap/**` MAY describe export shapes and dogfood samples。
- `apps/isomorph/isomorph-source/bootstrap/**` MUST NOT become canonical source for a project semantic framework。
- agent-use contract MAY consume semantic framework material, but MUST NOT redefine bootstrap primitives。

## Rationale

isomorph 的目标是让用户或项目可以建构自己的 semantic framework，而不是让 bootstrap source 预先拥有所有领域。

如果 bootstrap primitives 直接吸收 docwarden、animation 或其他项目术语，framework construction 会退化成中心词库维护，agent 也无法区分 bootstrap language 与 domain language。

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

这些是建构 framework 的 bootstrap language。

### Negative

```text
docwarden task
docwarden review
animation stagger
animation spring
```

这些属于具体 semantic framework，不应作为 root primitives 的默认内容。

### Borderline

```text
apps/isomorph/isomorph-source/bootstrap/docwarden/**
```

可以作为 dogfood 样本或 export-shape reference；不能作为 docwarden semantic framework 的 canonical source。
