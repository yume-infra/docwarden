---
status: draft
created: 2026-06-01
updated: 2026-06-01
owner: sayori
---

# Workflow Iso Definition

本文件精确记录 `workflow` 在当前仓库里的语义位置。

## 精确定义

`workflow` 的语义定义属于 isomorph。

当前 iso 定义：

```text
workflow = state + move + transition 共同成立的推进表达
```

其中：

- `state`：当前可行动处境。
- `move`：使协作、理解或材料状态继续推进的行动。
- `transition`：move 如何使一个 state 进入 next state 的成立关系。

缺少 state、move 或 transition 中任一位置，都不构成完整 workflow。

来源：

- `.isomorph/mapping/bootstrap/modules/concept/structure/workflow.md`
- `.isomorph/mapping/bootstrap/modules/concept/structure.md`
- `.isomorph/mapping/bootstrap/relations/structure-language.md`

## 与 structure 的关系

`workflow` 不是任意流程图，也不是产品名。

它是 isomorph `structure` language 下的一种推进结构。

当前已验证的 structure language 包括：

- `pipeline`：input / transform / output 共同成立的转换结构。
- `workflow`：state / move / transition 共同成立的推进结构。
- `architecture`：layer / relation / boundary 共同成立的层级结构。
- `branch`：condition / route / target 共同成立的分流结构。
- `composition`：whole / part / stable semantic boundary 共同成立的组合结构。

## 与产品线的关系

`workflow` 不是独立产品线，也不是 docwarden 使用层 config。

更精确的说法是：

```text
dw: / ctx: / iso: / ym: 中都可以出现 workflow structure definition 或 instance
```

但这些 definition / instance 的产品语义由所在映射层或产品线拥有。

例如：

- `dw:` 中的 workflow instance 表达 docwarden 文档维护推进。
- `ctx:` 中的 workflow instance 表达 contexta capability mapping / activation 推进。
- `iso:` 中的 workflow instance 表达 isomorph 相关推进；语义检查链路若是 input -> transform -> output，则更可能是 pipeline。
- `ym:` 中的 workflow instance 表达 sayori 个人层流程。

## 与 artifact 的关系

`workflow` 本身不是泛泛的 artifact kind。

当 contexta 或 docwarden 映射一个 workflow 相关文件时，被映射的首先是 workflow definition / workflow asset。

该文件的语义成立条件仍回到 iso 的 workflow 定义：

```text
state / move / transition 是否共同成立
```

因此：

- contexta 可以映射 workflow 相关 asset。
- docwarden 可以在 `.isomorph/mapping/docwarden/` 拥有自己的 workflow definition。
- docwarden 使用层可以通过 `docwarden init` 创建 runtime config。
- isomorph 定义并检查 workflow 的结构语义。

三者不是同一个职责。
