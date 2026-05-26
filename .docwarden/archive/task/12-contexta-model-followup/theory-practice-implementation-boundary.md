---
status: draft
created: 2026-05-22
updated: 2026-05-22
owner: sayori
loop: 10
---

# theory practice implementation boundary

## Purpose

本轮整理 contexta 当前整体阶段，并界定 theory、practice reference、task material、implementation 的边界。

这不是新增一个 contexta concept，而是先把当前推进方式说清楚，避免后续把理论、实践参照和 CLI 实现混在一起。

## Current Stage

contexta 当前不处在纯理论阶段，也不处在实现阶段。

更准确的阶段是：

```text
theory stabilization -> practice reference -> future implementation
```

当前重点是稳定 contexta 自己的基础语言，并把这些基础语言落到可读、可链接、可对照的 `.contexta` 文件中。

CLI lint engine 是后续实现层工作。当前只为它留下 signal definitions、dry run 和 locator 方向，不提前把 parser、severity、完整 fixture 或执行语义写死。

## Layers

### Theory

Theory 负责稳定 contexta 的上级语义。

它回答：

- 这个东西叫什么。
- 它为什么需要被命名。
- 它和相邻概念的边界是什么。
- 它用什么约束保护不被写坏。
- 它在 concept network 中如何连接。

当前 theory 主要体现在：

- `concept`
- `policy`
- `structure`
- `relation`
- `template`
- `semantic-lint`
- `signal`
- `trigger`
- `locator`
- `module`
- `assertion`
- `example`

Theory 的产物应进入 `.contexta/mapping/bootstrap/modules/**` 或 `.contexta/mapping/bootstrap/relations/**`。

### Practice Reference

Practice reference 负责让 theory 有具体参照物。

它回答：

- 这个理论在 md 文件里长什么样。
- Obsidian 中如何阅读它。
- agent 下次如何模仿或避错。
- 未来 CLI lint engine 可以用哪些真实形态校准。

当前 practice reference 包括：

- `.contexta/mapping/bootstrap/templates/**`
- `.contexta/mapping/bootstrap/relations/structure-language.md`
- `.contexta/mapping/bootstrap/modules/signal/**`
- `semantic-lint-instance-dry-run.md`
- 当前 concept / policy / relation modules 中的 example sections

Practice reference 不是最终 implementation。它可以不完整，但必须足够具体，能成为后续实现和 review 的参照。

### Task Material

Task material 负责承接未稳定的讨论、纠偏、review outcome 和 loop 记录。

它回答：

- 当前为什么这么判断。
- 哪些已经通过审核。
- 哪些仍是候选。
- 哪些内容以后需要回到 `.contexta`。

当前 task material 在 `.docwarden/task/12-contexta-model-followup/**`。

Task material 不是 contexta 的长期理论层。只有通过 review、确认长期价值后，才迁移或沉淀到 `.contexta`。

### Implementation

Implementation 负责把已稳定的 theory 和 practice reference 转成可执行能力。

它回答：

- CLI 如何解析 md。
- 如何识别 frontmatter、heading、section、code fence 和 wikilink。
- 如何产生 signal instance。
- 如何定位 module / heading / future assertion。
- 如何把 lint 输出交给用户或 workflow。

Implementation 不能反过来私自定义 theory。

如果 implementation 暴露 theory 缺口，应回到 task loop，形成新的 review material，再决定是否修改 concept、policy、relation、signal module 或 CLI lint engine。

## Boundary Rules

### Theory does not replace practice reference

只写抽象定义不够。

contexta 的理论需要通过 template、relation block、semantic signal、dry run 或 example 形成可读参照物。

### Practice reference does not become implementation

practice reference 可以是样例、骨架、dry run 或人工实例。

它不能提前承担 CLI 的 parser contract、完整测试套件、severity 体系或自动执行语义。

### Implementation does not define theory silently

CLI 可以暴露理论缺口，但不能在代码里绕过 contexta 的概念层直接固化新语义。

implementation feedback 应作为 signal 回到 task loop。

### Task material does not equal long-term theory

task material 可以记录半成品、占位、纠偏和候选判断。

长期 theory 必须经过 review 后再沉淀到 `.contexta`。

## Current Boundary Reading

当前已落地内容可以这样读：

- `concept` / `policy` / `structure` / `relation` 是 theory。
- `template` 既有 concept 定义，也有 practice reference 文件。
- `semantic-lint` 是 theory；`modules/signal/*.md` 是具体 signal definitions。
- `semantic-lint-instance-dry-run.md` 是 task material 中的 implementation reference，不是 CLI fixture。
- OFM path alias policy 是 theory；`structure-language.md` 是 relation practice reference。
- `.docwarden/user/profile.md` 是 docwarden user context asset，不是 contexta theory，也不是 template。

## Review Questions

本轮需要确认：

- 是否接受当前四层边界：theory / practice reference / task material / implementation。
- `.contexta` 是否只承接已经 review 过、需要长期稳定读取的 theory 和 practice reference。
- `.docwarden/task` 是否继续承接 loop、纠偏、candidate 和 review outcome。
- CLI lint engine 是否明确留到 implementation 层，当前只用 signal definitions 和 dry run 做参照。
