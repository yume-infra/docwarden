---
status: draft
created: 2026-05-25
updated: 2026-05-25
owner: sayori
loop: 2
---

# signal module quality review

## Lead

Loop 1 已确认：

```text
signal = semantic-lint 的 warning type naming
kind: signal = signal definition module 的 content language entry
modules/signal/*.md = signal definition 的正确落点
```

Loop 2 审查当前 6 个 signal module 的内容质量。

本轮不扩 signal 数量，不新增 signal schema，不实现 CLI lint engine。

## Quality Criteria

一个 signal module 当前至少需要做到：

- Trigger 可观察，能被未来 CLI 近似检查。
- Why 解释语义偏移，而不是写成 policy。
- Source 能指向已有 concept / policy。
- Inspection 能指导用户或 agent 审查。
- signal 保持 warning type，不表达最终判罚。

## Inventory

当前 signal modules：

- [[mapping/bootstrap/modules/signal/concept-as-policy|concept-as-policy]]
- [[mapping/bootstrap/modules/signal/workflow-as-policy|workflow-as-policy]]
- [[mapping/bootstrap/modules/signal/architecture-as-responsibility-card|architecture-as-responsibility-card]]
- [[mapping/bootstrap/modules/signal/template-owns-lifecycle|template-owns-lifecycle]]
- [[mapping/bootstrap/modules/signal/example-as-kind|example-as-kind]]
- [[mapping/bootstrap/modules/signal/composition-as-list|composition-as-list]]

## Review Summary

| Signal | Score | Judgment |
| --- | ---: | --- |
| concept-as-policy | 8/10 | 成立。Trigger 清楚，Why 稳，Inspection 可执行。主要风险是 future CLI 要排除 examples/code fence。 |
| workflow-as-policy | 6.5/10 | 方向成立，但 Trigger 依赖 “missing state / move / transition terms”，可观察性较弱。 |
| architecture-as-responsibility-card | 7/10 | 成立，但 responsibility / owner 这类词可能是 architecture 中的正常局部内容，需要靠 missing layer / relation / boundary 降噪。 |
| template-owns-lifecycle | 7.5/10 | 成立。Trigger 和 Source 都比较稳；Inspection 能直接指向 docwarden workflow / policy / template 边界。 |
| example-as-kind | 6.5/10 | 方向成立，但当前更多是历史防回归 signal；缺少当前真实误用样本。 |
| composition-as-list | 6.5/10 | 方向成立，但 `body contains list items` 很粗，需要依赖 missing whole / part / stable semantic boundary 降噪。 |

## Findings

### 1. 当前 schema 足够第一版

`Trigger / Why / Source / Inspection` 可以保留。

不需要现在新增 `Evidence`、`Severity`、`Target Scope` 或 CLI parser 字段。

原因：

- 当前 signal module 仍是 signal definition language，不是 CLI spec。
- 过早扩字段会把 signal module 写成 engine schema。
- 未来 CLI 实现时可以从实际 parser 需求反推字段。

### 2. 最弱点是 Trigger 的可观察性

当前比较弱的 Trigger：

- `body missing state / move / transition terms or sections`
- `body missing layer / relation / boundary terms or sections`
- `body missing whole / part / stable semantic boundary terms or sections`

这些条件可以被未来 CLI 近似检查，但不是完全稳定的语义判断。

当前可以接受，因为 signal 是 warning，不是最终判罚。

### 3. signal module 需要真实样本继续校准

当前 6 个 signal 都来自已暴露误用，但有些缺少真实命中样本。

尤其是：

- [[mapping/bootstrap/modules/signal/example-as-kind|example-as-kind]]
- [[mapping/bootstrap/modules/signal/composition-as-list|composition-as-list]]
- [[mapping/bootstrap/modules/signal/workflow-as-policy|workflow-as-policy]]

这些 signal 可以先保留，但后续需要在真实 lint dry run 中检验误报率。

### 4. 不应继续扩 signal 数量

当前最重要的是提升现有 signal 的判断力，而不是新增 signal。

如果继续新增，容易让 `modules/signal/` 变成 premature registry。

## Candidate Conclusion

当前 6 个 signal module 可以作为第一版保留。

本轮不需要大改 `.contexta`。

下一步更合适的是：

```text
保留现有 6 个 signal module
不扩 signal 数量
不新增 schema
只在后续真实 lint dry run 中补样本和调 Trigger
```

如果要做最小修改，只建议后续在 task material 中标记：

- `workflow-as-policy`、`composition-as-list`、`example-as-kind` 需要真实样本校准。
- 未来 CLI 需要处理 examples / code fence / signal module 自身描述的排除问题。

## Review Questions

1. 是否接受：当前 6 个 signal module 作为第一版保留。
2. 是否接受：本轮不改 signal schema。
3. 是否接受：不新增 signal 数量。
4. 是否接受：弱 Trigger 先作为 warning trigger 保留，后续用真实 lint dry run 校准。
5. 是否需要现在直接修改某个 signal module，还是只记录质量审查结论。
