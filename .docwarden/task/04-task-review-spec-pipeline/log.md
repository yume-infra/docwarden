---
status: accepted
created: 2026-05-13
updated: 2026-05-13
owner: sayori
---

# task / review / spec pipeline 日志

## [2026-05-13] setup | 创建 working task

创建 `04-agent-oriented-stable-layer` task。该工作面后来随理论修正重命名为 `04-task-review-spec-pipeline`。

初始判断：

- `03-ai-infra-min-schema` 已完成 working 内闭环，但还没有被 docwarden 自己消费。
- 下一步需要定义 agent-oriented stable 层，让后续 promote 有落点。
- custom skill creator 继续延后。

本任务继续使用慢推进循环。

## [2026-05-13] loop-1 | 起草 stable 定位

sayori 回答 Loop 1：

- stable 是否只服务 agent 编码是巨大分歧点。
- 按当前理论，需要有最小 user-review 单元。
- stable 是给 agent 的指挥层，但给 agent 的指挥层仍然需要 user review。
- 是否拆成 `stable/agent` 与 `stable/user` 暂时很难明确。
- 当前 `docs/` 不等于 stable。
- 当前阶段 stable 应由 promote 从 working material 中产生。

已创建 `stable-positioning.md`，将该分歧点作为草案核心。

## [2026-05-13] loop-1 | stable 定位 review 通过

sayori 接受 Loop 1 stable 定位。

已将 `stable-positioning.md` 标记为 accepted，并更新 `index.md` 与 `plan.md`。

下一步进入 Loop 2：最小目录结构。

## [2026-05-13] loop-2 | stable 理论被修正

sayori 反过来质疑 stable 理论本身，指出 `stable` 命名不合适。

新的方向：

```text
task -> review system -> spec
                    -> guide
                    -> wiki
```

初步理解：

- `task`：短命任务过程层，当前 `.docwarden/task/` 更接近它。
- `review`：user review system，用于降低 user review 成本。
- `spec`：agent-facing 指挥层 / 规范层。
- `guide`：user-facing 叙事层，也服务新需求构建。
- `wiki`：长期知识网络，对应 llm-wiki 理论。

sayori 进一步指出：HTML 作为 review surface 很有意思，可能比 Markdown 更轻松。

随后 sayori 明确：长期知识层就叫 `wiki`；guide 层可以服务新需求构建，review 层后可以同时产出 spec 和 guide。

已更新 `index.md` 和 `plan.md`，并创建 `pipeline-positioning.md`。

## [2026-05-13] loop-2 | pipeline 定位 review 通过

sayori 接受 `task -> review system -> spec / guide / wiki` pipeline 定位，并确认这些就是当前想表达的意思。

已将 `pipeline-positioning.md` 标记为 accepted，并更新 `index.md` 与 `plan.md`。

下一步进入 Loop 3：pipeline 最小目录结构。

## [2026-05-13] loop-3 | task 迁移与目录结构草案

sayori 明确：

- 不保留 `.docwarden/working/` 中间态。
- 要迁移就立即彻底迁移。
- 未来结构先按 `task / review / spec / guide / wiki` 设计。
- 每层都需要入口文件。
- 入口文件统一命名为 `index.md`。

已执行：

- 将 `.docwarden/working/` 整体迁移为 `.docwarden/task/`。
- 将路径引用从 `.docwarden/working` 更新为 `.docwarden/task`。
- 创建 `.docwarden/task/index.md` 作为 task 层入口。
- 创建 `pipeline-structure.md` 草案。

## [2026-05-13] loop-3 | 目录结构 review 通过

sayori 确认 Loop 3 目录结构合理。

已将 `pipeline-structure.md` 标记为 accepted。

已创建长期层目录和入口文件：

- `.docwarden/review/index.md`
- `.docwarden/spec/index.md`
- `.docwarden/guide/index.md`
- `.docwarden/wiki/index.md`

下一步进入 Loop 4：review surface 最小形态。

## [2026-05-13] loop-4 | review surface 生命周期确认

sayori 指出：

- review 不应该被理解成每个目标产物都审查一轮。
- 审查应当只做一轮；user 解决问题、确认关注点后，模型应自己提炼并分发到 spec / guide / wiki。
- review system 后续需要详细设计，当前理论层还不够处理。

本轮确认：

- review surface 本体短命。
- review decision / trace 需要可追溯。
- review 不作为长期知识入口。

已创建 `review-surface-shape.md` 并标记为 accepted。

下一步进入 Loop 5：pipeline dry run。

## [2026-05-13] close | 当前工作面收束

sayori 指出 dry run 后续再系统设计。

当前判断：

- `task -> review system -> spec / guide / wiki` pipeline 定位已经通过。
- `.docwarden/task` 迁移已经完成。
- `review/spec/guide/wiki` 入口层已经建立。
- review surface 的短命属性和 decision trace 需求已经确认。
- pipeline dry run 暂不开展，留到后续 review system 系统设计。

已将 `index.md` 的 `workspace_status` 更新为 `closed`。

## [2026-05-13] post-close | lead file 命名统一

sayori 指出当前仍存在旧 lead file 命名，要求全量迁移为 `index.md`。

已执行：

- 将 `.docwarden/task/*/` 下的旧 lead file 迁移为 `index.md`。
- 将当前协议和文档引用中的旧 lead file 命名迁移为 `index.md` / `index`。
- 将 03 的结构检查脚本改为检查 `index.md`。

迁移后不再保留旧 lead file 文件名。
