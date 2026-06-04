# Definition Pass 2 Draft

Status: revised-draft

## Goal

把 feedback loop 贴回现有 isomorph 理论，而不是重造一组平行概念。

这一轮只定义理论对应关系，不迁移 `.isomorph`，不修改 runtime。

## Existing Theory Anchors

本轮优先复用现有 isomorph language：

- `concept`：稳定命名和定义语义对象。
- `policy`：表达约束、适用范围和执行边界。
- `relation`：表达 concept network 的稳定连接。
- `module`：md file scope，承载 metadata 和正文。
- `assertion`：module 内部最小可审查 semantic commitment。
- `signal`：semantic-lint 产生的语义偏移 warning。
- `trigger`：semantic-lint 可观察、可脚本化的触发条件。
- `semantic-lint`：从 formatted md 产生 signal，并尽量组织成 review-ready lint result。
- `template`：复制骨架，不拥有 lifecycle、review、policy 或 source authority。
- `example`：教 agent 在具体场景中如何判断和落笔。
- `structure`：表达多个语义位置如何共同成立。
- `architecture`：表达 layer、relation、boundary 共同成立的层级结构。
- `workflow`：表达 state、move、transition 共同成立的推进结构。

## Layer Model

### isomorph bootstrap language

root `.isomorph` 拥有 bootstrap semantic authority。

它定义建构 framework 所需的语言，不拥有具体领域理论。

当前可复用对象：

- `concept` 定义对象。
- `policy` 定义约束。
- `relation` 定义 concept network 连接。
- `structure / architecture / workflow / pipeline / branch / composition` 定义组织语言。
- `module / assertion / metadata / kind` 定义 md module 与最小可审查承诺。
- `signal / trigger / semantic-lint / locator / confidence` 定义偏移检测链。
- `template / example` 定义复制骨架与样本教学。

### semantic framework

semantic framework 是用户或项目拥有的 domain semantic system。

它拥有：

- domain terms。
- domain relations。
- domain boundaries。
- domain loss models。
- domain quality signals。
- domain examples / counterexamples。
- agent-use surface。

root `.isomorph` 不能把 Animation、docwarden 或 skill authoring 这类领域内容吸收成 root primitives。

### vocabulary

vocabulary 是 semantic framework 的 naming surface。

它不是 glossary，也不是 keyword list。

它让 agent 能把 term、alias、intent、failure mode 转成可被 recognition、magic-word、semantic-lint、review 和 usage contract 消费的语义材料。

### usage contract

usage contract 是 semantic framework 进入 agent 工作流的方式。

它不需要作为全新 root primitive 立即出现。它可以由现有对象组合：

- `policy` 约束 agent 行为。
- `workflow` 表达 agent 使用这套 framework 的推进过程。
- `signal` 表达可检测误用。
- `example` 教 agent 如何看、如何写、如何避免误判。
- `relation` 表达 framework 内部的读取路径。
- `skill-primitive` 表达其中一种 agent-facing skill 形态。

`skill-primitive` 因此不是核心层中心，而是 usage contract 的一种 exportable / materializable 形态。

## correction

correction 是 feedback loop 中的偏差反馈来源。

现阶段不把 `correction` 直接升成 root primitive。

它应先被建模为 review / lint / workflow 输入，可以来自：

- 用户直接纠正。
- review surface 中的用户反馈。
- semantic-lint 产生的 signal。
- recognition 发现的 role mismatch。
- agent 输出与 framework vocabulary 预期不一致。
- dogfood 中反复出现的失败模式。

correction 的首要动作不是写回，而是 route：

- 是否只是 task log。
- 是否形成 signal。
- 是否形成待 review assertion。
- 是否需要更新 framework vocabulary。
- 是否需要更新 usage contract。
- 是否只是 projection/materialization 错误。

## candidate update

candidate update 是 correction 被 route 后形成的待 review 更新。

它不需要先作为独立 root primitive。

贴合现有理论，它更像：

```text
candidate update = 待 review assertion 或 assertion set
```

candidate update 必须能被组织成 `lead + backing`：

- `lead`：最小 user-reviewable commitment。
- `backing`：source correction、相关 module、signal / trigger / evidence、boundary、reason、expected behavior。

candidate update 的 target 可以是：

- framework vocabulary 的 term / alias / intent。
- framework relation。
- framework boundary。
- framework loss model。
- framework example / counterexample。
- usage contract policy / workflow / signal。
- contexta materialization rule。

但 projection rule 只能调整 materialization 输出，不能反向定义 isomorph bootstrap language。

## lead-review theory

`review gate` 应提升为统一的 `lead-review theory`。

它不是 docwarden workflow 里的局部 gate。

它的理论职责是把 candidate assertion / signal / update 组织成用户偏好的审核形态：

```text
candidate update
  -> lead
  -> backing
  -> user review
  -> accepted / rejected / revise / route
```

`lead` 是最小 user-reviewable commitment。

`backing` 是被 lead 统摄、用于支撑 / 展开 / 校验 lead 的材料层。

用户主要审核 lead；当 lead 不清晰、不可信或需要追溯时，再展开 backing。

`lead-review theory` 可以由 contexta export 成 skill。这个 skill 的职责不是普通 review，而是强制 agent 用 lead + backing 的方式组织 theory update、candidate assertion、semantic-lint result 或 workflow correction。

docwarden review 是当前 dogfood projection：

```text
lead-review theory
  -> contexta lead-review skill
  -> docwarden review surface
  -> docwarden CLI hard gate
```

docwarden 不拥有 lead-review theory；它只是当前最早的文件写入和 review workflow 验证场。

## Feedback Loop

贴合现有理论后的 loop：

```text
agent uses semantic framework
  -> formatted md / answer / artifact / judgment
  -> recognition and semantic-lint inspect surface
  -> signal or user correction appears
  -> correction is routed
  -> candidate assertion / assertion set is formed
  -> lead-review organizes lead + backing
  -> user accepts / rejects / revises / routes
  -> accepted assertion updates framework vocabulary or usage contract
  -> contexta materializes confirmed usage contract when needed
  -> future agent behavior changes
```

## Consequences

- 不新增 `correction` root primitive，除非后续发现它不能被 signal / review input / workflow input 承接。
- 不新增 `candidate-update` root primitive，先把它作为待 review assertion / assertion set。
- `review gate` 改为 `lead-review theory`，并作为可 contexta-export 的 skill theory。
- `skill-primitive` 保持为 usage contract 的一种 agent-facing 形态。
- `skill-creator` 与未来 `lead-review` canonical skill asset 属于 contexta，不属于 root `.isomorph` 或 repo-local `.agents`。

## Open Questions

- `lead-review theory` 是否应作为 root `.isomorph` 的 bootstrap concept。
- `lead` / `backing` 是否需要进入 isomorph core，还是继续由 docwarden review theory 承接后再上提。
- accepted update 的第一个 deterministic write path 应先支持 framework vocabulary，还是 usage contract。
- framework vocabulary 的 concrete module shape 应复用 `concept / policy / relation / signal / example`，还是需要一个 framework-owned composition module。
