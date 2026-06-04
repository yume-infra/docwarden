---
kind: composition
---

# module-assertion

## Whole

[[language/primitive/concept/module|module]]

Reading:

module 是 assertion 的 whole，提供 assertion 的上下文、归属范围和 ownership。

module 的成立来自 md file scope，不来自 composition。

## Part

[[language/primitive/concept/assertion|assertion]]

Reading:

assertion 是 module 内部的 part。

assertion 的 semantic commitment 归属于所在 module scope。

assertion 的可审查性不要求 assertion 独立成文件。

## Stable Semantic Boundary

stable semantic boundary 判断哪些 assertion 应共同归入同一个 module scope。

module 对内部 assertion 承担 ownership，但不保证 assertion 已经正确。

review/promote 改变 assertion 的系统地位，不改变 assertion 作为 semantic commitment 的性质。

## Module Scope

本文件是 module / assertion 的 composition instance，不重新定义 [[language/primitive/concept/module|module]] 或 [[language/primitive/concept/assertion|assertion]]。

module / assertion 是 whole / part composition，不是 architecture 的 layer / relation / boundary。
