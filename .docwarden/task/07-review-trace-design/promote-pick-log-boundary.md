---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
loop: 1
---

# promote / pick / log 边界

本文件记录 Loop 1 结论，用于定义 user review 之后的最小分流边界。

## 纠偏

user review 之后不引入独立 `review result`。

也不把 `decision trace` 设计成新的持久化账本层。

review 之后真正需要处理的是分流：

```text
promote
pick
log
```

## promote

promote 面向主线稳定内容。

它处理 user review 通过后，应该进入主产物稳定化路径的内容。

这些内容后续可以进入：

```text
spec / guide / wiki
```

promote 不处理 review 过程中顺手发现的旁支信息。

## pick

pick 面向 side 内容长期化。

它处理 promote 不关注、但值得长期保存的内容。

典型内容包括：

- adr。
- 纠错经验。
- 用户偏好。
- 术语理解。
- 项目历史判断。
- 可学习内容。
- 其他长期侧向材料。

## log

没有进入 promote，也没有进入 pick 的内容，默认只留在 task log。

这些内容包括：

- 过程性讨论。
- 错误草案。
- 临时尝试。
- 已被纠正但没有长期价值的表达。

不为这些内容额外设计持久化层。

## task working materials 的完成策略

走完 promote + pick 后，task working materials 默认应 delete。

原因是 working / task 是短命层。

如果已经完成 promote 和 pick，长期价值已经被分流到主线稳定内容和 side 长期内容中。

继续 archive 整个 working，会形成第三个长期层，削弱 promote / pick 分流的意义。

## config 选项

虽然默认策略是 delete，但应通过 config 提供 archive 选项。

archive 用于服务不希望丢弃 working 材料的 workflow。

因此当前策略是：

```text
after_promote_pick: delete | archive
default: delete
```

## 当前结论

review 后的最小持久化判断不是 result，也不是 ledger。

它是：

```text
promote / pick / log
```

其中：

- promote 进入主线稳定化。
- pick 进入 side 长期化。
- log 只保留过程，不额外长期化。
- task working materials 完成后默认 delete，可配置 archive。
