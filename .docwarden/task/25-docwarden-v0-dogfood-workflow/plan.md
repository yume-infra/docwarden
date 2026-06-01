---
status: active
created: 2026-06-01
updated: 2026-06-01
owner: sayori
---

# Plan

## Step 1: 修正 init skeleton

目标：`docwarden init` 生成原始理论要求的最小 `.docwarden` 结构。

应生成：

```text
.docwarden/
  config.yaml
  task/
    index.md
  review/
    index.md
  spec/
    index.md
  guide/
    index.md
  wiki/
    index.md
  archive/
```

验收：

- 新 workspace 运行 `docwarden init` 后具备五层入口。
- `task / review / spec / guide / wiki` 的 `index.md` 均有明确职责说明。
- 不覆盖已有 `.docwarden`。
- 测试覆盖完整结构。

## Step 2: 实现 task create

目标：为 workflow 提供标准过程材料入口。

命令形态：

```bash
docwarden task create --id <id> --title <title>
```

生成：

```text
.docwarden/task/<id>/
  index.md
  plan.md
  log.md
```

验收：

- 新 task 使用当前新规范：`index.md` 是入口，`plan.md` 是推进结构，`log.md` 是时间线。
- task `index.md` 明确 context / objective / boundary / next entry。
- `log.md` 追加创建事件。
- CLI 输出 task path 和 next entry。

## Step 3: 改造 review 为 task 驱动

目标：`review` 从 task material 中提炼 user 可审查内容。

主命令：

```bash
docwarden review --task <id>
```

读取：

```text
.docwarden/task/<id>/index.md
.docwarden/task/<id>/plan.md
.docwarden/task/<id>/log.md
```

生成：

```text
.docwarden/review/<review-id>/
  index.md
  lead.md
  backing.md
  state.yaml
```

验收：

- `lead.md` 不只是 target 摘要，而是回答本轮真正需要 user 判断什么。
- `backing.md` 说明来源 task material。
- `state.yaml` 记录 task id、review id、status、source files。
- `review --target` 不再作为主链路入口。

## Step 4: 实现 promote / pick 最小闭环

目标：review 后能把 task material 分发到长期层级。

命令形态：

```bash
docwarden promote --task <id> --to spec|guide|wiki
docwarden pick --task <id> --to wiki
```

v0 约束：

- 不引入稳定的 `candidates` layer。
- 未经 user 明确确认的内容仍留在 task 或 review artifact 中。
- 写入 `spec / guide / wiki` 时必须留下来源 trace。

验收：

- 一条 task 可以完成 `create -> review -> promote/pick`。
- `spec / guide / wiki` 至少有一个被 workflow 写入的最小可追踪产物。
- task `log.md` 记录 promote / pick 事件。

## Step 5: 在当前仓库 dogfood

目标：用本 task 自己作为第一个真实目标。

验收：

- 使用新命令创建或维护本 task。
- 对本 task 运行 `review --task 25-docwarden-v0-dogfood-workflow`。
- 通过 `promote / pick` 产生第一份真实 `spec / guide / wiki` 增量。
- 记录哪些地方仍然不可用，进入下一轮 task。
