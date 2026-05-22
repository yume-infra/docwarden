---
status: accepted
created: 2026-05-18
updated: 2026-05-18
owner: sayori
loop: 3
---

# pick 规则

本文件记录 Loop 3 结论，用于定义 promote 之后的 pick。

## 核心定位

pick 不是和 promote 对称的第二条主流程。

pick 是：

```text
promote 之后的信息损失控制
```

它服务于 working / task 的短命性。

因为 promote 会把 task 中的内容抽象、压缩、规范化，必然会隐去一部分信息。

如果 task 完成后要 delete，就需要在删除前判断这些被隐去的信息里，是否存在长期价值。

pick 就是这个补捞机制。

## 核心问题

pick 的核心问题不是：

```text
task 里还有什么有趣内容？
```

而是：

```text
promote 之后，哪些被主线稳定化过程隐去的信息仍有长期价值？
```

因此 pick 应发生在 promote 之后。

只有先知道 promote 吸收了什么、抽象了什么、隐去了什么，才能判断哪些剩余信息值得 pick。

## pick 的对象

pick 面向 promote 没有吸收的 task residue。

这些 residue 大部分是过程噪音，不应长期化。

但其中可能存在可复利的用户层级资产。

典型包括：

- ADR。
- 纠错经验。
- 用户偏好。
- 术语理解。
- 项目历史判断。
- 可学习内容。
- 其他不属于项目主线 delta、但能服务后续建设的 side 内容。

## 用户层级资产

pick 的去向一定是用户层的资产。

项目层的主线内容已经由 promote 处理。

被 promote 筛去之后仍值得保留的内容，不再是项目主线基线，而是服务使用者的长期资产。

因此 pick 捞取的是：

```text
可复利的用户层级资产
```

这类资产可以帮助用户后续：

- 复用经验。
- 识别 agent 偏移。
- 维护个人偏好和隐式规范。
- 理解项目演化。
- 在新需求中恢复上下文。

## 去向

当前初步判断，pick 的自然去向偏向 wiki。

原因是 pick 内容多为小颗粒、可链接、可查询的长期知识。

但这不等于最终承接层已经确定。

用户层级资产的建设还没有完成，因此不能把 pick 的目标锁死为 wiki。

当前只确认：

```text
pick -> user-level asset
```

其中 wiki 是当前合理候选方向。

## 与 promote 的关系

如果某个 pick 候选实际会改变项目主线基线，它就不应该停留在 pick。

这种情况应反向触发 promote 重新判断。

因此：

- promote 解决项目主线稳定化。
- pick 解决 working 删除前的信息损失控制。
- pick 捞取被 promote 隐去但可复利的用户层级资产。

## 主流程

当前主流程应理解为：

```text
task
  -> surface for promote
  -> user review
  -> promote mainline delta
  -> pick user-level compoundable assets
  -> delete/archive working
```

其中：

- `promote mainline delta` 处理项目主线稳定基线变化。
- `pick user-level compoundable assets` 处理 promote 隐去但值得长期保存的用户层资产。
- `delete/archive working` 默认 delete，可配置 archive。

## 当前结论

pick 的一句话定义是：

```text
捞到可复利的用户层级资产
```
