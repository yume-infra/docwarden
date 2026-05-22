---
status: accepted
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 3
---

# template skeleton review

本文件是 task 12 Loop 3 的最小 review 单元，已通过审核并落地到 `.contexta`。

目标是审查 `.contexta/templates/` 是否只提供已成立内容语言的复制骨架，而不是制造新 kind、承接真实内容或混入 docwarden lifecycle。

## 当前已有设计

已确认：

- template 是复制后的内容骨架。
- template 不负责来源、review、pick、更新、写入、生命周期。
- template 不承接真实 policy、concept definition 或 docwarden workflow。
- `kind` 是 content language entry。
- template 文件中的 `kind` 暂时指向复制后目标 module 的内容语言。
- `.contexta/templates/example.md` 已移除，example 当前不是 kind、template kind 或 directory kind。

当前 template inventory：

| Template | Frontmatter kind | 当前判断 |
| --- | --- | --- |
| `concept.md` | `concept` | 已有稳定 concept 内容语言，可保留。 |
| `policy.md` | `policy` | 已有稳定 policy 内容语言，可保留。 |
| `pipeline.md` | `pipeline` | 当前作为 structure language 的直接骨架，可保留。 |
| `workflow.md` | `workflow` | 当前作为 structure language 的直接骨架，可保留。 |
| `architecture.md` | `architecture` | 当前作为 structure language 的直接骨架，可保留。 |
| `branch.md` | `branch` | 当前作为 structure language 的直接骨架，可保留。 |
| `composition.md` | `composition` | 当前作为 structure language 的直接骨架，可保留。 |
| `user-context.md` | `user-context` | 已由当前项目确认是 user context 内容类型模板，可保留；本轮一并补 concept。 |

## 当前缺口

当前缺口不是重写 template 生成机制。

当前真正缺口是：

- template 什么时候可以存在。
- template 文件里的 `kind` 是否需要改成 `target_kind`。
- template 是否必须对应一个 concept module。
- structure language template 是否会反向制造 subtype metadata。
- `user-context` 这种项目中已确认的内容类型是否需要 concept 层补定义。

## 候选判断

### 1. template 的成立条件

一个 template 可以存在，需要同时满足：

- 目标内容语言已经被确认。
- 目标内容语言有稳定正文骨架。
- 新建同类 module 时，复制骨架能减少结构偏移。

一个 template 不应存在，仅仅因为：

- 某个词是 concept。
- 某个对象未来可能有用。
- agent 想通过 template 反向证明一个 kind 成立。

因此，不需要为每个 concept 都创建 template。

例如当前不需要新增：

- `module.md`
- `assertion.md`
- `kind.md`
- `relation.md`
- `naming.md`
- `example.md`

这些概念可以被定义、被约束、被引用，但当前没有独立、稳定、可复制的目标 module 骨架需求。

### 2. template 文件中的 kind 暂不改名

当前可以继续保留：

```yaml
kind: policy
```

在 `.contexta/templates/policy.md` 中，它表示：

```text
这个 template 复制后要生成的目标 module kind 是 policy。
```

暂不改为：

```yaml
target_kind: policy
```

原因：

- 当前已有 template 全部采用 `kind`。
- `kind-boundary` 已记录 template 文件中 `kind` 的特殊读取方式。
- 直接改名会把 template skeleton review 变成 frontmatter schema migration。

后续如果 contexta 需要明确区分 template artifact metadata 与目标 module metadata，再单独开启 frontmatter loop。

### 3. structure language template 当前成立

当前可保留：

- `pipeline.md`
- `workflow.md`
- `architecture.md`
- `branch.md`
- `composition.md`

原因：

- 这些不是通过 `sub_type` 成立。
- 它们已经各自有最小正文骨架。
- 它们与 `structure` 的关系由 relation 承接，不由 template frontmatter 承接。

这些 template 不应新增：

```yaml
kind: structure
structure_type: workflow
```

也不应在 template 内部写入 relation 结论，证明自己属于 structure。

### 4. user-context template 当前保留

`.contexta/templates/user-context.md` 当前保留。

原因：

- 用户已明确确认它是 user context 内容类型的模板。
- `.docwarden/user/profile.md` 是当前项目里的 user context 长期资产。
- 这个 template 有稳定正文骨架：Context / Boundary / Assertions / Notes。

当前缺口：

- `user-context` 作为内容语言，原本还没有对应 concept module。

审核后调整：

- 本轮一并补 `.contexta/modules/concept/user-context.md`。

### 5. example template 不恢复

当前不恢复 `.contexta/templates/example.md`。

原因：

- example 是样本语言。
- example 当前不作为独立 module kind、template kind 或 directory kind。
- example 可以出现在 concept、policy、structure 等 module 内部。

后续如果真实使用中出现稳定的 example module 骨架，再重新 review。

## 已落地范围

本轮长期层落地：

- 修订 `.contexta/modules/concept/template.md`，补充 template 的成立条件。
- 修订 `.contexta/modules/policy/template-boundary.md`，补充 template MUST NOT 反向制造 kind。
- 新增 `.contexta/modules/concept/user-context.md`。
- 暂不修改 `.contexta/templates/*.md` 的 frontmatter。
- 暂不新增或恢复 `.contexta/templates/example.md`。
- 暂不新增 `target_kind`。

## 审核结果

sayori 已确认：

1. template 的成立条件是“已确认内容语言 + 稳定正文骨架 + 有复制需求”，不是“有 concept 就有 template”。
2. template 文件中的 `kind` 本轮继续理解为目标 module kind，暂不改成 `target_kind`。
3. 当前全部 template 先保留，`user-context` 的 concept 缺口这轮一并补。
