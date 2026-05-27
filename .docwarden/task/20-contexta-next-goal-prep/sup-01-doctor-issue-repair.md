---
status: accepted
created: 2026-05-27
updated: 2026-05-28
owner: sayori
---

# doctor issue repair design

本文件补充下一轮 `contexta doctor` 的 issue / repair 设计。

## Position

普通 runtime 采用 strict semantics：

- missing recognition authority -> failure
- invalid recognition material -> failure
- missing pin -> failure
- unknown pin baseline -> failure

`doctor` 不放宽这些语义。

`doctor` 的职责是：

```text
inspect local .contexta
  -> emit structured issues
  -> build explicit repair plan
  -> apply repair only when preconditions hold
  -> verify postconditions
```

## Issue Model

最小 issue 字段：

```text
code
severity
target
summary
evidence
impact
repairability
repair
```

字段含义：

- `code`：稳定 issue code，供 CLI、tests、doctor repair 复用。
- `severity`：`error | warning | info`。
- `target`：`.contexta` path 或 affected runtime command。
- `summary`：人可读说明。
- `evidence`：具体文件、字段、trigger line、pin field、link target。
- `impact`：会阻塞哪些普通 runtime 命令。
- `repairability`：`auto | plan-only | manual`。
- `repair`：可选 repair plan id。

## Initial Issue Codes

P1 issue：

- `missing-recognition-authority`
- `invalid-recognition-trigger`
- `missing-pin-metadata`
- `invalid-pin-metadata`
- `unknown-pin-baseline`
- `baseline-material-conflict`

P2 issue：

- `missing-baseline-material`
- `missing-signal-loss-model`
- `unparsed-signal-trigger`
- `broken-primitive-semantic-basis-link`
- `empty-contexta-instance`
- `nested-contexta-root`

P3 issue：

- `export-position-not-structured`
- `legacy-contexta-footprint`
- `stale-baseline-material`

## Repair Model

最小 repair plan 字段：

```text
id
issues
strategy
preconditions
actions
postconditions
verification
rollback
```

字段含义：

- `id`：稳定 plan id。
- `issues`：本 plan 修复哪些 issue code。
- `strategy`：repair 的语义，例如 `install-missing-baseline-material`。
- `preconditions`：apply 前必须仍然成立的条件。
- `actions`：写入、创建、更新、记录 repair log 等动作。
- `postconditions`：apply 后必须成立的条件。
- `verification`：apply 后运行的检查。
- `rollback`：失败时如何回滚或保留 staging material。

## Correct Repair Requirements

repair 正确性要求：

1. inspect 默认只读。
2. repair plan 默认 dry-run。
3. apply 前重新检查 preconditions；若 `.contexta` 在 plan 后改变，abort。
4. 不覆盖 existing local material；repair 只能创建 absent paths，或替换 doctor 自己创建的 staging artifact。
5. 所有写入先进入 staging，再原子提交。
6. 每个 action 都有 postcondition。
7. apply 后必须重新运行 doctor inspect。
8. apply 后必须运行相关 strict runtime command 的最小验证。
9. repair 必须 idempotent；重复 apply 不应继续改变结果。
10. repair log 必须记录 applied plan、timestamp、before fingerprint、after fingerprint。

## Baseline Repair

### Missing pin

普通 `upgrade` 对 missing pin 失败。

doctor 对 missing pin 输出：

```text
issue: missing-pin-metadata
repairability: plan-only
```

可选 repair strategy：

```text
adopt-packaged-baseline
```

语义：

- 显式把当前 packaged vendor snapshot 作为 local instance 的 pinned baseline。
- 不声称现有 local files 等于 vendor snapshot。
- 现有 local files 与 baseline 的差异视为 local customization。
- 缺失的 baseline files 可以 materialize。
- 已存在且内容不同的 baseline path 不自动覆盖。

preconditions：

- `.contexta` exists。
- packaged baseline digest is known。
- `.contexta/.contexta-pin.json` absent。
- no nested `.contexta/.contexta`。
- every baseline path is either absent or readable.

actions：

- write missing baseline files only when destination absent。
- write `.contexta/.contexta-pin.json` with packaged baseline identity。
- record repair log.

postconditions：

- pin metadata decodes。
- pin baseline resolves to packaged snapshot。
- missing baseline files now exist。
- conflicting existing baseline paths are reported as customization or conflict, not overwritten。

verification：

- `contexta upgrade --root <root>` succeeds.
- `contexta recognize` only succeeds if recognition authority is present and valid.

### Unknown pin

doctor 对 shape-valid but unknown pin 输出：

```text
issue: unknown-pin-baseline
repairability: manual
```

v0 不自动 rewrite unknown pin。

除非后续明确设计 `adopt-packaged-baseline --replace-unknown-pin`，否则 unknown pin 必须人工确认。

### Invalid pin

doctor 对 malformed / invalid pin 输出：

```text
issue: invalid-pin-metadata
repairability: manual
```

v0 不从 invalid pin 推断 baseline。

## Recognition Repair

### Missing recognition authority

doctor 对缺 recognition primitive 输出：

```text
issue: missing-recognition-authority
repairability: auto
```

repair strategy：

```text
install-default-recognition-primitive
```

preconditions：

- pinned baseline known, or repair plan also includes `adopt-packaged-baseline`。
- default recognition primitive exists in packaged baseline。
- target path absent.

actions：

- materialize packaged default recognition primitive。
- record repair log.

postconditions：

- local model loads at least one recognition rule。
- unknown trigger count in recognition rules is zero。

verification：

- `contexta recognize` on a seed concept fixture succeeds。
- `contexta recognize` on target with unknown kind fails or returns strict unknown according to final runtime contract; it must not use TS fallback.

### Invalid recognition trigger

doctor 对 unsupported trigger 输出：

```text
issue: invalid-recognition-trigger
repairability: manual
```

v0 不自动 rewrite user-authored trigger lines。

如果 trigger line belongs to an exact known old baseline file, future doctor may offer baseline replacement, but v0 should avoid semantic rewrite.

## Signal / Primitive Repair

### Missing loss model

doctor 输出：

```text
issue: missing-signal-loss-model
repairability: plan-only
```

v0 不从 Definition 自动生成 Loss Model。

如果 signal file matches known old baseline, doctor may offer `upgrade-baseline-signal-file` in a later version.

### Broken trigger

doctor 输出：

```text
issue: unparsed-signal-trigger
repairability: manual
```

ordinary `lint` should expose this issue through strict diagnostics instead of silently producing zero signals.

### Broken primitive Semantic Basis link

doctor 输出：

```text
issue: broken-primitive-semantic-basis-link
repairability: manual
```

v0 可以提供 normalized candidate suggestions, but must not rewrite links automatically unless the change is a pure normalization proven equivalent.

## Self-Repair Target

当前仓库的 `.contexta` 是预期的 first doctor target。

预期 doctor flow：

```text
contexta doctor --root .
  -> reports missing-pin-metadata
  -> reports missing-recognition-authority
  -> may report missing-baseline-material

contexta doctor repair --root . --plan adopt-packaged-baseline
  -> writes missing baseline files
  -> writes pin metadata
  -> does not overwrite existing local files

contexta doctor repair --root . --plan install-default-recognition-primitive
  -> writes missing recognition primitive if not already materialized by baseline adoption

or one combined repair plan:

contexta doctor repair --root . --plan adopt-packaged-baseline+install-default-recognition-primitive
  -> applies both strategies under one precondition check

contexta upgrade --root .
  -> succeeds

contexta recognize --root . <fixture>
  -> succeeds only through local recognition material
```

## Implementation Note

本设计已在 `ae2fd7e feat(contexta): enforce strict runtime contracts` 中进入 v0 实现。

已落地的最小闭环：

- `contexta doctor` / `contexta doctor inspect` 输出 structured issues。
- `contexta doctor repair --plan adopt-packaged-baseline` 显式执行 repair。
- repair 只写缺失 baseline file 和缺失 pin metadata，不覆盖 existing local material。
- repair 后会重新 inspect，并验证 strict `upgrade` 与 synthetic concept recognition。
- ordinary `recognize` / `lint` / `upgrade` 不因 doctor 存在而放宽 strict semantics。

当前实现与设计仍保留的后续差距：

- repair plan apply 前的 fingerprint precondition 目前记录 before / after fingerprint，但未阻止 plan 生成后外部修改。
- 写入使用 temp file + rename；尚未引入独立 staging directory。
- unknown / invalid pin 仍为 manual，不提供自动 replacement plan。

This self-repair path is valid only if doctor records all conflicts instead of hiding them.

## Tests Required

Doctor tests:

- inspect is read-only.
- missing pin emits `missing-pin-metadata`.
- missing recognition primitive emits `missing-recognition-authority`.
- plan aborts if `.contexta` changes after planning.
- repair does not overwrite existing files.
- repair writes pin only with known packaged baseline.
- repair writes missing recognition primitive.
- repair is idempotent.
- repair log records before / after fingerprint.
- post-repair strict `upgrade` succeeds.
- post-repair recognition uses local material, not TS fallback.

Self-repair test:

- fixture representing current pre-v0 `.contexta` can be repaired.
- after repair, ordinary runtime strict commands pass the expected minimum contract.
