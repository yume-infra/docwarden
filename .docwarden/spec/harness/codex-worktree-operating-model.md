---
kind: policy
---

# codex-worktree-operating-model

## Intent

本 policy 描述 `docwarden` 仓库内部的 Codex App 协作模式。

它的目标不是设计跨仓库 workspace，也不是让 `contexta` 管理 Git worktree。它约束的是：`docwarden` 如何用一个主 Local checkout、多个 Codex-managed permanent worktree 和清晰的 thread 编排规则来长期并发推进。

## Official Boundary

Codex App 的 worktree 是基于 Git worktree 的 repo 内并行 checkout。

本仓库遵守以下边界：

- `/Users/sayori/Desktop/docwarden` 是 Local / 主 checkout。
- Codex-managed worktree 是后台执行面。
- permanent worktree 是长期保留的后台执行面。
- thread 是会话和任务上下文，不等同于 worktree。
- worktree 生命周期由 Codex App 管理，不由 `contexta` 或仓库脚本伪造。
- `.codex` local environment 是每个 worktree 的启动和动作契约，应通过 Codex App 真实生成后再纳入仓库。

Reference:

- <https://developers.openai.com/codex/app/worktrees>
- <https://developers.openai.com/codex/app/local-environments>

## Local Checkout

Local checkout:

```text
/Users/sayori/Desktop/docwarden
```

职责：

- 保持主线入口；
- 进行最终验收、merge、push；
- 处理跨长期线冲突；
- 作为用户日常 IDE 或唯一 dev server 的前台环境；
- 不承载所有长期探索和并发改造。

Local checkout 不应成为每条长期线的工作区。长期线应进入 Codex-managed permanent worktree。

## Permanent Worktrees

`docwarden` 当前保留这些长期执行面：

```text
docwarden 架构层重构
  负责 layer / isomorph / contexta / projection / runtime 边界。

docwarden v1 实现
  负责 docwarden CLI、文档管理机制、确定性 gate、v1 行为闭环。

isomorph primitives
  负责 semantic primitive、grammar、lint、export shape 的语义机制。

contexta runtime
  负责 .contexta pack、Codex export、plugin / repo-skill dogfood。
```

这些名称是协作边界，不是强制目录名。真实目录由 Codex App 管理。

## Current Lanes

当前长期线：

```text
docwarden 架构层重构
  thread: docwarden 架构层重构
  cwd: /Users/sayori/.codex/worktrees/1c84/docwarden
  branch: refactor/layers
  status: closed after architecture handoff

docwarden v1 实现
  thread: docwarden v1 实现
  cwd: /Users/sayori/.codex/worktrees/a18c/docwarden
  branch: feat/docwarden-v1

isomorph primitives
  thread: isomorph primitives
  cwd: /Users/sayori/.codex/worktrees/77ac/docwarden
  branch: feat/isomorph-primitives

contexta runtime
  thread: contexta runtime
  cwd: /Users/sayori/.codex/worktrees/ae35/docwarden
  branch: feat/contexta-runtime
```

`docwarden 架构层重构` 已经从最初的 `workflows contexta` 维护，演进并完成主架构改造。后续它只作为架构咨询线；日常工作应进入 `docwarden-main` 或对应长期线。

## Thread Naming

Thread 名称应先表达长期线，再表达当前任务。

推荐形状：

```text
docwarden 架构层重构
docwarden v1 实现
isomorph primitives
contexta runtime
docwarden 历史：旧实现评估
docwarden 历史：理论缺失层梳理
```

短任务可以在长期线内新开 thread，但标题仍应保留所属线：

```text
contexta runtime：plugin export dogfood
isomorph primitives：skill-primitive lint gate
docwarden v1：review/pick CLI baseline
```

## Handoff Rules

使用 Codex App 的 Handoff 在 Local 和 worktree 之间移动 thread。

规则：

- 需要日常 IDE、唯一 dev server 或最终人工验收时，handoff 到 Local。
- 需要后台持续推进时，handoff 回对应 permanent worktree。
- 不手动在多个 worktree 同时 checkout 同一个 branch。
- 如果一个 branch 已经被某个 worktree 占用，另一个 worktree 应从 detached HEAD 或新 branch 工作。
- merge 进入 `main` 时，以 Local checkout 为最终落点。

## Branch Rules

长期线可以有对应 branch，但 branch 不是 worktree 本身。

当前对应关系：

```text
docwarden 架构层重构 -> refactor/layers
docwarden v1 实现 -> feat/docwarden-v1
isomorph primitives -> feat/isomorph-primitives
contexta runtime -> feat/contexta-runtime
```

如果 Codex worktree 处于 detached HEAD，可以先完成探索，再在该 worktree 上创建 branch。

如果需要把 branch 带回 Local，不要手动在 Local checkout 同名 branch；优先使用 Handoff，或先让当前 worktree 离开该 branch。

## Local Environment

`docwarden` 应补齐 `.codex` local environment，但不要手写未验证 schema。

建设顺序：

1. 在 Codex App settings 中为 `docwarden` 创建 local environment；
2. setup script 覆盖 worktree 初始化；
3. actions 覆盖常用验证动作；
4. 检查 App 生成的 `.codex/**` 文件；
5. 将确认可提交的配置纳入仓库；
6. 再考虑是否由 `contexta` 生成或维护其中一部分。

初始 setup 候选：

```bash
rtk pnpm install
rtk pnpm -C apps/contexta build
rtk pnpm -C apps/isomorph build
```

初始 actions 候选：

```bash
rtk pnpm -C apps/contexta test
rtk pnpm -C apps/isomorph test
rtk pnpm -C apps/contexta typecheck
rtk pnpm -C apps/isomorph typecheck
```

所有命令最终应按仓库实际脚本收敛。当前仓库 agent 命令仍需遵守 `rtk` 前缀规则。

## Contexta Boundary

`contexta` 不管理 Codex worktree。

它可以管理：

- `.contexta/packs/**` source assets；
- Codex repo-skill export；
- Codex plugin export；
- verified hooks/config projection；
- dogfood 资产分发。

它不管理：

- permanent worktree 创建；
- Handoff；
- branch checkout；
- Codex App sidebar 项目组织；
- Local environment UI 生成流程。

如果未来要让 `contexta` 接触 `.codex` 配置，必须先确认该配置是 Codex 官方加载 surface，再作为 export target 建模。

## Coordination Loop

每条长期线遵循同一个推进循环：

1. 在对应 permanent worktree/thread 内推进实现或调研；
2. 形成可验证提交；
3. 在该线内完成局部测试；
4. 需要整合时切回 Local；
5. Local 合并并跑最终验收；
6. 冲突按层级职责判断，而不是按文件归属简单覆盖。

冲突判断：

- 架构边界、目录责任、runtime export 目标：优先保留架构线结论；
- docwarden v1 行为、primitive 内容、具体 skill 质量：优先尊重对应实现线；
- 任何上游 Codex 不支持的 runtime surface：不导出。

## Main Lead Prompt

`docwarden-main` 接管主线协调时使用：

```text
你现在接管 docwarden-main，职责是 docwarden 仓库的主线整合、最终验收、merge、push、跨长期线冲突协调。

当前工作模式已经确立：

Local / 主 checkout:
- /Users/sayori/Desktop/docwarden
- main 分支
- 只负责整合、最终验证、merge、push、冲突判断
- 不作为所有并发实现工作的战场

长期 permanent worktree:
- docwarden 架构层重构 -> refactor/layers
- docwarden v1 实现 -> feat/docwarden-v1
- isomorph primitives -> feat/isomorph-primitives
- contexta runtime -> feat/contexta-runtime

职责边界：
- docwarden = 文档管理 workflow / CLI / gate / v1 行为
- isomorph = semantic primitive / grammar / lint / export shape
- contexta = context assets / packs / Codex runtime export / dogfood 分发
- projection/export 只输出上游 Codex 官方支持的 runtime surface
- 上游不支持的内容永远不要映射到 runtime

你作为 main lead，要做：
1. 定期检查四条长期线的 git 状态和提交；
2. 判断哪些变更可以进入 main；
3. 处理跨线冲突；
4. 保持 main 是最终可用、可验证、可 push 的状态；
5. 需要架构判断时回到 “docwarden 架构层重构” 线；
6. 不要直接吞并实现线的职责。

开始前读取：
- AGENTS.md
- /Users/sayori/Desktop/docwarden/.docwarden/user/profile.md
- .docwarden/spec/harness/codex-worktree-operating-model.md
- docs/concept/layers.md
- docs/practice/codex-runtime-targets.md

当前已知状态：
- main clean，ahead origin/main
- refactor/layers 已完成架构交接，合入 main 后可删除
- feat/docwarden-v1 有未提交 docwarden v1 改动
- feat/isomorph-primitives 有未提交 primitive / lint / runtime 改动
- feat/contexta-runtime 有未提交 contexta runtime / plugin export 改动

你的第一步：
检查这四个 worktree 的状态，输出一份 main 整合看板，不要修改文件。
```

## Merge Prompt

`docwarden-main` 准备整合长期线时使用：

```text
作为 docwarden-main lead，检查以下长期线是否可以合入 main：

- feat/docwarden-v1
- feat/isomorph-primitives
- feat/contexta-runtime

要求：
1. 先分别读取对应 worktree 的 git status、最近提交、未提交 diff 摘要；
2. 判断每条线是否应该先在自己的 thread 内提交；
3. 如果有跨线冲突，按 .docwarden/spec/harness/codex-worktree-operating-model.md 的职责边界分类；
4. 只在确认 main clean 且合并路径清楚后执行 merge；
5. 合并后跑对应验证；
6. 最后输出 main 状态、合入内容、剩余风险。
```

