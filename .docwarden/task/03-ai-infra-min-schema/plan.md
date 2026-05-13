---
status: accepted
created: 2026-05-12
updated: 2026-05-13
owner: sayori
---

# AI 基建最小 schema 计划

本轮产出项目内 AI 基建需要的最小 schema。产物先作为 working material 存在；只有经过 sayori review，并进入 promote 主路径后，才可能影响 stable。

## Loop 1：范围与词表

状态：accepted。当前只是可容忍的工作定义，后续继续对齐词表。

目标：定义最小 schema 覆盖什么，以及核心词语的含义。

要问的问题：

- 在本项目里，`schema` 的最小有用含义是什么？
- 现在必须稳定的词有哪些：`working`、`review`、`promote`、`pick`、`stable`、`index`、`log`？

草案产物：

- `schema-scope.md`

review 门槛：

- sayori 确认范围足够窄，词表没有过度设计。

## Loop 2：目录与状态语义

状态：accepted。

目标：定义 agent 产出的 working material 应该放在哪里，以及每种状态是什么意思。

要问的问题：

- `.docwarden/task/` 下最小可用结构应该有哪些目录或文件？
- 允许哪些状态？哪些状态流转是合法的？

草案产物：

- `directory-semantics.md`

review 门槛：

- sayori 确认 agent 可以不靠猜测地放置新材料。

## Loop 3：文档操作规则

状态：accepted。

目标：定义 agent 能对 `docs/` 和 `.docwarden/task` 做什么。

要问的问题：

- 哪些动作可以自动做？
- 哪些动作必须得到 sayori 明确授权？

草案产物：

- `operation-rules.md`

review 门槛：

- sayori 确认规则能保护 `docs/`，同时不阻断 agent 推进工作。

## Loop 4：promote 与 pick 边界

状态：accepted。

目标：定义 `docwarden` 侧最小的 promote / pick 操作边界；这里不定义完整的 `contexta` 内容 schema。

要问的问题：

- promote 的最小输入、输出和触发条件是什么？
- pick 的最小输入、输出和触发条件是什么？
- 哪些 side 内容应该进入 pick，而不是进入 promote？

草案产物：

- `promote-pick-boundary.md`

review 门槛：

- sayori 确认 promote / pick 的流程边界足够清楚，并且没有越界到 `contexta` 语义层。

## Loop 5：验收与 dry run

状态：accepted。

目标：定义这个 schema 如何证明自己有用。

要问的问题：

- 在不开展 promote/pick 编排的前提下，最小 dry run 应该是什么？
- 这个 dry run 应该捕获哪些失败模式？

草案产物：

- `acceptance.md`

review 门槛：

- sayori 确认 schema 能支撑一次完整循环：读取来源材料，提炼 working material，经过 review，并能区分 promote 主产物与 pick side 产物。

## 本轮不做

- 实现 CLI 命令。
- 设计或安装 custom skill creator。
- 编辑 `docs/` stable 文档。
- 创建完整个人 wiki 系统。
- 定义完整的 `contexta` 内容 schema。
- 完整解决 semantic lint。
