# 项目内 AI Infra 实践记录

> ⚠️ ai warning
>
> 本文记录当前项目里已经发生的 AI Infra 实践。
> 它来自 `.docwarden/task/03-ai-infra-min-schema/` 与 `.docwarden/task/04-task-review-spec-pipeline/` 的实际推进。

## 背景

在真正实现 docwarden 的 CLI、plugin 或 skill 之前，项目先需要一套能支撑 agent 工作的内部基础设施。

这套基础设施不是面向最终用户的产品功能，而是为了让 agent 在项目内工作时：

- 有明确的工作区。
- 有明确的文件入口。
- 有明确的状态模型。
- 有明确的 review 边界。
- 不直接污染 human-maintained docs。

## 实践 1：先建立 `.docwarden`

当前项目把 `.docwarden` 定义为 agent 工作区。

这个决定解决了一个基础问题：agent 的过程材料应该放在哪里。

如果没有这个区域，agent 容易把计划、草案、纠错、review notes 混入 `docs/`，导致未稳定内容和理论源混在一起。

## 实践 2：把工作区收敛到 task 层

早期使用的是 `working` 表述。

后续实践中发现，`working` 更像状态，不适合作为长期目录名。

当前已经迁移为：

```text
.docwarden/task/
```

这使目录语义更明确：这里保存的是围绕具体任务存在的短命过程材料。

## 实践 3：每个工作面用 `index.md` 做入口

当前每个 task 工作面都以 `index.md` 作为入口。

这个入口承担：

- lead file。
- 唯一震源。
- 文件索引。
- 当前判断。
- 下一步入口。

这种做法让 agent 进入一个工作面时不需要猜应该先读哪个文件。

## 实践 4：用 `log.md` 记录时间线

`log.md` 只记录事件。

它不承担主线解释，也不替代 `index.md`。

这个区分让工作面中同时存在：

- 一个面向当前状态的入口。
- 一个面向历史过程的时间线。

## 实践 5：引入最小状态

当前实践只保留必要状态。

工作面状态：

- `active`
- `paused`
- `closed`

文件状态：

- `draft`
- `reviewing`
- `accepted`

暂不引入 `superseded`。

如果未来出现替代关系，先通过 `index.md` 和 `log.md` 的自然语言说明处理。

## 实践 6：把 review 设计成慢循环

当前有效的推进方式是：

1. agent 问问题。
2. user 回答。
3. agent 起草。
4. user review。
5. 通过后继续。

这比 agent 一次性写完整体系更稳定。

尤其是在概念还未对齐时，慢循环可以及时暴露误解。

## 实践 7：把结构约束交给脚本检查

当前已经有最小检查脚本：

```text
.docwarden/task/03-ai-infra-min-schema/scripts/check-working-schema.mjs
```

它证明了一件事：AI Infra 中一部分规则可以机械检查，不必完全依赖模型自觉。

当前可检查的主要是结构规则，不是语义正确性。

语义正确性仍然依赖 user review。

## 实践 8：从 stable 修正到 pipeline

实践中发现，单一 `stable` 层会混淆多个责任。

当前更合理的管线是：

```text
task -> review system -> spec
                    -> guide
                    -> wiki
```

这个修正来自实际推进中的概念冲突，而不是预先设计出来的目录结构。

## 当前经验

这轮实践得到的经验是：

- AI Infra 应该先服务当前项目，不要一开始就抽象成通用产品。
- agent 工作区必须和 human-maintained docs 分离。
- 文件入口命名要统一，否则 agent 查询成本会上升。
- task 材料必须短命，否则会变成新的知识垃圾。
- review 是必要的，但 review surface 后续需要系统设计。
- 脚本检查适合先覆盖结构规则，语义规则后置。

## 下一步

下一步 AI Infra 实践应该继续围绕 review system 展开。

重点不是马上做 CLI，而是先弄清楚：

- review surface 最小应该长什么样。
- HTML review 是否真的比 Markdown 更轻松。
- decision trace 放在哪里。
- review 后如何分发到 spec / guide / wiki。

这些问题解决后，再考虑把流程沉淀成 tooling。
