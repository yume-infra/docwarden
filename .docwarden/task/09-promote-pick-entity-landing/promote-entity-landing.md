---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 2
---

# promote entity landing

本文件定义 promote 通过后，docwarden 如何判断项目主线内容的具体实体落点。

## 核心判断

promote 的对象是已通过 review 的项目主线基线变化。

promote 实体落点先判断变化服务哪一种主线稳定功能，再判断具体实体。

不是先从现有目录或文件形状反推。

## promote 只处理什么

promote 只处理项目主线基线变化。

它处理：

- 项目操作规则。
- 项目理解路径。
- 项目长期知识节点。
- 已通过 review、需要进入稳定层的主线 delta。

它不处理：

- user-level asset。
- agent 纠偏经验。
- 用户偏好或协作画像。
- 未通过 review 的 task material。
- 内容模板、metadata、module、assertion、semantic lint。

## 落点判断顺序

promote 实体落点按以下顺序判断：

1. 先识别已通过 review 的主线 delta。
2. 再判断这个 delta 服务哪一种稳定功能。
3. 再选择或创建具体实体。
4. 最后判断该实体操作是否会引入未 review 的新主张。

如果会引入未 review 的新主张，应回到 review，而不是直接写入。

## 稳定功能到实体落点

如果 delta 是 agent 执行时必须遵守的项目规则，落到 `.docwarden/spec/` 下的具体实体。

如果 delta 是 user 恢复项目理解所需的线性说明，落到 `.docwarden/guide/` 下的具体实体。

如果 delta 是可复用、可链接、可组合的项目知识节点，落到 `.docwarden/wiki/` 下的具体实体。

同一个已审核 delta 可以投影到多个实体，但每个实体操作都不能新增未审核主张。

## 更新还是新建

优先更新已有实体，当已有实体满足：

- 同一主题。
- 同一稳定功能。
- 更新不会改变未 review 的其他内容。

应新建实体，当：

- 没有同一主题和同一稳定功能的实体。
- 追加到已有实体会混淆职责。
- 需要形成独立可引用的项目主线单元。

应延后或回到 review，当：

- delta 的主线功能不清。
- 需要新增超出原 review 的判断。
- 无法判断落点属于 spec、guide 还是 wiki。

## 当前例子

`08-promote-pick-dry-run/promote-candidates.md` 中的 review workflow delta 可以形成三个候选实体操作：

- `.docwarden/spec/review-workflow.md`
- `.docwarden/guide/review-workflow.md`
- `.docwarden/wiki/review-workflow.md`

这三个候选不是因为已有目录形状需要填充。

它们分别服务：

- spec：agent 执行规则。
- guide：user 理解路径。
- wiki：项目知识节点。

## 本轮不判断

- 这些实体的内容模板。
- frontmatter 完整协议。
- review artifact schema。
- cleanup config。
- pick 的用户层资产落点。
- 真实写入。

## 审核点

- promote 是否应先判断主线 delta 的稳定功能，再选择具体实体。
- promote 是否只处理项目主线基线变化。
- 同一个已审核 delta 是否可以投影到多个实体，但不能新增未审核主张。
- 无法判断实体落点时，是否应延后或回到 review。

## Review

sayori 确认三个稳定功能判断准确：

- agent 执行规则落到 `.docwarden/spec/`。
- user 理解路径落到 `.docwarden/guide/`。
- 可链接项目知识落到 `.docwarden/wiki/`。
