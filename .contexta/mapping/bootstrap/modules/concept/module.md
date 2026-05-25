---
kind: concept
---

# module

## Designation

Canonical: `module`

Aliases:

- md module

## Naming Need

contexta 需要一个名字表示 md 文件形成的文档作用域。

这个名字用于避免把 file scope、content kind、template、docwarden workflow 对象和 assertion 混成同一种对象。

## Definition

module 是 md file scope。

在当前 contexta / docwarden 描述系统中，只要一个描述对象以 `.md` 文件存在，它就天然是 module。

module 以一个 md 文件为作用域，承载 metadata 和结构化正文，并为 assertion 提供上下文和归属范围。

module 的成立来自 md file scope，不来自 frontmatter `kind`、stable semantic boundary 或 composition。

stable semantic boundary 是 module 组织 assertion 的质量边界，不是 module 是否成立的前提。
