---
status: draft
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# real content dry run target log

## [2026-05-26] task-started | 准备真实内容靶子

sayori 确认：当前没有真实内容可以给 semantic-lint dry run 使用。

当前处理：

- 收口并归档 task 12-16。
- 新开本 task，准备推进另一块真实内容。
- 真实内容应先按自身目的成立，再作为后续 semantic-lint dry run target。

当前边界：

- 不伪造 fixture。
- 不直接运行 dry run。
- 不实现 CLI lint engine。

## [2026-05-26] planning | 接受阶段目标

sayori 接受下一阶段主目标：

- 先推进一个真实 contexta 内容靶子。
- 用它检验 assertion / locator / signal / review-ready lint result 链路。
- 暂不先做 CLI lint engine。
- 暂不先整理 `docs/`。

已新增 `stage-plan.md`，用于承接后续一问一答规划。

## [2026-05-26] planning | 选择靶子类型

sayori 接受：

- 真实内容靶子优先选择 contexta 的 theory / practice reference 缺口。
- 不选择 `docs/` 回填、docwarden workflow 或 CLI lint engine 作为第一靶子。
- 该内容首先应按自身建设目的成立，其次才作为后续 semantic-lint dry run target。

## [2026-05-26] planning | 选择第一靶子类别

sayori 接受：

- 第一块真实内容靶子优先做 locator-ready content。
- 当前不优先扩 signal、不优先扩 magic-word 延后 registry、不优先重构 `example-quality`。
- 当前重点是让真实 `.contexta` 内容具备可审查、可定位的 assertion。

## [2026-05-26] planning | 选择第一 target module

sayori 接受第一块具体 target module：

```text
.contexta/mapping/bootstrap/modules/concept/assertion.md
```

当前目的：

- 不制造 signal。
- 不进入 CLI schema。
- 先让 `assertion` concept 自身成为 locator-ready content。

## [2026-05-26] proposal | 起草 assertion locator proposal

sayori 接受先在 task 内做 locator proposal，不直接修改 `.contexta`。

已新增：

```text
.docwarden/task/17-real-content-dry-run-target/assertion-locator-proposal.md
```

当前 proposal 建议第一轮只标记 `Definition` 中的核心 assertion，暂不逐条标记 `Qualification` 和 `Carrier`。

## [2026-05-26] correction | locator marker 可读性

sayori 纠偏：

- 初稿 marker 过于复杂。
- locator 不应影响文档可读性。
- 文档进入 stable 后会持续保留 locator。

当前修正：

- marker 名称应短、稳定、低干扰。
- marker 不承担语义解释。
- 第一轮减少 marker 数量。
- 已将 proposal 中的长 marker 改为更短候选：`^a-def`、`^a-role`、`^a-boundary`、`^a-atomic`、`^a-locator`。

## [2026-05-26] correction | locator target 不是全量 assertion ID

sayori 确认：

- assertion 可以很多。
- locator target 只标少数需要长期外部引用的 assertion。
- `a-` 已表达 marker 类型是 assertion。
- marker 后缀应更简，不要污染阅读体验。

当前 proposal 进一步压缩候选 marker：

```text
^a-def
^a-use
^a-no
^a-one
^a-loc
```

## [2026-05-26] decision | 统一编号 locator marker

sayori 接受统一编号形式：

```text
^def-1
^def-2
^qual-1
^car-1
```

当前判断：

- 不使用 `a-` prefix。
- `def / qual / car` 表示 locator family。
- 数字只在同一 family 内稳定区分 locator target。
- 数字不表示重要性、置信度、正确性或当前正文排序。
- stable 后不重排编号。

## [2026-05-26] decision | 第一轮只处理 Definition

sayori 接受：

- 第一轮只处理 `.contexta/mapping/bootstrap/modules/concept/assertion.md` 的 `Definition` surface。
- 暂不处理 `Qualification`。
- 暂不处理 `Carrier`。

## [2026-05-26] decision | 第一轮 marker 收敛为 3 个

sayori 接受第一轮只标 3 个 Definition locator target：

```text
^def-1
^def-2
^def-3
```

对应：

- `assertion` 正面定义。
- assertion 不表示正确性。
- 没有 locator marker 的内容仍可能是 assertion。

## [2026-05-26] implementation | 写入 assertion Definition locator

sayori 要求写入。

已修改：

```text
.contexta/mapping/bootstrap/modules/concept/assertion.md
```

写入 3 个 Definition locator marker：

```text
^def-1
^def-2
^def-3
```

marker 放在对应段落末尾，保持 block reference 语义并降低阅读干扰。

## [2026-05-26] planning | 转入 locator family boundary

第一轮 `def-*` marker 写入后，sayori 反馈体验良好。

当前决定：

- 不立刻推广 `def-*`。
- 先设计 locator family boundary。
- 在明确不同 content surface 的 family 命名与适用边界后，再决定是否推广。

## [2026-05-26] implementation | 落地 locator family 与 rule marker

按 sayori 方向，先落地过一版 `locator-family`，后续被纠正为过度实体化。

当前修正后的方向：

- locator 理论放在 `.contexta/mapping/bootstrap/modules/concept/locator.md`。
- 具体 locator instance 放入 `.contexta/mapping/bootstrap/modules/locator/`。
- instance 使用 `kind: locator`。
- 不新增 `locator-family` concept。

当前 locator instance：

```text
.contexta/mapping/bootstrap/modules/locator/definition.md
.contexta/mapping/bootstrap/modules/locator/rule.md
```

已同步旧 `^a-*` 口径：

- locator marker 改为 `^<family>-<number>`。
- `kind` concept 增加 `kind: locator` instance 读取说明。

已在以下 policy 上推进第一轮 `rule-*`：

```text
.contexta/mapping/bootstrap/modules/policy/semantic-lint-boundary.md
```

第一轮标识：

```text
^rule-1 semantic-lint MUST produce signal before review judgment.
^rule-2 trigger MUST inspect formatted md directly.
^rule-3 locator MUST point to assertion marker without judging correctness.
```

## [2026-05-26] correction | rule marker 暂不进入 stable

sayori 纠偏：

- `locator-family` 不应作为独立 concept / kind。
- locator 理论应回到 `locator.md`。
- 具体 locator instance 应放入 `modules/locator/`，并使用 `kind: locator`。
- `rule-*` 与 RFC2119 magic words 的关系暧昧，不能机械标注。

已修正：

- 删除 `locator-family` concept。
- 删除 `modules/locator-family/`。
- 新增 `modules/locator/definition.md` 和 `modules/locator/rule.md`。
- `kind` 读取说明改为 `kind: locator`。
- 撤回 `.contexta/mapping/bootstrap/modules/policy/semantic-lint-boundary.md` 中的 `^rule-*` marker。

当前判断：

- RFC2119 magic words 标识规则强度和规范性 assertion 识别压力。
- locator marker 提供稳定地址。
- magic word 不能单独替代 locator，因为同一 module 内会有多条 `MUST / SHOULD`。
- 但 magic word 可以参与 locator 置信度和 rule assertion 识别。

## [2026-05-26] correction | locator 与 magic-word 收口

sayori 要求先收口 locator / magic-word 理论，后续 CLI 设计另行讨论。

本轮纠偏：

- locator marker 是 address token，不是 semantic classifier。
- magic word 负责 semantic-lint 的读取、判断和 confidence，不负责稳定地址。
- RFC2119 magic word 可以识别 rule assertion 和规则强度，但不能替代 `rule-*` locator。
- `rule-*` 恢复为纯 locator prefix，只给具体 rule assertion 提供稳定地址。
- locator marker 使用 `^<prefix>-<number>` 形式，避免继续使用容易实体化的 `family` 口径。
- number 是同一 module / prefix 内的 stable id，不表示重要性、置信度、正确性或正文顺序。
- stable 后不因插入、删除或重排自动 renumber；已删除 target 的 number 不复用。

已更新：

- `.contexta/mapping/bootstrap/modules/concept/locator.md`
- `.contexta/mapping/bootstrap/modules/concept/magic-word.md`
- `.contexta/mapping/bootstrap/modules/magic-word/locator-marker.md`
- `.contexta/mapping/bootstrap/modules/magic-word/constraint-strength.md`
- `.contexta/mapping/bootstrap/modules/locator/definition.md`
- `.contexta/mapping/bootstrap/modules/locator/rule.md`
- 若干直接引用处统一 `locator marker` 术语。
