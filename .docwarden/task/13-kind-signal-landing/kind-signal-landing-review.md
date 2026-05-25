---
status: accepted
created: 2026-05-25
updated: 2026-05-25
owner: sayori
loop: 1
---

# kind signal landing review

## Lead

task 12 已经把具体 signal definitions 从集合文件拆成 `modules/signal/*.md`。

这带来一个必须先确认的边界：

```yaml
kind: signal
```

是否可以作为 contexta 的 content language entry？

## Current Design

已确认：

- [[mapping/bootstrap/modules/concept/metadata|metadata]] 是 md module frontmatter 中的结构化说明字段。
- [[mapping/bootstrap/modules/concept/metadata/kind|kind]] 是 metadata 中的内容语言入口。
- [[mapping/bootstrap/modules/concept/module|module]] 是 md file scope。
- [[mapping/bootstrap/modules/concept/signal|signal]] 是 semantic-lint 中被命名的 warning 类型。
- [[mapping/bootstrap/modules/concept/assertion|assertion]] 是 module 内部最小可审查语义判断。
- [[mapping/bootstrap/modules/concept/locator|locator]] 是 assertion 的定位机制。

当前落点：

```text
.contexta/mapping/bootstrap/modules/signal/concept-as-policy.md
.contexta/mapping/bootstrap/modules/signal/workflow-as-policy.md
.contexta/mapping/bootstrap/modules/signal/architecture-as-responsibility-card.md
.contexta/mapping/bootstrap/modules/signal/template-owns-lifecycle.md
.contexta/mapping/bootstrap/modules/signal/example-as-kind.md
.contexta/mapping/bootstrap/modules/signal/composition-as-list.md
```

这些文件都是 module。

它们的 `kind: signal` 表示该 module 的正文应按 signal definition 语言读取。

## Candidate Judgment

`signal` 可以作为 content language entry，但只能表示 signal definition language。

它不表示：

- signal instance。
- trigger。
- locator。
- policy。
- pipeline。
- docwarden review item。

因此：

```text
modules/signal/*.md = signal definition modules
```

比下面这种集合文件更合理：

```text
structures/pipeline/semantic-lint-signals.md
```

原因：

- 一个 signal 是一个可审查 module。
- pipeline 只编排转换链路，不拥有 signal definition。
- `semantic-lint` 是检测语言 concept，不应变成 `kind: semantic-lint`。
- signal instance 是未来 CLI 输出，不应提前写成长期 module。

## Boundary Reading

最简链路：

```text
module -> contains assertion
locator -> points to assertion
signal definition -> defines warning type
semantic-lint pipeline -> turns formatted md into candidate / instance
signal instance -> runtime hit with locator
```

## Necessity Review

本轮使用三个 subagent 从理论架构、CLI lint engine、文档维护 / Obsidian 阅读面评估 signal 必要性。

综合评分：8/10。

分项判断：

- 理论架构：8.5/10。signal 填补 warning type naming 位置，避免 trigger 被迫承担语义命名。
- CLI lint engine：7.5-8/10。未来输出需要稳定的 `signal / locator / trigger / evidence / confidence / inspection` 归属点。
- 文档维护 / Obsidian：7-8/10。一个 signal 一个 module 有利于 review 和链接，但当前不应继续扩张。

当前结论：

- 保留 signal concept。
- 保留 `kind: signal`。
- 保留 `modules/signal/*.md`。
- 不新增 `signal-definition` kind。
- 不继续扩 signal 数量。
- 不设计 severity / engine schema / CLI spec。

最小成立条件：

```text
trigger = 可观察现象
signal = warning 类型命名
assertion = 被审查判断
locator = 指向 assertion
semantic-lint = 检测语言
pipeline = 检测链路
policy = 约束
```

已按该判断补最小 `.contexta` 修订：

- `metadata`：定义 frontmatter metadata 层。
- `kind`：说明 `kind: signal` 只表示 signal definition language。
- `signal`：说明 signal definition module 与 signal instance 的差异。
- `semantic-lint`：说明 signal definitions 是长期 module，signal instance 是未来 CLI 输出。
- relation：新增 `metadata-language` 和 `semantic-lint-chain`。

## Directory Shape

当前 concept 目录按主类型分层：

```text
.contexta/mapping/bootstrap/modules/concept/structure.md
.contexta/mapping/bootstrap/modules/concept/structure/pipeline.md
.contexta/mapping/bootstrap/modules/concept/structure/workflow.md

.contexta/mapping/bootstrap/modules/concept/metadata.md
.contexta/mapping/bootstrap/modules/concept/metadata/kind.md
```

主类型自己的定义放在 `concept/` 根下。

下级概念放在对应主类型目录下。

这样避免 `concept/structure/structure.md` 或 `concept/metadata/metadata.md` 这种重复路径。

## Review Questions

1. 是否接受：`signal` 可以作为 content language entry。
2. 是否接受：`kind: signal` 只表示 signal definition module，不表示 signal instance。
3. 是否接受：具体 signal definitions 放在 `modules/signal/*.md`。
4. 是否接受：pipeline 只引用 signal modules，不拥有 signal definitions。
5. 是否接受：`metadata` 作为主类型定义放在 `concept/metadata.md`，`kind` 放在 `concept/metadata/kind.md`。
6. 是否需要在 `.contexta` 的 `metadata`、`kind`、`signal`、`semantic-lint` 或 relation 中继续补最小边界说明。

## Accepted Conclusion

已通过 sayori 审核。

本轮结论：

```text
signal = semantic-lint 的 warning type naming
kind: signal = signal definition module 的 content language entry
modules/signal/*.md = signal definition 的正确落点
signal instance = 未来 CLI 输出，不作为长期 module
```

保留限制：

```text
不新增 signal-definition kind
不扩 signal 数量
不设计 CLI schema / severity
```

metadata 结论：

```text
metadata = md module frontmatter 中的结构化说明字段
kind = metadata 中负责选择 content language 的字段
```

目录结论：

```text
concept/metadata.md
concept/metadata/kind.md

concept/structure.md
concept/structure/pipeline.md
concept/structure/workflow.md
...
```
