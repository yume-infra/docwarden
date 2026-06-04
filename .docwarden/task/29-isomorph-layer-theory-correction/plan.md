# 29-isomorph-layer-theory-correction plan

Task title: isomorph layer theory correction
Created: 2026-06-04T07:45:15.669Z

## Objective
- 用慢速 task loop 纠正 isomorph 的层级理论：先确认问题、建模、review，再决定实现。
- 把 `skill-primitive` 从“root concrete skill repository”重新定位为 agent-use contract 的一种输出形态。
- 把 external vocabulary / semantic framework 建模为独立实例，不让 root `.isomorph` 拥有具体领域词表或 downstream runtime material。

## Steps
- [x] Step 0: 编号协调与任务入口创建
- [x] Step 1: Freeze current surface
- [x] Step 2: Diagnose layer errors
- [x] Step 3: Model target mechanism
- [x] Step 4: Review model with user
- [x] Step 5: Implement reversible baseline
- [x] Step 6: Validate and decide promote / pick / log-only

## Loop

本 task 使用慢速 loop：

```text
capture -> diagnose -> model -> review -> route -> implement -> verify -> promote/pick/log
```

每一轮只推进一个可审查判断。没有通过 review 的模型不进入 implementation。

## Step 0: 编号协调与任务入口创建

Status: done

结论：

- main 已有 `28-docwarden-v1-skills-cli-dogfood`。
- isomorph primitives 线程中的未提交 `28-isomorph-layer-theory-correction` 作为问题记录来源，不作为 mainline canonical 编号。
- 本任务使用 `29-isomorph-layer-theory-correction`。

## Step 1: Freeze current surface

Status: done

目标：冻结当前主线已合入但仍可疑的理论面，避免边查边改。

要检查：

- `.isomorph/primitives/concept/skill-primitive.md`
- former `.isomorph/primitives/skill-primitive/*.md` concrete material
- `.isomorph/exports/**`
- `.isomorph/primitives/concept/semantic-framework.md`
- `.isomorph/primitives/concept/vocabulary.md`
- `.isomorph/grammars/policy/mapping-boundary.md`
- `.contexta/packs/**` 与 `plugins/**` 中已 materialize 的 skill surface

验收：

- root `.isomorph` 只接受 bootstrap concept/policy/template/lint surface。
- concrete skill material 必须停止作为 root primitive source 扩张。
- contexta pack skill directories 承接 canonical skill material。

## Step 2: Diagnose layer errors

Status: done

目标：把层级错误拆成少数可判断命题。

当前假设：

- root `.isomorph` 可以拥有 bootstrap language：concept、grammar、lint、recognition。
- concrete skill material 不应继续作为 root primitive 实例。
- `Export Shape` 不应继续作为 `skill-primitive` 的核心定义中心。
- `.isomorph/exports/**` 不能继续作为稳定 root layer 扩张。
- contexta 需要重新定位为 context assets / packs / distribution，而不是 isomorph export folder。
- external vocabulary target 应作为 semantic framework instance，而不是 root vocabulary material。

验收：

- 用户已确认 `skill-creator` canonical 落 contexta，review gate 上提为 `lead-review theory`。
- `.isomorph/exports/**` 降级问题保留为后续 broader cleanup，不在本轮迁移。

## Step 3: Model target mechanism

Status: done

目标：定义机制而不是先改目录。

需要建模的四层：

- `isomorph core language`：定义 concept / relation / grammar / lint / recognition。
- `semantic framework instance`：承载 external vocabulary 或项目语义体系。
- `agent-use contract`：把 framework 转成 agent 可用的 trigger、judgment、workflow、loss model。
- `projection/materialization`：由 contexta / plugin / runtime export 变成 Codex skill、pack 或 runtime artifact。

关键判断：

- `skill-primitive` 是 agent-use contract 的一种输出形态，不拥有 semantic framework。
- vocabulary 可以驱动 content/skill/agent behavior，但必须先成为 framework instance。
- framework 的使用方式需要显式暴露，而不是隐含在 export folder 或 generated skill 中。

验收：

- `lead-review` 进入 bootstrap concept/policy。
- `skill-primitive` 定义收窄为 agent-use contract shape。
- `contexta` 承接 `skill-creator` 与 `lead-review` canonical skill asset。

当前材料：

- `definition-pass-1.md`：已确认 core / primitive / grammar / framework vocabulary / usage contract / feedback loop，以及 `skill-creator` canonical 属于 contexta。
- `definition-pass-2-draft.md`：已按现有 isomorph 理论重写，`correction` 先作为 review/lint/workflow 输入，`candidate update` 先作为待 review assertion / assertion set，`review gate` 提升为 `lead-review theory`。
- `existing-theory-alignment.md`：记录现有 `concept / policy / relation / assertion / signal / semantic-lint / structure` 如何承接新机制，避免重新发明平行层级。

## Step 4: Review model with user

Status: done

目标：先 review 目标模型，再写 implementation。

review 问题：

- 四层模型是否足够表达 Animation Vocabulary 这类外部词表？
- `skill-primitive` 是否应降级为 agent-use contract 输出形态？
- `.isomorph/exports/**` 是否整体迁出/重命名/降级？
- contexta 在这个模型里是 asset distribution，还是另有更基础的语义位置？

验收：

- 用户确认边界 1/2/3 正确，确认 `skill-creator` 落统一 contexta 层后分发。
- 用户要求进入实现，本轮开始落地。

## Step 5: Implement reversible baseline

Status: done

目标：先在 main 做可回滚基线，修掉当前已合入主线的错误 canonical source 与验证入口。

本轮实现：

- 新增 `lead-review` concept/policy。
- 将 concrete `skill-creator` / `dw-pick` skill-primitive material 移到 contexta canonical skill source。
- 新增 contexta `lead-review` skill asset。
- 新增 `concrete-skill-primitive-under-root` signal 防回流。
- 修正 repo-local/plugin dogfood skill 的 validation path。

验收：

- 不迁移 `.isomorph/exports/**`。
- 不新增 runtime 不支持 surface。
- broader semantic-framework/export cleanup 后续再拆 lane。

## Step 6: Validate and decide promote / pick / log-only

Status: done

目标：实现后再决定稳定落点。

验收：

- `skill-creator`、`dw-pick`、`lead-review` primitive validation 均为 `status: ready`。
- contexta/isomorph focused typecheck and tests passed。
- contexta repo-skill and plugin dogfood export passed。
- 本轮不 promote 到 `docs/`；实现结论留在 task log，后续 broader export/framework cleanup 另拆。
