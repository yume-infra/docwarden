---
status: accepted
created: 2026-05-27
updated: 2026-05-28
owner: sayori
---

# contexta next goal pre-goal lead

## Execution Status

本 lead 已在后续 goal 中执行完成。

实现提交：

- `ae2fd7e feat(contexta): enforce strict runtime contracts`

任务整理提交见后续 task commit。

当前实现已经不是 task19 所说的单文件 runnable spike。

已明显改善的部分：

- runtime 入口已迁到 `run*Effect`。
- pin metadata 已有结构化 decode。
- upgrade 已能表达 `pinned-v0` 和 `pre-v0-without-pin`。
- local recognition material 已进入 seed。
- CLI subprocess tests 已开始覆盖主要命令。
- 当前验证通过：contexta typecheck、build、tests、lint。

但下一轮 goal 不应继续横向补 signal 或扩 CLI 命令。

下一轮应聚焦：

```text
authority does not fail open
  -> executable contract does not leak parser errors
  -> missing pin / missing authority fail strictly
  -> doctor owns repair
  -> upgrade pin means real baseline
  -> diagnostics are visible
  -> public/runtime boundary narrows
```

## Approved Direction

下一轮 goal 先修正 recognition / lint / CLI contract 的语义闭环，再处理 public API 和目录结构收口。

该顺序已通过 review。

recognition、lint 和 CLI exit code 是 runtime v0 的可执行语义。

public API、RootResolver service、bin/library split 和目录重组重要，但不应抢在 authority 和 executable contract 之前。

## Architecture Design Lens

下一轮架构判断参考 `/Users/sayori/Desktop/software-design-philosophy-skill/SKILL.md`。

该模型只作为设计审查尺，不覆盖 contexta 理论。

用于本轮的最小判断：

- Complexity：优先减少 change amplification、cognitive load 和 unknown unknowns。
- Deep module：runtime entrypoint 应隐藏 root resolution、model loading、trigger interpretation 等实现复杂度，不能把这些复杂度推给 CLI 或调用方。
- Information hiding：recognition authority、signal applicability、pin baseline resolution 各自应有清楚 owner；同一设计决策不应散在 CLI、runtime、recognition 和 signal 模块。
- Avoid temporal decomposition：不要只按执行步骤拆文件；拆分应围绕“谁隐藏哪类知识”。
- Different layers, different abstractions：domain、application、infrastructure、CLI 每层必须提供不同抽象；纯 pass-through 层没有保留价值。
- Pull complexity downward：target missing、bad trigger、unknown pin 等常见错误应在低层聚合成清楚结果，不把调用方逼成字符串判断。
- Define errors out of existence：能通过语义定义消除的错误，不要变成散落的异常分支。但本轮已决定 runtime 执行面采用严格失败；repair / migration 状态进入后续 `doctor`，不由普通 `recognize` / `lint` / `upgrade` 默默兼容。
- Design it twice：fallback、missing pin、public API 收口这三个决策至少比较两个方案后再实现。

## Approved Decisions

本轮已确认以下关键决策。

### Recognition fallback

选择最严格语义：

```text
missing or invalid local recognition authority
  -> config-class failure
  -> no default TS fallback
```

如果当前 local `.contexta` 因缺 recognition primitive 而无法运行，应后续修 local instance，或通过 `contexta doctor` 给出诊断 / repair。

TS fallback 不应作为默认 runtime path，也不应作为 hidden compatibility mode。

### Missing pin

选择最严格语义：

```text
missing .contexta-pin.json
  -> config-class failure
  -> no pre-v0 success in normal upgrade path
```

pre-v0 / unpinned local instance 的识别和修复，后续交给 `contexta doctor`。

普通 `upgrade` 只接受 pinned local instance。

这意味着当前仓库这种 pre-v0 `.contexta` 不能被普通 runtime 悄悄视为可升级状态；应先由 doctor 判断和 repair。

### Doctor issue / repair

`contexta doctor` 进入下一轮 goal。

doctor v0 必须设计 issue / repair，并保证可以正确修复。

最小闭环：

```text
doctor inspect
  -> structured issues
  -> dry-run repair plan
  -> apply with precondition checks
  -> verify postconditions
  -> ordinary strict runtime command passes
```

doctor v0 应支持当前仓库 pre-v0 `.contexta` 的 self-repair。

## P1 Next Goal Scope

### 1. Recognition 不得 fail open

当前风险：

- 没有 local recognition rule candidate 时会走 TS fallback。
- recognition trigger 写坏时会丢弃 rule，再走 fallback。
- pre-v0 `.contexta` 没有 recognition primitive 时，runtime 可能仍靠 fallback 识别。

下一轮目标：

- 删除默认 fallback authority。
- local recognition material 缺失或不可解析时进入 config-class failure。
- target `frontmatter.kind` 只能作为 feature，不应在 fallback 中恢复成 authority。
- 后续 repair 入口由 `contexta doctor` 承接，不由 `recognize` / `lint` 静默兼容。

验收测试：

- pre-v0 `.contexta` 缺 recognition primitive 时，`recognize` exit 2。
- local recognition rule 使用未知 trigger 时，config-class failure。
- `.contexta` 中随便出现 `kind: foo` 不应自动让 target `kind: foo` 成为 recognized role。

### 2. Lint 必须消费 recognition result

当前风险：

- `candidateSignalScope` 在 recognition 阶段直接对所有 signal 计算。
- signal trigger 直接读 frontmatter/path。
- local recognition override 不一定改变 lint applicability。

下一轮目标：

- recognition 输出 recognized role、basis、features、diagnostics。
- lint application 再消费 recognition result 和 signal definitions。
- signal applicability 必须能表达“基于 recognition role”还是“基于 raw surface feature”。

验收测试：

- local recognition override 把 `kind: concept` 识别为其他 role 时，`concept-as-policy` 行为必须明确。
- 不依赖 frontmatter 的 local recognition rule 识别出 concept 时，concept signal 是否适用必须有测试。

### 3. CLI executable contract 不能绕过 runtime error model

当前风险：

- `Argument.file(..., { mustExist: true })` 让 missing target 在 CLI parser 层失败，exit 可能为 1，而不是合同期望的 2。
- `init --root <existing .contexta>` 可能创建嵌套 `.contexta/.contexta`。

下一轮目标：

- missing target / target outside root / invalid explicit root 都进入统一 contexta error output。
- `init` 明确区分 workspace root 和 existing `.contexta` root。
- 显式 `.contexta` root 对 recognize / lint / primitive / upgrade 可用，但 init 不应嵌套创建。

验收测试：

- CLI subprocess 覆盖 missing target、target 不存在、outside root。
- `init --root <workspace>`、`init --root <workspace/.contexta>`、cwd init、duplicate init。
- 成功输出 stderr 为空；错误输出 exit 2 且 stderr 前缀稳定。

## P2 Next Goal Scope

### 4. Pin 必须指向真实 baseline

当前风险：

- shape-valid bogus pin 会被当作 `pinned-v0`。
- missing pin 当前可被表达为 `pre-v0-without-pin` success。
- empty `.contexta` 也可能被当作 pre-v0 instance。

下一轮目标：

- pin decode 后增加 baseline resolution。
- `vendor/ref/digest` 必须能匹配 known packaged baseline。
- missing pin / unknown pin / invalid pin 都是 ordinary runtime config failure。
- pre-v0 instance 的识别与修复不在普通 `upgrade` success path 中，后续交给 `contexta doctor`。

验收测试：

- unknown vendor/ref/digest 不应被信任为 pinned baseline，应 exit 2。
- `init` 产生的 digest 与 materialized seed set 对得上。
- upgrade 对 pinned 成功。
- upgrade 对 missing pin、invalid pin、unknown pin、empty `.contexta`、missing `.contexta` 均失败且错误分类明确。
- upgrade read-only 有 tree snapshot 前后对比。

### 4.5 Doctor repair path

doctor issue / repair 设计进入下一轮 goal。

详细设计见 `sup-01-doctor-issue-repair.md`。

`contexta doctor` 的方向：

- inspect local `.contexta`。
- 报告 missing recognition authority、missing pin、unknown pin、invalid pin、broken trigger、broken OFM link。
- 给出可审查 repair plan。
- repair plan 必须有 preconditions、postconditions、verification。
- 必须支持当前仓库自己的 pre-v0 `.contexta` 最小 self-repair 闭环。

doctor 不应让普通 runtime 放宽 strict semantics。

### 5. Diagnostics 必须可观察

当前风险：

- signal 缺 `Loss Model` 会 fallback 到 Definition，伪装成有 loss model。
- unparsed trigger 在普通 lint 输出里可能只表现为 `signals: 0`。
- primitive skill 只检查 required OFM links 是否出现，不验证链接是否解析到 local material。

下一轮目标：

- signal definition 的 loss model 缺失必须 diagnostic。
- unparsed trigger 必须在 JSON 和 human output 中可见。
- primitive skill 的 Semantic Basis links 需要解析到 local contexta material。

验收测试：

- signal 缺 `## Loss Model`。
- signal trigger 使用未知 DSL。
- skill primitive Semantic Basis 含坏 OFM link。
- Export Position 是 prose 时，future requirements 的解释规则明确。

## P3 Next Goal Scope

### 6. Architecture boundary 收口

当前风险：

- `runtime.ts` 仍承载 application orchestration。
- package root 仍暴露内部 model / helper / infrastructure surface。
- recognition 依赖 signal engine。
- domain 依赖 parser module。
- error type 带 CLI exitCode。

下一轮目标：

- `runtime.ts` 收成兼容聚合层。
- application 层拆出 recognize / lint / primitive skill / upgrade。
- public API 只保留稳定 entrypoints 和 result types。
- CLI 单独维护 error kind 到 exit code / stderr 的映射。
- 每个新模块必须能说清隐藏的设计知识，避免按执行顺序做浅模块。

验收测试：

- import boundary test。
- public API contract test。
- library import 不触发 bin bootstrap side effect。
- 对 fallback、missing pin、public API 三个设计点保留 alternatives note，记录为什么选当前方案。

## Suggested Next Goal Shape

下一轮 goal 建议拆成三个连续 commit 或三个小阶段。

### Phase 1: Contract Bugs First

修：

- missing target exit 2。
- `init --root <existing .contexta>` 不嵌套。
- CLI root resolution subprocess tests。

原因：

这是最明确的可执行 bug，范围小，能快速稳定外壳。

### Phase 2: Recognition / Lint Authority

修：

- fallback authority。
- bad recognition trigger diagnostic。
- lint 消费 recognition result。
- signal trigger diagnostic 可见。

原因：

这是 contexta runtime 的理论核心，不应在更多 feature 之前继续漂移。

### Phase 3: Upgrade / Doctor / Diagnostics

修：

- pin baseline resolution。
- missing pin strict failure。
- doctor issue / repair v0。
- 当前仓库 pre-v0 `.contexta` self-repair。
- primitive OFM link resolution。

原因：

strict runtime 会让当前 pre-v0 local instance 直接失败，因此 doctor 必须提供正确 repair 路径。

### Phase 4: Boundary 收口

修：

- public API 收口。
- import boundary。
- bin / library split。
- error 到 CLI exit code 的映射下沉到 CLI adapter。

原因：

这些会影响长期维护性，但不应抢在 strict semantics 和 doctor repair 之前。

## Do Not Start With

- 不先新增更多 signal。
- 不先扩展 primitive-creator 到 `SKILL.md` compiler。
- 不先做大目录重排。
- 不先把所有 error payload 设计成最终 schema。
- 不把 fallback 当成“临时可用所以继续保留 authority”。
- 不把 missing pin 当成普通 upgrade success。

## Goal Start Contract

下一轮 goal 的启动合同：

1. ordinary runtime strict，不保留默认 TS fallback。
2. missing / invalid recognition authority -> config-class failure。
3. missing / invalid / unknown pin -> config-class failure。
4. strict failure 的错误 payload 应复用或可映射到 doctor issue code。
5. doctor v0 必须支持 inspect、dry-run repair plan、apply、postcondition verification。
6. doctor v0 必须能 repair 当前仓库 pre-v0 `.contexta` 的最小闭环。
7. 普通 runtime 不因 doctor 存在而放宽语义。
