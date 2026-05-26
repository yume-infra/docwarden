---
status: accepted
created: 2026-05-26
updated: 2026-05-26
owner: sayori
---

# signal definition surface review

## Review Lead

signal definition 应该服务 pure chain：

```text
formatted md -> semantic-lint -> signal -> review
```

因此 signal module 不应该写成 policy、review item、CLI output schema 或 remediation guide。

## Accepted Decision

signal definition 是被 semantic-lint 使用的 warning name 定义。

它只回答三件事：

```text
Definition
Trigger
Basis
```

## Definition

说明这个 signal name 表示什么语义偏移。

Definition 不写成 policy，也不写修复动作。

## Trigger

说明 formatted md 中什么可观察形态会触发这个 signal。

Trigger 只提供检测条件，不判断最终是否成立。

## Basis

说明这个 signal 依赖哪些 concept、policy、relation 或 structure 作为判断依据。

Basis 只建立链接，不在 signal module 内重新定义依据。

## Boundary

signal definition 可以包含：

- signal name 的语义偏移定义。
- 可观察 trigger。
- 判断依据链接。

signal definition 不应包含：

- final judgment。
- policy violation 结论。
- review focus。
- 迁移或修复命令。
- CLI output schema。
- candidate / instance / evidence 字段设计。

## Implemented Cleanup

当前 6 个 signal modules 已迁移为：

```text
Definition / Trigger / Basis
```

旧的 `Why / Source / Inspection` surface 已移除。
