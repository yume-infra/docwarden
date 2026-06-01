---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
target: .contexta/mapping/bootstrap/modules/concept/assertion.md
---

# assertion locator proposal

## Purpose

本文件为 `.contexta/mapping/bootstrap/modules/concept/assertion.md` 起草 locator-ready assertion 方案。

本文件不直接修改 `.contexta`。

## Target

```text
.contexta/mapping/bootstrap/modules/concept/assertion.md
```

## Selection Rule

本轮只选择真正可单独 review、引用、迁移或 lint 的 semantic commitment。

不为了覆盖率给每个句子加 marker。

候选 marker 应：

- 指向稳定 assertion，而不是 heading、过渡句或解释上下文。
- 避免一条 marker 同时覆盖多个互相独立的承诺。
- 优先覆盖后续 semantic-lint / review-ready lint result 会引用的判断。
- 低干扰，不显著破坏 human reading。
- 进入 stable 后持续保留，不因后续编辑随意重命名或重排。

## Correction

本 proposal 初稿使用了过多长 marker，例如 `^a-reviewable-commitment`、`^a-no-correctness-marker`。

这会把 locator 从定位辅助变成正文噪音。

当前修正：

- locator marker 会长期保留在 stable 文档中。
- marker 名称应短、稳定、低干扰。
- 第一轮 marker 数量应更少。
- 不用 marker 名称解释 assertion 语义；语义应由正文承担。
- marker 只提供稳定定位，不承担说明、分类或 review judgment。

## Accepted Principle

assertion 可以很多。

locator target 只标少数需要被 review、semantic-lint、trace 或迁移长期外部引用的 assertion。

`a-` prefix 不进入当前方案。

当前接受统一编号形式：

```text
^def-1
^def-2
^qual-1
^car-1
```

其中：

- `def / qual / car` 表示 locator family，来自当前 module 的局部 content surface。
- 数字只负责在同一 family 内稳定区分多个 locator target。
- 数字不表示重要性、置信度、正确性或当前正文排序。
- stable 后不重排编号。
- 新增 locator target 使用该 family 的下一个未用编号。

## Recommended Markers

### `^def-1`

Source assertion:

```md
assertion 是 module 内部的最小可审查 semantic commitment。
```

Reason:

这是 `assertion` concept 的正面定义，应作为首个 locator target。

### `^def-2`

Source assertion:

```md
assertion 不表示内容已经正确。
```

Reason:

这是关键边界。它避免 agent 把 assertion 误读成 accepted fact、verified claim 或 correctness marker。

### `^def-3`

Source assertion:

```md
没有 locator marker 的内容仍可能是 assertion。
```

Reason:

这是 locator 与 assertion 的边界，防止 agent 把“没有 marker”误判为“不是 assertion”。

Note:

如果需要同时引用“marker 只提高定位能力”这句，优先让同一个 `^def-3` 覆盖这一小段的核心边界，而不是拆成两个 locator target。

## Deferred Definition Assertions

第一轮暂不标以下 Definition 内容：

- `assertion 表示 module 对某个对象作出一条可以被 review 和 semantic-lint 判断的语义承诺。`
- `assertion 本身不保存 correctness marker。`
- `review 通过后...`
- `accepted 表示...`
- `assertion 的核心不是句子长度...`
- `assertion 应尽量原子...`

原因：

- 第一轮目标是验证 locator 机制，不是全覆盖。
- review / accepted scope 相关内容可能更适合后续单独判断其 relation / workflow 边界。
- atomic 相关内容重要，但更像 quality rule 或 qualification，暂不作为第一批 public locator target。

## Qualification Candidates

当前 `Qualification` 下四条列表项可以有两种处理方式：

方案 A：给每条 qualification 分别加 marker。

```text
^qual-1
^qual-2
^qual-3
^qual-4
```

优点：

- 每个 qualification 都能单独 review。
- 后续 lint 或 review 可以引用具体条件。

缺点：

- 第一轮 marker 数量偏多。
- 这些列表项是否是独立 assertion，还是同一个 qualification set 的组成条件，需要先确认。

方案 B：暂不逐条加 marker，只在后续需要引用 qualification set 时再处理。

决定：第一轮采用方案 B。

理由：本轮目标是建立 locator-ready 最小闭环，不是把 `assertion.md` 全量标注。

## Carrier Candidates

当前 `Carrier` 两段暂不推荐加 marker。

原因：

- 它们更像 assertion 可以出现在哪些 md surface 的说明。
- 它们有价值，但不是第一轮最需要 lint / review 指向的核心承诺。
- 后续如果出现“heading 是否可以是 assertion”之类误判，再回到这里补 marker。

决定：第一轮不处理 `Carrier`。

## Non-targets

本轮不处理：

- 全量给 `.contexta` 增加 marker。
- 自动生成 marker。
- 引入全局 assertion ID。
- 修改 `locator` concept。
- 设计 CLI parser。
- 追求 accepted signal instance。

## Proposed First Edit

如果本 proposal 通过，第一轮实际修改只应在 target module 中加入以下 marker：

```text
^def-1
^def-2
^def-3
```

并暂不处理 Qualification / Carrier。

## Accepted First-round Scope

第一轮只处理 `Definition` surface。

本轮不处理：

- `Qualification`
- `Carrier`
- 其他 `.contexta` module

第一轮 Definition marker 收敛为 3 个：

```text
^def-1
^def-2
^def-3
```
