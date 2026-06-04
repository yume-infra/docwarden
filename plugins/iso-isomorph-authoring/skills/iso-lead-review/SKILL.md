---
name: iso-lead-review
description: 用于把 theory update、candidate assertion、semantic-lint signal、workflow
  correction 或 skill/materialization 变更组织成最小可审核的 lead + backing；不用于直接执行
  docwarden CLI、写 docs、替代 deterministic validation，或生成普通长篇 review report。
---

# Lead Review

用 lead-review 把候选语义更新压成用户能快速判断的最小承诺。

`lead` 是本轮需要用户接受、拒绝、修正或改路由的最小 commitment。`backing` 是支撑 lead 的材料层，不替代 lead。

## Capability

这个 skill 处理需要用户判断的 semantic update：

- theory、vocabulary、policy、relation、skill primitive 或 workflow correction。
- semantic-lint signal 需要进入 review。
- agent 输出与既有 framework vocabulary 或 usage contract 不一致。
- skill / contexta materialization 需要确认是否忠实于 semantic source。

## Workflow

1. 先命名 candidate update 指向什么对象：concept、policy、relation、assertion、signal、usage contract、skill primitive 或 contexta materialization。
2. 写出一个 lead，只表达最小 user-reviewable commitment。
3. 把 source、boundary、evidence、locator、reason、expected behavior 和 affected files 放进 backing。
4. 判断 route：accepted、rejected、revise、promote、pick、log-only、continue-task 或 transfer-lane。
5. 如果 lead 同时包含多个承诺，拆分后再让用户审。
6. 如果 backing 不能支撑 lead，先补证据或降级为 open question。
7. 用户已经确认方向时，执行对应实现或 CLI hard gate，并报告验证结果。

## Soft Boundary

Use skill judgment for:

- candidate 是否已经形成可审核 assertion。
- lead 是否足够小，能被用户单独接受或拒绝。
- backing 是否只是支撑材料，而不是把 lead 淹没的长解释。
- correction 应更新 framework vocabulary、usage contract、skill primitive、contexta materialization，还是只进入 task log。
- semantic-lint result 是否足够 review-ready。
- docwarden review、promote、pick 或 lane transfer 哪个 route 正确。

## Hard Boundary

lead-review 不执行 hard writes。

- docwarden CLI 负责 task/review/promote/pick 的 deterministic state change。
- isomorph CLI 负责 primitive validation 和 semantic-lint hard check。
- contexta CLI 负责 Codex-supported runtime materialization。
- `docs/` 仍是 human-maintained source layer；除非用户明确要求具体 docs edit，否则不写。

## Review Gates

用户只需要先审核 lead。

需要展开 backing 的情况：

- lead 不清楚。
- lead 与现有 theory 可能冲突。
- source 或 evidence 不可信。
- route 会改变长期语义资产。
- runtime materialization 可能越过上游支持 surface。

不要把 task history、方案比较、实现细节和验证日志塞进 lead。

## Validation

Before treating this skill as usable, run:

```bash
rtk apps/isomorph/dist/index.js primitive skill .contexta/packs/isomorph-authoring/skills/lead-review/skill-primitive.md --json
rtk python3 .contexta/packs/isomorph-authoring/skills/skill-creator/scripts/quick_validate.py .contexta/packs/isomorph-authoring/skills/lead-review
```

Forward-test with a realistic correction. The output must present one smallest lead and backing before proposing a write.
