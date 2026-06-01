---
status: draft
created: 2026-06-01
updated: 2026-06-01
owner: sayori
---

# Review Workflow Definition / Config Split Draft

本文件修正上一版错误：`review` workflow 的定义层和 docwarden 使用层 config 不是同一个东西。

## Review Lead

docwarden v0 需要先在 isomorph mapping 层整理 workflow 初版定义，再由 `docwarden init` 在使用层创建可运行项目框架和 config。

上一版的候选落点：

```text
.docwarden/workflow/review.md
```

应撤回。

它把定义层和使用层 config 混到了一起。

## Definition Layer

definition layer 应在 isomorph mapping 下表达。

当前口径：

```text
.isomorph/mapping/bootstrap/
  isomorph 的自举映射。

.isomorph/mapping/contexta/
  contexta 层映射。
  现有 user-context 示例应按这个口径理解。

.isomorph/mapping/docwarden/
  新的 docwarden 层映射。
  用 isomorph 的 workflow structure 整理 docwarden workflow v0。
```

docwarden workflow definition 应使用 Markdown + frontmatter，因为它是可读、可审核、可语义检查的 mapping definition。

候选定义形态：

```md
---
kind: workflow
id: dw:review
mapping: docwarden
structure: workflow
status: draft
---

# review

## State

...

## Move

...

## Transition

...
```

这里的 `kind: workflow` 回到 isomorph 的 workflow structure 定义，不是 docwarden 使用层 config。

## Runtime Config Layer

docwarden 使用层应由命令初始化。

候选链路：

```text
docwarden init
  -> 创建 .docwarden/ 基本框架
  -> 创建项目资产目录
  -> 创建 yaml 或其他 runtime config
```

候选 runtime config 形态：

```yaml
review:
  mode: review-first
  pending_marker: review-pending

cleanup:
  after_promote_pick: delete

review_surface:
  files:
    - index.md
    - lead.md
    - backing.md

route_targets:
  - promote
  - pick
  - log-only
  - transfer
  - no-op
```

这类配置用于当前项目实际运行，不承担 isomorph mapping definition 的语义定义职责。

## Definition v0

docwarden `review` workflow 的 definition v0 应先表达 state / move / transition。

### State

```text
task-active
  当前任务仍在推进，task material 持续变化。

review-needed
  任务产生了可能需要长期化或确认的主线 delta / side value / drift。

review-surface-ready
  review surface 已生成，等待用户审核。

reviewed
  用户已审核 lead，并给出确认 / 纠偏 / 拒绝 / 延后。

routed
  已根据 review 将内容分流到 promote / pick / log-only / transfer / no-op。

cleanup-ready
  promote / pick / log / transfer 的处理位置已写明，task 可以进入 cleanup handoff。
```

### Move

```text
detect-review-need
  判断当前 task 是否产生需要 review 的内容。

build-review-surface
  生成 index.md / lead.md / backing.md。

collect-user-review
  让用户审核 lead，必要时查 backing。

route-reviewed-material
  根据用户审核结果分流。

prepare-cleanup-handoff
  写明 cleanup 前置条件、未处理缺口和后续承接位置。
```

### Transition

```text
task-active --detect-review-need--> review-needed

review-needed --build-review-surface--> review-surface-ready

review-surface-ready --collect-user-review--> reviewed

reviewed --route-reviewed-material--> routed

routed --prepare-cleanup-handoff--> cleanup-ready
```

## Review Mode

`review.mode` 是 runtime config 的选项，不是 workflow definition 的全部内容。

`review-first`：

```text
review-needed
  -> review-surface-ready
  -> user review
  -> routed
```

`review-later`：

```text
task-active
  -> generate judged content
  -> mark pending review
  -> final review
  -> clear pending marker
```

v0 可以先在 runtime config 中保留这个选项，只完整跑通 `review-first`。

## `dw:review` Skill 位置

`dw:review` 是执行单元。

它读取：

- docwarden 使用层 runtime config。
- 当前 task material。
- 必要时读取 isomorph mapping 下的 docwarden workflow definition。
- 项目规则和 user profile。

它输出：

- review surface：`index.md / lead.md / backing.md`。
- route 建议和 cleanup handoff。

它不拥有：

- isomorph workflow structure 定义。
- docwarden workflow definition。
- docwarden runtime config 的唯一真相。

## 下一步

下一步不应继续问 `.docwarden/workflow/review.md` 是否接受。

更小的审核对象应是：

```text
1. 是否接受：旧 .isomorph/mapping/docwarden 应迁为 contexta。
2. 是否接受：新的 .isomorph/mapping/docwarden 承接 docwarden workflow definition。
3. 是否接受：docwarden init 创建使用层框架和 runtime config。
```
