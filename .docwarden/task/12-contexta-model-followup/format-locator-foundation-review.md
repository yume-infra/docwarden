---
status: accepted
created: 2026-05-22
updated: 2026-05-23
owner: sayori
loop: 12
---

# format locator foundation review

## Purpose

本轮设计 contexta 在进入 CLI implementation 前缺少的可寻址基础。

核心问题是：

- format 说明 md module 里哪些表面可以被稳定读取。
- locator 说明如何让需要被审核的 assertion 被稳定定位。

这一轮不实现 parser，不定义完整 lint engine，也不设计完整 block reference 体系。

## Current Baseline

当前已经成立：

- `module` 是 md file scope。
- `assertion` 是 module 内部最小可审查语义判断。
- `assertion` 后续需要能成为 locator target。
- `locator` 已有 concept，但其中“至少支持 module 和 heading”的旧表述需要被本轮修正为 assertion 取向。
- contexta 内部连接只使用 OFM path alias。
- semantic lint 未来会产生 signal instance，并需要 locator 指向命中位置。

当前还缺少：

- assertion locator 应依附在哪些稳定表面上。
- heading、section、frontmatter、relation block、future assertion 各自是否属于可定位表面。
- format 与 template、structure、link-resolution、locator 的边界。

## Diagnosis

只定义 locator 不够。

如果没有 format，locator 不知道可以依附在哪些稳定文本表面上，容易退化成“随便指向一段文字”。

只定义 format 也不够。

如果没有 locator，format 只能说明 md 长什么样，不能让 review、semantic lint 和未来 CLI 把判断带回某条 assertion。

因此这轮应把两者作为一组基础关系来设计：

```text
format = 可读表面
locator = assertion 定位标记
```

## Candidate Model

### format

format 是 contexta module 的稳定可读形状。

它描述 md module 中哪些部分可以被 agent、Obsidian、review 和未来 CLI 稳定读取。

format 当前应至少承认以下表面：

- frontmatter：module metadata surface。
- H1：module title surface。
- heading：section boundary surface。
- section body：assertion-bearing surface。
- OFM wikilink：cross-module reference surface。
- relation block heading：relation record surface。

format 不负责判断内容语义是否正确。

format 不负责复制后的内容骨架；那是 template 的职责。

format 不负责组织语言本身；那是 structure 的职责。

format 不负责 link 写法约束；那是 link-resolution policy 的职责。

format 不负责给每个 assertion 发 ID；那是后续 assertion locator loop 的职责。

### locator

locator 是服务 assertion 审核的定位机制。

它的核心目标不是泛化地指向 module、heading 或 relation block，而是让某条需要被审核、引用、迁移或 lint 命中的 assertion 可以被稳定找到。

locator 第一版应尽可能简单：

- context address：用 module path 和 heading 提供定位上下文。
- assertion marker：用特殊符号或 magic word 标出需要被定位的 assertion。

当前第一版 locator 不应支持：

- sentence locator。
- implicit short link。
- 自动从自然语言反推位置。
- 全局 assertion ID。
- 对所有 assertion 强制编号。
- 完整 parser contract。

module、section 和 relation block 只是 locator 的上下文或宿主表面，不是 locator 定义的核心。

future assertion locator 应建立在 format 已定义的可读表面之上，并通过标记让 assertion 从普通文本中显现出来。

## Candidate Locator Forms

### Context Address

```md
[[mapping/bootstrap/modules/concept/locator#Definition|locator#Definition]]
```

读取方式：

- target 是 module path + heading。
- 这是 assertion 所在的上下文地址。
- 它不是 assertion locator 的全部。

### Special Symbol Candidate

```md
locator 是服务 assertion 审核的定位机制。 ^a-def
```

读取方式：

- `^a-def` 是特殊符号形式的 assertion marker。
- 它可以和 OFM block reference 方向兼容。
- `a-` 是 assertion marker 的 magic prefix。
- marker 保持短，因为 path 和 alias 已经承担跨 module 语义。

### Magic Word Candidate

```md
ASSERTION locator-definition: locator 是服务 assertion 审核的定位机制。
```

读取方式：

- `ASSERTION` 是 magic word。
- 它让脚本和 agent 可以直接识别“这里是一条可定位 assertion”。
- 风险是正文阅读噪音更高。

### Combined Candidate

```md
locator 是服务 assertion 审核的定位机制。 ^a-def

[[mapping/bootstrap/modules/concept/locator#^a-def|locator-definition]]
```

读取方式：

- `^a-def` 提供当前 module 内的具体 assertion 落点。
- OFM link 提供跨 module 引用。
- 本轮已按此方向落地最小效果。

## Boundary

### format vs template

format 说明 md module 可被稳定读取的表面。

template 提供复制后的正文骨架。

template 可以使用 format，但 template 不能定义 format 的长期语义。

### format vs structure

format 说明文本表面。

structure 说明语义组织方式。

例如 heading 是 format surface；pipeline 的 input / transform / output 是 structure reading。

### format vs link-resolution

format 承认 OFM wikilink 是 cross-module reference surface。

link-resolution policy 约束这个 surface 应如何书写。

### locator vs link-resolution

locator 关心 assertion 如何被标记和定位。

link-resolution 关心内部 link 使用什么语法与路径形式。

OFM path alias 可以引用 locator target，但不能替代 locator 本身。

### locator vs assertion

assertion 是被审查语义判断。

locator 是让 assertion 在所在表面中被定位的标记机制。

当前应先确认 locator 服务 assertion，而不是把 locator 泛化成所有 link。

本轮只展开最小候选，不强制为每条 assertion 加 marker。

## Accepted Landing

本轮已落地：

- 新增 `.contexta/mapping/bootstrap/modules/concept/format.md`。
- 修订 `.contexta/mapping/bootstrap/modules/concept/locator.md`。
- 修订 `.contexta/mapping/bootstrap/modules/policy/link-resolution.md`。
- 保持 `.contexta/mapping/bootstrap/modules/policy/link-resolution.md` 只处理 OFM link 写法，不把它扩成 locator 或 format。

当前不落地：

- CLI parser contract。
- 全量 assertion marker。
- 全局 assertion ID。
- lint severity。
- format validator。

## Review Questions

- `format = 可读表面` 已接受。
- format 作为 contexta 基础 concept 已接受。
- `locator = 服务 assertion 审核的定位机制` 已接受。
- locator 第一版只设计 assertion marker 的最小形态。
- assertion marker 当前接受 `^a-*` 短 marker。

## Outcome

本轮已收口。

当前结论：

- format 是 contexta module 的稳定可读形状。
- locator 服务 assertion 审核定位，不是泛化 link 地址。
- module path、heading 和 relation block heading 是定位上下文或宿主表面。
- assertion marker 第一版采用 `^a-*` 短 marker。
- block reference 只允许作为 assertion marker target，不泛化为普通 link。
- 当前不做 CLI parser、format validator、全局 assertion ID 或全量 assertion marker。

## Loop 13 Correction

Loop 13 进一步修正了 format 的定位。

本文件中 `format = 可读表面` 是 Loop 12 的阶段性表达。

当前收口口径是：

```text
template = 0->1 初始骨架
format = 1->2 / 2->3 持续编辑中的形态保持契约
semantic-lint = 直接消费 formatted md
```

format 不是 facts layer，也不是第一性语义来源。format 关注的是 md module 已经由 template 生成后，继续修改、扩写和维护时，不把 frontmatter、H1、heading、OFM link、relation block heading 和 assertion marker 等可消费形态改坏。
