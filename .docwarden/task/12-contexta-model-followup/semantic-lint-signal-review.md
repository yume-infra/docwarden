---
status: accepted
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 8
---

# semantic lint signal review

本文件是 task 12 Loop 8 的最小 review 单元。

目标是从当前已暴露的问题中整理第一批 semantic lint 可审查信号，并为未来 CLI lint step / engine 保留方向。

## 当前已有设计

已确认：

- contexta 负责 template / metadata / module / assertion / semantic lint。
- semantic lint 应从真实误用中整理，而不是在初步阶段把 lint 引擎设计死。
- contexta 内部连接已使用 OFM path alias，可以稳定指向 concept、policy、relation 和 heading。
- assertion 保留后续成为 locator target 的能力，但当前不设计完整 assertion locator。
- semantic lint 未来会成为 CLI 中的一步。
- semantic lint 未来需要 lint engine 承接。
- semantic lint 未来需要 locator 辅助脚本级 lint。

Loop 15 修正：

- 具体 signal definition 不放在独立 `lint/` 目录。
- 具体 signal definition 以 `kind: signal` 的 module 落在 `.contexta/mapping/bootstrap/modules/signal/`。

## 当前定位

semantic lint 在当前阶段是语义偏移信号语言。

它不定义 concept，不替代 policy，不替代 example，也不执行 docwarden workflow。

它的当前作用是：当一个 md module 的内容疑似落到错误内容语言、错误层级或错误职责时，提供可审查的 warning signal。

它的未来形态是 CLI lint step / engine。届时 lint signal 需要能通过 locator 指向可审查位置，辅助脚本级 lint。

## 关系模型

当前四个概念的关系是：

```text
module 包含 assertion
locator 指向 module / heading / assertion
trigger 在 locator 指向的位置观察可检测现象
signal 命名这个现象背后的语义偏移风险
```

职责边界：

- assertion 是被审查的最小语义判断。
- locator 是地址，不判断对错。
- trigger 是可机械检测的触发条件，不等于结论。
- signal 是被命名的 lint warning，不等于 policy violation。

## 非目标

本轮不做：

- 不设计完整自动 lint 引擎。
- 不设计完整 severity 系统。
- 不设计完整 assertion locator。
- 不把每条 policy 都转写成 lint rule。
- 不把 example quality 抽象成新结构。

本轮需要明确：

- 后续会做 CLI lint step / engine。
- 后续会做 CLI lint step。
- 后续会做 locator，以辅助脚本级 lint。
- 当前只是 semantic lint 的初步信号层。

## 候选模型

一条 semantic lint signal 至少需要：

- Signal：信号名。
- Trigger：什么可观察文本、结构或落点会触发这个信号。
- Why：为什么这是语义偏移。
- Source：这个判断依据来自哪些 concept / policy / relation。
- Inspection：agent 或用户看到该信号后应该检查什么。

未来进入 CLI lint engine 后，signal instance 还需要增加 locator 相关字段；本轮先不设计字段细节。

### Signal Definition / Signal Instance

本轮主要设计 signal definition。

未来 CLI 输出的是 signal instance。

Signal Definition 至少包含：

- Signal
- Trigger
- Why
- Source
- Inspection

Signal Instance 至少包含：

- Signal
- Locator
- Trigger
- Evidence
- Inspection

差异：

- signal definition 说明某类语义偏移如何被识别。
- signal instance 是一次具体 lint 命中。
- locator 和 evidence 主要出现在 signal instance 中。

### Trigger 边界

Trigger 必须尽量是可脚本化观察条件。

好的 trigger：

- `frontmatter.kind == concept`
- `module path matches mapping/bootstrap/modules/concept/*.md`
- `heading == Definition`
- `section contains MUST / SHOULD / MUST NOT`
- `heading missing Delimitation`

不好的 trigger：

- concept 写成 policy。
- architecture 不是真正的 architecture。
- composition 缺少稳定语义边界。

这些是 signal 或 inspection judgment，不是 trigger。

### Why 边界

Why 只说明最小语义风险。

Why 不重复定义 Source 指向的 concept / policy / relation。

权威依据应通过 Source link 回到已有 md。

最小表达：

```md
## concept-as-policy

Trigger:

- `frontmatter.kind == concept`
- `heading in [Definition, Naming Need]`
- `section contains MUST / SHOULD / MUST NOT`

Why:

- [[mapping/bootstrap/modules/concept/concept|concept]] 是命名语言。
- [[mapping/bootstrap/modules/concept/policy|policy]] 是约束语言。
- concept 写成 policy 会让命名和约束职责混在一起。

Source:

- [[mapping/bootstrap/modules/concept/concept|concept]]
- [[mapping/bootstrap/modules/concept/policy|policy]]

Inspection:

- 如果内容是定义，保留在 concept。
- 如果内容是约束，移动到 policy。
```

## 第一批候选信号

### 1. concept-as-policy

Trigger:

- `frontmatter.kind == concept`
- `heading in [Definition, Naming Need]`
- `section contains MUST / SHOULD / MUST NOT`

Why:

- concept 是命名语言。
- policy 是约束语言。
- 二者混用会让 concept 失去命名稳定性。

Source:

- [[mapping/bootstrap/modules/concept/concept|concept]]
- [[mapping/bootstrap/modules/concept/policy|policy]]

Inspection:

- 回看 concept 的 Definition 是否仍在命名和界定。
- 将约束内容迁移到对应 policy。

### 2. workflow-as-policy

Trigger:

- `frontmatter.kind == workflow`
- `section contains MUST / SHOULD / MUST NOT`
- `body missing state / move / transition terms or sections`

Why:

- workflow 是推进结构。
- policy 是约束语言。
- workflow 写成 policy 会丢失推进关系。

Source:

- [[mapping/bootstrap/modules/concept/workflow|workflow]]
- [[mapping/bootstrap/modules/concept/policy|policy]]

Inspection:

- 检查内容是否表达 state、move、transition。
- 如果只是在保护边界，改落到 policy。

### 3. architecture-as-responsibility-card

Trigger:

- `frontmatter.kind == architecture`
- `body contains responsibility / owner / function descriptions`
- `body missing layer / relation / boundary terms or sections`

Why:

- architecture 是层级结构。
- 它必须表达层之间的关系和边界。
- 只写职责卡片不能构成 architecture。

Source:

- [[mapping/bootstrap/modules/concept/architecture|architecture]]
- [[mapping/bootstrap/modules/concept/structure|structure]]

Inspection:

- 检查是否存在 layer、relation、boundary。
- 如果只是职责说明，不能标为 architecture。

### 4. template-owns-lifecycle

Trigger:

- `path matches mapping/*/templates/*.md`
- `section contains source / review / pick / update / write / lifecycle terms`
- `section contains MUST / SHOULD / MUST NOT with concrete subject`

Why:

- template 只负责复制后的内容骨架。
- docwarden workflow 负责操作生命周期。
- policy 负责规则本体。

Source:

- [[mapping/bootstrap/modules/concept/template|template]]
- [[mapping/bootstrap/modules/policy/template-boundary|template-boundary]]

Inspection:

- 生命周期内容回到 docwarden workflow。
- 规则本体回到 policy。
- template 只保留复制骨架和占位。

### 5. example-as-kind

Trigger:

- `frontmatter.kind == example`
- `path contains /templates/example.md`
- `directory name == example`
- `text states example proves kind or content type`

Why:

- example 是样本语言。
- kind 是内容语言入口。
- example 只能示范如何理解、书写或判断某个对象。

Source:

- [[mapping/bootstrap/modules/concept/example|example]]
- [[mapping/bootstrap/modules/concept/kind|kind]]
- [[mapping/bootstrap/modules/policy/kind-boundary|kind-boundary]]

Inspection:

- 检查 example 是否在提供具体样本。
- 不要让 example 反向制造 kind。

### 6. composition-as-list

Trigger:

- `frontmatter.kind == composition`
- `body contains list items`
- `body missing whole / part / stable semantic boundary terms or sections`

Why:

- composition 是组合结构。
- list 只是语言形式。
- 没有稳定语义边界的列表不构成 composition。

Source:

- [[mapping/bootstrap/modules/concept/composition|composition]]
- [[mapping/bootstrap/modules/concept/structure|structure]]

Inspection:

- 检查是否说明 part 为什么属于同一个 whole。
- 如果只是并列信息，不能标为 composition。

## 后续落点判断

长期形态应由 CLI lint step / engine 承接，而不是 concept、policy 或 relation 本身。

可能的后续结构：

```text
.contexta/mapping/bootstrap/modules/concept/signal.md
.contexta/mapping/bootstrap/modules/concept/trigger.md
.contexta/mapping/bootstrap/modules/concept/locator.md

.contexta/mapping/bootstrap/modules/policy/semantic-lint-boundary.md

.contexta/mapping/bootstrap/modules/signal/
.contexta/mapping/bootstrap/structures/pipeline/semantic-lint.md
```

其中：

- concept 层只定义 signal / trigger / locator 等名字。
- policy 层只约束 semantic lint 的边界。
- modules/signal 承载具体 signal definitions。
- pipeline structure layer 编排 formatted md 如何转换为 signal candidate / signal instance。

## 已落地

- 新增 `.contexta/mapping/bootstrap/modules/concept/semantic-lint.md`。
- 新增 `.contexta/mapping/bootstrap/modules/concept/signal.md`。
- 新增 `.contexta/mapping/bootstrap/modules/concept/trigger.md`。
- 新增 `.contexta/mapping/bootstrap/modules/concept/locator.md`。
- 新增 `.contexta/mapping/bootstrap/modules/policy/semantic-lint-boundary.md`。
- 新增 `.contexta/mapping/bootstrap/modules/signal/*.md`。
- 新增 `.contexta/mapping/bootstrap/modules/policy/signal-boundary.md`。
- 新增 `.contexta/mapping/bootstrap/structures/pipeline/semantic-lint.md`。
- 暂不设计完整 CLI lint engine。
- 暂不设计完整 assertion locator。

## 待审核问题

1. 是否同意：semantic lint 当前阶段先做 warning signal，但明确未来会进入 CLI lint step / engine？
2. 是否同意：semantic lint signal definition 的最小结构是 Signal / Trigger / Why / Source / Inspection？
3. 是否同意：第一批候选信号来自当前已暴露误用，而不是穷举全部 policy？
4. 是否同意：未来 CLI 输出的是 signal instance，至少包含 Signal / Locator / Trigger / Evidence / Inspection？
5. 是否同意：本轮先不设计完整 severity、lint engine 和 assertion locator，但明确 locator 是未来脚本级 lint 的必要承接？
6. 是否同意：semantic lint 长期形态应由 CLI lint step / engine 承接，而不是把具体 signals 放进 concept、policy 或 relation？
