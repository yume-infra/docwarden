---
status: accepted
created: 2026-05-19
updated: 2026-05-19
owner: sayori
loop: 3
---

# pick entity landing

本文件定义 pick 通过后，docwarden 如何判断用户层资产或 side asset 的具体实体落点。

## 核心判断

pick 的对象不是项目主线基线变化。

pick 处理的是 promote 之外仍有复利价值的 side 内容。

它不能由 agent 直接判断并写入。

pick 后应先生成 review surface，通过 `lead` 形式给用户 review。

用户 review 要确认两件事：

- 资产性质是否成立。
- 建议实体落点是否符合要求。

通过 review 后，docwarden 才能按已确认的资产性质选择具体实体落点。

不能默认进入 wiki，也不能默认进入 `.docwarden/user/profile.md`。

## pick 只处理什么

pick 处理：

- user-level asset。
- 用户协作偏好。
- 用户纠偏信号。
- agent 错误模式。
- 不改变项目主线、但能帮助后续协作的判断资产。

pick 不处理：

- 项目主线规则。
- review artifact schema。
- cleanup config。
- spec / guide / wiki 的主线内容。
- template、metadata、module、assertion、semantic lint。

如果 pick candidate 实际改变项目主线，应回到 promote。

如果 pick candidate 实际属于内容格式协议，应转给 contexta。

## review 后落点判断顺序

pick 实体落点按以下顺序判断：

1. 先从 promote 隐去内容、对话纠偏或 agent 错误模式中识别 pick candidate。
2. 再生成 pick review surface。
3. 通过 `lead` 给用户 review 资产性质和建议实体落点。
4. 用户确认后，再选择或创建具体实体。
5. 最后判断实体操作是否改变已 review 的用户口径。

review 是最重要的用户口径对接。

通过 review 的 lead 不能在写入实体时被实质变更。

如果实体写入需要新增或改变 review 未确认的主张，应回到 review，而不是直接写入。

## 落点层级

pick 需要有一组可选择的实体落点层级。

这组层级用于让不同情景的 pick 选择不同承接位置。

当前至少需要区分：

- `user context`：用户协作偏好、纠偏信号、agent 应使用的默认判断。
- `pending side asset`：已确认有复利价值，但还没有合适实体类型承接。
- `not pick / promote`：实际改变项目主线，应回到 promote。
- `not pick / contexta`：实际属于内容格式协议，应转给 contexta。

后续出现新的 pick 情景时，应先判断是否需要新的实体落点层级，而不是强行写入已有实体。

## 当前已确认实体

当前已确认的用户层实体是：

```text
.docwarden/user/profile.md
```

它承接当前项目中的 user context 实体资产。

它是 user context 内容类型在当前项目中的一个实体实现。

当前已验证的路径是：

```text
pick
  -> review surface
  -> lead 确认资产性质为 user context
  -> 输出到 .docwarden/user/profile.md
```

适合落入该实体的内容包括：

- 用户协作偏好。
- 用户表达偏好。
- 用户对 agent 错误模式的纠偏信号。
- 后续 agent 理解需求时应使用的默认判断。

## 不能强行落入 profile

不能因为 `.docwarden/user/profile.md` 已存在，就把所有 pick 都写入 profile。

以下情况不应直接写入 profile：

- 内容改变 docwarden 工作流。
- 内容改变 review artifact schema。
- 内容属于 contexta 的内容格式协议。
- 内容是独立 side asset，但不是用户上下文。
- 内容需要新的实体类型承接，而当前实体类型尚未设计。

这些情况应分别回到 promote、contexta，或记录为待设计实体落点。

## 当前例子

`sayori-working-profile` 已通过 pick review，并已落到：

```text
.docwarden/user/profile.md
```

因为它记录的是当前项目协作中的 user context。

这个例子表明：

- profile 不是 template。
- profile 是 user context 规范在当前项目中的实体实现。
- docwarden 负责 pick / review / 选中 user context / 输出到 `.docwarden/user/profile.md`。
- contexta 只负责 user context 内容类型的格式约束。

`review-lead-minimality` 已通过 pick review。

其中关于用户如何判断 review lead 是否膨胀的内容，可以作为 user context 的一部分被吸收。

但其中如果涉及 docwarden review artifact 的结构规则，例如 `index.md / lead.md / backing.md`，则不属于 pick，应回到 promote。

## 待设计落点

当前还不能假设所有 pick 都进入 wiki 或 profile。

如果后续出现非 profile 的 side asset，应先进入 `pending side asset`，记录为待设计实体落点，而不是强行写入已有实体。

待设计实体落点至少应说明：

- 这个 side asset 服务什么复利用途。
- 为什么它不是 promote。
- 为什么它不是 contexta。
- 为什么现有 user profile 不适合承接。

## 本轮不判断

- 新的用户层目录结构。
- side asset 的完整分类。
- user context 模板。
- user context 内容格式规范。
- frontmatter 完整协议。
- cleanup config。
- 真实写入。

## 审核点

- pick 是否应先判断资产性质，再判断具体实体。
- pick 后是否必须通过 review surface 的 lead 给用户确认资产性质和实体落点。
- `.docwarden/user/profile.md` 是否只承接当前项目中的 user context。
- `.docwarden/user/profile.md` 是否是 user context 内容类型在当前项目中的实体实现。
- 不能落入 profile 的 pick 是否应回到 promote、contexta，或记录为待设计实体落点。
- 已通过 pick review 的内容，写入实体时是否不能实质变更用户已确认口径。

## Review

sayori 确认方向成立，并补充：

- pick 后通过 review surface 的 `lead` 给用户确认资产性质和实体落点。
- profile 是 user context 规范在当前项目中的实体实现。
- 其他 pick 需要落点层级来选择不同承接位置。
- review 是最重要的用户口径对接，写入实体时不能实质变更。
