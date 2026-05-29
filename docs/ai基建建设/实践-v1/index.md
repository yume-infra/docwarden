# AI 基建实践 v1

> ⚠️ ai warning
>
> 本目录由 Codex 根据当前项目中已经发生的 `.docwarden` 实践起草。
> 在 sayori review 前，它只是实践记录草案，不是最终理论源。

## 定位

本目录记录项目内 AI Infra 的实践。

这里关注的是：为了让 agent 能更稳定地参与项目，需要在项目内部先建立哪些工作区、流程、约束和可验证机制。

它不直接承载文档体系理论本身。

文档体系理论与 docwarden 产品相关实践，放在：

```text
docs/文档体系建设/
```

## 当前实践来源

当前实践主要来自：

- `.docwarden/task/03-ai-infra-min-schema/`
- `.docwarden/task/04-task-review-spec-pipeline/`
- `.docwarden/task/21-contexta-isomorph-layer-split/`

这两轮实践已经验证了一个基本方向：

1. 先在项目内建立 agent 可工作的 `.docwarden` 区域。
2. 再用慢推进循环让 user 和 agent 对齐概念。
3. 把过程材料留在 task 中。
4. 把需要长期沉淀的内容再分发到后续层级。

## 当前已完成的实践

### 1. `.docwarden` 作为 agent 工作区

当前项目已经把 `.docwarden` 定义为 agent 的工作区。

agent 可以在这里创建和修改 task material，包括：

- 工作面入口。
- 计划。
- 日志。
- 草案。
- review 过程记录。
- 检查脚本。

这让 agent 的过程性工作不直接污染 `docs/`。

### 2. `docs/` 默认只读

当前规则是：`docs/` 是 human-maintained source layer。

agent 默认只能读取 `docs/`，不能修改。

只有当 sayori 明确要求修改具体 `docs/` 文件时，agent 才能编辑。

这个边界避免了 agent 把未 review 的过程材料直接伪装成稳定理论。

### 3. task 层替代 working 层

旧的 `.docwarden/working/` 已经迁移为：

```text
.docwarden/task/
```

原因是 `task` 比 `working` 更清楚地表达了短命任务过程层的语义。

当前 task 层承载：

- 上下文捕获。
- 草案。
- log。
- review 过程记录。
- 临时判断。
- 任务推进材料。

### 4. 工作面入口统一为 `index.md`

当前每个 task 工作面使用 `index.md` 作为 lead file。

`index.md` 负责：

- 描述工作面边界。
- 说明来源基线。
- 维护当前判断。
- 说明文件散发关系。
- 汇总当前文件状态。
- 指示下一步入口。

此前存在的旧 lead file 命名已经全量迁移为 `index.md`。

### 5. 最小状态模型

当前实践采用两层状态：

- 工作面状态：`active`、`paused`、`closed`
- 文件状态：`draft`、`reviewing`、`accepted`

工作面状态写在工作面 `index.md` 的 frontmatter 中。

文件状态写在每个文件自己的 frontmatter 中。

`accepted` 只表示 user 接受为当前 task 定义，不表示已经进入长期层级。

### 6. 慢推进循环

当前每个实质环节都采用慢推进循环：

1. agent 先问少量具体问题。
2. sayori 回答。
3. agent 在 task 目录生成 draft。
4. sayori review。
5. 通过后再进入下一环。

这个循环降低了 agent 一次性生成大段错误理论的风险。

### 7. 最小结构检查脚本

`03-ai-infra-min-schema` 中已经出现了一个最小结构检查脚本：

```text
.docwarden/task/03-ai-infra-min-schema/scripts/check-working-schema.mjs
```

它能检查：

- 工作面是否存在 `index.md`。
- 工作面是否存在 `log.md`。
- markdown 文件是否有 frontmatter。
- 文件状态是否合法。
- `workspace_status` 是否只出现在 `index.md`。
- `index.md` 文件索引是否提到顶层 markdown 文件。

这说明 AI Infra 不只是理论，也可以逐步沉淀成工具。

### 8. 三层 monorepo 拆分

2026-05-29 的实践确认，当前 monorepo 不应只被理解为 docwarden 单项目。

它同时承载：

```text
docwarden = 文档维护 workflow
contexta = context / prompt / capability infrastructure
isomorph = semantic primitive engine
```

此前 semantic-lint 和 recognition runtime 使用 `contexta` 名字推进，导致真正的 prompt / capability 基础设施缺位。

当前实践已将 semantic runtime 迁到：

```text
apps/isomorph/
.isomorph/
```

`apps/contexta/` 回到 context / prompt / capability infrastructure 的入口位置。

当前不保留 `.contexta` 占位配置；只有当 contexta 的 catalog / install / activation 机制真实消费本地配置时，才落地 `.contexta`。

## 当前未完成

当前实践还没有完成：

- review system 的详细设计。
- HTML review surface。
- review artifact / decision trace schema。
- spec / guide / wiki 的最小产物模板。
- promote / pick 的触发和编排。
- contexta 的 capability catalog / install / activation 机制。
- docwarden dogfood 所需的第一批 skills / prompts / agents。
- isomorph 与 contexta 的接入边界。

## 当前结论

项目内 AI Infra 的第一阶段不是直接做 CLI，也不是直接写最终规范。

更有效的顺序是：

```text
先建立 agent 工作区
  -> 用慢推进循环积累 task material
  -> 通过 review 纠偏
  -> 再把稳定内容分发到 spec / guide / wiki
  -> 通过 contexta 分发 workflow 所需能力
  -> 必要时把语义稳定性要求下沉到 isomorph
  -> 最后再扩展 tooling / CLI / plugin
```

这套实践已经在当前项目中跑通了最小闭环。
